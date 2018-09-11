/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--手机号详情模块
 */

import React, { Component } from 'react';
import session from '@/services/session';
import Reg from '@/utils/reg'; // 工具包
// import App from '../../../app';
import Message from '@/services/message';
import http from '@/utils/request';
import Navigator from '@/utils/navigator'; // 页面跳转
import Header from '@/component/header';

import '../css/phone-info.scss';

export default class PhoneInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mob: this.props.params.mob, // 手机号
      mob_log: parseInt(this.props.params.mob_log), // 是否开启手机号登录
      mob_sts: parseInt(this.props.params.mob_sts) // 手机状态
    };
    this.desc = {
      noreg:
        '一个手机号码只能作为一个账号的登录名，一个手机号最多可以被6个账号绑定。',
      reg:
        '已验证且已开启手机号码登录，一个手机号码只能作为一个账号的登录名，一个手机号最多可以被6个账号绑定。'
    };
    this.btnText = ['关闭手机号码登录', '开启手机号码登录', '验证手机号'];
  }
  getDesc(mob_log, mob_sts) {
    return mob_log && mob_sts ? this.desc.reg : this.desc.noreg;
  }
  getBtnText(mob_log, mob_sts) {
    if (mob_log && mob_sts) {
      return this.btnText[0];
    } else if (!mob_log && mob_sts) {
      return this.btnText[1];
    } else {
      return this.btnText[2];
    }
  }
  closeMobileLogin() {
    let _this = this;
    http
      .post('/member/close/mobile', {
        token: session.get('token')
      })
      .then(res => {
        Message.toast('关闭手机号码登录成功');
        _this.setState({
          mob_log: 0
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  openMobileLogin() {
    let _this = this;
    http
      .post('/member/open/mobile', {
        token: session.get('token')
      })
      .then(res => {
        Message.toast('开启手机号码登录成功');
        _this.setState({
          mob_log: 1
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  regSts() {
    // 第一个按钮
    let { mob_log, mob_sts } = this.state;
    if (!mob_log && !mob_sts) {
      window.location.hash = '#/verify-phone/' + this.state.mob;
    } else if (mob_log && mob_sts) {
      this.closeMobileLogin();
    } else if (!mob_log && mob_sts) {
      this.openMobileLogin();
    }
    // Message.confirm({
    //     msg:'开启手机号码登录失败！',
    //     leftBtnText:'在线客服',
    //     rightBtnText:'取消',
    //     leftBtnHandler：function(){},
    //     children:(<div className="msg1">
    //         <em>原因：账户Oil****已开启本号码登录。 一个手机号码只能开启登录一个账号。</em>
    //         <em>提醒：请确认账户Oil****是否属于你 如是请自行选择手机号码登录的账户 如不是请联系在线客服</em>
    //     </div>)
    // });
  }
  changePhone() {
    // 更换手机号 update:1 表示入口为更换手机号
    Navigator.goAddr('#/verify-phone/' + this.state.mob + '/1');
  }
  goTo() {
    location.href = '#/user-info';
  }
  render() {
    let { mob, mob_log, mob_sts } = this.state;
    return (
      <div className="pt-header phone-info">
        {/* <div className="header">
                    <a href="#/user-info" className="back"></a>
                    <div className="user-info big">手机号</div>
                </div> */}
        {/* <Header title="手机号" back={this.goTo.bind(this)} /> */}
        <Header title="手机号" />
        <section className="phone-detail">
          <div
            className={
              mob_sts ? (mob_log ? 'phone-ok' : 'phone-done') : 'phone-no'
            }
          />
          <div className="phone-number">
            <p>
              {mob_sts ? (mob_log ? '你的手机号' : '') : '未验证'}
              {Reg.phoneNumberHide(mob)}
            </p>
            {mob_sts && !mob_log ? <p>已验证且未开启手机号码登录</p> : ''}
          </div>
          <p className="phone-desc">{this.getDesc(mob_log, mob_sts)}</p>

          <button className="btn-blue" onClick={ this.changePhone.bind(this) }>
            更换手机号码
          </button>
          <button className="btn-white" onClick={ this.regSts.bind(this) }>
            {this.getBtnText(mob_log, mob_sts)}
          </button>
        </section>
      </div>
    );
  }
}
