import React, { Component } from 'react';
import Header from '@/component/header'; // 头部
import cx from 'classnames';
import Reg from '@/utils/reg';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import pbkdf2 from 'pbkdf2';

import '../css/change-pwd.scss';
const secReg = /^[0-9]*$/g; // 纯数字
const thiReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/; // 有中文
const forReg = /\s+/gi; // 有空格
const fivReg = /^([a-zA-Z]+)$/; // 纯字母

export default class ChangePwd extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      type: 'password',
      clearold: false,
      clearnew: false,
      clearnew2: false,
      next: 'next-btn',
      oldpwd: '',
      newpwd: '',
      new2pwd: '',
      fir: 'wrong',
      sec: 'wrong',
      thi: 'wrong',
      four: 'wrong',
      level: '',
      strength: ''
    };
  }
  inputChange(e) {
    if (e.target.placeholder == '请输入旧密码') {
      this.setState({ oldpwd: e.target.value });
      if (e.target.value) {
        this.setState({ clearold: true, next: 'next-btn-blue' });
      } else {
        this.setState({ clearold: false, next: 'next-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '6-20位英文字母.数字或者符号') {
      this.setState({ newpwd: e.target.value });
      if (e.target.value) {
        this.setState({ clearnew: true });
        this.levelChange(e.target.value);
        // this.four(this.state.acc, e.target.value);
      } else {
        this.setState({ clearnew: false });
      }
    } else {
    }
    if (e.target.placeholder == '请再次输入新密码') {
      this.setState({ new2pwd: e.target.value });
      if (e.target.value) {
        this.setState({ clearnew2: true });
        // this.levelChange(e.target.value);
        this.four(this.state.newpwd, e.target.value);
      } else {
        this.setState({ clearnew2: false });
      }
    } else {
    }
  }
  Next(oldpwd, newpwd, new2pwd) {
    let params = {
      password: pbkdf2
        .pbkdf2Sync(oldpwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
        .toString('hex'),
      password1: pbkdf2
        .pbkdf2Sync(newpwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
        .toString('hex'),
      password2: pbkdf2
        .pbkdf2Sync(new2pwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
        .toString('hex'),
      token: session.get('userInfo').tk
    };
    http
      .post('/member/modify/password', params)
      .then(res => {
        // console.log(res.data);
        Message.toast('密码修改成功');
        window.location.href = '/account.html#/resetsec';
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  levelChange(pwd) {
    const strength = Reg.pswStrength(pwd);
    const len = pwd.length;
    if (len >= 6 && len <= 20) {
      this.setState({ fir: 'right' });
    } else {
      this.setState({ fir: 'wrong' });
    }
    if (strength == 0) {
      this.setState({ level: '', sec: 'wrong', thi: 'wrong', strength: '' });
    } else if (strength == 1) {
      this.setState({
        level: 'level1',
        sec: 'right',
        thi: 'right',
        strength: '低'
      });
    } else if (strength == 2) {
      this.setState({
        level: 'level2',
        sec: 'right',
        thi: 'right',
        strength: '中'
      });
    } else if (strength == 3) {
      this.setState({
        level: 'level3',
        sec: 'right',
        thi: 'right',
        strength: '高'
      });
    }
  }
  four(acc, pwd) {
    console.log(acc, pwd);
    if (acc == pwd) {
      this.setState({ four: 'right' });
    } else {
      this.setState({ four: 'wrong' });
    }
  }
  // 密码提示
  pwdVer(pwd) {
    if (this.onClear) return undefined;
    let len = pwd.length;
    if (pwd != '') {
      // 6 -20
      if (len < 6 || len > 20) {
        Message.toast('密码设置不符合要求，请重新设置');
        return;
      }
      // 纯数字
      if (secReg.test(pwd)) {
        Message.toast('密码设置不能为纯数字，请重新设置');
        return;
      }
      // 纯字母
      if (fivReg.test(pwd)) {
        Message.toast('密码设置不能为纯字母，请重新设置');
        return;
      }
      // 有空格
      // debugger;
      if (forReg.test(pwd) === true) {
        // console.log(pwd);
        // console.log(forReg.test(pwd));
        Message.toast('密码设置不能有空格，请重新设置');
        return;
      }
      // 中文
      if (thiReg.test(pwd)) {
        Message.toast('密码设置不能有中文，请重新设置');
      }
    }
  }
  pwdVer2(acc, pwd) {
    if (this.onClear) return undefined;
    if (pwd && acc != pwd) {
      Message.toast('两次输入不同，请重新输入');
    }
  }
  clearold() {
    this.setState({ oldpwd: '', clearold: false, next: 'next-btn' });
  }
  clearnew() {
    this.setState({
      newpwd: '',
      clearnew: false,
      fir: 'wrong',
      sec: 'wrong',
      thi: 'wrong',
      four: 'wrong',
      level: '',
      strength: ''
    });
  }
  clearnew2() {
    this.setState({ new2pwd: '', clearnew2: false, four: 'wrong' });
  }

  eye(e) {
    if (this.state.type == 'password') {
      this.setState({ type: 'text' });
    } else {
      this.setState({ type: 'password' });
    }
  }
  render() {
    let type = this.state.type;
    let clearold = this.state.clearold;
    let clearnew = this.state.clearnew;
    let clearnew2 = this.state.clearnew2;
    let oldpwd = this.state.oldpwd;
    let newpwd = this.state.newpwd;
    let new2pwd = this.state.new2pwd;
    let fir = this.state.fir;
    let sec = this.state.sec;
    let thi = this.state.thi;
    let four = this.state.four;
    let level = this.state.level;
    let strength = this.state.strength;
    let next = this.state.next;
    return (
      <div className="resetp">
        <Header title="修改密码" />
        <div className="resetp-cont">
          <div className="top">
            <p className="title">
              你正在为账户<span>
                {Reg.nameHide(session.get('userInfo').acc)}
              </span>重置密码：
            </p>
            <span className="eye-part" onClick={ event => this.eye(event) }>
              {type == 'password' ? (
                <img
                  className="password-eye"
                  src={ require('../img/account/un_secret@2x.png') }
                />
              ) : (
                <img
                  className="password-eye"
                  src={ require('../img/account/secret@2x.png') }
                />
              )}
            </span>
          </div>
          <div className="pwd-input">
            <span className="text-left">旧密码</span>
            <div className="input-box">
              <input
                type={ type }
                maxLength="20"
                value={ oldpwd }
                placeholder="请输入旧密码"
                onChange={ event => this.inputChange(event) }
              />
              <span
                className={ cx(clearold ? 'clear-part' : 'hide') }
                onClick={ event => this.clearold(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('../img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <div className="pwd-input">
            <span className="text-left">输入新密码</span>
            <div className="input-box">
              <input
                type={ type }
                maxLength="20"
                value={ newpwd }
                placeholder="6-20位英文字母.数字或者符号"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.pwdVer(newpwd) }
              />
              <span
                className={ cx(clearnew ? 'clear-part' : 'hide') }
                onClick={ event => this.clearnew(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('../img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <div className="pwd-input">
            <span className="text-left">确认新密码</span>
            <div className="input-box">
              <input
                type={ type }
                maxLength="20"
                value={ new2pwd }
                placeholder="请再次输入新密码"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.pwdVer2(newpwd, new2pwd) }
              />
              <span
                className={ cx(clearnew2 ? 'clear-part' : 'hide') }
                onClick={ event => this.clearnew2(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('../img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <div className="password-level">
            <ul className="pass-level-cont">
              <li className="level-pic">
                <span className="level-text">密码安全等级:</span>
                <div className={ cx(level, 'level-box') }>
                  <span className="blank" />
                  <span className="blank" />
                  <span className="blank" />
                  <span className="level-name">{strength}</span>
                </div>
              </li>
              <li className={ 'level-list-' + fir }>6-20字符</li>
              <li className={ 'level-list-' + sec }>
                包含大小写字母.数字以及标点符号（空格除外）
              </li>
              <li className={ 'level-list-' + thi }>
                大写字母.小写字母.数字以及标点符号至少包含2种以上
              </li>
              <li className={ 'level-list-' + four }>两次输入一致</li>
            </ul>
          </div>
          <button
            className={ next }
            onClick={ event => this.Next(oldpwd, newpwd, new2pwd) }
          >
            下&nbsp;一&nbsp;步
          </button>
        </div>
      </div>
    );
  }
}
