import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ball from '../ball';
import CountDownComponent from '@/component/countdown.jsx'; // 倒计时的公共组件
import { Number } from '@/utils/number';
import session from '@/services/session';
import http from '@/utils/request';
import { isEmpty } from 'lodash';
import './index.scss';

class Sd11x5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bet11x5: props.bet11x5,
      serviceTime: props.serviceTime,
      ballArr: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bet11x5) {
      this.setState({
        bet11x5: nextProps.bet11x5,
        serviceTime: nextProps.serviceTime
      });
      this.getBallArr(nextProps.bet11x5.categoryId);
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
        let bet11x5 = fastData.filter(m => m.typeId == 215)[0] || {};
        if (this.state.bet11x5.issueCode == bet11x5.issueCode) {
          timer = setTimeout(this.getFastBet.bind(this), 2000);
        } else {
          clearTimeout(timer);
          this.setState({ bet11x5: bet11x5 });
        }
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }
  getBallArr(categoryId) {
    let { ballArr } = this.state;
    let ballNum; // 球数
    if (categoryId == 1) {
      ballNum = 8;
    } else {
      ballNum = categoryId;
    }
    ballArr = [
      Number.attachZero(Number.getSrand(1, 11, ballNum)),
      Number.attachZero(Number.getSrand(1, 1, 1))
    ];
    if (ballArr.length <= 0) {
      return;
    }
    this.setState({ ballArr });
  }
  changeBet() {
    let { bet11x5 } = this.state;
    this.getBallArr(bet11x5.categoryId); // 切换
  }
  postLotto(url) {
    let { bet11x5, ballArr } = this.state;
    const childCode = [
      '',
      21508,
      21502,
      21503,
      21504,
      21505,
      21506,
      21507,
      21509
    ];
    session.set('sd11x5', {
      lotteryChildCode: childCode[bet11x5.categoryId],
      balls: ballArr[0].toString()
    });
    window.location.href = url;
  }
  render() {
    let { bet11x5, serviceTime, ballArr } = this.state;
    if (isEmpty(bet11x5)) return <div />;
    const num = ['', 8, 2, 3, 4, 5, 6, 7];
    let endTime = this.getendTime(serviceTime, bet11x5.saleEndTime);
    const kind = ['', '任八', '任二', '任三', '任四', '任五', '任六', '任七'];
    return (
      <div className="sd11x5">
        <div className="title">山东11x5</div>
        <div className="end-time">
          <span>{bet11x5.issueCode}期 </span>
          <span>截止时间还剩</span>
          <CountDownComponent
            remaining={ parseInt(endTime / 1000) }
            formats={ '时,分,秒' }
            timeout={ this.handleTimeout.bind(this) }
          />
        </div>
        <div className="lottery-bet">
          <div className="greed">{kind[bet11x5.categoryId]}</div>
          <Ball BallArr={ ballArr } />
          <div className="change-bet" onClick={ this.changeBet.bind(this) }>
            <img src={ require('../../img1/bt_refresh@2x.png') } />
          </div>
        </div>
        <div className="lottery-rule">
          <span>任选{num[bet11x5.categoryId]}个号码，所选号中含开出的5个号即中奖</span>
          <a
            className="change-button"
            onClick={ () => this.postLotto(bet11x5.fastUrl) }
          >
            投注
          </a>
        </div>
      </div>
    );
  }
}
Sd11x5.PropTypes = {
  bet11x5: PropTypes.array,
  serviceTime: PropTypes.string
};
export default Sd11x5;
