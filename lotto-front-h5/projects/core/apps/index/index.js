import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import http from '@/utils/request';
import Message from '@/services/message';

import OperLottList from './compontents/oper-lottlist'; // 彩种列表
import LottoBanner from './compontents/lottoBanner'; // 第二栏彩种轮播
import Menu from '@/component/menu'; // 底部菜单
import SaveToHomeScreenTip from './compontents/save-to-homescreen'; // 提示用户保存到桌面
import AllLotto from './compontents/allLotto';
import { MsgScroll } from './compontents/msg';
import session from '@/services/session.js';

import cx from 'classnames';
import { browser } from '@/utils/utils'; // 判断浏览器内核
import AdsCase from './compontents/ads-case'; // 首页广告弹框
import '@/scss/index/index.scss';
import analytics from '@/services/analytics';
const realName = session.get('userInfo');

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      close: false,
      adsObj: {},
      userRealName: realName ? realName.att_rn : ''
    };
  }
  componentDidMount() {
    analytics.send(201);
  }
  componentWillMount() {
    session.clear('ballOrder');
    http
      .get('/home/operall', {})
      .then(res => {
        this.setState(res.data);
      })
      .catch(err => {
        // console.log(err);
        Message.toast(err.message);
      });
  }
  down(event) {
    analytics.send(2014, () => {
      if (browser.android) {
        http
          .get('/home/channelVersion', {})
          .then(res => {
            var url = res.data.wapAppUrl;
            window.location.href = url;
          })
          .catch(err => {
            Message.toast(err.message);
          });
      } else {
      }
    });
  }
  close(e) {
    this.setState({ close: true });
  }
  onOpenAllLottPage() {
    this.refs.allLott.onOpen();
  }
  enter(w, url, i) {
    analytics.send(20121 + i, url);
  }

  render() {
    let close = this.state.close;
    let userRealName = this.state.userRealName;
    let enterList = [
      {
        img: require('./images/cd.png'),
        txt: '抄单',
        tag: '/cd'
      },
      {
        img: require('./images/help.png'),
        txt: '帮助',
        tag: '/help.html'
      },
      {
        img: require('./images/recharge.png'),
        txt: '充值',
        tag: '/sc.html#/recharge'
      },
      {
        img: require('./images/draw.png'),
        txt: '提现',
        tag:
          userRealName == 1
            ? '/sc.html#/draw-money'
            : '/sc.html#/real-name?draw_money=1'
      }
    ];
    return (
      <div className="home">
        {/* 主要为轮播图 */}
        <OperLottList
          operAdList={ this.state.operAdList }
          operLottList={ this.state.operLottList }
          onOpenAllLottPage={ this.onOpenAllLottPage.bind(this) }
        />
        {/* 四个功能模块的入口 */}
        <div className="enter-box">
          <ul className="enter-list">
            {enterList.map((e, i) => {
              return (
                <li
                  className="enter-cont"
                  onClick={ event => this.enter(event, e.tag, i) }
                  key={ i }
                >
                  <img src={ e.img } alt="" />
                  <span>{e.txt}</span>
                </li>
              );
            })}
          </ul>
        </div>
        {/* 消息轮播 */}
        <MsgScroll winInfoList={ this.state.winInfoList } />
        {/* 第二栏轮播图 */}
        <LottoBanner
          operAdList={ this.state.operAdList }
          operFastList={ this.state.operFastList }
        />
        {/* 全部彩种 */}
        <AllLotto operLottList={ this.state.operLottList } />
        {/* 下载链接 */}
        <div
          ref="icondown"
          className={ cx(
            'float',
            { hide: close },
            { hide: browser.ios || browser.yicaiApp }
          ) }
        >
          <div
            className={ cx('down', { hide: browser.ios || browser.yicaiApp }) }
            onClick={ event => this.down(event) }
          />
          <span className="close" onClick={ event => this.close(event) } />
        </div>
        {/* 底部菜单 */}
        <Menu index={ 0 } />
        <SaveToHomeScreenTip ref={ tip => (this.saveToHomeScreenTip = tip) } />
        <AdsCase emptyHandle={ () => this.saveToHomeScreenTip.show() } />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('app'));
