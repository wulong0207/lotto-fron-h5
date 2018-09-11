import React, { Component } from 'react';
import Template from './component/container.jsx';
import Rex from '../utils/regExp.jsx';
import Message from '@/services/message'; // 弹窗
import http from '@/utils/request';
import session from '@/services/session.js';
import pbkdf2 from 'pbkdf2';
import { DialogType } from '../const.js';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.phone) {
      this.phone.value = this.props.phone;
    }
  }
  close() {
    this.props.changeShowDialog(DialogType.none);
  }

  regsiterHandle() {
    this.props.changeShowDialog(DialogType.Register);
  }
  linkPhoneLogin() {
    this.props.changeLoginPhone(this.phone.value);
    this.props.changeShowDialog(DialogType.LoginPhone);
  }

  PhoneOnBlur() {
    let phone = this.phone.value;

    if (phone.length < 1) {
      Message.toast('请输入手机号');
    } else {
      // if (!Rex.phone.test(phone)) {
      //   Message.toast('请输入正确的11位手机码');
      // } else {
      //
      // }
      this.verAccount(phone);
    }
  }

  verAccount(username) {
    let params = { userName: username };
    http
      .post('/passport/login/validate/username', params)
      .then(res => {
        if (!res.data.set_pwd) {
          this.linkPhoneLogin();
          Message.toast(
            '暂未设置密码，请使用手机号' + res.data.mob + '进行免密登录'
          );
        }
      })
      .catch(err => {
        if (err.code === '40119') {
          if (Rex.phone.test(params.userName)) {
            // 为手机号
            Message.toast('该账号未注册或未开启手机号码登录');
            return;
          }
          if (Rex.email.test(params.userName)) {
            // 为邮箱
            Message.toast('该账号未注册或未开启邮箱登录');
            return;
          }
          if (
            !Rex.phone.test(params.userName) &&
            !Rex.email.test(params.userName)
          ) {
            // 账户名
            Message.toast('账户名不存在');
          }
        } else {
          Message.toast(err.message);
        }
      });
  }

  checkLogin(userName) {
    let params = { userName: userName };
    http
      .post('/passport/login/validate/username', params)
      .then(res => {
        if (res.success === 1) {
          if (!res.data.set_pwd) {
            this.linkPhoneLogin();
            Message.toast(
              '暂未设置密码，请使用手机号' + res.data.mob + '进行免密登录'
            );
          }
        }
      })
      .catch(err => {
        if (err.code === '40190') {
          Message.toast(
            '暂未设置密码，请使用手机号' + err.data.mob + '进行免密登录'
          );
        } else {
          Message.toast(err.message);
        }
      });
  }

  btnClick() {
    let phone = this.phone.value;
    let pwd = this.pwd.value;
    let params = {
      userName: phone,
      password: pbkdf2
        .pbkdf2Sync(pwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
        .toString('hex')
    };

    http
      .post('/passport/login', params)
      .then(res => {
        session.set('token', res.data.tk);
        session.set('userInfo', res.data);
        if (res.success === 1) {
          if (!res.data.mob) {
            this.props.changeShowDialog(DialogType.PhoneVerify);
          } else if (!res.data.att_rn) {
            this.props.changeShowDialog(DialogType.Ident);
          } else {
            this.close();
            Message.toast('登录成功');
          }
        }
      })
      .catch(err => {
        if (
          err.message === '您输入的密码与账户名不匹配!是否忘记密码或忘记用户名'
        ) {
          Message.toast(
            <span>
              您输入的密码与账户名不匹配!是否
              <a href="/account.html#/findpwd">忘记密码</a>
            </span>
          );
        } else if (
          err.message ===
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
        } else {
          Message.toast(err.message);
        }
      });
  }

  render() {
    return (
      <div className="login">
        <Template
          close={ this.close.bind(this) }
          title="账号登录"
          btnClick={ this.btnClick.bind(this) }
        >
          <div className="template_main">
            <ul className="template_list">
              <li className="template_item">
                <input
                  ref={ phone => (this.phone = phone) }
                  type="text"
                  placeholder="请输入手机号/会员名"
                  onBlur={ this.PhoneOnBlur.bind(this) }
                />
              </li>
              <li className="template_item">
                <input
                  type="password"
                  ref={ pwd => (this.pwd = pwd) }
                  placeholder="请输入密码"
                />
              </li>
              <li className="lable">
                <span
                  className="lable_txt"
                  onClick={ this.regsiterHandle.bind(this) }
                >
                  免费注册
                </span>
                <a href="/account.html#/findpwd" className="lable_txt right">
                  忘记密码
                </a>
              </li>
            </ul>
          </div>
        </Template>
      </div>
    );
  }
}
