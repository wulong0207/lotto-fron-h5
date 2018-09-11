import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import http from '@/utils/request';
import { getParameter, formatMoney, browser } from '@/utils/utils';
import Header from '@/component/header';
import Ball from '../../component/ball';
import { Number } from '@/utils/number';
import session from '@/services/session.js';
import Interaction from '@/utils/interaction';
import Dialog from '../../../../../activity/apps/jckt/login/dialog';
import Message from '@/services/message.js';
import './pick.scss';

class Pick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ballArr: [], // 随机生成号码
      issueCode: '', // 当前彩期
      orderCode: ''
    };
  }
  componentDidMount() {
    console.log(getParameter('code'), 'code');
    this.randomBall(+getParameter('code'));
    this.getIssueCode();
  }
  getIssueCode() {
    http
      .get('/home/prelott', {
        params: {
          lotteryCode: getParameter('code')
        }
      })
      .then(res => {
        this.setState({ issueCode: res.data.issueCode });
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }
  randomBall(id) {
    let arr = [];
    let BallArr = [];
    if (id == 100) {
      // 双色球
      arr = [33, 6, 16, 1];
    }
    if (id == 102) {
      // 大乐透
      arr = [35, 5, 12, 2];
    }
    BallArr = [
      Number.attachZero(Number.getSrand(1, arr[0], arr[1])),
      Number.attachZero(Number.getSrand(1, arr[2], arr[3]))
    ];
    this.setState({ ballArr: BallArr });
    console.log(BallArr, 'ballArr');
  }
  changeBet() {
    this.randomBall(+getParameter('code'));
  }
  pay() {
    let token = session.get('token');
    if (!token) {
      if (browser.yicaiApp) {
        // 调APP登录
        Interaction.sendInteraction('toLogin', []);
      } else {
        // 注册登录
        this.dialog.changeShowDialog(1);
      }
    } else {
      this.getAddOrder();
    }
  }
  getAddOrder() {
    let { ballArr } = this.state;
    let url = '/activity/excuteAdded';
    let result = { isDltAdd: 0, amount: 2 }; // 是否大乐透追加 //单注金额
    if (+getParameter('code') === 102) {
      // dlt
      result = { isDltAdd: 1, amount: 3 };
    }
    let params = {
      activityId: getParameter('activityId'), // 活动编号
      addAmount: parseInt(result.amount * getParameter('num')), // 追号总金额
      addCount: 1, // 追号投注数
      addIssues: +getParameter('num'), // 移动端追号期数 活动只支持1,2,3期
      addMultiples: 1, // 移动端追号倍数 活动只支持1倍
      addType: 1, // 追号类型； 1：固定选号；2：随机选号
      isDltAdd: result.isDltAdd,
      issueCode: this.state.issueCode, // 彩期编号
      lotteryCode: +getParameter('code'),
      multipleNum: +getParameter('num'), // curCart.mul * curCart.zh, // 订单总倍数   number  必填。
      orderAddContentList: [
        {
          amount: result.amount, //  单个方案投注金额    number  必填。
          buyNumber: 1, //   单个方案投注注数    number  必填。
          codeWay: 2, // 投注方式    number  必填。1：手选；2：机选；3：上传
          contentType: 1, // 玩法  number  必填。如竞彩，1：单式；2：复式；3：胆拖；
          lotteryChildCode: +(getParameter('code') + '01'), //    子玩法   ID   number  必选。
          multiple: 1, //    单个方案投注倍数    number  必填。
          planContent: `${ballArr[0]}|${ballArr[1]}` // 投注内容    string
        }
      ], // 追号内容列表
      platform: 2, // 平台类型 1:Web,2:Wap;
      source: 2, // 平台来源
      stopType: 3, // 停追类型； 1：奖项；2：金额；3：永追
      token: session.get('token')
    };
    http
      .post(url, params)
      .then(res => {
        let orderCode = res.data.orderAddCode || '';
        this.handleOrder(orderCode);
      })
      .catch(err => {
        this.handleErrorCode(err);
        console.log(err.message);
      });
  }
  // 跳转支付
  handleOrder(code) {
    let token = session.get('token');
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toPay', [
        JSON.stringify([{ oc: code, bt: 1, token: token }])
      ]);
    } else {
      return (window.location.href = `/pay.html?orderCode=${code}&buyType=1&token=${token}`);
    }
  }
  // 错误状态
  handleErrorCode(err) {
    switch (err.code) {
      case '41407':
        // 未支付订单
        this.state.orderCode = err.data.orderAddedCode || '';
        Message.alert({
          title: '温馨提示',
          btnTxt: ['关闭', '去支付'], // 可不传，默认是确定
          btnFn: [
            () => {},
            () => {
              // 去方案详情
              this.goToJjcLottery(this.state.orderCode);
              // this.handleOrder(this.state.orderCode);
            }
          ],
          children: (
            <div className="message-alert">
              <div className="content">您本次活动有未付款的订单，请尽快支付</div>
            </div>
          )
        });
        break;

      default:
        Message.alert({
          title: '温馨提示',
          btnTxt: ['确定'], // 可不传，默认是确定
          btnFn: [() => {}],
          children: (
            <div className="message-alert">
              <div className="content">{err.message}</div>
            </div>
          )
        });
        break;
    }
  }
  // 先去方案详情 然后去支付
  goToJjcLottery(code) {
    window.location.href = 'sc.html#/orders/' + code;
  }

  render() {
    let { ballArr } = this.state;
    if (!ballArr.length) return null;
    return (
      <div className="pick">
        <Header title="套餐选号" bg="white" />
        <div className="pick-content">
          <div className="bet-info">
            {getParameter('code') == '100' ? (
              <img className="logo" src={ require('../../img/ssq@2x.png') } />
            ) : (
              <img className="logo" src={ require('../../img/dlt@2x.png') } />
            )}
            <div className="title">
              <div>
                <b>
                  {getParameter('code') == '100' ? '双色球' : '大乐透'}
                  {getParameter('num')}期追号套餐
                </b>
              </div>
              <div>
                <i>
                  支付{(+getParameter('code') === 100 ? 2 : 3) *
                    getParameter('num')}元,不中返{getParameter('refund')}元
                </i>
              </div>
            </div>
            <div className="rule">
              <p>
                连续投注一组号码{getParameter('num')}期，若都没有中奖， 返奖在追号结束三个工作日内发放到购买套餐账户内。
              </p>
            </div>
          </div>
          <div className="bet">
            <div className="bet-ball">
              <Ball BallArr={ ballArr } />
              <div className="change-ball" onClick={ this.changeBet.bind(this) }>
                <img
                  className="refresh"
                  src={ require('../../img/refresh.png') }
                />
                <span>换一注</span>
              </div>
            </div>
            <div className="now-bug" onClick={ this.pay.bind(this) } />
          </div>
        </div>
        {/* 弹窗部分 */}
        <Dialog ref={ dialog => (this.dialog = dialog) } />
      </div>
    );
  }
}

export default Pick;
