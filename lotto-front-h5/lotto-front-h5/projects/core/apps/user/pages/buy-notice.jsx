/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-购彩提醒设置子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import Switch from '@/component/switch';
import Header from '@/component/header';

import '../css/notice.scss';

export default class BuyNotice extends Component {
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
      <div className="pt-header buy-notice">
        <Header back={ this.goTo.bind(this) } title="购彩提醒设置" />
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>双色球</span>
              <em>每周二、四、日 17:00提醒</em>
            </div>
            <Switch value="on" switchClick={ this.ssq.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>大乐透</span>
              <em>每周一、三、六 17:00提醒</em>
            </div>
            <Switch value="on" switchClick={ this.dlt.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>七乐彩</span>
              <em>每周一、三、五 17:00提醒</em>
            </div>
            <Switch value="off" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>七星彩</span>
              <em>每周二、五、日 17:00提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>福彩3D</span>
              <em>每天 17:00提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>排列三/五</span>
              <em>每天 17:00提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>东方6+1</span>
              <em>每周一、三、六 17:00提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>高频彩</span>
              <em>每天不定期提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>胜负彩</span>
              <em>彩票截止前2小时提醒</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>竞技彩</span>
              <em>你关注或购买的联赛在赛事截止前1小时提醒</em>
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
