/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--验证手机号模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
import session from '@/services/session';
import Reg from '@/utils/reg'; // 工具包
// import App from '../../../app';
import http from '@/utils/request';
import Header from '@/component/header';

import '../css/verify-phone.scss';

export default class VerifyPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delShow: false,
      isSend: false,
      timeout: 60,
      canModify: false,
      mob: this.props.params.mob,
      update: this.props.params.update
    };
    this.timer = null;
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  componentDidMount() {
    this.sendCode();
  }
  sendCode() {
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      http
        .post('/member/get/mobile/code', {
          token: session.get('token'),
          sendType: 7 // 登记/修改
        })
        .then(
          res => {
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
          },
          res => {
            Message.toast(res.message);
            _this.setState({ isSend: false });
          }
        )
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
    this.refs.phone.value = '';
    this.setState({ delShow: false, canModify: false });
  }
  comfirm() {
    let canModify = this.state.canModify;
    let updatePhone = this.state.update;
    if (canModify) {
      let code = this.refs.phone.value;
      if (code.length < 6) {
        Message.toast('请输入6位的验证码');
        return;
      }
      http
        .post('/member/validate/mobile', {
          code: code,
          token: session.get('token'),
          sendType: 7 // 已修改
        })
        .then(res => {
          updatePhone
            ? (window.location.hash = '#/register-phone')
            : (window.location.hash = '#/user-info');
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
      <div className="pt-header verify-phone">
        {/* <div className="header">
                    <a href="#/user-info" className="back"></a>
                    <div className="user-info big">验证手机号</div>
                </div> */}
        {/* <Header title="验证手机号" back={this.goTo.bind(this)} /> */}
        <Header title="验证手机号" />
        <p className="verify-phone">
          已发送验证码到您的手机<span>
            {Reg.phoneNumberHide(this.state.mob)}
          </span>
        </p>
        <section className="sf-section">
          <div className="yzm-section">
            <div className="sf-item">
              <span>验证码</span>
              <input
                ref="phone"
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
        <p className="p-desc">温馨提示:</p>
        <p className="p-desc">
          1.
          运营商发送短信可能会有延迟请耐心等待，避免多次重新发送以致输错验证码；
        </p>
        <p className="p-desc">
          2. 如长时间没收到验证短信，请检查您的手机是否设置了短信拦截；
        </p>
        <p className="p-desc">
          3.
          若你确认手机无法接受到验证短信，请联系在线客服，协助你完成身份验证。
        </p>
      </div>
    );
  }
}
