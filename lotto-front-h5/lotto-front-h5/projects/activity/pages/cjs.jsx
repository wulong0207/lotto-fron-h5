import React, { Component } from 'react';
import Message from '@/services/message';
import http from '@/utils/request';
import Interaction from '@/utils/interaction';

import cx from 'classnames';
import { browser } from '@/utils/utils'; // 判断浏览器内核

import { Gride } from '../component/gride';
import { ScrollCont } from '../component/scroll';

import '../scss/cjs.scss';

export class Fivact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customertel: ''
    };
  }
  componentWillMount() {
    this.getcustomertel();
  }
  getcustomertel() {
    http
      .get('/member/customertel')
      .then(res => {
        // console.log(res.data);
        this.setState({ customertel: res.data });
      })
      .catch(err => {
        // console.log(err);
        Message.toast(err.message);
      });
  }
  // 下载app
  download() {
    if (browser.android) {
      http
        .get('/home/channelVersion', {})
        .then(res => {
          var url = res.data.wapAppUrl;
          window.location = url;
        })
        .catch(err => {
          Message.toast(err.message);
        });
      // window.location =
      // 'http://sit.cp.2ncai.com/_upload_file/app/Android_V1.0.5_6_activities_20170814_1101.apk';
    } else {
    }
  }
  goHome() {
    window.location = '/index.html';
  }
  ssq() {
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toBetVC', ['100']);
    } else {
      window.location = '/ssq.html';
    }
  }
  syxw() {
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toBetVC', ['213']);
    } else {
      window.location = '/jx11x5.html';
    }
  }
  render() {
    let customertel = this.state.customertel;
    return (
      <div className="foract" ref={ bodyBox => (this.bodyBox = bodyBox) }>
        <section className="cont-title">
          <img className="hand" src={ require('../img/bighans.png') } />
        </section>
        <section className="cont">
          <div className="cont-grid">
            <Gride />
          </div>
          <div className="cont-msg">
            <div className="gold-left">
              <img src={ require('../img/gold_left.png') } alt="" />
            </div>
            <div className="msg-list">
              {/* scroll */}
              <ScrollCont />
            </div>
            <div className="gold-right">
              <img src={ require('../img/gold_right.png') } alt="" />
            </div>
          </div>
          <div className="cont-recommend">
            <div className="title">
              <img src={ require('../img/tuijian_grize.png') } alt="" />
            </div>
            <div className="list-01">
              <img
                src={ require('../img/two_ball.png') }
                alt=""
                className="double-logo"
              />
              <div className="text">
                <p>双色球</p>
                <p>2元可中1000万！</p>
              </div>
              <div className="post">
                <button onClick={ event => this.ssq(event) }>立即投注</button>
              </div>
            </div>
            <div className="list-02">
              <img
                src={ require('../img/11_5.png') }
                alt=""
                className="double-logo"
              />
              <div className="text">
                <p>江西11选5</p>
                <p>每天84次中奖机会</p>
              </div>
              <div className="post">
                <button onClick={ event => this.syxw(event) }>立即投注</button>
              </div>
            </div>
          </div>
          <div
            className={ cx('downloade', {
              hide: browser.ios || browser.yicaiApp
            }) }
          >
            <div className="down-cont">
              <img
                src={ require('../img/thi_logo.png') }
                alt=""
                className="logo"
              />
              <span>下载客户端，随时查看中奖</span>
              <div className="post">
                <button onClick={ event => this.download(event) }>
                  立即下载
                </button>
              </div>
            </div>
          </div>
          <div className="cont-info">
            <div className="title">
              <img src={ require('../img/act_info.png') } alt="" />
            </div>
            <div className="container">
              <ul className="intro-list">
                <li>1、本活动新老用户均可参与;</li>
                <li>2、参与活动的用户需完善个人信息；</li>
                <li>
                  3、获得的彩金卡、优惠券、抵扣券仅限于购彩使用，中奖的奖金可提现；
                </li>
                <li>
                  4、获得充20得88红包的用户<span>单笔充值金额需≧20元</span>；充值的本金及赠送的红包仅限于购彩使用，中奖的奖金可提现；
                </li>
                <li>
                  5、抽中的红包在<span>“用户中心”-“我的礼品”</span>中查看；
                </li>
                <li>6、每位实名用户仅限参与一次；</li>
                <li>
                  7、<span>每日抽奖的奖品数量有限，抽完即止</span>哦;
                </li>
                <li>
                  8、恶意操作的用户，将取消活动资格，本站有权收回获赠的红包；
                </li>
                <li>
                  9、在法律许可范围内，2n彩票保留本次活动解释权，如有疑问请联系客服:{' '}
                  {customertel}。
                </li>
              </ul>
              <p
                className={ cx('btn', { hide: browser.yicaiApp }) }
                onClick={ event => this.goHome(event) }
              >
                进入2N彩票首页
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
