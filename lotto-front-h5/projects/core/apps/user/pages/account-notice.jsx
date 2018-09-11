/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-账户信息子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import Switch from '@/component/switch';
import Header from '@/component/header';

export default class AccountNotice extends Component {
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
      <div className="pt-header account-notice">
        {/* <PageHeader url="#/notice-setting" title="账户消息设置"/> */}
        <Header title="账户消息设置" back={ this.goTo.bind(this) } />
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>钱包变动</span>
              <em>提款等资金操作时，第一时间通知你</em>
            </div>
            <Switch value="on" switchClick={ this.ssq.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>账号异常</span>
              <em>账号登录时账号异常通知</em>
            </div>
            <Switch value="on" switchClick={ this.dlt.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>修改资料成功</span>
              <em>提交修改资料成功后通知</em>
            </div>
            <Switch value="on" />
          </div>
        </section>
        <FootCopy name="st-copy-absolute" />
        {/* 路由跳转 */}
      </div>
    );
  }
}
