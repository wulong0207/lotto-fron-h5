/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:07:07
 * Desc: 充值成功
 */

import React, { Component } from 'react';
import Header from '@/component/header'; // 头部
import '../scss/resetsec.scss';

export class ResetSec extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  go() {
    window.location.hash = '/login';
  }
  render() {
    return (
      <div className="resetsec">
        <Header title="密码重置成功" />
        <img src={ require('@/img/account/smile_green@2x.png') } />
        <p>密码修改成功！</p>
        <button className="next-btn" onClick={ event => this.go(event) }>
          返回登录页
        </button>
      </div>
    );
  }
}
