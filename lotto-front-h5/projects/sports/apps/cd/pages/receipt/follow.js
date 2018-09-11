import React, { Component } from 'react';
import { OrderBase } from '../../types';
import PropTypes from 'prop-types';
import NumberInput from '@/component/number-input';
import api from '../../services/api';
import './follow.scss';
import alert from '@/services/alert';
import confirm from '@/services/confirm';
import { gotoPay } from '@/services/order';

export default class OrderFollowBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      times: 1
    };
  }

  getMaxBet(data) {
    let curIssue = data.curIssue || {};
    let betArr = data.lotBetMulList || [];
    let maxBet = 0;

    let saleEndTime = +new Date(curIssue.saleEndTime);
    let currentDateTime = +new Date(curIssue.currentDateTime);
    let curTime = parseInt((saleEndTime - currentDateTime) / 1000);

    for (let i = 0; i < betArr.length; i++) {
      if (curTime > betArr[i].endTime) {
        maxBet = betArr[i].multipleNum;
        break;
      }
    }

    return maxBet;
  }

  followHandle() {
    api
      .betFollow(this.props.id, this.state.times)
      .then(res => gotoPay(res.data.oc))
      .catch(err => {
        if (parseInt(err.code) === 40263) {
          const max = err.data.multiple;
          confirm
            .confirm(
              <div>
                <p>哇，土豪！</p>
                <p>单个方案最大倍为{max}倍！</p>
              </div>,
              `${max}倍投注`,
              '返回修改'
            )
            .then(() => {
              this.timesChangeHandle(max);
            });
          // api
          //   .overflowBet(this.props.lotteryCode)
          //   .then(res => {
          //     let maxBet = this.getMaxBet(res.data);
          //     confirm
          //       .confirm(
          //         <div>
          //           <p>哇，土豪！</p>
          //           <p>单个方案最大倍为{maxBet}倍！</p>
          //         </div>,
          //         `${maxBet}倍投注`,
          //         '返回修改'
          //       )
          //       .then(() => {
          //         this.timesChangeHandle(maxBet);
          //       });
          //   })
          //   .catch(err => {
          //     alert.alert(err.message);
          //   });
        } else {
          const { message } = err;
          if (!message) return undefined;
          if (typeof message === 'string' && message.match(/(token|登录)/)) {
            return undefined;
          }
          alert.alert(message);
        }
      });
  }

  timesChangeHandle(times) {
    this.setState({ times });
  }

  render() {
    if (this.props.isEnd) return null;
    const { orderAmount, multipleNum } = this.props.order;
    const price = orderAmount / multipleNum;
    // if (winningStatus !== 1) return null;
    return (
      <div className="follow-bar">
        <div className="follow-times">
          <div className="times-box">
            <div className="times-input">
              投<NumberInput
                onChange={ this.timesChangeHandle.bind(this) }
                min={ 1 }
                max={ 50000 }
                number={ this.state.times }
              />倍
            </div>
          </div>
          <div className="amount">
            共<em>{price * this.state.times}</em>元
          </div>
        </div>
        <button className="follow-btn" onClick={ this.followHandle.bind(this) }>
          立即抄单
        </button>
      </div>
    );
  }
}

OrderFollowBar.propTypes = {
  order: OrderBase.isRequired,
  id: PropTypes.number.isRequired,
  lotteryCode: PropTypes.number.isRequired,
  isEnd: PropTypes.bool.isRequired
};
