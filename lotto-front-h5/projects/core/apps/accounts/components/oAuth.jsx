/*
 * @Author: yubei
 * @Date: 2017-09-14 15:54:15
 * Desc: 第三方登录
 */

import React, { Component } from 'react';
import { getParameter } from '@/utils/utils.js';
import analytics from '@/services/analytics';

export default class OAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.next = '';
    this.host = window.location.host;
    this.protocol = window.location.protocol;
  }

  componentWillMount() {
    let next = getParameter('next');
    this.next = next ? encodeURIComponent(next) : '';
  }

  // QQ登录
  onQQLogin() {
    let redirect_uri = encodeURIComponent(
      `${this.protocol}//${this.host}/oauth.html?state=&next=${this.next}`
    );
    analytics.send(2078).then(() => window.location = `https://graph.qq.com/oauth2.0/authorize?client_id=101380144&response_type=token&scope=all&redirect_uri=${redirect_uri}`)
  }

  onWeiboLogin() {
    let redirect_uri = encodeURIComponent(
      `${this.protocol}//${this.host}/oauth.html?state=&next=${this.next}`
    );
    // let redirect_uri = encodeURIComponent(`http://m.2ncai.com/oauth.html`);
    analytics.send(2079).then(() => window.location = `https://api.weibo.com/oauth2/authorize?client_id=201627274&response_type=code&redirect_uri=${redirect_uri}`)
  }

  render() {
    return (
      <div className="third-party">
        <fieldset>
          <legend>合作账号登录</legend>
          <div className="third-logo">
            <span onClick={ this.onQQLogin.bind(this) }>
              <img src={ require('@/img/account/qq_nor@2x.png') } />
            </span>
            <span onClick={ this.onWeiboLogin.bind(this) }>
              <img src={ require('@/img/account/weibo_nor@2x.png') } />
            </span>
          </div>
        </fieldset>
      </div>
    );
  }
}
