/*
 * @Author: yubei 
 * @Date: 2017-08-18 16:50:31 
 * Desc: 用户头像
 */

import React, { Component } from 'react';
import session from '@/services/session.js';
import { browser } from '@/utils/utils';

import './index.scss';

export default class Usericon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
    this.userInfo = null;
  }

  // 初始化
  componentWillMount() {
    this.userInfo = session.get('userInfo');
    if (this.userInfo) {
      this.state = {
        isLogin: true
      };
    }
  }

  render() {
    if (browser.yicaiApp) {
      return <div />;
    }
    return (
      <span>
        {this.state.isLogin ? (
          <a className={ 'user-icon login' } href="/sc.html#/">
            <img
              src={
                this.userInfo.hd_url
                  ? this.userInfo.hd_url
                  : require('./img//head@2x.png')
              }
            />
          </a>
        ) : (
          <a className={ 'user-icon' } href="/account.html#/login">
            <img src={ require('./img/login_icon.png') } />
          </a>
        )}
      </span>
    );
  }
}
