/*
 * @Author: nearxu 
 * @Date: 2017-12-26 17:04:16 
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import session from '@/services/session';
import DrawList from '../pages/draw-list';

import '../css/trade-info.scss';

export default class RechargePage extends Component {
  refresh() {
    this.drawlist.getTradeInfo();
  }

  render() {
    return <DrawList ref={ drawlist => (drawlist = this.drawlist) } />;
  }
}

const Home = ReactDOM.render(<RechargePage />, document.getElementById('app'));

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           url 网络地址
 *           code 股票代码
 *           name 股票名称
 *           market 股票市场
 */
window.initializeApp = function(param) {
  var curParam = param;
  try {
    curParam = JSON.parse(param);
  } catch (e) {
    curParam = param;
  }

  session.set('token', curParam.token);
  console.log('H5-Message: ' + curParam.token);
  Home.refresh();
};
