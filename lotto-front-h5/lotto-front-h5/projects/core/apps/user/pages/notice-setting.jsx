/**
 * Created by manaster
 * date 2017-03-10
 * desc:个人中心模块--消息通知设置子模块
 */

import React, { Component } from 'react';
import Header from '@/component/header';
import '../css/notice-setting.scss';

export default class NoticeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false
    };
  }
  lotteryNotice() {
    // 跳到开奖信息界面
    window.location.hash = '#/lottery-notice';
  }
  tradeNotice() {
    // 跳到交易消息界面
    window.location.hash = '#/trade-notice';
  }
  accountNotice() {
    // 跳到账户消息界面
    window.location.hash = '#/account-notice';
  }
  buyNotice() {
    // 跳到购彩提醒界面
    window.location.hash = '#/buy-notice';
  }
  otherNotice() {
    // 跳到其他消息界面
    window.location.hash = '#/other-notice';
  }
  noBotherNotice() {
    // 跳到勿扰模式界面
    window.location.href = '#/no-bother-notice';
  }
  goTo() {
    location.href = '#/setting';
  }
  render() {
    return (
      <div className="pt-header notice-setting">
        <Header title="消息通知设置" back={ this.goTo.bind(this) } />
        <section className="sf-section">
          <div className="sf-item" onClick={ this.lotteryNotice.bind(this) }>
            <span>开奖信息</span>
            <em className="tl">开奖后第一时间知晓开奖结果</em>
            <i className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.tradeNotice.bind(this) }>
            <span>交易消息</span>
            <em className="tl">投注后方案信息及中奖信息消息</em>
            <i className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.accountNotice.bind(this) }>
            <span>账户信息</span>
            <em className="tl">个人用户中心信息变化及异常提醒</em>
            <i className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.buyNotice.bind(this) }>
            <span>购彩信息</span>
            <em className="tl">设置闹钟定时提醒，以免错过期数</em>
            <i className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.otherNotice.bind(this) }>
            <span>其他信息</span>
            <em className="tl">最新活动、资讯和产品上线等提醒</em>
            <i className="icon-arrow-r" />
          </div>
        </section>
        <section className="sf-section">
          <div className="sf-item" onClick={ this.noBotherNotice.bind(this) }>
            <span>勿扰模式</span>
            <em className="tl" />
            <i className="icon-arrow-r" />
          </div>
        </section>
        {/* 路由跳转 */}
      </div>
    );
  }
}
