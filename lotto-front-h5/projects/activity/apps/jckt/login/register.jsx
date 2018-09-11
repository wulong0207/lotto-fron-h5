import React, { Component } from 'react';
import Template from './component/container.jsx';
import Message from '@/services/message'; // 弹窗
import http from '@/utils/request';
import Rex from '../utils/regExp.jsx';
import pbkdf2 from 'pbkdf2';
import session from '@/services/session.js';
import { DialogType } from '../const.js';

export default class Regsiter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginMessageShow: false,
      buttonStyle: false,
      timeout: 120,
      isSend: false,
      code: ''
    };
  }

  close() {
    this.props.changeShowDialog(DialogType.none);
  }

  phoneBlur() {
    let phone = this.phone.value;

    if (phone.length < 1) {
      Message.toast('请输入手机号');
      return false;
    } else if (!Rex.phone.test(phone)) {
      Message.toast('请输入正确的11位手机码');
      return false;
    }

    return true;
  }

  onchangePhone() {
    let val = this.phone.value;
    if (val.length > 0) {
      if (!this.state.buttonStyle) {
        this.setState({ buttonStyle: true });
      }
    } else {
      this.setState({ buttonStyle: false });
    }
  }

  getValidate() {
    let phone = this.phone.value;
    let isSend = this.state.isSend;
    let self = this;

    if (this.phoneBlur() && !isSend) {
      let params = {
        sendType: 2,
        userName: phone
      };
      http
        .post('/passport/get/code', params)
        .then(res => {
          self.setState({ isSend: true });

          let timeout = self.state.timeout;
          self.timer = setInterval(() => {
            timeout--;
            this.verify.value = '再次获取 ' + timeout;
            if (timeout <= 0) {
              this.verify.value = '获取验证码';
              self.setState({
                isSend: false,
                timeout: 120
              });
              clearInterval(self.timer);
            }
          }, 1000);
        })
        .catch(err => {
          if (err.code === '40120' || err.code === '40171') {
            Message.toast(err.message);
          } else {
            Message.toast('请输入正确的手机号码！');
          }
        });
    }
  }

  nickNameBlur() {
    let nickName = this.nickName.value;

    if (nickName.length >= 4 && nickName.length <= 20) {
      if (Rex.pwd_num.test(nickName)) {
        Message.toast('账户名设置不能为纯数字，请重新设置');
      } else if (!Rex.nickName.test(nickName)) {
        Message.toast('账户名设置不符合要求，请重新设置');
      }
    } else {
      Message.toast('账户名支持中文、字母、数字、“_”的组合，4-20个字符');
    }
  }

  pwdOnBlur() {
    let pwd = this.pwd.value;

    if (pwd.length >= 6 && pwd.length <= 20) {
      if (Rex.pwd_num.test(pwd)) {
        // 纯数字
        Message.toast('密码设置不能为纯数字，请重新设置');
      } else if (Rex.pwd_abc.test(pwd)) {
        // 纯字母
        Message.toast('密码设置不能为纯字母，请重新设置');
      } else if (Rex.pwd_space.test(pwd)) {
        // 带空格
        Message.toast('密码设置不能有空格，请重新设置');
      } else if (Rex.pwd_china.test(pwd)) {
        // 有中文
        Message.toast('密码设置不能有中文，请重新设置');
      }
    } else {
      Message.toast('密码设置不符合要求，请重新设置');
    }
  }

  pwdOnBlurTwo() {
    let pwd = this.pwd.value;
    let pwd2 = this.pwd2.value;

    if (pwd !== pwd2) {
      Message.toast('两次输入的密码不同，请确认后输入');
    }
  }

  btnClick() {
    if (!this.state.buttonStyle) return;

    let phone = this.phone.value;
    let verifyCode = this.verifyCode.value;
    let pwd = this.pwd.value;
    let pwd2 = this.pwd2.value;
    let nickName = this.nickName.value;

    if (phone.length < 1) {
      Message.toast('请输入手机号');
    } else if (!Rex.phone.test(phone)) {
      Message.toast('请输入正确的11位手机码');
    } else if (verifyCode.length < 1) {
      // 验证码不能为空
      Message.toast('验证码不能为空，请重新输入');
    } else {
      // 请求注册
      let params = {
        account: nickName,
        code: verifyCode,
        sendType: 2,
        userName: phone
      };
      if (pwd) {
        params.password1 = pbkdf2
          .pbkdf2Sync(pwd, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
          .toString('hex');
      }
      if (pwd2) {
        params.password2 = pbkdf2
          .pbkdf2Sync(pwd2, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64)
          .toString('hex');
      }

      this.registerPost(params);
    }
  }

  registerPost(params) {
    http
      .post('/activity/register', params)
      .then(res => {
        if (res.success === 1) {
          session.set('token', res.data.tk);
          session.set('userInfo', res.data);
          // 验证码不能为空
          Message.toast('注册成功');
          // 提示实名
          this.props.changeShowDialog(DialogType.RealName);
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  btnMessageClick() {
    this.props.changeShowDialog(DialogType.Login);
  }
  checkNumber() {
    let code = this.validate.value;
    let num = Number(code);
    if (!num && num !== 0) {
      this.validate.value = this.state.code;
      Message.toast('验证码只能输入纯数字哦');
      return;
    }
    this.state.code = num;
  }

  render() {
    return (
      <div className="regsiter">
        <Template
          title="免费注册"
          commit="确认注册"
          btnMessage="已有账号，请登录"
          buttonStyle={ this.state.buttonStyle }
          close={ this.close.bind(this) }
          btnMessageClick={ this.btnMessageClick.bind(this) }
          btnClick={ this.btnClick.bind(this) }
        >
          <div className="template_main">
            <ul className="template_list">
              <li className="template_item">
                <input
                  type="text"
                  ref={ phone => (this.phone = phone) }
                  onChange={ this.onchangePhone.bind(this) }
                  onBlur={ this.phoneBlur.bind(this) }
                  placeholder="请输入手机号"
                />
              </li>
              <li className="template_item">
                <input
                  type="text"
                  ref={ verify => (this.verifyCode = verify) }
                  placeholder="请输入验证码"
                  onChange={ this.checkNumber.bind(this) }
                />
                <input
                  type="button"
                  ref={ verify => (this.verify = verify) }
                  className="btn_verify"
                  value="获取验证码"
                  onClick={ this.getValidate.bind(this) }
                />
              </li>
              <li className="lable mt40 mb20">
                <span className="lable_txt">选填项</span>
              </li>
              <li className="template_item">
                <input
                  type="text"
                  ref={ nickName => (this.nickName = nickName) }
                  placeholder="请输入4-20个字符的用户名"
                  onBlur={ this.nickNameBlur.bind(this) }
                />
              </li>
              <li className="template_item">
                <input
                  type="password"
                  ref={ pwd => (this.pwd = pwd) }
                  placeholder="请输入密码"
                  onBlur={ this.pwdOnBlur.bind(this) }
                />
              </li>
              <li className="template_item">
                <input
                  type="password"
                  ref={ pwd2 => (this.pwd2 = pwd2) }
                  placeholder="再次请输入密码"
                  onBlur={ this.pwdOnBlurTwo.bind(this) }
                />
              </li>
            </ul>
          </div>
        </Template>
      </div>
    );
  }
}
