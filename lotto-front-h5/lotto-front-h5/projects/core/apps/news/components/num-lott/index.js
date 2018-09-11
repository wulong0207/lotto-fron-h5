import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ball from '../ball';
import CountDownComponent from '@/component/countdown.jsx'; // 倒计时的公共组件
import { Number } from '@/utils/number';
import { formatMoney, moneyToCN } from '@/utils/utils';
import session from '@/services/session';
import http from '@/utils/request';
import { isEmpty } from 'lodash';
import './index.scss';

class NumLott extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      serviceTime: props.serviceTime,
      ballArr: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.setState({
        data: nextProps.data,
        serviceTime: nextProps.serviceTime
      });
      this.getBallArr(nextProps.data.typeId, nextProps.data.categoryId);
    }
  }
  getendTime(serviceTime, saleEndTime) {
    saleEndTime = new Date(saleEndTime.replace(/-/g, '/')).getTime();
    return parseInt(saleEndTime - serviceTime);
  }
  handleTimeout() {
    this.getFastBet();
    this.getServiceTime();
  }
  getServiceTime() {
    http
      .get(`/home/servicetime?t=${+new Date()}`, { loading: false })
      .then(res => {
        let { serviceTime } = this.state;
        serviceTime = res.data || {};
        this.setState({ serviceTime });
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }
  getFastBet() {
    http
      .get(`/operate/fast?t=${+new Date()}`, {
        params: {
          position: 2,
          loading: false
        }
      })
      .then(res => {
        let timer = null;
        let fastData = res.data || [];
        let data = fastData.filter(m => m.typeId == 100)[0] || {};
        if (this.state.data.issueCode == data.issueCode) {
          timer = setTimeout(this.getFastBet.bind(this), 1000);
        } else {
          clearTimeout(timer);
          this.setState({ data: data });
        }
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }
  getBallArr(id, categoryId) {
    let { ballArr } = this.state;
    let arr = [];
    if (id == 100) {
      // 双色球
      arr = [33, 6, 16, 1];
    }
    if (id == 102) {
      // 大乐透
      arr = [35, 5, 12, 2];
    }
    ballArr = [
      Number.attachZero(Number.getSrand(1, arr[0], arr[1])),
      Number.attachZero(Number.getSrand(1, arr[2], arr[3]))
    ];
    if (ballArr.length <= 0) {
      return;
    }
    this.setState({ ballArr });
  }
  changeBet() {
    let { data } = this.state;
    this.getBallArr(data.typeId, data.categoryId); // 切换
  }
  postLotto(url) {
    let { ballArr } = this.state;
    //  存放ballArr seesion ballOrder:{red:'',blue:''}
    session.set('ballOrder', {
      red: ballArr[0].toString(),
      blue: ballArr[1].toString()
    });
    window.location.href = url;
  }
  render() {
    const { data, serviceTime, ballArr } = this.state;
    if (isEmpty(data)) return <div />;
    let endTime = this.getendTime(serviceTime, data.saleEndTime);
    console.log(endTime, 'endTime');
    const redCode = data.preDrawCode.split('|')[0] || '';
    const blueCode = data.preDrawCode.split('|')[1];
    return (
      <div className="ssq">
        <div className="title">{data.typeId == 100 ? '双色球' : '大乐透'}</div>
        <div className="pre-code">
          <div className="issue-title">{data.perIssue}期开奖结果</div>
          <div className="code">
            {redCode.split(',').map((m, index) => {
              return (
                <span key={ index } className="red">
                  {m}
                </span>
              );
            })}
            <span className="blue">{blueCode.replace(/,/gi, '  ')}</span>
            {data.jackpotAmount ? (
              <span className="grey">
                奖池：<em>{moneyToCN(formatMoney(data.jackpotAmount))}</em>
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="end-time">
          <span>{data.issueCode}期 </span>
          <span>截止时间还剩</span>
          <CountDownComponent
            remaining={ parseInt(endTime / 1000) }
            formats={ '时,分,秒' }
            timeout={ this.handleTimeout.bind(this) }
          />
        </div>
        <div className="lottery-bet">
          <Ball BallArr={ ballArr } />
          <div className="lottery-rule">
            <a
              className="change-button"
              onClick={ event => this.postLotto(data.fastUrl) }
            >
              投注
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NumLott;

NumLott.PropTypes = {
  data: PropTypes.array,
  serviceTime: PropTypes.string
};
