import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import Message from '@/services/message'; // 弹窗
import session from '@/services/session.js';
import Reg from '@/utils/reg';
import pbkdf2 from 'pbkdf2';
import Dialog from '@/component/dialog/dialog';

import '../scss/register.scss';

export default class LogVerify extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      phoneDelShow: false,
      codeDelShow: false,
      timeout: 120,
      isSend: false,
      canModify: false,
      light: 'loginBtn',
      username: '',
      code: ''
    };
  }
  // componentWillMount() {
  //   this.setState({ username: '', code: '' });
  // }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // props update
  componentWillReceiveProps(nextProps) {
    if (nextProps.phonenumber !== undefined) {
      this.setState({
        username: nextProps.phonenumber,
        light: 'loginBtn-act'
      });
    }
  }
  // 焦点
  blurAlert(type, e) {
    if (this.onClear) return undefined;
    let account = e.currentTarget.value;
    if (type == 'phone' && account) {
      if (this.props.title == '账号' || this.props.title == '账号登录') {
        this.mobChange(account);
        // 账号密码登录--验证账号有效性
        let params = {
          userName: account.replace(/\s/g, '')
        };
        http
          .post('/passport/login/validate/username', params)
          .then(res => {
            if (res.success == 1) {
              if (this.props.onBlur) this.props.onBlur(e, res, account);
            }
          })
          .catch(err => {
            if (err.code == '40190') {
              // if (this.props.onBlur) this.props.onBlur(event, err, account);
              Message.toast(
                '暂未设置密码，请使用手机号' + err.data.mob + '进行免密登录'
              );
            } else {
              Message.toast(err.message);
            }
          });
      } else if (this.props.title == '账号登录') {
        this.mobChange(account);
        this.setState({ light: 'loginBtn-act' });
        // 账号验证码登录
      } else if (this.props.title == '手机号码认证') {
        // 登记手机号
        this.mobChange(account);
        var mob = /^1[3456789]\d{9}$/;
        mob.test(account.replace(/\s/g, ''))
          ? ''
          : Message.toast('请输入正确的11位手机码');
      }
    }
    if (type == 'code' && account) {
      if (this.props.title != '账号') {
        account.length == 6 ? '' : Message.toast('请输入6位数字验证码！');
      } else {
      }
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
      this.setState({ username: mob });
    } else {
      mob = Reg.trim(mob);
      this.setState({ username: mob });
    }
  }
  valueChange(type, e) {
    if (type == 'phone') {
      let account = e.currentTarget.value;
      this.setState({ username: account });
      account
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
      let account = e.currentTarget.value;
      this.setState({ code: account });
      account
        ? this.setState({
          codeDelShow: true,
          canModify: true
        })
        : this.setState({ codeDelShow: false, canModify: false });
    }
  }
  clear(type, e) {
    let phone = this.state.username;
    let code = this.state.code;
    let light = this.state.light;
    if (type == 'phone') {
      phone = '';
      light = 'loginBtn';
      this.setState({
        phoneDelShow: false,
        username: phone,
        light: 'loginBtn'
      });
    }
    if (type == 'code') {
      code = '';
      this.setState({ codeDelShow: false, code: code });
    }
  }
  sendCode() {
    // let token = session.get('accInfo').tk;
    let phone = Reg.trim(this.refs.phone.value);
    if (!phone) {
      Message.toast('请输入手机号');
      return;
    }
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      // 账号登录弹框
      if (this.props.title === '账号登录') {
        let params = {
          sendType: 1,
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
            Message.toast(err.message);
          });
      } else if (this.props.title === '手机号码认证') {
        // 登记手机号
        let token = session.get('token');
        let params = {
          mobile: phone,
          sendType: 5,
          token: token
        };
        http
          .post('/member/get/new/mobile/code', params)
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
            Message.toast(err.message);
          });
      }
    }
  }
  login(event) {
    // let token = session.get('accInfo').tk;
    event.persist();
    var value = this.refs.phone.value;
    let mob = Reg.trim(value);
    let code = this.refs.code.value;
    if (this.props.title == '账号登录') {
      let params = {
        code: code,
        sendType: 1,
        userName: mob
      };
      http
        .post('/passport/login/code', params)
        .then(res => {
          session.set('token', res.data.tk);
          session.set('userInfo', res.data);
          // console.log(res.data.tk);
          if (res.success == 1) {
            if (this.props.onClick) this.props.onClick(event, res);
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    } else if (this.props.title == '手机号码认证') {
      // 登记手机号
      let mob_token = session.get('token');
      let params = {
        code: code,
        mobile: mob,
        sendType: 5,
        token: mob_token
      };
      http
        .post('/member/modify/mobile', params)
        .then(res => {
          if (res.success == 1) {
            if (this.props.onClick) this.props.onClick(event, res, mob_token);
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    } else if (this.props.title == '账号') {
      let params = {
        userName: mob,
        password: pbkdf2
          .pbkdf2Sync(code, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
          .toString('hex')
      };
      http
        .post('/passport/login', params)
        .then(res => {
          console.log(res);
          session.set('token', res.data.tk);
          session.set('userInfo', res.data);
          if (res.success == 1) {
            if (this.props.onClick) this.props.onClick(event, res);
          }
        })
        .catch(err => {
          if (
            err.message == '您输入的密码与账户名不匹配!是否忘记密码或忘记用户名'
          ) {
            Message.toast(
              <span>
                您输入的密码与账户名不匹配!是否
                <a href="/account.html#/findpwd">忘记密码</a>
              </span>
            );
          } else if (
            err.message ==
            '您输入的密码和账户名不匹配已超过10次!今天已经不能再次尝试,请联系在线客服'
          ) {
            Message.toast(
              <span>
                您输入的密码和账户名不匹配已超过10次!今天已经不能再次尝试,请联系
                <a
                  href="//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663"
                  target="_blank"
                >
                  在线客服
                </a>
              </span>
            );
          } else if (err.code == '40130') {
            Message.toast('请使用验证码登录！');
          } else {
            Message.toast(err.message);
          }
        });
    }
  }
  register(event) {
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
  findPsw() {
    window.location = '/account.html#/findpwd';
  }
  render() {
    let username = this.state.username;
    let code = this.state.code;
    let show = this.state.show;
    var light = this.state.light;

    let verBtn = this.props.title == '账号' ? 'none' : 'block';

    let ver_placeholder =
      this.props.title == '账号' ? '请输入密码' : '6位数字验证码';
    let ver_maxLength = this.props.title == '账号' ? '' : '6';
    let ver_type = this.props.title == '账号' ? 'password' : 'tel';
    let log_placeholder =
      this.props.title == '手机号码认证'
        ? '请输入11位手机码'
        : '请输入手机号/会员名';
    let log_maxLength = this.props.title == '账号' || '账号登录' ? '' : '13';
    let log_type = this.props.title == '账号' || '账号登录' ? 'text' : 'tel';

    let regBtn = this.props.title == '手机号码认证' ? 'none' : 'block';
    let pswBtn = this.props.title == '账号' ? 'block' : 'none';
    let btnCont = this.props.title == '手机号码认证' ? '确认提交' : '确认登录';
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    return (
      <Dialog ref={ dialog => (this.dialog = dialog) } showHeader={ false }>
        <section className="sf-section">
          <div className="head">
            <span>
              {this.props.title == '账号' ? '账号登录' : this.props.title}
            </span>
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
                placeholder={ log_placeholder }
                onChange={ this.valueChange.bind(this, 'phone') }
                onBlur={ this.blurAlert.bind(this, 'phone') }
                type="text"
                maxLength={ log_maxLength }
                value={ username || '' }
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
                  placeholder={ ver_placeholder }
                  maxLength={ ver_maxLength }
                  onChange={ this.valueChange.bind(this, 'code') }
                  onBlur={ this.blurAlert.bind(this, 'code') }
                  type={ ver_type }
                  value={ code }
                />
                <i
                  onMouseEnter={ () => (this.onClear = true) }
                  onMouseLeave={ () => (this.onClear = false) }
                  className={ this.state.codeDelShow ? 'icon-delete' : '' }
                  onClick={ this.clear.bind(this, 'code') }
                />
              </div>
              <div
                style={ { display: verBtn } }
                className="yzm"
                onClick={ this.sendCode.bind(this) }
              >
                {this.state.isSend
                  ? '再次获取(' + this.state.timeout + ')'
                  : '获取验证码'}
              </div>
            </div>
            <div className="register">
              <div className="text-btn">
                <span
                  onMouseEnter={ () => (this.onClear = true) }
                  onMouseLeave={ () => (this.onClear = false) }
                  onClick={ this.register.bind(this) }
                  style={ { display: regBtn } }
                  className="freeReg"
                >
                  免费注册
                </span>
                <span
                  style={ { display: pswBtn } }
                  className="forget"
                  onClick={ this.findPsw.bind(this) }
                >
                  忘记密码
                </span>
              </div>
              <div className="main-btn log">
                <button className={ light } onClick={ this.login.bind(this) }>
                  {btnCont}
                </button>
              </div>
            </div>
          </div>
        </section>
      </Dialog>
    );
  }
}

LogVerify.PropTypes = {
  onClick: PropTypes.func,
  onBlur: PropTypes.func
};
