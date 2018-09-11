/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:06:26
 * Desc: 注册成功
 */

import React, { Component } from 'react';

import Header from '@/component/header'; // 头部
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import analytics from '@/services/analytics';

import '../scss/regsec.scss';

export class RegSec extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      submit: 'sub-btn'
    };
  }
  componentDidMount() {
    analytics.send(2064);
  }
  directTo(num, acc) {
    if (num) {
      analytics.send(20641).then(() => {
        session.set('token', session.get('userInfo').tk);
        window.location = '/sc.html#/recharge';
      })
    } else {
      analytics.send(20643).then(() => {
        session.set('createAcc', acc);
        window.location.hash = '/identity';
      })
    }
  }
  hungOut() {
    analytics.send(20642).then(() => {
      session.set('token', session.get('userInfo').tk);
      window.location = '/index.html';
    });
  }
  changeEmail(e) {
    if (e.target.value) {
      this.setState({ email: e.target.value, submit: 'sub-btn-blue' });
    } else {
      this.setState({ email: '', submit: 'sub-btn' });
    }
  }
  submit(email) {
    let params = {
      email: email,
      token: session.get('userInfo').tk
    };
    analytics.send([2044, 20645]).then(() => http.post('/passport/add/email', params))
      .then(res => {
        if (res.success == 1) {
          Message.toast(res.message);
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let acc = session.get('createAcc');
    let btn_cont = session.get('pre');
    let email = this.state.email;
    let submit = this.state.submit;
    return (
      <div className="regsec">
        <Header title="注册成功" isback={ false } />
        <div className="regsec-cont">
          <img src={ require('@/img/account/smile_green@2x.png') } />
          <p className="cong">
            <span>{acc}</span>，恭喜你注册成功！
          </p>
          <p className="cong">
            <span>实名认证</span> 资料是领大奖和提款的唯一凭证
          </p>
          <button
            className="next-btn"
            onClick={ event => this.directTo(btn_cont, acc) }
          >
            {btn_cont == 1 ? '立即充值' : '立即认证'}
          </button>
          <p className="go-hung" onClick={ event => this.hungOut(event) }>
            {/* 先逛逛，买彩票时再认证 */}
            先逛逛
          </p>
          <div className="email-very">
            <input
              placeholder="请输入你的邮箱地址"
              type="text"
              value={ email }
              onChange={ event => this.changeEmail(event) }
            />
            <button className={ submit } onClick={ event => this.submit(email) }>
              提交
            </button>
            <p className="fir-list">
              超过<span>85%</span>的用户选择了立即登记邮箱，账户更安全购彩更放心。
            </p>
            <p className="sec-list">登记邮箱后你可以享受以下服务：</p>
            <p className="thi-list">投注信息确认邮件 / 彩市话题及热门活动</p>
          </div>
        </div>
      </div>
    );
  }
}
