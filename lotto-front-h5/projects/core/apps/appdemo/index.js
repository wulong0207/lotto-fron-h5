/*
 * @Author: yubei
 * @Date: 2017-11-16 16:08:03
 * Desc: appdemo
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Interaction from '@/utils/interaction';
import session from '@/services/session';

import './index.scss';
import '@/scss/base/mixins';

export class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 交易明细
  transaction() {
    Interaction.sendInteraction('viewTransactionDetail', []);
  }

  // 充值
  recharge() {
    Interaction.sendInteraction('toRecharge', []);
  }

  // 个人中心
  user() {
    Interaction.sendInteraction('goCenter', []);
  }

  // 返回上一页
  back() {
    Interaction.sendInteraction('toLastVC', []);
  }

  // 实名认证
  realName() {
    Interaction.sendInteraction('toRealName', []);
  }

  // 在线客服
  onlineService() {
    Interaction.sendInteraction('toOnLineServcie', []);
  }

  // 自助服务
  mySelfService() {
    Interaction.sendInteraction('toMyselfService', []);
  }

  // 拨打电话
  callPhone() {
    Interaction.sendInteraction('callPhone', ['17152716667']);
  }

  // 投注记录
  betRecord() {
    Interaction.sendInteraction('viewBettingRecord', []);
  }

  // 提款
  drawMoney() {
    Interaction.sendInteraction('toWithdraw', []);
  }

  // 支付
  pay() {
    Interaction.sendInteraction('toPay', []); // 有字符串参数
  }

  // H5支付结果给app
  payResult() {
    Interaction.sendInteraction('payResult', []); // 有字符串参数
  }

  // token失效
  tokenExpire() {
    Interaction.sendInteraction('tokenExpires', []);
  }

  // 修改密码
  changePassword() {
    Interaction.sendInteraction('toChangePassword', []);
  }

  // 登录
  login() {
    Interaction.sendInteraction('toLogin', []);
  }

  // 找回密码
  findPassword() {
    Interaction.sendInteraction('toFindBackPassword', []);
  }

  // 用户中心红包
  userRedPacket() {
    Interaction.sendInteraction('toRedPacket', []);
  }

  // 获取token
  getToken() {
    // Interaction.sendInteraction('getToken',[]);
    alert('获取token成功');
  }

  // 绑定手机
  bindPhone() {
    Interaction.sendInteraction('toBindingMobilePhone', []);
  }

  // 去购彩
  LottoView() {
    Interaction.sendInteraction('toBetVC', ['300']); // 彩种code
  }

  // 添加银行卡
  addBankCard() {
    Interaction.sendInteraction('goAddbankCard', []);
  }

  render() {
    return (
      <div className="appdemo">
        <fieldset>
          <legend>UI交互类</legend>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.transaction.bind(this) }
          >
            交易明细
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.recharge.bind(this) }
          >
            充值
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.user.bind(this) }
          >
            个人中心
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.back.bind(this) }
          >
            上一界面
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.realName.bind(this) }
          >
            实名认证
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.onlineService.bind(this) }
          >
            在线客服
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.mySelfService.bind(this) }
          >
            自助服务
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.callPhone.bind(this) }
          >
            拨打电话
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.betRecord.bind(this) }
          >
            投注记录
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.drawMoney.bind(this) }
          >
            提款
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.pay.bind(this) }
          >
            支付
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.payResult.bind(this) }
          >
            H5支付结果给APP
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.tokenExpire.bind(this) }
          >
            token失效
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.changePassword.bind(this) }
          >
            修改密码
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.login.bind(this) }
          >
            登录
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.findPassword.bind(this) }
          >
            找回密码
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.userRedPacket.bind(this) }
          >
            用户中心红包
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.getToken.bind(this) }
          >
            获取token
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.bindPhone.bind(this) }
          >
            绑定手机
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.LottoView.bind(this) }
          >
            去购彩
          </a>
          <a
            className="button btn-blue"
            href="###"
            onClick={ this.addBankCard.bind(this) }
          >
            添加银行卡
          </a>
        </fieldset>
      </div>
    );
  }
}

const Home = ReactDOM.render(<Demo />, document.getElementById('app'));

/**
  * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
  * @param Json字符串，包括以下内容
  *           token token
  */
window.initializeApp = function(params) {
  // alert(JSON.stringify(params));
  var curParams = {};
  try {
    curParam = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
  //  Home.queryPayInfo();
};
