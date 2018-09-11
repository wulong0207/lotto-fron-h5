/*
 * @Author: zouyuting
 * @Date: 2017-12-03 15:51:16
 * @Desc: 注册
 */
import React, { Component } from 'react';

import Header from '@/component/header'; // 头部
import OAuth from '../components/oAuth'; // 第三方登录
import Agree from '../components/agree'; // 法律条款
import cx from 'classnames';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import analytics from '@/services/analytics';

import '../scss/register.scss';
const forReg = /^\S+$/g;
const mobReg = /^1[3456789]\d{9}$/; // 判断手机号

export class Register extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      agreePage: false,
      clearmob: false,
      clearver: false,
      register: 'login-btn',
      isSend: false,
      timeout: 60,
      mob: '',
      ver: ''
    };
  }
  componentDidMount() {
    analytics.send(2061);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  inputChange(e) {
    e.target.value = forReg.test(e.target.value)
      ? e.target.value
      : e.target.value.replace(/\s/g, '');
    if (e.target.placeholder == '请输入11位手机号码') {
      this.setState({ mob: e.target.value });
      if (e.target.value) {
        this.setState({ clearmob: true, register: 'login-btn-blue' });
      } else {
        this.setState({ clearmob: false, register: 'login-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '六位数验证码') {
      this.setState({ ver: e.target.value });
      if (e.target.value) {
        this.setState({ clearver: true, eye: true });
      } else {
        this.setState({ clearver: false, eye: false });
      }
    } else {
    }
  }
  // 手机号验证
  mobVer(e, mob) {
    if (this.onClear) return undefined;
    mob = mobReg.test(mob)
      ? mob.toString().substring(0, 3) +
        ' ' +
        mob.toString().substring(3, 7) +
        ' ' +
        mob.toString().substring(7, 11)
      : mob;
    this.setState({ mob: mob });
    mob = forReg.test(mob) ? mob : mob.replace(/\s/g, '');
    if (mob) {
      mobReg.test(mob) ? '' : Message.toast('请输入正确的手机号码！');
      // let params = {
      //   userName: mob
      // };
      // http
      //   .post('/passport/register/validate/username', params)
      //   .then(res => {})
      //   .catch(err => {
      //     Message.toast(err.message);
      //   });
    }
  }
  sendCode() {
    let isSend = this.state.isSend;
    let mob = this.state.mob;
    mob = forReg.test(mob) ? mob : mob.replace(/\s/g, '');
    let _this = this;
    if (mob && mobReg.test(mob)) {
      if (!isSend) {
        let params = {
          sendType: 2,
          userName: mob
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
                  timeout: 60
                });
                clearInterval(_this.timer);
              }
            }, 1000);
          })
          .catch(err => {
            if (err.code == '40120') {
              Message.toast(
                <span>
                  该手机号已被注册，你可以使用第三方快速注册或
                  <a
                    onClick={ () => {
                      Message.closeToast();
                      this.props.router.replace('/login')
                      // location.hash = '/login';
                    } }
                  >
                    立即登录
                  </a>
                </span>
              );
            } else if (err.code == '40117') {
              Message.toast(
                <span>
                  您今天已获取验证码10次!次数已用完,请明天再试!或联系
                  <a
                    onClick={ () => {
                      Message.closeToast();
                      window.open(
                        '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663'
                      );
                    } }
                  >
                    在线客服
                  </a>
                </span>
              );
            } else {
              Message.toast(err.message);
            }
          });
      }
    } else {
      Message.toast('请输入正确的11位手机号码！');
    }
  }
  registerBtn(mob, ver) {
    mob = forReg.test(mob) ? mob : mob.replace(/\s/g, '');
    let params = {
      code: ver,
      sendType: 2,
      userName: mob
    };
    session.set('reg_phone', params.userName);
    if (params.code && params.userName) {
      analytics.send([20611, 20612, 20614]).then(() => http.post('/passport/register', params))
        .then(res => {
          if (res.success == 1) {
            session.set('userInfo', res.data);
            this.props.router.replace('/createacc')
            // window.location.hash = '/createacc';
          }
        })
        .catch(err => {
          if (err.message == '手机号已注册') {
            Message.toast(
              <span>
                该手机号已被注册，你可以使用第三方快速注册或
                <a
                  onClick={ () => {
                    Message.closeToast();
                    this.props.router.replace('/login')
                    // location.hash = '/login';
                  } }
                >
                  立即登录
                </a>
              </span>
            );
          } else if (err.code == '40101') {
            Message.toast('您输入的手机号码不正确');
          } else {
            Message.toast(err.message);
          }
        });
    } else {
      Message.toast('请输入手机号及验证码');
    }
  }
  clearmob() {
    this.setState({ mob: '', clearmob: false, register: 'login-btn' });
  }
  clearver() {
    this.setState({ ver: '', clearver: false });
  }
  agreeOpen(e, agreeOpen) {
    if (agreeOpen) {
      this.setState({ agreePage: false });
    } else {
      this.setState({ agreePage: true });
    }
  }
  render() {
    let clearmob = this.state.clearmob;
    let clearver = this.state.clearver;
    let register = this.state.register;
    let mob = this.state.mob;
    let ver = this.state.ver;
    let agreePage = this.state.agreePage;
    return (
      <div className="register">
        <Header title="免费注册" />
        <div className="register-cont">
          <img
            className="head-img"
            src={ require('@/img/account/login_old_user.png') }
          />
          <div className="user-input">
            <span className="text-left">手机号码</span>
            <div className="input-part-phone input-box">
              <input
                type="tel"
                maxLength="11"
                value={ mob }
                placeholder="请输入11位手机号码"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.mobVer(event, mob) }
              />
              <span
                className={ cx(clearmob ? 'clear-part' : 'hide') }
                onClick={ event => this.clearmob(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <div className="ver-input">
            <span className="text-left">验证码</span>
            <div className="input-part-ver input-box">
              <input
                type="tel"
                maxLength="6"
                value={ ver }
                placeholder="六位数验证码"
                onChange={ event => this.inputChange(event) }
              />
              <span
                className={ cx(clearver ? 'clear-part' : 'hide') }
                onClick={ event => this.clearver(event) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
            <span className="gain-part" onClick={ event => this.sendCode(event) }>
              {this.state.isSend
                ? this.state.timeout + '秒后重新获取'
                : '获取验证码'}
            </span>
          </div>
          <div className="login-btn-box">
            <button
              ref="register_btn"
              className={ register }
              onClick={ event => this.registerBtn(mob, ver) }
            >
              注&nbsp;册
            </button>
            <p>
              提交即表示我已经年满18岁并同意<span
                onClick={ event => this.agreeOpen(event, agreePage) }
              >
                《2N彩票用户购彩须知》
              </span>
            </p>
          </div>
          <ul className="warm-msg">
            <li>温馨提示：</li>
            <li>
              1.运营商发送短信可能会有延迟请耐心等待，避免多次重新发送以致输错验证码；
            </li>
            <li>
              2. 如长时间没收到验证短信，请检查您的手机是否设置了短信拦截；
            </li>
            <li>
              3.若你确认手机无法接收到验证短信，请联系
              在线客服，协助你完成身份验证
            </li>
          </ul>
          {/* 第三方登录 */}
          <OAuth />
        </div>
        {/* 2N彩票用户购彩须知 法律条款 */}
        <div className={ cx(agreePage ? 'p-agree' : 'hide') }>
          <Header
            title="2N彩票用户购彩须知"
            back={ evnet => this.agreeOpen(event, agreePage) }
          />
          <div className="agree-content">
            <Agree />
          </div>
        </div>
      </div>
    );
  }
}
