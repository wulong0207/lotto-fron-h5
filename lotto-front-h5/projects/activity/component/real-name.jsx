import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import Message from '@/services/message'; // 弹窗
import session from '@/services/session.js';
import Dialog from '@/component/dialog/dialog';

import '../scss/real-name.scss';

export default class RegisterName extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      nameDelShow: false,
      idDelShow: false,
      codeDelShow: false,
      light: 'loginBtn'
    };
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  valueChange(type, e) {
    if (type == 'name') {
      e.currentTarget.value
        ? this.setState({
          nameDelShow: true,
          canModify: true,
          light: 'loginBtn-act'
        })
        : this.setState({
          nameDelShow: false,
          canModify: false,
          light: 'loginBtn'
        });
    }
    if (type == 'idcard') {
      e.currentTarget.value
        ? this.setState({
          idDelShow: true,
          canModify: true
        })
        : this.setState({ idDelShow: false, canModify: false });
    }
  }
  clear(type, e) {
    let name = this.refs.name;
    let id = this.refs.idcard;
    let light = this.state.light;
    if (type == 'name') {
      name.value = '';
      light = 'loginBtn';
      this.setState({ nameDelShow: false, light: 'loginBtn' });
      name.value ? null : this.setState({ canModify: false });
    }
    if (type == 'idcard') {
      id.value = '';
      this.setState({ idDelShow: false });
      id.value ? null : this.setState({ canModify: false });
    }
  }
  blurAlert(type, e) {
    if (this.onClear) return undefined;
    if (type == 'name' && e.currentTarget.value) {
      var accReg = /^[\u4e00-\u9fa5][?·\u4e00-\u9fa5]{0,5}[\u4e00-\u9fa5]$/;
      if (accReg.test(e.currentTarget.value)) {
      } else {
        Message.toast('领奖人姓名错误，请确认后重新输入');
      }
    }
    if (type == 'idcard' && e.currentTarget.value) {
      var idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      idcard.test(e.currentTarget.value)
        ? ''
        : Message.toast('领奖人身份证错误，请确认后重新输入');
    }
  }
  identify(event) {
    var tk = session.get('token');
    let token = tk;
    let realname = this.refs.name.value;
    let idcard = this.refs.idcard.value;
    let params = {
      idCard: idcard,
      realName: realname,
      token: token
    };
    http
      .post('/passport/set/realname', params)
      .then(res => {
        console.log(res);

        if (this.props.onClick) {
          this.props.onClick(event, params.token, params.realName);
        }
      })
      .catch(err => {
        if (
          err.message == '您的名字超出了系统识别的长度,您可联系在线客服协助完成'
        ) {
          Message.confirm({
            title: '温馨提示',
            btnTxt: ['修改', '在线客服'],
            btnFn: [
              () => {},
              () => {
                window.open(
                  '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663'
                );
              }
            ],
            children: (
              <div>
                <p>
                  你的名字超出了系统识别的长度<br />你可联系在线客服协助完成
                </p>
              </div>
            )
          });
        } else {
          Message.toast(err.message);
        }
      });
  }
  // 关闭弹窗
  show(enable) {
    if (enable) {
      this.dialog.open();
    } else {
      this.dialog.close();
    }
  }
  cancle() {
    this.dialog.close();
    if (this.onClear) return undefined;
  }
  render() {
    var light = this.state.light;
    return (
      <Dialog ref={ dialog => this.dialog = dialog } showHeader={ false }>
        <section className="sf-section">
          <div className="head">
            <span>{this.props.title}</span>
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
            <div className="title">
              <span>实名认证是领奖，提款的唯一凭证，确认后不可修改。</span>
            </div>
            {/* 真实姓名 */}
            <div className="sf-item">
              <input
                ref="name"
                placeholder="请输入领奖人姓名"
                onChange={ this.valueChange.bind(this, 'name') }
                onBlur={ this.blurAlert.bind(this, 'name') }
                type="text"
              />
              <i
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                className={ this.state.nameDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'name') }
              />
            </div>
            {/* 身份证号 */}
            <div className="sf-item">
              <input
                ref="idcard"
                placeholder="请输入领奖人的身份证号"
                onChange={ this.valueChange.bind(this, 'idcard') }
                onBlur={ this.blurAlert.bind(this, 'idcard') }
                type="text"
              />
              <i
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                className={ this.state.idDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'idcard') }
              />
            </div>
            <div className="submit">
              <button className={ light } onClick={ event => this.identify(event) }>
                确认提交
              </button>
            </div>
          </div>
        </section>
      </Dialog>
    );
  }
}

RegisterName.PropTypes = {
  onClick: PropTypes.func
};
