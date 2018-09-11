/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-勿扰模式设置子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import Switch from '@/component/switch';
import Header from '@/component/header';
import '../css/notice.scss';

export default class NoBotherNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goTo() {
    location.href = '#/notice-setting';
  }
  render() {
    return (
      <div className="pt-header no-bother-notice">
        {/* <div className="header">
                    <a href="#/notice-setting" className="back"></a>
                    <div className="user-info big">勿扰模式设置</div>
                </div> */}
        <Header title="勿扰模式设置" back={ this.goTo.bind(this) } />
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>勿扰模式</span>
              <em>开启后，在设定的时间段内收到新消息时不会响铃或振动</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <span>开始时间</span>
            <em>23:00</em>
          </div>
          <div className="sf-item">
            <span>结束时间</span>
            <em>08:00</em>
          </div>
        </section>
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>声音</span>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>振动</span>
            </div>
            <Switch value="on" />
          </div>
        </section>
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>中奖动画</span>
              <em>开启后，当有新的中奖方案时会显示动画提醒</em>
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
