/*
 * @Author: zouyuting
 * @Date: 2017-12-05 15:35:10
 * @Desc: 实名认证
 */
import React, { Component } from 'react';

import Header from '@/component/header'; // 头部
import cx from 'classnames';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';
import analytics from '@/services/analytics';

import '../scss/creatacc.scss';
const realname = /^[\u4e00-\u9fa5][?·\u4e00-\u9fa5]{0,5}[\u4e00-\u9fa5]$/;
const idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

export class Identity extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      clearname: false,
      clearid: false,
      next: 'next-btn',
      name: '',
      id: ''
    };
  }
  componentDidMount() {
    analytics.send(2063);
  }
  inputChange(e) {
    if (e.target.placeholder == '实名认证为领奖和提款的唯一凭证') {
      this.setState({ name: e.target.value });
      if (e.target.value) {
        this.setState({ clearname: true, next: 'next-btn-blue' });
      } else {
        this.setState({ clearname: false, next: 'next-btn' });
      }
    } else {
    }
    if (e.target.placeholder == '请输入15位或18位中国大陆身份证号码') {
      this.setState({ id: e.target.value });
      if (e.target.value) {
        this.setState({ clearid: true });
        // this.levelChange(e.target.value);
      } else {
        this.setState({ clearid: false });
      }
    } else {
    }
  }
  identityBtn(name, id) {
    Message.confirm({
      title: '温馨提示',
      btnTxt: ['返回修改', '确定'],
      btnFn: [
        () => {},
        () => {
          let params = {
            idCard: id,
            realName: name,
            token: session.get('userInfo').tk
          };
          analytics.send([20631, 20632, 20633]).then(() => http.post('/passport/set/realname', params))
            .then(res => {
              session.set('pre', res.data.is_pre_rn);
              if (res.success == 1) {
                this.props.router.replace('/regsec');
                // window.location.hash = '/regsec';
              }
            })
            .catch(err => {
              if (err.code == '40150') {
                this.overtop();
              } else {
                Message.toast(err.message);
              }
            });
        }
      ],
      children: (
        <div>
          <p style={ { textAlign: 'left' } }>
            真实姓名：{name}
            <span style={ { color: 'red' } }>（需与身份证号码对应）</span>
          </p>
          <p style={ { textAlign: 'left' } }>真实姓名：{id}</p>
        </div>
      )
    });
  }
  // 真实姓名验证
  nameVer(name) {
    if (this.onClear) return undefined;
    let len = name.length;
    if (name != '') {
      if (len > 6) {
        this.overtop();
        return;
      }
      if (realname.test(name) != true) {
        Message.toast('领奖人姓名错误，请确认后重新输入');
      }
    }
  }
  idVer(id) {
    if (this.onClear) return undefined;
    if (id && idcard.test(id) != true) {
      Message.toast('身份证号码输入错误，请确认后重新输入');
    }
  }
  clearname() {
    this.setState({ name: '', clearname: false, next: 'next-btn' });
  }
  clearid() {
    this.setState({ id: '', clearid: false });
  }
  leap() {
    this.pass();
  }
  // 跳过
  pass() {
    let params = {
      token: session.get('userInfo').tk
    };
    analytics.send(20634).then(() => http.post('/passport/continue', params))
      .then(res => {
        if (res.success == 1) {
          window.location.hash = '/regsec';
          session.set('token', params.token);
          session.set('pre', res.data.is_pre_rn);
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 真实姓名超出系统识别长度
  overtop() {
    Message.confirm({
      title: '温馨提示',
      btnTxt: ['修改', '在线客服'],
      btnFn: [
        () => {},
        () => {
          window.open('//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663');
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
  }
  render() {
    let clearname = this.state.clearname;
    let clearid = this.state.clearid;
    let name = this.state.name;
    let id = this.state.id;
    let next = this.state.next;
    return (
      <div className="identity">
        <Header title="实名认证">
          <span
            className="header-help"
            onMouseEnter={ () => (this.onClear = true) }
            onMouseLeave={ () => (this.onClear = false) }
            onClick={ event => this.leap(event) }
          >
            跳过
          </span>
        </Header>
        <div className="identity-cont">
          <div className="name-input">
            <span className="text-left">真实姓名</span>
            <div className="input-box">
              <input
                type="text"
                value={ name }
                placeholder="实名认证为领奖和提款的唯一凭证"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.nameVer(name) }
              />
              <span
                className={ cx(clearname ? 'clear-part' : 'hide') }
                onClick={ event => this.clearname(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <div className="name-input">
            <span className="text-left">身份证号</span>
            <div className="input-box">
              <input
                maxLength="18"
                value={ id }
                className={ cx(clearid ? '' : 'idinput') }
                placeholder="请输入实名认证人身份证号码"
                onChange={ event => this.inputChange(event) }
                onBlur={ event => this.idVer(id) }
              />
              <span
                className={ cx(clearid ? 'clear-part' : 'hide') }
                onClick={ event => this.clearid(event) }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>
          <button
            ref="next"
            className={ next }
            onClick={ event => this.identityBtn(name, id) }
          >
            下&nbsp;一&nbsp;步
          </button>
          <ul className="warm-msg">
            <li>温馨提示：</li>
            <li>
              1.真实姓名是您领奖和提款时的重要依据，填写后不可更改。网站不向未满18周岁的青少年出售彩票。
            </li>
            <li>2.您的个人信息将被严格保密，不会用于任何第三方用途。</li>
            <li>
              3.暂不支持港澳台身份证，军官证，护照等相关证件进行实名认证。
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
