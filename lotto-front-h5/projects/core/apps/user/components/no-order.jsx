/**
 * Created by manaster
 * date 2017-03-06
 * desc:个人中心模块--没有订单子模块
 */

import React, { Component } from 'react';
import Session from '@/services/session';
import Navigator from '@/utils/navigator';
import { setDate } from '@/utils/utils';
import http from '@/utils/request';

export class NoOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      betNum: 0,
      show: this.props.show,
      redNumberArr: [], // 红球的数组
      blueNumberArr: [] // 篮球的数组
    };
  }

  componentDidMount() {
    this.reqSSQ();
    this.changeDouble(6, 1);
  }
  // 换一组双色球
  changeDouble(redNum, blueNum) {
    let resultBlueArr = [],
      resultRedArr = [];
    let resultBlue = {},
      resultRed = {};
    while (resultRedArr.length < redNum) {
      let num = parseInt(Math.random() * 32);
      if (num < 10) {
        num = '0' + num;
      } else {
        num = num + '';
      }
      if (num != '00' && !resultRed[num]) {
        resultRedArr.push(num);
        resultRed[num] = true;
      }
    }
    while (resultBlueArr.length < blueNum) {
      let num = parseInt(Math.random() * 16);
      if (num < 10) {
        num = '0' + num;
      } else {
        num = num + '';
      }
      if (num != '00' && !resultBlue[num]) {
        resultBlueArr.push(num);
        resultBlue[num] = true;
      }
    }
    let redBallArr = resultRedArr.sort((a, b) => {
      return a - b;
    });
    this.setState({
      redNumberArr: redBallArr,
      blueNumberArr: resultBlueArr
    });
  }
  // 换一组双色球
  // changeDouble(redNum, blueNum){
  //     let resultRed = {}, reusltRedArr = [];
  //     let resultBlue = {}, resultBlueArr = [];

  //     while(reusltRedArr.length < redNum){
  //         let num = parseInt(Math.random() * 32);
  //         if(num < 10){
  //             num = "0" + num;
  //         }else{
  //             num = num + '';
  //         }
  //         if(num != "00" && !resultRed[num]){
  //             reusltRedArr.push(num);
  //             resultRed[num] = true;
  //         }
  //     }

  //     while(resultBlueArr.length < blueNum){
  //         let num = parseInt(Math.random() * 16);
  //         if(num < 10){
  //             num = "0" + num;
  //         }else{
  //             num = num + '';
  //         }
  //         if(num != "00" && !resultBlue[num]){
  //             resultBlueArr.push(num);
  //             resultBlue[num] = true;
  //         }
  //     }

  //     let result = (reusltRedArr.sort((a,b)=>{return a - b})).concat(resultBlueArr);
  //     this.setState({numberArr: result});
  // }

  reqSSQ() {
    let self = this;
    http
      .get('/h5/ssq/info', {
        params: {}
      })
      .then(res => {
        if (!res.success) {
          Message.toast(res.message);
          return;
        }

        let betNum =
          res.data.lotteryIssueBase.latestIssue.jackpotAmount / 5000000;

        self.setState({ betNum: parseInt(betNum) });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  // 提交订单
  submitOrder() {
    let { redNumberArr, blueNumberArr } = this.state;
    Session.set('ballOrder', {
      blue: blueNumberArr.toString(),
      red: redNumberArr.toString(),
      period: 10
    });
    Navigator.goSSQ();
  }

  render() {
    let { show, redNumberArr, blueNumberArr } = this.state;
    return (
      <div style={ { display: show ? '' : 'none' } }>
        {/* 没有订单记录 */}
        <section className="no-order">
          <div className="no-order-desc">
            <p>您该段时间内没有订单记录</p>
          </div>
          <div className="no-order-lottery">
            <div className="ssq-img" />
            <div className="no-order-ssq clearfix">
              <span>双色球</span>
              {/* <p>奖池滚存:可开出{this.state.betNum}注500万大奖</p> */}
              <em onClick={ this.changeDouble.bind(this, 6, 1) }>换一注</em>
            </div>
            <div className="no-order-number">
              {redNumberArr.concat(blueNumberArr).map((item, index) => {
                return <span key={ index }>{item}</span>;
              })}
            </div>
          </div>
          <div className="no-order-buy">
            <button onClick={ this.submitOrder.bind(this) }>连续买10期</button>
            <p>55%以上的巨奖均由追号产生的哦，快试试吧！</p>
          </div>
        </section>
      </div>
    );
  }
}
