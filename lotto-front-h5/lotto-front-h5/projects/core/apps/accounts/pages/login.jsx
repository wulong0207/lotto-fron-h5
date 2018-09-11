/*
 * @Author: zouyuting
 * @Date: 2017-12-02 14:36:39
 * @Desc: 登录
 */

import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '@/component/header'; // 头部
// import Proxy from '@/component/proxy/proxy'; // 代理
import OAuth from '../components/oAuth';
import cx from 'classnames';
import session from '@/services/session.js';
import storage from '@/services/storage.js';
import Message from '@/services/message';
import http from '@/utils/request';
import { getParameter } from '@/utils/utils';
import pbkdf2 from 'pbkdf2';
import analytics from '@/services/analytics';
import RouterLink from '@/component/analytics/router-link';

import '../scss/login.scss';
const ACCOUNT_HISTORY = 'ACCOUNT_HISTORY';
const mobReg = /^1[3456789]\d{9}$/; // 判断手机号
const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; // 验证邮箱
const forReg = /^\S+$/g; // 判断空格

export class Login extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      clearuser: false,
      clearpwd: false,
      eye: false,
      eyeType: 'password',
      login: 'login-btn',
      username: '',
      accountlist: storage.get(ACCOUNT_HISTORY) || [],
      showacclist: false,
      password: '',
      checked: ''
    };
  }

  componentDidMount() {
    this.filterAccount();
    analytics.send(207);
  }
  inputChange(e) {
    if (e.target.placeholder == '邮箱/手机/用户名') {
      this.setState({ username: e.target.value });
      if (e.target.value) {
        this.setState({ clearuser: true, login: 'login-btn-blue' });
      } else {
        this.setState({ clearuser: false, login: 'login-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '请输入登录密码') {
      this.setState({ password: e.target.value });
      if (e.target.value) {
        this.setState({ clearpwd: true, eye: true });
      } else {
        this.setState({ clearpwd: false, eye: false });
      }
    } else {
    }
  }
  // 验证账号有效性
  verMob(e, val) {
    if (this.onClear) return undefined;
    val = mobReg.test(val)
      ? val.toString().substring(0, 3) +
        ' ' +
        val.toString().substring(3, 7) +
        ' ' +
        val.toString().substring(7, 11)
      : val;
    this.setState({ username: val });
    val = forReg.test(val) ? val : val.replace(/\s/g, '');
    if (val != '') {
      this.verAccount(val);
    }
  }
  // 登录
  loginBtn(e, username, password) {
    var back = getParameter('next');
    var back2 = getParameter('back');
    analytics.send(2074)
    if (password == '') {
      Message.toast(
        <span>
          您输入的密码与账户名不匹配!是否
          <a
            onClick={ () => {
              Message.closeToast();
              location.hash = '/findpwd';
            } }
          >
            忘记密码
          </a>
        </span>
      );
    } else {
      username = forReg.test(username) ? username : username.replace(/\s/g, '');
      password = forReg.test(password) ? password : password.replace(/\s/g, '');
      let params = {
        userName: username,
        password:
          password.length > 20
            ? password
            : pbkdf2
              .pbkdf2Sync(
                password,
                '2f1e131cc3009026cf8991da3fd4ac38',
                50,
                64
              )
              .toString('hex')
      };
      analytics.send([2072, 2073]).then((res) => http.post('/passport/login', params))
        .then(res => {
          console.log(res);
          debugger;
          if (res.success == 1) {
            // debugger;
            // 登录历史记录
            let accountlist = [];
            if (this.state.checked == 'checked') {
              accountlist = this.state.accountlist.concat();
              accountlist.unshift(params);
              this.setState({ accountlist });
              storage.set(ACCOUNT_HISTORY, accountlist);
            } else {
              let unremerber = {
                userName: username,
                password: ''
              };
              accountlist = this.state.accountlist.concat();
              accountlist.unshift(unremerber);
              this.setState({ accountlist });
              storage.set(ACCOUNT_HISTORY, accountlist);
            }

            session.set('userInfo', res.data);
            session.set('token', res.data.tk);
            if (back2) {
              window.location = back2;
            } else if (back) {
              location.replace(back);
            } else {
              window.location = '/index.html';
            }
          }
        })
        .catch(err => {
          console.log(err);
          if (err.code == '40128') {
            Message.toast(
              <span>
                您输入的密码与账户名不匹配!是否
                <a
                  onClick={ () => {
                    Message.closeToast();
                    location.hash = '/findpwd';
                  } }
                >
                  忘记密码
                </a>
              </span>
            );
          } else if (err.code == '40141') {
            Message.toast(
              <span>
                您输入的密码和账户名不匹配已超过10次!今天已经不能再次尝试,请联系
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
  }
  // 显示与隐藏账户历史
  onaccList(e, history) {
    if (this.state.showacclist) {
      this.setState({ showacclist: false });
    } else {
      this.setState({ showacclist: true });
    }
    history = this.unique(history);
    storage.set(ACCOUNT_HISTORY, history);
    this.setState({ accountlist: history });
  }
  // 历史列表登录
  rename(e, user, pwd) {
    let markAcc = mobReg.test(user)
      ? user.toString().substring(0, 3) +
        ' ' +
        user.toString().substring(3, 7) +
        ' ' +
        user.toString().substring(7, 11)
      : user;
    this.setState({
      username: markAcc,
      showacclist: false,
      login: 'login-btn-blue',
      clearuser: true
    });
    this.verAccount(user);
    if (pwd) {
      this.setState({
        password: pwd,
        checked: 'checked',
        clearpwd: true,
        eye: true
      });
    } else {
      this.setState({ password: '', checked: '', clearpwd: false, eye: false });
    }
  }
  // 验证账号有效性
  verAccount(username) {
    let params = { userName: username };
    http
      .post('/passport/login/validate/username', params)
      .then(res => {
        if (res.data.set_pwd == 0) {
          session.set('mob', params.userName);
          Message.toast(
            <span>
              您的账号未设置密码 ,可
              <a
                onClick={ () => {
                  Message.closeToast();
                  location.hash = '/verifylogin';
                } }
              >
                免密登录
              </a>
            </span>
          );
        }
      })
      .catch(err => {
        if (err.code == '40119') {
          if (mobReg.test(params.userName)) {
            // 为手机号
            Message.toast('该账号未注册或未开启手机号码登录');
            return;
          }
          if (emailReg.test(params.userName)) {
            // 为邮箱
            Message.toast('该账号未注册或未开启邮箱登录');
            return;
          }
          if (
            !mobReg.test(params.userName) &&
            !emailReg.test(params.userName)
          ) {
            // 账户名
            Message.toast('账户名不存在');
          }
        } else {
          Message.toast(err.message);
        }
      });
  }
  clearuser() {
    this.setState({ username: '', clearuser: false, login: 'login-btn' });
  }
  clearpwd() {
    this.setState({ password: '', clearpwd: false, eye: false });
  }
  eye() {
    if (this.state.eyeType == 'password') {
      this.setState({ eyeType: 'text' });
    } else {
      this.setState({ eyeType: 'password' });
    }
  }
  // 记住密码
  remember() {
    if (this.state.checked == '') {
      analytics.send(2075);
      this.setState({ checked: 'checked' });
    } else {
      this.setState({ checked: '' });
    }
  }
  // 过滤历史记录中不可使用账号
  filterAccount() {
    let arr = storage.get('ACCOUNT_HISTORY');
    if (arr) {
      let len = arr.length;
      let accountlist = [];
      for (var i = 0; i < len; i++) {
        let params = { userName: arr[i].userName, password: arr[i].password };
        http
          .post('/passport/login/validate/username', params)
          .then(res => {
            accountlist.unshift(params);
            this.setState({ accountlist });
            storage.set(ACCOUNT_HISTORY, accountlist);
          })
          .catch(err => {});
      }
    } else {
    }
  }
  unique(arr) {
    let res = [arr[0]];
    let userName;
    for (let i = 1; i < arr.length; i++) {
      let repeat = false;
      for (let j = 0; j < res.length; j++) {
        if (arr[i].userName == res[j].userName) {
          repeat = true;
          break;
        }
      }
      if (!repeat) {
        res.push(arr[i]);
      }
    }
    return res;
  }
  render() {
    let clearuser = this.state.clearuser;
    let clearpwd = this.state.clearpwd;
    let eye = this.state.eye;
    let eyeType = this.state.eyeType;
    let login = this.state.login;
    let username = this.state.username;
    let password = this.state.password;
    let checked = this.state.checked;
    let accountlist = this.state.accountlist;
    let showacclist = this.state.showacclist;
    return (
      <div className="login">
        <Header
          title="登录"
          back={ () => {
            window.history.go('-1');
          } }
        />
        <div className="login-container">
          {/* <Proxy>
            <span className="login-proxy">加入代理</span>
          </Proxy> */}
          <img
            className="head-img"
            src={ require('@/img/account/login_old_user.png') }
          />
          <div className="username-wrap">
            <img
              className="icon-left"
              src={ require('@/img/account/account_grey@2x.png') }
            />
            <input
              className="input-part"
              ref="username"
              autoComplete="off"
              value={ username }
              type="text"
              placeholder="邮箱/手机/用户名"
              onChange={ event => this.inputChange(event) }
              onBlur={ event => this.verMob(event, username) }
            />
            {/* 用户名列表 */}
            <span
              className={ cx(accountlist.length >= 1 ? 'history-acc' : 'hide') }
              onClick={ event => this.onaccList(event, accountlist) }
            />
            <ul className={ cx(showacclist ? 'history-list' : 'hide') }>
              {accountlist ? (
                accountlist.map((e, i) => {
                  return (
                    <li
                      className="rename"
                      key={ i }
                      onClick={ event =>
                        this.rename(event, e.userName, e.password)
                      }
                    >
                      {e.userName}
                    </li>
                  );
                })
              ) : (
                <li className="rename" />
              )}
            </ul>
            <span
              className={ cx(clearuser ? 'clear-part' : 'hide') }
              onClick={ event => this.clearuser(event) }
              onMouseEnter={ () => (this.onClear = true) }
              onMouseLeave={ () => (this.onClear = false) }
            >
              <img src={ require('@/img/account/deletegrey@2x.png') } />
            </span>
          </div>
          <div className="username-wrap">
            <img
              className="icon-left"
              src={ require('@/img/account/password_grey@2x.png') }
            />
            <input
              className="input-part"
              ref="password"
              autoComplete="off"
              value={ password }
              type={ eyeType }
              placeholder="请输入登录密码"
              maxLength="20"
              minLength="4"
              onChange={ event => this.inputChange(event) }
            />
            <span
              className={ cx(clearpwd ? 'clear-part' : 'hide') }
              onClick={ event => this.clearpwd(event) }
            >
              <img src={ require('@/img/account/deletegrey@2x.png') } />
            </span>
            <span
              className={ cx(eye ? 'eye-part' : 'hide') }
              onClick={ event => this.eye(event) }
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
          <button
            className={ login }
            onClick={ event => this.loginBtn(event, username, password) }
          >
            登&nbsp;录
          </button>
          <div className="else_btn">
            <div className="remerber" onClick={ event => this.remember(event) }>
              <input
                type="checkbox"
                checked={ checked }
                className="login_checkbox"
              />
              <span className="jizhu">记住密码</span>
            </div>
            <div className="forget">
              <RouterLink to="/findpwd" id={ 2076 }>
                <span
                  className="forgetpwd"
                  onMouseEnter={ () => (this.onClear = true) }
                  onMouseLeave={ () => (this.onClear = false) }
                >
                  忘记密码
                </span>
              </RouterLink>
            </div>
          </div>
          <div className="register">
            <RouterLink to="/register" id={ 2077 }>
              <p className="register-btn">免费注册</p>
            </RouterLink>
          </div>
          {/* 第三方登录 */}
          <OAuth />
        </div>
      </div>
    );
  }
}
