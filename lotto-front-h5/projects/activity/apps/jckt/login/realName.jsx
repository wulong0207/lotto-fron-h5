import React, { Component } from 'react';
import Template from './component/container.jsx';
import { DialogType } from '../const.js';
import Rex from '../utils/regExp.jsx';
import Message from '@/services/message'; // 弹窗
import http from '@/utils/request';
import session from '@/services/session.js';

export default class RealName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  close() {
    this.props.changeShowDialog(DialogType.none);
  }

  userNameBlur() {
    let name = this.name.value;
    if (!Rex.userName.test(name)) {
      Message.toast('领奖人姓名错误，请确认后重新输入');
    }
  }

  idCardBlur() {
    let card = this.card.value;
    if (!Rex.idCard.test(card)) {
      Message.toast('领奖人身份证错误，请确认后重新输入');
    }
  }

  btnClick() {
    let tk = session.get('token');
    let token = tk;
    let realname = this.name.value;
    let idcard = this.card.value;

    let params = {
      idCard: idcard,
      realName: realname,
      token: token
    };
    http
      .post('/passport/set/realname', params)
      .then(res => {
        Message.toast('恭喜您已完成实名认证');
        this.props.changeShowDialog(DialogType.none);
      })
      .catch(err => {
        if (
          err.message ===
          '您的名字超出了系统识别的长度,您可联系在线客服协助完成'
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

  render() {
    return (
      <div className="register_realName">
        <Template
          title={ this.props.title }
          commit="确认提交"
          close={ this.close.bind(this) }
          btnClick={ this.btnClick.bind(this) }
        >
          <div className="message">
            实名认证是提奖，提款的唯一凭证，确认后不可修改。
          </div>
          <div className="template_main">
            <ul className="template_list">
              <li className="template_item">
                <input
                  type="text"
                  ref={ name => (this.name = name) }
                  placeholder="请输入领奖人姓名"
                  onBlur={ this.userNameBlur.bind(this) }
                />
              </li>
              <li className="template_item">
                <input
                  type="text"
                  ref={ card => (this.card = card) }
                  placeholder="请输入领奖人的身份证号"
                  onBlur={ this.idCardBlur.bind(this) }
                />
              </li>
            </ul>
          </div>
        </Template>
      </div>
    );
  }
}
