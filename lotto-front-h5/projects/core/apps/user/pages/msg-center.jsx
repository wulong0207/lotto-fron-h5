/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--消息中心子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Header from '@/component/header';
import '../css/msg-center.scss';

export default class MsgCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setting() {
    let noticeSetting = ReactDOM.findDOMNode(this.refs.noticeSetting);
    noticeSetting.click();
  }
  goTo() {
    location.href = '/sc.html';
  }
  render() {
    return (
      <div className="pt-header pb-footer msg-center">
        <Header title="消息中心" back={ this.goTo.bind(this) }>
          <div className="operation">
            <span onClick={ this.setting.bind(this) }>设置</span>
          </div>
        </Header>
        <section className="msg-contain">
          {/*
                     <div className="msg-item">
                     <span className="msg-data">今天</span>
                     <div className="msg-wrapper">
                     <span className="msg-title">激情世界杯，盛世狂欢宴</span>
                     <img src={require('../../img/msg-bg.png')} alt=""/>
                     <p>世界杯的活动的盛宴，点燃激情的圣火世界杯的活动的盛宴，点燃激情的圣火。</p>
                     </div>
                     </div>
                    */}
          <div className="no-msg">
            <i className="icon-errpic" />
            <span className="no-content">没有内容！</span>
            <span>大家都去外星了</span>
          </div>
        </section>
        <section className="msg-footer">
          <span>提醒</span>
          <span>全部</span>
          <span>活动优惠</span>
          <span>系统通知</span>
        </section>
        {/* 路由跳转 */}
        <Link to="/notice-setting" ref="noticeSetting" />
      </div>
    );
  }
}
