/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:07:25
 * Desc: 验证码登录
 */

import React, { Component } from 'react';

import Reg from '@/utils/reg.js';
import Header from '@/component/header'; // 头部
import cx from 'classnames';
import session from '@/services/session.js';
import storage from '@/services/storage.js';
import Message from '@/services/message';
import http from '@/utils/request';

import '../scss/verifylogin.scss';
const ACCOUNT_HISTORY = 'ACCOUNT_HISTORY';

export class VerifyLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSend: false,
      timeout: 60,
      verify: '',
      clearver: false,
      login: 'login-btn',
      accountlist: storage.get(ACCOUNT_HISTORY)
        ? storage.get(ACCOUNT_HISTORY)
        : [] || []
    };
    this.timer = null;
  }
  componentDidMount() {
    this.sendCode();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  verChange(e) {
    if (e.target.value) {
      this.setState({
        verify: e.target.value,
        login: 'login-btn-blue',
        clearver: true
      });
    } else {
      this.setState({ verify: '', login: 'login-btn', clearver: false });
    }
  }
  onClearver() {
    this.setState({ verify: '', login: 'login-btn', clearver: false });
  }
  sendCode(isSend) {
    let _this = this;
    if (!isSend) {
      let params = {
        sendType: 1,
        userName: session.get('mob')
      };
      session.set('mianmiAcc', params.userName);
      http
        .post('/passport/get/code', params)
        .then(res => {
          _this.setState({ isSend: true });
          let timeout = _this.state.timeout;
          _this.timer = setInterval(() => {
            timeout--;
            _this.setState({ timeout: timeout });
            if (timeout <= 0) {
              _this.setState({
                isSend: false,
                timeout: 60
              });
              clearInterval(_this.timer);
            }
          }, 1000);
        })
        .catch(err => {
          Message.toast(err.message);
        });
    }
  }
  loginBtn(ver) {
    let params = {
      code: ver,
      sendType: 1,
      userName: session.get('mob')
    };
    // 记住免密登录的账号
    http
      .post('/passport/login/code', params)
      .then(res => {
        // 存入历史登录
        let account = {
          userName: params.userName,
          password: ''
        };
        let accountlist = [];
        accountlist = this.state.accountlist.concat();
        accountlist.unshift(account);
        storage.set(ACCOUNT_HISTORY, accountlist);

        session.set('userInfo', res.data); // 存储用户信息
        session.set('token', res.data.tk); // 存储用户信息
        var back = session.get('back');
        window.location = back || '/index.html';
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  render() {
    var acc = Reg.phoneNumberHide(session.get('mob'));
    let verify = this.state.verify;
    let login = this.state.login;
    let clearver = this.state.clearver;
    let isSend = this.state.isSend;
    return (
      <div className="verifylogin">
        <Header title="免密登录" />
        <div className="verifylogin-cont">
          <p className="title">我们已经发送了验证码到你的手机</p>
          <p className="phone-num">{acc}</p>
          <div className="ver-input">
            <span className="text-left">验证码</span>
            <div className="input-part">
              <input
                type="tel"
                maxLength="6"
                placeholder="六位数验证码"
                value={ verify }
                onChange={ event => this.verChange(event) }
              />
              <span
                className={ cx(clearver ? 'clear-part' : 'hide') }
                onClick={ this.onClearver.bind(this) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
            <span
              className="gain-part"
              onClick={ event => this.sendCode(isSend) }
            >
              {isSend ? this.state.timeout + '秒后重新获取' : '获取验证码'}
            </span>
          </div>
          <button className={ login } onClick={ event => this.loginBtn(verify) }>
            登录
          </button>
        </div>
      </div>
    );
  }
}
