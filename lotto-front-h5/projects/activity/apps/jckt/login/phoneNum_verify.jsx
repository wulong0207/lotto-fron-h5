import React, { Component } from 'react';
import Container from './component/container.jsx';
import Rex from '../utils/regExp.jsx';
import Message from '@/services/message'; // 弹窗
import http from '@/utils/request';
import { DialogType } from '../const.js';
import pbkdf2 from 'pbkdf2';
import session from '@/services/session';

export default class PhoneNumVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  getValidate() {
    let phone = this.phone.value;
    let isSend = this.state.isSend;
    let token = session.get('token');
    let self = this;
    if (this.phoneBlur() && !isSend) {
      let params = {
        sendType: 5,
        mobile: phone,
        token: token
      };
      http
        .post('/member/get/new/mobile/code', params)
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

  btnClick() {
    let phone = this.phone.value;
    let validate = this.validate.value;
    let params = {
      mobile: phone,
      code: validate,
      sendType: 5
    };
    http
      .post('/member/modify/mobile', params)
      .then(res => {
        if (res.success === 1) {
          Message.toast('绑定成功');
          this.props.changeShowDialog(DialogType.RealName);
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
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
      <div className="phoneNum_verify">
        <Container
          title="手机号码认证"
          close={ this.close.bind(this) }
          btnClick={ this.btnClick.bind(this) }
        >
          <div className="template_main">
            <ul className="template_list">
              <li className="template_item">
                <input
                  type="text"
                  ref={ phone => (this.phone = phone) }
                  placeholder="请输入手机号/会员名"
                  onBlur={ this.phoneBlur.bind(this) }
                />
              </li>
              <li className="template_item">
                <input
                  type="number"
                  placeholder="请输入验证码"
                  ref={ validate => (this.validate = validate) }
                />
                <input
                  type="button"
                  ref={ verify => (this.verify = verify) }
                  className="btn_verify"
                  value="获取验证码"
                  onClick={ this.getValidate.bind(this) }
                  onChange={ this.checkNumber.bind(this) }
                />
              </li>
            </ul>
          </div>
        </Container>
      </div>
    );
  }
}
