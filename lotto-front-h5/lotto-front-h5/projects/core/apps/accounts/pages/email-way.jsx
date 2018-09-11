/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:03:12
 * Desc: 邮箱找回密码
 */

import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '@/component/header'; // 头部
import cx from 'classnames';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import Reg from '@/utils/reg.js';

import '../scss/verifylogin.scss';

export class EmailWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clearver: false,
      verify: '',
      isSend: false,
      timeout: 60,
      login: 'login-btn'
    };
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
  sendCode() {
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      let params = {
        email: session.get('userInfo_find').em,
        sendType: 4,
        userName: session.get('userInfo_find').acc
      };
      http
        .post('/retrieve/get/email/code', params)
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
  Next() {
    let params = {
      code: this.state.verify,
      email: session.get('userInfo_find').em,
      sendType: 4,
      userName: session.get('userInfo_find').acc
    };
    http
      .post('/retrieve/validate/email', params)
      .then(res => {
        if (res.success == 1) {
          window.location.hash = '/resetpwd';
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  online() {
    window.open('//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663');
  }
  render() {
    let login = this.state.login;
    let clearver = this.state.clearver;
    let verify = this.state.verify;
    return (
      <div className="phoneway">
        <Header title="邮箱验证码验证找回密码" />
        <div className="phoneway-cont">
          <p className="title">我们已经发送了验证码到你的邮箱</p>
          <p className="phone-num">
            {Reg.mailHide(session.get('userInfo_find').em)}
          </p>
          <div className="ver-input">
            <span className="text-left">验证码</span>
            <div className="input-part">
              <input
                type="tel"
                placeholder="六位数验证码"
                onChange={ event => this.verChange(event) }
                value={ verify }
                maxLength="6"
              />
              <span
                className={ cx(clearver ? 'clear-part' : 'hide') }
                onClick={ this.onClearver.bind(this) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
            <span className="gain-part" onClick={ event => this.sendCode() }>
              {this.state.isSend
                ? this.state.timeout + '秒后重新获取'
                : '获取验证码'}
            </span>
          </div>

          <button className={ login } onClick={ event => this.Next(event) }>
            下&nbsp;一&nbsp;步
          </button>
          <Link to="/Findway">
            <p className="resel-btn">重新选择验证方式</p>
          </Link>
          <ul className="warm-msg">
            <li>没有收到邮件？</li>
            <li>
              1.请查看邮件是否被邮箱自动拦截，或被误认为垃圾邮件放到垃圾箱中。
            </li>
            <li>2.如果超过10分钟仍未收到激活信，请你重新发送。</li>
            <li>
              3.若你确认手机无法接收到验证短信，请联系<span
                onClick={ event => this.online(event) }
              >
                在线客服
              </span>，协助你完成身份验证。
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
