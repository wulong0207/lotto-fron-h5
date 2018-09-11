/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--登记手机号模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
// import App from '../../../app';
import session from '@/services/session';
import RegExp from '../components/reg-exp';
import http from '@/utils/request';
import Reg from '@/utils/reg';
import Header from '@/component/header';
import { getParameter } from '@/utils/utils';
import '../css/register.scss';

export default class RegisterPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneDelShow: false,
      codeDelShow: false,
      isSend: false,
      timeout: 60,
      canModify: false
    };
    this.timer = null;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  valueChange(type, e) {
    if (type == 'phone') {
      e.currentTarget.value = Reg.phoneChange(Reg.trim(e.currentTarget.value));

      e.currentTarget.value
        ? this.setState({
          phoneDelShow: true,
          canModify: true
        })
        : this.setState({ phoneDelShow: false, canModify: false });
    }
    if (type == 'code') {
      e.currentTarget.value
        ? this.setState({
          codeDelShow: true,
          canModify: true
        })
        : this.setState({ codeDelShow: false, canModify: false });
    }
  }

  blurAlert(e) {
    let phone = Reg.trim(this.refs.phone.value);
    if (!phone) {
      Message.toast('请输入手机号');
      return;
    }
    if (!RegExp.phoneReg.test(phone)) {
      Message.toast('输入的手机号码不正确');
    }
  }

  clear(type, e) {
    let phone = this.refs.phone;
    let code = this.refs.code;
    if (type == 'phone') {
      phone.value = '';
      this.setState({ phoneDelShow: false });
      code.value ? null : this.setState({ canModify: false });
    }
    if (type == 'code') {
      code.value = '';
      this.setState({ codeDelShow: false });
      phone.value ? null : this.setState({ canModify: false });
    }
  }

  sendCode() {
    let phone = Reg.trim(this.refs.phone.value);
    if (!phone) {
      Message.toast('请输入手机号');
      return;
    }
    if (!RegExp.phoneReg.test(phone)) {
      Message.toast('输入的手机号码不正确');
      return;
    }
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      http
        .post('/member/get/new/mobile/code', {
          mobile: phone,
          sendType: 5,
          token: session.get('token')
        })
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

  comfirm(e) {
    e.preventDefault();
    let canModify = this.state.canModify;
    let phone = Reg.trim(this.refs.phone.value);
    let code = this.refs.code.value;
    if (canModify) {
      if (!phone || !RegExp.phoneReg.test(phone)) {
        Message.toast('输入的手机号码不正确');
        return;
      }
      if (!code || code.length < 6) {
        Message.toast('输入的验证码不正确');
        return;
      }
      http
        .post('/member/modify/mobile', {
          mobile: phone,
          sendType: 5,
          code: code,
          token: session.get('token')
        })
        .then(res => {
          let back = getParameter('back');
          if (back) {
            window.location = back;
          } else {
            window.location.hash = '#/user-info';
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    }
  }
  goTo() {
    location.href = '#/user-info';
  }

  render() {
    return (
      <div className="pt-header register-phone">
        {/* <div className="header">
                    <a href="#/user-info" className="back"></a>
                    <div className="user-info big">登记手机号</div>
                </div> */}
        {/* <Header title="登记手机号" back={this.goTo.bind(this)} /> */}
        <Header title="登记手机号" />
        <section className="sf-section">
          <div className="sf-item">
            <span>手机号</span>
            <input
              ref="phone"
              placeholder="请输入11位的手机号码"
              maxLength="13"
              onBlur={ this.blurAlert.bind(this) }
              onChange={ this.valueChange.bind(this, 'phone') }
              type="tel"
            />
            <i
              className={ this.state.phoneDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'phone') }
            />
          </div>
          <div className="yzm-section">
            <div className="sf-item">
              <span>验证码</span>
              <input
                ref="code"
                placeholder="6位数字验证码"
                maxLength="6"
                onChange={ this.valueChange.bind(this, 'code') }
                type="tel"
              />
              <i
                className={ this.state.codeDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'code') }
              />
            </div>
            <div className="yzm" onClick={ this.sendCode.bind(this) }>
              {this.state.isSend ? this.state.timeout + '秒后重新发送' : '获取验证码'}
            </div>
          </div>
        </section>
        <button
          className={ this.state.canModify ? 'btn-blue' : 'btn-grey' }
          onClick={ this.comfirm.bind(this) }
        >
          确认
        </button>
        <p className="p-desc">温馨提示:</p>
        <p className="p-desc">1. 运营商发送短信可能会有延迟请耐心等待，避免多次重新发送以致输错验证码；</p>
        <p className="p-desc">2. 如长时间没收到验证短信，请检查您的手机是否设置了短信拦截；</p>
        <p className="p-desc">3. 若你确认手机无法接受到验证短信，请联系在线客服，协助你完成身份验证。</p>
      </div>
    );
  }
}
