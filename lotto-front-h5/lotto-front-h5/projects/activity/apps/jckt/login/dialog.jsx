import React, { Component } from 'react';
import Login from './login.jsx'; // 登录界面
import LoginPhone from './login_phone.jsx'; // 手机登陆
import PhoneNumVerify from './phoneNum_verify.jsx'; // 手机号码验证
import RealName from './realName.jsx'; // 实名认证
import Register from './register.jsx'; // 注册
import './css/dialog.scss';
import { DialogType } from '../const.js';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogType: 0,
      LoginPhone: ''
    };
  }

  changeShowDialog(dialogType) {
    this.setState({ dialogType });
  }

  changeLoginPhone(phone) {
    this.setState({ LoginPhone: phone });
  }

  stopEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <div
        className="shadow"
        onTouchMove={ this.stopEvent.bind(this) }
        style={ { display: this.state.dialogType ? 'block' : 'none' } }
      >
        {this.state.dialogType === DialogType.Login ? (
          <Login
            changeShowDialog={ this.changeShowDialog.bind(this) }
            changeLoginPhone={ this.changeLoginPhone.bind(this) }
            phone={ this.state.LoginPhone }
          />
        ) : (
          ''
        )}
        {this.state.dialogType === DialogType.LoginPhone ? (
          <LoginPhone
            changeShowDialog={ this.changeShowDialog.bind(this) }
            changeLoginPhone={ this.changeLoginPhone.bind(this) }
            phone={ this.state.LoginPhone }
          />
        ) : (
          ''
        )}
        {this.state.dialogType === DialogType.PhoneVerify ? (
          <PhoneNumVerify changeShowDialog={ this.changeShowDialog.bind(this) } />
        ) : (
          ''
        )}
        {this.state.dialogType === DialogType.Ident ? (
          <RealName
            title="实名认证"
            changeShowDialog={ this.changeShowDialog.bind(this) }
          />
        ) : (
          ''
        )}
        {this.state.dialogType === DialogType.RealName ? (
          <RealName
            title="免费注册"
            changeShowDialog={ this.changeShowDialog.bind(this) }
          />
        ) : (
          ''
        )}
        {this.state.dialogType === DialogType.Register ? (
          <Register changeShowDialog={ this.changeShowDialog.bind(this) } />
        ) : (
          ''
        )}
      </div>
    );
  }
}
