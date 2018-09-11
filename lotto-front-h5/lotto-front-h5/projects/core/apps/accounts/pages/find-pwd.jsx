/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:03:37
 * Desc: 找回密码
 */

import React, { Component } from 'react';

import Header from '@/component/header'; // 头部
import cx from 'classnames';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';

import '../scss/findpwd.scss';
const mobReg = /^1[3456789]\d{9}$/; // 判断手机号
const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; // 验证邮箱
const forReg = /^\S+$/g; // 判断空格

export class FindPwd extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      clearuser: false,
      clearver: false,
      sure: 'sure-btn',
      username: '',
      verify: '',
      code: '',
      token: ''
    };
  }
  inputChange(e) {
    if (e.target.placeholder == '邮箱/手机/用户名') {
      this.setState({ username: e.target.value });
      if (e.target.value) {
        this.setState({ clearuser: true, sure: 'sure-btn-blue' });
      } else {
        this.setState({ clearuser: false, sure: 'sure-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '输入右边验证码') {
      this.setState({ verify: e.target.value });
      if (e.target.value) {
        this.setState({ clearver: true });
      } else {
        this.setState({ clearver: false });
      }
    } else {
    }
  }
  accVer(e, val) {
    if (this.onClear) return undefined;
    val = mobReg.test(val)
      ? val.toString().substring(0, 3) +
        ' ' +
        val.toString().substring(3, 7) +
        ' ' +
        val.toString().substring(7, 11)
      : val;
    this.setState({ username: val });
    val = forReg.test(val) ? val : val.replace(/\s/g, '');
    if (val != '') {
      this.verAccount(val);
    }
  }
  verAccount(username) {
    let params = { userName: username };
    http
      .post('/retrieve/validate/username', params)
      .then(res => {
        session.set('bankName', res.data.bankName);
      })
      .catch(err => {
        if (err.code == '40119') {
          if (mobReg.test(params.userName)) {
            // 为手机号
            Message.toast('该账号未注册或未开启手机号码登录');
          }
          if (emailReg.test(params.userName)) {
            // 为邮箱
            Message.toast('该账号未注册或未开启邮箱登录');
          }
          if (
            !mobReg.test(params.userName) &&
            !emailReg.test(params.userName)
          ) {
            // 账户名
            Message.toast('账户名不存在');
          }
        } else {
          Message.toast(err.message);
        }
      });
  }
  componentWillMount() {
    this.gainCode();
  }
  gainCode() {
    http
      .get('/retrieve/get/code', {})
      .then(res => {
        this.setState({ code: res.data.code, token: res.data.token });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  turnToFind() {
    let params = {
      code: this.state.verify == this.state.code ? this.state.code : '',
      token: this.state.token,
      userName: this.state.username.replace(/\s/gi, '')
    };
    http
      .post('/retrieve/validate/code', params)
      .then(res => {
        var userInfo = session.set('userInfo_find', res.data);
        if (res.success == 1) {
          window.location.hash = '/findway';
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  clearuser() {
    this.setState({ username: '', clearuser: false, sure: 'sure-btn' });
  }
  clearpwd() {
    this.setState({ verify: '', clearver: false });
  }
  render() {
    let clearuser = this.state.clearuser;
    let clearver = this.state.clearver;
    let username = this.state.username;
    let verify = this.state.verify;
    let sure = this.state.sure;
    let code = this.state.code;
    return (
      <div className="findsec">
        <Header title="找回密码" />
        <div className="find-container">
          <p className="msg">请输入需要找回的登录密码的账号名</p>
          <div className="username-wrap user">
            <img
              className="icon-left"
              src={ require('@/img/account/account_grey@2x.png') }
            />
            <input
              className="input-part"
              type="text"
              value={ username }
              placeholder="邮箱/手机/用户名"
              onChange={ event => this.inputChange(event) }
              onBlur={ event => this.accVer(event, username) }
            />
            <span
              className={ cx(clearuser ? 'clear-part' : 'hide') }
              onClick={ event => this.clearuser(event) }
              onMouseEnter={ () => (this.onClear = true) }
              onMouseLeave={ () => (this.onClear = false) }
            >
              <img src={ require('@/img/account/deletegrey@2x.png') } />
            </span>
          </div>
          <div className="username-wrap ver">
            <img
              className="icon-left"
              src={ require('@/img/account/id_code@2x.png') }
            />
            <input
              className="input-part"
              value={ verify }
              placeholder="输入右边验证码"
              maxLength="20"
              minLength="4"
              onChange={ event => this.inputChange(event) }
              type="tel"
            />
            <span
              className={ cx(clearver ? 'clear-part' : 'hide') }
              onClick={ event => this.clearpwd(event) }
            >
              <img src={ require('@/img/account/deletegrey@2x.png') } />
            </span>
          </div>
          <div className="valid-text" onClick={ event => this.gainCode(event) }>
            <p>{code}</p>
          </div>
          <button className={ sure } onClick={ event => this.turnToFind(event) }>
            确&nbsp;认
          </button>
        </div>
      </div>
    );
  }
}
