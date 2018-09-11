/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:05:58
 * Desc: 手机找回密码
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

export class PhoneWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clearver: false,
      verify: '',
      phone: '',
      acc: '',
      isSend: false,
      timeout: 60,
      login: 'login-btn'
    };
    this.timer = null;
  }
  componentWillMount() {
    this.setState({
      phone: session.get('userInfo_find').mob,
      acc: session.get('userInfo_find').acc
    });
  }
  componentDidMount() {
    this.sendCode();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  sendCode() {
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      let params = {
        mobile: this.state.phone,
        sendType: 4,
        userName: this.state.acc
      };
      http
        .post('/retrieve/get/mobile/code', params)
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
          if (err.code === '40117') {
            Message.toast(
              <span>
                您今天已获取验证码10次!次数已用完,请明天再试!或联系
                <a
                  onClick={ () => {
                    Message.closeToast();
                    window.open(
                      '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663'
                    );
                  } }
                >
                  在线客服
                </a>
              </span>
            );
          } else {
            Message.toast(err.message);
          }
        });
    }
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
  Next() {
    let params = {
      code: this.state.verify,
      mobile: this.state.phone,
      sendType: 4,
      userName: this.state.acc
    };
    http
      .post('/retrieve/validate/mobile', params)
      .then(res => {
        if (res.success == 1) {
          window.location.hash = '/resetpwd';
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  onClearver() {
    this.setState({ verify: '', login: 'login-btn', clearver: false });
  }
  online() {
    window.open('//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663');
  }
  render() {
    let login = this.state.login;
    let clearver = this.state.clearver;
    var account = Reg.phoneNumberHide(this.state.phone);
    let verify = this.state.verify;
    return (
      <div className="phoneway">
        <Header title="手机验证码验证找回密码" />
        <div className="phoneway-cont">
          <p className="title">我们已经发送了验证码到你的手机</p>
          <p className="phone-num">{account}</p>
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
            <li>温馨提示：</li>
            <li>
              1.运营商发送短信可能会有延迟请耐心等待，避免多次重新发送以致输错验证码；
            </li>
            <li>
              2. 如长时间没收到验证短信，请检查您的手机是否设置了短信拦截；
            </li>
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
