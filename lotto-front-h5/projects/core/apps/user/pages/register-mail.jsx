/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--登记邮箱地址模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
// import App from '../../../app';
import session from '@/services/session';
import RegExp from '../components/reg-exp';
import http from '@/utils/request';
import Header from '@/component/header';
import '../css/register.scss';
import { getParameter } from '@/utils/utils';

export default class RegisterMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailDelShow: false,
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
    if (type == 'mail') {
      e.currentTarget.value
        ? this.setState({ mailDelShow: true, canModify: true })
        : this.setState({ mailDelShow: false, canModify: false });
    }
    if (type == 'code') {
      e.currentTarget.value
        ? this.setState({ codeDelShow: true, canModify: true })
        : this.setState({ codeDelShow: false, canModify: false });
    }
  }
  clear(type, e) {
    let mail = this.refs.mail;
    let code = this.refs.code;
    if (type == 'mail') {
      mail.value = '';
      this.setState({ mailDelShow: false });
      code.value ? null : this.setState({ canModify: false });
    }
    if (type == 'code') {
      code.value = '';
      this.setState({ codeDelShow: false });
      mail.value ? null : this.setState({ canModify: false });
    }
  }
  blurAlert() {
    let mail = this.refs.mail.value;
    if (!mail) {
      Message.toast('请输入邮箱地址');
      return;
    }
    if (!RegExp.mailReg.test(mail)) {
      Message.toast('输入的邮箱地址不正确');
    }
  }
  sendCode() {
    let mail = this.refs.mail.value;
    if (!mail) {
      Message.toast('请输入邮箱地址');
      return;
    }
    if (!RegExp.mailReg.test(mail)) {
      Message.toast('输入的邮箱地址不正确');
      return;
    }
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      http
        .post('/member/get/new/email/code', {
          token: session.get('token'),
          email: mail,
          sendType: 5 // 登记/修改
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
  comfirm() {
    let canModify = this.state.canModify;
    let mail = this.refs.mail.value;
    let code = this.refs.code.value;
    if (canModify) {
      if (!mail || !RegExp.mailReg.test(mail)) {
        Message.toast('输入的邮箱地址不正确');
        return;
      }
      if (!code || code.length < 6) {
        Message.toast('输入的验证码不正确');
        return;
      }
      http
        .post('/member/modify/email', {
          token: session.get('token'),
          email: mail,
          code: code,
          sendType: 5 // 登记修改
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
      <div className="pt-header register-mail">
        <Header title="登记邮箱地址" />
        <section className="sf-section">
          <div className="sf-item">
            <span>邮箱地址</span>
            <input
              ref="mail"
              placeholder="请输入邮箱地址"
              onBlur={ this.blurAlert.bind(this) }
              onChange={ this.valueChange.bind(this, 'mail') }
              type="mail"
            />
            <i
              className={ this.state.mailDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'mail') }
            />
          </div>
          <div className="yzm-section">
            <div className="sf-item">
              <span>邮箱验证</span>
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
              {this.state.isSend
                ? this.state.timeout + '秒后重新发送'
                : '获取验证码'}
            </div>
          </div>
        </section>
        <button
          className={ this.state.canModify ? 'btn-blue' : 'btn-grey' }
          onClick={ this.comfirm.bind(this) }
        >
          确认
        </button>
        <p className="p-desc">没有收到邮件？</p>
        <p className="p-desc">
          1. 请查看邮件是否被邮箱自动拦截，或被误认为垃圾邮件放到垃圾箱中
        </p>
        <p className="p-desc">2. 如果超过10分钟仍未收到激活信，请你重新发送</p>
        <p className="p-desc">
          3.
          若你确认手机无法接受到验证短信，请联系在线客服，协助你完成身份验证。
        </p>
      </div>
    );
  }
}
