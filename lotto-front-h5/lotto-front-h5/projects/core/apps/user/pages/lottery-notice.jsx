/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-开奖信息子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import Switch from '@/component/switch';
import Header from '@/component/header';

import '../css/notice.scss';

export default class LotteryNotice extends Component {
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
      <div className="pt-header lottery-notice">
        {/* <div className="header">
                    <a href="#/notice-setting" className="back"></a>
                    <div className="user-info big">开奖消息设置</div>
                </div> */}
        <Header title="开奖消息设置" back={ this.goTo.bind(this) } />
        <section className="sf-section">
          <div className="sf-item">
            <div className="sf-item-l">
              <span>双色球</span>
              <em>每周二、四、日 21:15开奖</em>
            </div>
            <Switch value="on" switchClick={ this.ssq.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>大乐透</span>
              <em>每周一、三、六 20:30开奖</em>
            </div>
            <Switch value="on" switchClick={ this.dlt.bind(this) } />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>七乐彩</span>
              <em>每周一、三、五 21:15开奖</em>
            </div>
            <Switch value="off" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>七星彩</span>
              <em>每周二、五、日 20:30开奖</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>福彩3D</span>
              <em>每天 20:30开奖</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>排列三/五</span>
              <em>每天 20:30开奖</em>
            </div>
            <Switch value="on" />
          </div>
          <div className="sf-item">
            <div className="sf-item-l">
              <span>竞技彩赛果</span>
              <em>购买竞技彩后，将收到方案中比赛的赛果通知</em>
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
