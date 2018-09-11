/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--邮箱详情模块
 */

import React, { Component } from 'react';
import Reg from '@/utils/reg'; // 工具包
// import App from '../../../app';
import Message from '@/services/message';
import http from '@/utils/request';
import Navigator from '@/utils/navigator'; // 页面跳转
import session from '@/services/session';
import Header from '@/component/header';

import '../css/mail-info.scss';

export default class MailInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 邮箱
      em: decodeURI(this.props.params.em),
      // 是否开启邮箱登录
      em_log: parseInt(this.props.params.em_log),
      // 邮箱状态
      em_sts: parseInt(this.props.params.em_sts)
    };
    this.desc = {
      noreg:
        '一个邮箱只能作为一个账号的登录名，一个邮箱最多可以被6个账号绑定。',
      reg:
        '已验证且已开启邮箱登录，一个邮箱只能作为一个账号的登录名，一个邮箱最多可以被6个账号绑定。'
    };
    this.btnText = ['关闭邮箱地址登录', '开启邮箱地址登录', '验证邮箱地址'];
  }
  getDesc(em_log, em_sts) {
    return em_log && em_sts ? this.desc.reg : this.desc.noreg;
  }
  getBtnText(em_log, em_sts) {
    if (em_log && em_sts) {
      return this.btnText[0];
    } else if (!em_log && em_sts) {
      return this.btnText[1];
    } else {
      return this.btnText[2];
    }
  }
  closeMailLogin() {
    let _this = this;

    http
      .post('/member/close/email', {
        token: session.get('token')
      })
      .then(res => {
        Message.toast('关闭邮箱地址登录成功');
        _this.setState({
          em_log: 0
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  openMailLogin() {
    let _this = this;

    http
      .post('/member/open/email', {
        token: session.get('token')
      })
      .then(res => {
        Message.toast('开启邮箱地址登录成功');
        _this.setState({
          em_log: 1
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  regSts() {
    // 第一个按钮
    let { em_log, em_sts } = this.state;
    if (!em_log && !em_sts) {
      Navigator.goAddr('#/verify-mail/' + this.state.em);
    } else if (em_log && em_sts) {
      this.closeMailLogin();
    } else if (!em_log && em_sts) {
      this.openMailLogin();
    }
    // Message.confirm({
    //     msg:'开启手机号码登录失败！',
    //     leftBtnText:'在线客服',
    //     rightBtnText:'取消',
    //     children:(<div className="msg1">
    //         <em>原因：账户Oil****已开启本号码登录。 一个手机号码只能开启登录一个账号。</em>
    //         <em>提醒：请确认账户Oil****是否属于你 如是请自行选择手机号码登录的账户 如不是请联系在线客服</em>
    //     </div>)
    // });
  }
  changeMail() {
    // 更换手机号 逻辑同更换手机号
    Navigator.goAddr('#/verify-mail/' + this.state.em + '/1');
  }
  goTo() {
    location.href = '#/user-info';
  }
  render() {
    let { em, em_log, em_sts } = this.state;
    return (
      <div className="pt-header mail-info">
        {/* <div className="header">
                    <a href="#/user-info" className="back"></a>
                    <div className="user-info big">邮箱地址</div>
                </div> */}
        <Header title="邮箱地址" />
        <section className="phone-detail">
          <div
            className={ em_sts ? (em_log ? 'mail-ok' : 'mail-done') : 'mail-no' }
          />
          <div className="phone-number">
            <p>
              {em_sts ? (em_log ? '你的邮箱' : '') : '未验证'}
              {Reg.mailHide(em)}
            </p>
            {em_sts && !em_log ? <p>已验证且未开启邮箱登录</p> : ''}
          </div>
          <p className="phone-desc">{this.getDesc(em_log, em_sts)}</p>
          <button className="btn-blue" onClick={ this.changeMail.bind(this) }>
            更换邮箱地址
          </button>
          <button className="btn-white" onClick={ this.regSts.bind(this) }>
            {this.getBtnText(em_log, em_sts)}
          </button>
        </section>
      </div>
    );
  }
}
