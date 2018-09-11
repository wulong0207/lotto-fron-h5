/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:06:46
 * Desc: 重置密码
 */

import React, { Component } from 'react';

import Header from '@/component/header'; // 头部
import cx from 'classnames';
import Reg from '@/utils/reg.js';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import pbkdf2 from 'pbkdf2';

import '../scss/creatacc.scss';
const secReg = /^[0-9]*$/g; // 纯数字
const thiReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/; // 有中文
const forReg = /\s+/gi; // 有空格
const fivReg = /^([a-zA-Z]+)$/; // 纯字母

export class ResetPwd extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      clearacc: false,
      clearpwd: false,
      acceye: false,
      pwdeye: false,
      acctype: 'password',
      pwdtype: 'password',
      acc: '',
      pwd: '',
      next: 'next-btn',
      fir: 'wrong',
      sec: 'wrong',
      thi: 'wrong',
      four: 'wrong',
      level: '',
      strength: ''
    };
  }
  inputChange(e) {
    if (e.target.placeholder == '6-20位英文字母.数字或者符号') {
      this.setState({ acc: e.target.value });
      if (e.target.value) {
        this.setState({ clearacc: true, acceye: true, next: 'next-btn-blue' });
        this.levelChange(e.target.value);
      } else {
        this.setState({ clearacc: false, acceye: false, next: 'next-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '请再次输入新密码') {
      this.setState({ pwd: e.target.value });
      if (e.target.value) {
        this.setState({ clearpwd: true, pwdeye: true, eye: true });
        // this.levelChange(e.target.value);
        this.four(this.state.acc, e.target.value);
      } else {
        this.setState({ clearpwd: false, pwdeye: false, eye: false });
      }
    } else {
    }
  }
  clearacc(e) {
    this.setState({
      acc: '',
      clearacc: false,
      acceye: false,
      next: 'next-btn',
      level: '',
      fir: 'wrong',
      sec: 'wrong',
      thi: 'wrong',
      strength: ''
    });
  }
  acceye(e) {
    if (this.state.acctype == 'password') {
      this.setState({ acctype: 'text' });
    } else {
      this.setState({ acctype: 'password' });
    }
  }
  clearpwd(e) {
    this.setState({ pwd: '', clearpwd: false, pwdeye: false, four: 'wrong' });
  }
  pwdeye(e) {
    if (this.state.pwdtype == 'password') {
      this.setState({ pwdtype: 'text' });
    } else {
      this.setState({ pwdtype: 'password' });
    }
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
    if (acc != pwd) {
      Message.toast('两次输入不同，请重新输入');
    }
  }
  Next(acc, pwd) {
    this.pwdVer(acc);
    this.pwdVer2(acc, pwd);
    if (acc && pwd) {
      let params = {
        password: pbkdf2
          .pbkdf2Sync(acc, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
          .toString('hex'),
        password1: pbkdf2
          .pbkdf2Sync(pwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
          .toString('hex'),
        userName: session.get('userInfo_find').acc
      };
      http
        .post('/retrieve/reset/password', params)
        .then(res => {
          if (res.success == 1) {
            window.location.hash = '/resetsec';
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    }
  }
  render() {
    let acc = this.state.acc;
    let pwd = this.state.pwd;
    let clearacc = this.state.clearacc;
    let clearpwd = this.state.clearpwd;
    let acctype = this.state.acctype;
    let pwdtype = this.state.pwdtype;
    let pwdeye = this.state.pwdeye;
    let acceye = this.state.acceye;
    let next = this.state.next;
    let fir = this.state.fir;
    let sec = this.state.sec;
    let thi = this.state.thi;
    let four = this.state.four;
    let level = this.state.level;
    let strength = this.state.strength;
    return (
      <div className="resetp">
        <Header title="重置密码" />
        <div className="resetp-cont">
          <p className="title">
            你正在为账户<span>
              {Reg.nameHide(session.get('userInfo_find').acc)}
            </span>找回密码：
          </p>
          <div className="pwd-input">
            <span className="text-left">输入新密码</span>
            <div className={ cx(clearacc ? '' : 'input', 'input-box') }>
              <input
                maxLength="20"
                value={ acc }
                placeholder="6-20位英文字母.数字或者符号"
                onChange={ event => this.inputChange(event) }
                type={ acctype }
                onBlur={ event => this.pwdVer(acc) }
              />
              <span
                className={ cx(clearacc ? 'clear-part' : 'hide') }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                onClick={ event => this.clearacc(event) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
            <span
              className={ cx(acceye ? 'eye-part' : 'hide') }
              onClick={ event => this.acceye(event) }
            >
              {acctype == 'password' ? (
                <img
                  className="password-eye"
                  src={ require('@/img/account/un_secret@2x.png') }
                />
              ) : (
                <img
                  className="password-eye"
                  src={ require('@/img/account/secret@2x.png') }
                />
              )}
            </span>
          </div>
          <div className="pwd-input">
            <span className="text-left">确认新密码</span>
            <div className={ cx(clearpwd ? '' : 'input', 'input-box') }>
              <input
                maxLength="20"
                value={ pwd }
                type={ pwdtype }
                placeholder="请再次输入新密码"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.pwdVer2(acc, pwd) }
              />
              <span
                className={ cx(clearpwd ? 'clear-part' : 'hide') }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                onClick={ event => this.clearpwd(event) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
            <span
              className={ cx(pwdeye ? 'eye-part' : 'hide') }
              onClick={ event => this.pwdeye(acc, pwd) }
            >
              {pwdtype == 'password' ? (
                <img
                  className="password-eye"
                  src={ require('@/img/account/un_secret@2x.png') }
                />
              ) : (
                <img
                  className="password-eye"
                  src={ require('@/img/account/secret@2x.png') }
                />
              )}
            </span>
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
          <button className={ next } onClick={ event => this.Next(acc, pwd) }>
            下&nbsp;一&nbsp;步
          </button>
        </div>
      </div>
    );
  }
}
