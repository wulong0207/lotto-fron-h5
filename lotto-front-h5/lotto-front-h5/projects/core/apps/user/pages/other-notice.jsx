/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-其他消息设置子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import Switch from '@/component/switch';
import Header from '@/component/header';

import '../css/notice.scss';

export default class OtherNotice extends Component {
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
      <div className="pt-header other-notice">
        {/* <div className="header">
                    <a href="#/notice-setting" className="back"></a>
                    <div className="user-info big">其他消息设置</div>
                </div> */}
        <Header title="其他消息设置" back={ this.goTo.bind(this) } />
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>新活动提醒</span>
              <em>各种优惠活动的提醒，好礼不能错过</em>
            </div>
            <Switch value="on" switchClick={ this.ssq.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>新彩种及新功能上线</span>
              <em>上线新的彩种、新的功能会及时邀请你来体验</em>
            </div>
            <Switch value="on" switchClick={ this.dlt.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>大奖提醒</span>
              <em>网站有大奖中出，第一时间将喜气传达给你</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>滚存或热点赛事提醒</span>
              <em>当某彩种出现巨额滚存或热门赛事时，会及时通知你来参与</em>
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
