/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--验证邮箱地址模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
import session from '@/services/session';
// import App from '../../../app';
import http from '@/utils/request';
import Navigator from '@/utils/navigator';
import Reg from '@/utils/reg'; // 工具包
import Header from '@/component/header';

import '../css/verify-mail.scss';

export default class VerifyMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delShow: false,
      isSend: false,
      timeout: 60,
      canModify: false,
      em: this.props.params.em,
      update: this.props.params.update
    };
    this.timer = null;
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
      http
        .post('/member/get/email/code', {
          token: session.get('token'),
          sendType: 7
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
  valueChange(e) {
    e.currentTarget.value
      ? this.setState({ delShow: true, canModify: true })
      : this.setState({ delShow: false, canModify: false });
  }
  clear() {
    this.refs.code.value = '';
    this.setState({ delShow: false, canModify: false });
  }
  comfirm() {
    let updateMail = this.state.update;
    if (this.state.canModify) {
      let code = this.refs.code.value;
      if (code.length < 6) {
        Message.toast('请输入6位的验证码');
        return;
      }
      http
        .post('/member/validate/email', {
          code: code,
          token: session.get('token'),
          sendType: 7
        })
        .then(res => {
          updateMail
            ? Navigator.goAddr('#/register-mail')
            : Navigator.goAddr('#/user-info');
        })
        .catch(err => {
          Message.toast(err.message);
        });
    } else {
      Message.toast('请输入验证码');
    }
  }
  goTo() {
    location.href = '#/user-info';
  }
  render() {
    return (
      <div className="pt-header verify-mail">
        {/* <div className="header">
                    <a href="#/user-info" className="back"></a>
                    <div className="user-info big">验证邮箱地址</div>
                </div> */}
        {/* <Header title="验证邮箱地址" back={this.goTo.bind(this)} /> */}
        <Header title="验证邮箱地址" />
        <p className="verify-phone">
          已发送验证码到您的邮箱<span>
            {Reg.mailHide(this.props.params.em)}
          </span>
        </p>
        <section className="sf-section">
          <div className="yzm-section">
            <div className="sf-item">
              <span>验证码</span>
              <input
                ref="code"
                placeholder="6位数字验证码"
                maxLength="6"
                type="tel"
                onChange={ this.valueChange.bind(this) }
              />
              <i
                className={ this.state.delShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this) }
              />
            </div>
            <div className="yzm" onClick={ this.sendCode.bind(this) }>
              {this.state.isSend
                ? this.state.timeout + '秒后重送'
                : '获取验证码'}
            </div>
          </div>
        </section>
        <button className="btn-blue" onClick={ this.comfirm.bind(this) }>
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
