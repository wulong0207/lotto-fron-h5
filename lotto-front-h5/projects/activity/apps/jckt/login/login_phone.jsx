import React, { Component } from 'react';
import Template from './component/container.jsx';
import { DialogType } from '../const.js';
import Message from '@/services/message'; // 弹窗
import http from '@/utils/request';
import session from '@/services/session.js';
import Rex from '../utils/regExp.jsx';

export default class LoginPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      timeout: 120,
      code: ''
    };

    this.isGetCode = true;
  }

  componentWillMount() {
    this.setState({ phone: this.props.phone });
  }

  close() {
    this.props.changeShowDialog(DialogType.none);
  }

  changePhone(e) {
    this.setState({ phone: e.target.value });
  }

  PhoneOnBlur() {
    let phone = this.phone.value;

    if (phone.length < 1) {
      Message.toast('请输入手机号');
      this.isGetCode = false;
    } else {
      if (!Rex.phone.test(phone)) {
        Message.toast('请输入正确的11位手机码');
        this.isGetCode = false;
      } else {
        this.checkUserName(phone);
      }
    }
  }

  checkUserName(userName) {
    let params = { userName: userName };
    http
      .post('/passport/login/validate/username', params)
      .then(res => {
        if (res.success === 1) {
          if (res.data.set_pwd && this.isGetCode) {
            this.isGetCode = false;
            this.props.changeLoginPhone(this.phone.value);
            this.props.changeShowDialog(DialogType.Login);
            Message.toast('该手机号码已设置密码，请使用密码登录');
          }
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  getValidate() {
    if (!this.isGetCode || !this.phone) return;
    let phone = this.phone.value;
    let self = this;
    let params = {
      sendType: 1,
      userName: phone,
      timeout: 120
    };
    http
      .post('/passport/get/code', params)
      .then(res => {
        self.setState({ isSend: true });

        let timeout = self.state.timeout;
        self.timer = setInterval(() => {
          timeout--;
          if (this.verify) {
            this.verify.value = '再次获取 ' + timeout;
          }

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
  linkRegsiter() {
    this.props.changeShowDialog(DialogType.Register);
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
  btnClick() {
    let phone = this.phone.value;
    let validate = this.validate.value;
    let params = {
      code: validate,
      sendType: 1,
      userName: phone
    };
    http
      .post('/passport/login/code', params)
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
        if (err.code === '30613') {
          this.props.changeShowDialog(DialogType.Login);
        }
        Message.toast(err.message);
      });
  }

  render() {
    return (
      <div className="login_phone">
        <Template
          title="账号登录"
          close={ this.close.bind(this) }
          btnClick={ this.btnClick.bind(this) }
        >
          <div className="template_main">
            <ul className="template_list">
              <li className="template_item">
                <input
                  type="text"
                  ref={ phone => (this.phone = phone) }
                  placeholder="请输入手机号"
                  value={ this.state.phone }
                  onChange={ this.changePhone.bind(this) }
                  onBlur={ this.PhoneOnBlur.bind(this) }
                />
              </li>
              <li className="template_item">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  ref={ validate => (this.validate = validate) }
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
              <li className="lable">
                <span
                  className="lable_txt"
                  onClick={ this.linkRegsiter.bind(this) }
                >
                  免费注册
                </span>
              </li>
            </ul>
          </div>
        </Template>
      </div>
    );
  }
}
