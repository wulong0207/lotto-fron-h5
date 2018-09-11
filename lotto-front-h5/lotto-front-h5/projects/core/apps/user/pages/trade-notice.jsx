/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-交易信息子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import Switch from '@/component/switch';
import Header from '@/component/header';

export default class TradeNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  ssq() {
    // 双色球开关点击事件
    // alert(1);
  }
  dlt() {
    // 大乐透开关点击事件
  }
  goTo() {
    location.href = '#/notice-setting';
  }
  render() {
    return (
      <div className="pt-header trade-notice">
        {/* <div className="header">
                    <a href="#/notice-setting" className="back"></a>
                    <div className="user-info big">交易消息设置</div>
                </div> */}
        <Header title="交易消息设置" back={ this.goTo.bind(this) } />

        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>中奖提醒</span>
              <em>开奖后中奖的方案通知你中奖信息，该提醒暂不支持高频彩</em>
            </div>
            <Switch value="on" switchClick={ this.ssq.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>方案撤单</span>
              <em>方案流产或出票失败通知</em>
            </div>
            <Switch value="on" switchClick={ this.dlt.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>合买方案进度提醒</span>
              <em>发起合买方案进度达到70%以上提醒</em>
            </div>
            <Switch value="off" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>方案未上传</span>
              <em>未上传的方案进度达到80%时提醒您上传方案</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>跟单失败</span>
              <em>定制跟单出现跟单失败时会提醒你</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>追号状态</span>
              <em>追号结束、余额不足、满足设置中奖奖项时会收到提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>出票成功</span>
              <em>每个方案出票成功后通知</em>
            </div>
            <Switch value="on" />
          </div>
        </section>
        <FootCopy name="st-copy" />
        {/* 路由跳转 */}
      </div>
    );
  }
}
