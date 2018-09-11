/*
 * @Author: zouyuting
 * @Date: 2017-12-05 15:34:18
 * @Desc: 创建账户
 */
import React, { Component } from 'react';

import Header from '@/component/header'; // 头部
import cx from 'classnames';
import Reg from '@/utils/reg.js';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import pbkdf2 from 'pbkdf2';
import analytics from '@/services/analytics';

import '../scss/creatacc.scss';
const accReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
const secReg = /^[0-9]*$/g; // 纯数字
const thiReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/; // 有中文
const forReg = /\s+/gi; // 有空格
const fivReg = /^([a-zA-Z]+)$/; // 纯字母

export class CreateAcc extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      clearacc: false,
      clearpwd: false,
      eye: false,
      eyeType: 'password',
      acc: '',
      pwd: '',
      next: 'next-btn',
      fir: 'wrong',
      sec: 'wrong',
      thi: 'wrong',
      level: '',
      strength: ''
    };
  }
  componentDidMount() {
    analytics.send(2062);
  }
  inputChange(e) {
    if (e.target.placeholder == '仅支持中文、字母、数字、“_”4-20个字符') {
      this.setState({ acc: e.target.value });
      if (e.target.value) {
        this.setState({ clearacc: true, next: 'next-btn-blue' });
      } else {
        this.setState({ clearacc: false, next: 'next-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '请输入密码') {
      this.setState({ pwd: e.target.value });
      if (e.target.value) {
        this.setState({ clearpwd: true, eye: true });
        this.levelChange(e.target.value);
      } else {
        this.setState({ clearpwd: false, eye: false });
      }
    } else {
    }
  }
  creatBtn(acc, pwd) {
    this.accVer(acc);
    this.pwdVer(pwd);
    if (acc && pwd) {
      // debugger;
      let params = {
        account: acc,
        password: pbkdf2
          .pbkdf2Sync(pwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
          .toString('hex'),
        token: session.get('userInfo').tk
      };
      analytics
        .send([20621, 20622, 20623])
        .then(() => http.post('/passport/set/account', params))
        .then(res => {
          if (res.success == 1) {
            this.props.router.replace('/regsec');
            // window.location.hash = '/identity';
            session.set('createAcc', params.account);
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    } else {
      Message.toast('请输入完整的用户信息');
    }
  }
  clearacc() {
    this.setState({ acc: '', clearacc: false, next: 'next-btn' });
  }
  clearpwd() {
    this.setState({
      pwd: '',
      clearpwd: false,
      eye: false,
      level: '',
      fir: 'wrong',
      sec: 'wrong',
      thi: 'wrong',
      strength: ''
    });
  }
  eye() {
    if (this.state.eyeType == 'password') {
      this.setState({ eyeType: 'text' });
    } else {
      this.setState({ eyeType: 'password' });
    }
  }
  // 密码安全等级变化
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
  // 账户名提示
  accVer(acc) {
    if (this.onClear) return undefined;
    const len = this.getFullLength(acc);
    if (acc != '') {
      if (len < 4 || len > 20) {
        Message.toast('账户名支持中文、字母、数字、“_”的组合，4-20个字符');
        return;
      }
      if (!accReg.test(acc)) {
        Message.toast('账户名设置不符合要求，请重新设置');
        return;
      }
      if (secReg.test(acc)) {
        Message.toast('账户名设置不能为纯数字，请重新设置');
      }
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
  leap() {
    let params = {
      token: session.get('userInfo').tk
    };
    analytics
      .send(20624)
      .then(() => http.post('/passport/continue', params))
      .then(res => {
        if (res.success == 1) {
          session.set('token', params.token);
          session.set('createAcc', res.data.acc);
          this.props.router.replace('/identity');
          // window.location.hash = '/identity';
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 区分中英文字符长度，中文按两个字符算
  getFullLength(txt) {
    var len = 0;
    for (var i = 0; i < txt.length; i++) {
      // 10:换行
      // 32：空格
      if (
        txt.charCodeAt(i) > 127 ||
        txt.charCodeAt(i) == 94 ||
        txt.charCodeAt(i) == 10 ||
        txt.charCodeAt(i) == 32
      ) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  }
  render() {
    let acc = this.state.acc;
    let pwd = this.state.pwd;
    let clearacc = this.state.clearacc;
    let clearpwd = this.state.clearpwd;
    let eye = this.state.eye;
    let eyeType = this.state.eyeType;
    let next = this.state.next;
    let fir = this.state.fir;
    let sec = this.state.sec;
    let thi = this.state.thi;
    let level = this.state.level;
    let strength = this.state.strength;
    return (
      <div className="createacc">
        <Header title="创建账号和密码">
          <span className="header-help" onClick={ event => this.leap(event) }>
            跳过
          </span>
        </Header>
        <div className="create-box">
          <p className="title-line">手机号码注册成功</p>
          <p className="phone">手机号码： {session.get('reg_phone')}</p>
          <div className="user-input">
            <span className="text-left">账号名</span>
            <div className="input-part-phone input-box">
              <input
                className={ cx(clearacc ? '' : 'accinput') }
                type="text"
                value={ acc }
                maxLength="20"
                placeholder="仅支持中文、字母、数字、“_”4-20个字符"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.accVer(acc) }
              />
              <span
                className={ cx(clearacc ? 'clear-part' : 'hide') }
                onClick={ event => this.clearacc(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <div className="pwd-input">
            <span className="text-left">密码</span>
            <div
              className={ cx(
                clearpwd ? '' : 'pwdinput',
                'input-part-ver input-box'
              ) }
            >
              <input
                type={ eyeType }
                maxLength="20"
                placeholder="请输入密码"
                value={ pwd }
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.pwdVer(pwd) }
              />
              <span
                className={ cx(clearpwd ? 'clear-part' : 'hide') }
                onClick={ event => this.clearpwd(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
            <span
              className={ cx(eye ? 'eye-part' : 'hide') }
              onClick={ event => this.eye(event) }
              onMouseEnter={ () => (this.onClear = true) }
              onMouseLeave={ () => (this.onClear = false) }
            >
              {eyeType == 'password' ? (
                <img
                  className="password-eye"
                  ref="eye"
                  src={ require('@/img/account/un_secret@2x.png') }
                />
              ) : (
                <img
                  className="password-eye"
                  ref="eye"
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
            </ul>
          </div>
          <button
            ref="next"
            className={ next }
            onClick={ event => this.creatBtn(acc, pwd) }
          >
            下&nbsp;一&nbsp;步
          </button>
          <ul className="warm-msg">
            <li>帐号名填写须知：</li>
            <li>1．与一彩网彩票业务或品牌冲突等的帐号名，本网站将有可能收回</li>
            <li>2. 帐号名只能修改一次</li>
          </ul>
        </div>
      </div>
    );
  }
}
