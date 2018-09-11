/**
 * Created by manaster
 * date 2017-03-10
 * desc:个人中心模块--填写银行卡信息模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
// import App from '../../../app';
import RegExp from '../components/reg-exp';
import http from '@/utils/request';
import session from '@/services/session';
import Navigator from '@/utils/navigator';
import Header from '@/component/header';
import Reg from '@/utils/reg.js';
import { getParameter } from '@/utils/utils';

import '../css/register-bank.scss';

export default class RegisterBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankNo: this.props.params.bankNo,
      nameDelShow: false,
      idcardDelShow: false,
      phoneDelShow: false,
      codeDelShow: false,
      isSend: false,
      timeout: 60,
      canModify: false
    };
  }
  componentDidMount() {
    let bankInfo = session.get('addBankInfo');
    if (bankInfo.rn && bankInfo.idc) {
      this.refs.idcard.value = bankInfo.idc || '';
      this.refs.realName.value = bankInfo.rn || '';
    }
  }
  // 格式化银行卡号
  formatBankCard(value) {
    return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  // 输入框value值改变判断
  valueChange(type) {
    let realname = /^[\u4e00-\u9fa5][?·\u4e00-\u9fa5]{0,5}[\u4e00-\u9fa5]$/;
    let idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let phone = /^1[34578]\d{9}$/;

    if (type == 'month') {
      this.refs.month.value
        ? this.setState({ canModify: true })
        : this.setState({ canModify: false });
    }
    if (type == 'realName') {
      // if(!realname.test(this.refs.realName.value)){
      //     Message.toast("真实姓名输入有误，请确认后重新输入")
      //     return ;
      // }
      this.refs.realName.value
        ? this.setState({ nameDelShow: true, canModify: true })
        : this.setState({ nameDelShow: false, canModify: false });
    }
    if (type == 'idcard') {
      // if(!idcard.test(this.refs.idcard.value)){
      //     Message.toast("身份证号输入有误，请确认后重新输入")
      //     return ;
      // }
      this.refs.idcard.value
        ? this.setState({ idcardDelShow: true, canModify: true })
        : this.setState({ idcardDelShow: false, canModify: false });
    }
    if (type == 'phone') {
      // if(!phone.test(this.refs.phone.value)){
      //     Message.toast("手机号码输入有误，请确认后重新输入")
      //     return ;
      // }
      let value = this.refs.phone.value;
      value.length > 3
        ? (this.refs.phone.value =
            value.substring(0, 3) +
            ' ' +
            value
              .substr(3)
              .replace(/\D/g, ' ')
              .replace(/....(?!$)/g, '$& '))
        : null;
      this.refs.phone.value
        ? this.setState({ phoneDelShow: true, canModify: true })
        : this.setState({ phoneDelShow: false, canModify: false });
    }
    if (type == 'code') {
      this.refs.code.value
        ? this.setState({ codeDelShow: true, canModify: true })
        : this.setState({ codeDelShow: false, canModify: false });
    }
  }
  // 失去焦点的提示
  /* valueBlur(type) {
        let realname = /^[\u4e00-\u9fa5][?·\u4e00-\u9fa5]{0,5}[\u4e00-\u9fa5]$/;
        let idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        let phone = /^1[34578]\d{9}$/;
        console.log('22222');
        if(type == 'realName'){
            if(this.refs.realName.value &&!realname.test(this.refs.realName.value)){
                Message.toast("真实姓名输入有误，请确认后重新输入")
            }
        }else if(type == 'idcard'){
            if(this.refs.idcard.value && !idcard.test(this.refs.idcard.value)){
                Message.toast("身份证号输入有误，请确认后重新输入")
            }
        }else if(type == 'phone'){
            if(this.refs.phone.value && !phone.test(this.refs.phone.value)){
                Message.toast("手机号码输入有误，请确认后重新输入")
            }
        }
    } */
  // 清楚内容
  clear(type) {
    let realName = this.refs.realName;
    let idcard = this.refs.idcard;
    let phone = this.refs.phone;
    let code = this.refs.code;
    if (type == 'realName') {
      // 真实姓名
      realName.value = '';
      this.setState({ nameDelShow: false });
      idcard.value || phone.value || code.value
        ? this.setState({ canModify: true })
        : this.setState({ canModify: false });
    }
    if (type == 'idcard') {
      // 身份证号
      idcard.value = '';
      this.setState({ idcardDelShow: false });
      realName.value || phone.value || code.value
        ? this.setState({ canModify: true })
        : this.setState({ canModify: false });
    }
    if (type == 'phone') {
      // 手机号
      phone.value = '';
      this.setState({ phoneDelShow: false });
      realName.value || idcard.value || code.value
        ? this.setState({ canModify: true })
        : this.setState({ canModify: false });
    }
    if (type == 'code') {
      // 验证码
      code.value = '';
      this.setState({ codeDelShow: false });
      realName.value || idcard.value || phone.value
        ? this.setState({ canModify: true })
        : this.setState({ canModify: false });
    }
  }
  // 发送验证码
  sendCode() {
    let phone = this.refs.phone.value.replace(/\s/g, '');
    if (!this.checkInputInfo()) {
      return;
    }
    let isSend = this.state.isSend;
    let _this = this;
    if (!isSend) {
      //   let url =
      //     '/bankCard/getValidateCode/' + session.get('token') + '/' + phone;
      http
        .post('/bankcard/get/code', {
          mobile: phone,
          token: session.get('token')
        })
        .then(
          res => {
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
          },
          res => {
            Message.toast(res.message);
            _this.setState({ isSend: false });
          }
        )
        .catch(err => {
          Message.toast(err.message);
        });
    }
  }

  checkInputInfo() {
    let bankInfo = session.get('addBankInfo');
    let month = this.refs.month.value;
    let realName = this.refs.realName.value;
    let readOnly = false;
    if (bankInfo.rn && bankInfo.idc) {
      readOnly = true;
    }

    if (!readOnly) {
      if (!Reg.checkChinese(realName)) {
        if (!realName) {
          Message.toast('请输入姓名');
          return false;
        } else {
          Message.toast('姓名输入不合法');
          return false;
        }
      } else if (realName.split('.').length > 2) {
        Message.toast('姓名输入不合法');
        return false;
      }
    }

    let idcard = this.refs.idcard.value.replace(/\s/g, '');

    if (!readOnly) {
      if (!Reg.checkID(idcard)) {
        if (!idcard) {
          Message.toast('请输入身份证号');
          return false;
        } else {
          Message.toast('身份证号输入不合法');
          return false;
        }
      }
    }

    let phone = this.refs.phone.value.replace(/\s/g, '');
    if (!Reg.checkPhone(phone)) {
      if (!phone) {
        Message.toast('请输入手机号');
        return false;
      } else {
        Message.toast('手机号输入不合法');
        return false;
      }
    }

    return true;
  }

  // 保存按钮
  confirm() {
    // debugger;
    let bankInfo = session.get('addBankInfo');
    let month = this.refs.month.value;
    let realName = this.refs.realName.value;
    let idcard = this.refs.idcard.value.replace(/\s/g, '');
    let readOnly = false;
    let phone = this.refs.phone.value.replace(/\s/g, '');
    if (bankInfo.rn && bankInfo.idc) {
      readOnly = true;
    }

    if (!this.checkInputInfo()) {
      return;
    }

    let code = this.refs.code.value;
    if (!code) {
      Message.toast('请输入验证码');
    }
    let montharr = month.split('-');
    let year = montharr[0].substr(-2, 2);
    let monthResult = montharr[1] + year;

    let url = '/bankcard/add/bankCard';
    let params = {
      bankid: bankInfo.bk_id, // 银行id
      bankname: bankInfo.bkn, // 开户行名称
      banktype: bankInfo.bct, // 银行卡类型:1储蓄卡;2信用卡
      cardcode: this.props.params.bankNo, // 银行卡号
      code: code, // 验证码
      idCard: idcard, // 身份证
      mobile: phone,
      openbank: 1, // 是否开启快捷支付 0：否，1：是
      realname: realName,
      token: session.get('token')
    };

    if (bankInfo.bct == 2) {
      // 信用卡
      url = '/bankcard/add/bankCard';
      params.overdue = monthResult || ''; // 如0916，表示16年9月，信用卡必填
    }
    http
      .post(url, params)
      .then(res => {
        if (!res.success) {
          Message.toast(err.message);
          return;
        }
        let paramsurl = getParameter('from');
        if (paramsurl == '1') {
          // 前往充值
          // Navigator.go(`#/recharge?cardid=${params}&bankid=${bankInfo.bk_id}`);
          Navigator.goAddr('#/recharge');
        } else if (paramsurl == '2') {
          Navigator.goAddr('#/draw-money');
        } else {
          // debugger;
          Navigator.goAddr('#/my-bank');
          // var back_url = getParameter('next');
          // var renext = getParameter('renext');
          // console.log(renext)
          // window.location = back_url || '#/my-bank';
          // console.log('back->', back_url);
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  goTo() {
    location.href = '#/add-bank';
  }
  render() {
    let bankInfo = session.get('addBankInfo');
    let style = { display: bankInfo.bct == 1 ? 'none' : '' };
    let readOnly = false;
    if (bankInfo.rn && bankInfo.idc) {
      readOnly = true;
    }
    let loadStyle = {};

    return (
      <div
        className="pt-header register-bank"
        style={ { paddingBottom: '30px' } }
      >
        <Header title="填写银行卡信息" />
        <p className="section-title">信息加密，仅用于银行验证</p>
        <section className="sf-section">
          <div className="sf-item">
            <span>银行类型</span>
            <span className="label">
              {bankInfo.bkn} {bankInfo.bct == 1 ? '储蓄卡' : '信用卡'}
            </span>
          </div>
          <div className="sf-item">
            <span>银行卡号</span>
            <span className="label">
              {this.formatBankCard(this.state.bankNo)}
            </span>
          </div>
          <div className="sf-item" style={ style }>
            <span>有效期</span>
            <input
              ref="month"
              className="ipt"
              placeholder="请选择月份年份"
              type="month"
              onBlur={ this.valueChange.bind(this, 'month') }
            />
            <i className="icon-info" />
          </div>
        </section>
        <p className="section-title">请填写银行预留信息</p>
        <section className="sf-section">
          <div className="sf-item">
            <span>真实姓名</span>
            <input
              ref="realName"
              readOnly={ readOnly }
              placeholder="请输入持卡人姓名"
              type="text"
              onChange={ this.valueChange.bind(this, 'realName') }
            />
            <i
              className={ this.state.nameDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'realName') }
            />
          </div>
          <div className="sf-item">
            <span>身份证号</span>
            <input
              ref="idcard"
              readOnly={ readOnly }
              placeholder="请输入持卡人身份证号码"
              type="text"
              onChange={ this.valueChange.bind(this, 'idcard') }
            />
            <i
              className={ this.state.idcardDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'idcard') }
            />
          </div>
          {/* se-delete   主要是针对se 手机不能点击加大处理 */}
          <div className="sf-item se-delete">
            <span>手机号</span>
            <input
              ref="phone"
              maxLength="11"
              placeholder="请输入银行预留手机号码"
              type="tel"
              onBlur={ this.valueChange.bind(this, 'phone') }
            />
            <i
              className={ this.state.phoneDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'phone') }
            />
          </div>
          <div className="yzm-section">
            <div className="sf-item">
              <span>验证码</span>
              <input
                ref="code"
                placeholder="6位数字验证码"
                maxLength="6"
                type="tel"
                onBlur={ this.valueChange.bind(this, 'code') }
              />
              <i
                className={ this.state.codeDelShow ? 'icon-delete' : '' }
                onClick={ this.clear.bind(this, 'code') }
              />
            </div>
            <div className="yzm" onClick={ this.sendCode.bind(this) }>
              {this.state.isSend
                ? this.state.timeout + '秒后重新发送'
                : '获取验证码'}
            </div>
          </div>
        </section>
        <button
          className={ this.state.canModify ? 'btn-blue' : 'btn-grey' }
          onClick={ this.confirm.bind(this) }
        >
          确认
        </button>
        <p className="p-desc">温馨提示：</p>
        <p className="p-desc">
          1.
          运营商发送短信可能会有延迟请耐心等待，避免多次重新发送以致输错验证码；
        </p>
        <p className="p-desc">
          2. 如长时间没收到验证短信，请检查您的手机是否设置了短信拦截；
        </p>
        <p className="p-desc">
          3.
          若你确认手机无法接受到验证短信，请联系在线客服，协助你完成身份验证。
        </p>
      </div>
    );
  }
}
