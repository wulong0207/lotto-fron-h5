import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import Message from '@/services/message'; // 弹窗
import session from '@/services/session.js';
import Reg from '@/utils/reg';
import pbkdf2 from 'pbkdf2';
import Dialog from '@/component/dialog/dialog';

import '../scss/register.scss';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.onClear = false; // 阻止onblur事件
    this.state = {
      // 注册逻辑
      phoneDelShow: false, //
      codeDelShow: false,
      nameDelShow: false,
      passwordDelShow: false,
      pasTwoDelShow: false,
      timeout: 120,
      isSend: false,
      canModify: false,
      light: 'loginBtn',
      agreeStyle: true,
      phone: ''
    };
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  blurAlert(type, e) {
    if (this.onClear) return undefined;
    if (type == 'phone' && e.currentTarget.value) {
      var mobReg = /^1[3456789]\d{9}$/;
      // console.log(this.mobChange(e.currentTarget.value));
      // this.refs.phone.value = this.mobChange(
      //   e.currentTarget.value.replace(/\s/g, '')
      // );
      // mobReg.test(e.currentTarget.value.replace(/\s/g, ''))
      //   ? ''
      //   : Reg.trim(this.refs.phone.value);
      let _phone = this.mobChange(e.currentTarget.value.replace(/\s/g, ''));
      this.setState({ phone: _phone });
      if (!mobReg.test(this.refs.phone.value.replace(/\s/g, ''))) {
        this.refs.phone.value = Reg.trim(this.refs.phone.value);
      }
    }
    if (type == 'code' && e.currentTarget.value) {
      e.currentTarget.value.length == 6
        ? ''
        : Message.toast('请输入6位数字验证码！');
    }
    if (type == 'name' && e.currentTarget.value) {
      const secReg = /^[0-9]*$/g;
      // const accReg = /^[a-zA-Z\u2E80-\u9FFF\d\_]{4,20}$/g;
      const accReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      const len = this.getFullLength(e.currentTarget.value);
      console.log(len);

      if (len >= 4 && len <= 20) {
        if (secReg.test(e.currentTarget.value)) {
          // 纯数字
          Message.toast('账户名设置不能为纯数字，请重新设置');
        } else {
          if (accReg.test(e.currentTarget.value)) {
          } else {
            Message.toast('账户名设置不符合要求，请重新设置');
          }
        }
      } else {
        Message.toast('账户名设置不符合要求，请重新设置');
      }
    }
    if (type == 'password' && e.currentTarget.value) {
      var secReg = /^[0-9]*$/g;
      var thiReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      var forReg = /^\S+$/gi;
      var fivReg = /^([a-zA-Z]+)$/;
      if (
        e.currentTarget.value.length >= 6 &&
        e.currentTarget.value.length <= 20
      ) {
        // 6-20
        if (secReg.test(e.currentTarget.value)) {
          // 纯数字
          Message.toast('密码设置不能为纯数字，请重新设置');
        } else {
          if (fivReg.test(e.currentTarget.value)) {
            // 纯字母
            Message.toast('密码设置不能为纯字母，请重新设置');
          } else {
            if (forReg.test(e.currentTarget.value) == true) {
              if (thiReg.test(e.currentTarget.value)) {
                // 有中文
                Message.toast('密码设置不能有中文，请重新设置');
              } else {
              }
            } else {
              // 有空格
              Message.toast('密码设置不能有空格，请重新设置');
            }
          }
        }
      } else {
        Message.toast('密码设置不符合要求，请重新设置');
      }
    }
    if (type == 'pasTwo' && e.currentTarget.value) {
      e.currentTarget.value == this.refs.password.value
        ? ''
        : Message.toast('两次输入的密码不同，请确认后输入');
    }
  }
  // 手机号码344分割
  mobChange(mob) {
    let mobReg = /^1[3456789]\d{9}$/;
    if (mobReg.test(mob)) {
      mob =
        mob.toString().substring(0, 3) +
        ' ' +
        mob.toString().substring(3, 7) +
        ' ' +
        mob.toString().substring(7, 11);
      return mob;
    } else {
      mob = Reg.trim(mob);
      Message.toast('请输入正确的手机号码！');
      return mob;
    }
  }
  valueChange(type, e) {
    if (type == 'phone') {
      let mobReg = /^1[3456789]\d{9}$/;
      // e.currentTarget.value = Reg.phoneChange(Reg.trim(e.currentTarget.value));
      // console.log(e.currentTarget.value);
      let val = e.currentTarget.value.replace(/\s/g, '');
      if (mobReg.test(val)) {
        // console.log(e.currentTarget.value.replace(/\s/g, ''));
        this.setState({ phone: e.currentTarget.value });
      } else {
        this.setState({ phone: val });
      }

      e.currentTarget.value
        ? this.setState({
          phoneDelShow: true,
          canModify: true,
          light: 'loginBtn-act'
        })
        : this.setState({
          phoneDelShow: false,
          canModify: false,
          light: 'loginBtn'
        });
    }
    if (type == 'code') {
      e.currentTarget.value
        ? this.setState({
          codeDelShow: true,
          canModify: true
        })
        : this.setState({ codeDelShow: false, canModify: false });
    }
    if (type == 'name') {
      e.currentTarget.value
        ? this.setState({
          nameDelShow: true,
          canModify: true
        })
        : this.setState({ nameDelShow: false, canModify: false });
    }
    if (type == 'password') {
      e.currentTarget.value
        ? this.setState({
          passwordDelShow: true,
          canModify: true
        })
        : this.setState({ passwordDelShow: false, canModify: false });
    }
    if (type == 'pasTwo') {
      e.currentTarget.value
        ? this.setState({
          pasTwoDelShow: true,
          canModify: true
        })
        : this.setState({ pasTwoDelShow: false, canModify: false });
    }
  }
  clear(type, e) {
    let phone = this.refs.phone;
    let code = this.refs.code;
    let name = this.refs.name;
    let light = this.state.light;
    let password = this.refs.password;
    let passwordTwo = this.refs.passwordTwo;
    if (type == 'phone') {
      phone.value = '';
      light = 'loginBtn';
      this.setState({ phoneDelShow: false, light: 'loginBtn', phone: '' });
    }
    if (type == 'code') {
      code.value = '';
      this.setState({ codeDelShow: false });
    }
    if (type == 'name') {
      name.value = '';
      this.setState({ nameDelShow: false });
    }
    if (type == 'password') {
      password.value = '';
      this.setState({ passwordDelShow: false });
    }
    if (type == 'pasTwo') {
      console.log(passwordTwo.value);
      passwordTwo.value = '';
      this.setState({ pasTwoDelShow: false });
    }
  }
  sendCode() {
    let phone = Reg.trim(this.refs.phone.value);
    let mobReg = /^1[3456789]\d{9}$/;
    if (!phone) {
      Message.toast('请输入手机号');
      return;
    }
    if (!mobReg.test(phone)) {
      return;
    }
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      let params = {
        sendType: 2,
        userName: phone
      };
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
                timeout: 120
              });
              clearInterval(_this.timer);
            }
          }, 1000);
        })
        .catch(err => {
          console.log(err.code);
          if (err.code == '40120' || err.code == '40171') {
            Message.toast(err.message);
          } else {
            Message.toast('请输入正确的手机号码！');
          }
        });
    }
  }
  register(event) {
    let mob = Reg.trim(this.refs.phone.value);
    let code = this.refs.code.value;
    let acc = this.refs.name.value;
    let psw = this.refs.password.value
      ? pbkdf2
        .pbkdf2Sync(
          this.refs.password.value,
          '2f1e131cc3009026cf8991da3fd4ac38',
          50,
          64
        )
        .toString('hex')
      : '';
    let repsw = this.refs.passwordTwo.value
      ? pbkdf2
        .pbkdf2Sync(
          this.refs.passwordTwo.value,
          '2f1e131cc3009026cf8991da3fd4ac38',
          50,
          64
        )
        .toString('hex')
      : '';
    // console.log(mob, code, acc, psw, repsw);
    // 注册条件判定
    // const accReg = /^[a-zA-Z\u2E80-\u9FFF\d\_]{4,20}$/g;//'账户名支持中文、字母、数字、“_”的组合，4-20个字符
    const accReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    const secReg = /^[0-9]*$/g; // 纯数字
    const thiReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/; // 有中文
    const forReg = /^\S+$/g; // 有空格
    const fivReg = /^([a-zA-Z]+)$/; // 纯字母
    const len = this.getFullLength(acc);
    let params = {
      account: acc,
      code: code,
      password1: psw,
      password2: repsw,
      sendType: 2,
      userName: mob
    };
    // 账号
    if (params.account != '') {
      if (len < 4 || len > 20) {
        Message.toast('账户名支持中文、字母、数字、“_”的组合，4-20个字符');
        return;
      }
      if (!accReg.test(params.account)) {
        Message.toast('账户名设置不符合要求，请重新设置');
        return;
      }
      if (secReg.test(params.account)) {
        Message.toast('账户名设置不能为纯数字，请重新设置');
        return;
      }
    }
    // 密码
    if (params.password1 != '' || params.password2 != '') {
      if (params.password1 != params.password2) {
        Message.toast('两次输入密码不一致，请重新输入');
        return;
      } else {
        // 6 -20
        if (
          this.refs.password.value.length < 6 ||
          this.refs.password.value.length > 20
        ) {
          Message.toast('密码设置不符合要求，请重新设置');
          return;
        }
        // 纯数字
        if (secReg.test(this.refs.password.value)) {
          Message.toast('密码设置不能为纯数字，请重新设置');
          return;
        }
        // 纯字母
        if (fivReg.test(this.refs.password.value)) {
          Message.toast('密码设置不能为纯字母，请重新设置');
          return;
        }
        // 有空格
        if (forReg.test(this.refs.password.value) != true) {
          Message.toast('密码设置不能有空格，请重新设置');
          return;
        }
        // 中文
        if (thiReg.test(this.refs.password.value)) {
          Message.toast('密码设置不能有中文，请重新设置');
          return;
        }
      }
    }
    this.registerPost(event, params);
  }
  registerPost(event, params) {
    event.persist();
    http
      .post('/activity/register', params)
      .then(res => {
        if (res.success == 1) {
          session.set('token', res.data.tk);
          session.set('userInfo', res.data);
          if (this.props.onClick) this.props.onClick(event);
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  login(event) {
    if (this.props.onClick) this.props.onClick(event);
    if (this.onClear) return undefined;
  }
  // X关闭弹窗
  cancle() {
    this.dialog.close();
    if (this.onClear) return undefined;
  }
  show(enable) {
    if (enable) {
      this.dialog.open();
    } else {
      this.dialog.close();
    }
  }

  // 条款
  agreeToggle(event) {
    if (this.props.onClick) this.props.onClick(event);
    // this.setState({ agreeStyle: !this.state.agreeStyle })
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
    var light = this.state.light;
    let show = this.state.show;
    let phone = this.state.phone;
    return (
      <Dialog ref={ dialog => (this.dialog = dialog) } showHeader={ false }>
        <section className="sf-section">
          <div className="head">
            <span>免费注册</span>
            <span
              className="del"
              onMouseEnter={ () => (this.onClear = true) }
              onMouseLeave={ () => (this.onClear = false) }
              onClick={ this.cancle.bind(this) }
            >
              <img src={ require('../img/close-btn.png') } />
            </span>
          </div>
          <div className="input-box">
            {/* 手机号 */}
            <div className="sf-item">
              <input
                ref="phone"
                value={ phone }
                placeholder="请输入11位的手机号码"
                onChange={ event => this.valueChange('phone', event) }
                onBlur={ event => this.blurAlert('phone', event) }
                type="tel"
                maxLength="11"
              />
              <i
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                className={ this.state.phoneDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'phone') }
              />
            </div>
            {/* 验证码 */}
            <div className="yzm-section">
              <div className="sf-item">
                <input
                  ref="code"
                  placeholder="6位数字验证码"
                  maxLength="6"
                  onChange={ this.valueChange.bind(this, 'code') }
                  onBlur={ this.blurAlert.bind(this, 'code') }
                  type="tel"
                />
                <i
                  onMouseEnter={ () => (this.onClear = true) }
                  onMouseLeave={ () => (this.onClear = false) }
                  className={ this.state.codeDelShow ? 'icon-delete' : '' }
                  onClick={ this.clear.bind(this, 'code') }
                />
              </div>
              <div className="yzm" onClick={ this.sendCode.bind(this) }>
                {this.state.isSend
                  ? '再次获取(' + this.state.timeout + ')'
                  : '获取验证码'}
              </div>
            </div>
            <div className="title">
              <span>选填项</span>
            </div>
            {/* 账户名 */}
            <div className="sf-item">
              <input
                ref="name"
                placeholder="请输入4-20个字符的用户名"
                minLength="4"
                maxLength="20"
                onBlur={ this.blurAlert.bind(this, 'name') }
                onChange={ this.valueChange.bind(this, 'name') }
                type="text"
              />
              <i
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                className={ this.state.nameDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'name') }
              />
            </div>
            {/* 密码 */}
            <div className="sf-item">
              <input
                ref="password"
                placeholder="请输入密码"
                onBlur={ this.blurAlert.bind(this, 'password') }
                onChange={ this.valueChange.bind(this, 'password') }
                maxLength="20"
                minLength="6"
                type="password"
              />
              <i
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                className={ this.state.passwordDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'password') }
              />
            </div>
            {/* 密码 */}
            <div className="sf-item">
              <input
                ref="passwordTwo"
                placeholder="再次输入密码"
                onBlur={ this.blurAlert.bind(this, 'pasTwo') }
                onChange={ this.valueChange.bind(this, 'pasTwo') }
                maxLength="20"
                minLength="6"
                type="password"
              />
              <i
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                className={ this.state.pasTwoDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'pasTwo') }
              />
            </div>
            <div className="register">
              <div className="agree-pages">
                <p>
                  我已年满18岁并同意<span
                    className="book"
                    onClick={ this.agreeToggle.bind(this) }
                  >
                    《2N彩票用户购彩须知》
                  </span>
                </p>
              </div>
              <div className="main-btn reg">
                <button
                  className={ light }
                  onClick={ event => this.register(event) }
                >
                  确认注册
                </button>
              </div>
              <span
                className="login-btn"
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                onClick={ this.login.bind(this) }
              >
                已有账号，请登录
              </span>
            </div>
          </div>
        </section>
        {/* <div className={cx('p-agree', {'hide': this.state.agreeStyle})}>
                    <header className="head">
                        <span className="back" onClick={this.agreeToggle.bind(this)}></span>
                        <p className="title">2N彩票用户购彩须知</p>
                    </header>
                    <div className="agree-content">
                        <Agree/>
                    </div>
                </div> */}
      </Dialog>
    );
  }
}

Register.propTypes = {
  onClick: PropTypes.func
};
