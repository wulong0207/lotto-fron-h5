/*
 * @Author: nearxu 
 * @Date: 2017-12-24 11:52:18
 * 双色球快投  
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import session from '@/services/session';
import { Number } from '@/utils/number';
import Ball from '../../../../activity/apps/chase/component/ball';
import '../css/ssq.scss';
class Ssq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ballArr: []
    };
  }
  componentDidMount() {
    this.randomBall();
  }
  randomBall() {
    let { ballArr } = this.state;
    // 双色球
    let arr = [33, 6, 16, 1];
    ballArr = [
      Number.attachZero(Number.getSrand(1, arr[0], arr[1])),
      Number.attachZero(Number.getSrand(1, arr[2], arr[3]))
    ];
    this.setState({ ballArr });
    session.set('ballOrder', {
      red: ballArr[0].toString(),
      blue: ballArr[1].toString()
    });
    console.log(ballArr, 'ballArr');
  }
  goPage() {
    window.location.href = 'ssq.html';
  }

  render() {
    let { ballArr } = this.state;
    if (!ballArr.length) return null;
    console.log(this.state.ballArr, 'ballarr');
    return (
      <div className="ssq-quick">
        <div className="no-order">
          <img src={ require('../img/cry@2x.png') } />
          <span className="grey">您该段时间内没有订单记录</span>
        </div>
        <div className="ssq">
          <img className="logo" src={ require('../img/ssq@2x.png') } />
          <div className="title">
            <div>
              <span>双色球</span>
            </div>
            <div className="change" onClick={ this.randomBall.bind(this) }>
              <img src={ require('../img/refresh@2x.png') } />
              <span>换一注</span>
            </div>
          </div>
          <Ball BallArr={ ballArr } />
        </div>
        <div className="bet" onClick={ this.goPage.bind(this) }>
          <span className="btn">
            <a>连续买10期</a>
          </span>
          <span className="grey">55%以上的巨讲均有追号产生的哦，快试试吧！</span>
        </div>
      </div>
    );
  }
}

export default Ssq;
