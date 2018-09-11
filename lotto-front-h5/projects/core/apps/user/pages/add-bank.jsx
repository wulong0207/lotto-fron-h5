/**
 * Created by manaster
 * date 2017-03-10
 * desc:个人中心模块--添加银行卡子模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
import RegExp from '../components/reg-exp';
import http from '@/utils/request';
import session from '@/services/session';
import Navigator from '@/utils/navigator'; // 页面跳转
import Header from '@/component/header';
import { getParameter } from '@/utils/utils';

import '../css/add-bank.scss';

export default class AddBank extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      delShow: false,
      canModify: false
    };
  }
  registerBank(e) {
    if (this.refs.card.value.trim()) {
      this.reqBankInfo();
    }
  }
  valueChange() {
    this.refs.card.value
      ? this.setState({ delShow: true, canModify: true })
      : this.setState({ delShow: false, canModify: false });
    this.refs.card.value = this.refs.card.value
      .replace(/\s/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  clear() {
    this.refs.card.value = '';
    this.setState({ delShow: false, canModify: false });
  }

  // 请求银行卡信息
  reqBankInfo() {
    // debugger;
    let value = this.refs.card.value;
    let next = encodeURIComponent(window.document.referrer);
    console.log(window.document.referrer);
    http
      .post('/bankcard/get/bankCard/detail', {
        cardcode: value.replace(/\s/g, ''),
        token: session.get('token')
      })
      .then(res => {
        // debugger;
        session.set('addBankInfo', res.data);
        let params = getParameter('from');
        let url = '#/register-bank/' + value.replace(/\s/g, '');
        if (params) {
          url += '?from=' + params;
        }
        // Navigator.goAddr(url);
        let last = getParameter('next');
        if (last) {
          Navigator.goAddr(url);
        } else {
          window.location.href = '?next=' + next + url;
        }
        // location.href = '/sc.html?next=' + next + url;
      })
      .catch(err => {
        console.log(err.code);
        if (err.code == '40330') {
          Message.toast(err.message);
        } else {
          Message.confirm({
            title: '该卡不能开通快捷支付',
            msg: '请确认后再提交',
            btnTxt: ['重新输入'],
            btnFn: [
              () => {
                console.log('重新输入');
                this.refs.card.value = '';
                this.setState({ delShow: false, canModify: false });
                this.refs.card.focus();
              },
              () => {
                // 查看支持银行卡 多余
                // window.location.hash = '#/bank-query';
              }
            ],
            children: <em>内容</em>
          });
        }
      });
  }

  blur() {
    if (this.onClear) return undefined;
    let value = this.refs.card.value;
    if (value === '') {
      return;
    }
    if (!RegExp.bankCardReg.test(value.replace(/\s/g, ''))) {
      Message.confirm({
        title: '该卡不能开通快捷支付',
        msg: '请确认后再提交',
        btnTxt: ['重新输入', '查看支持银行'],
        btnFn: [
          () => {
            console.log('重新输入');
            this.refs.card.value = '';
            this.setState({ delShow: false, canModify: false });
            this.refs.card.focus();
          },
          () => {
            window.location.hash = '#/bank-query';
          }
        ],
        children: <em>内容</em>
      });
    }
  }
  goTo() {
    location.href = '#/my-bank';
  }
  render() {
    return (
      <div className="pt-header add-bank">
        <Header title="添加银行卡" />
        <p className="verify-phone">请输入本人的银行卡号</p>
        <section className="sf-section">
          <div className="sf-item">
            <span>卡号</span>
            <input
              ref="card"
              className="ipt"
              placeholder="银行卡号"
              maxLength="23"
              type="tel"
              onBlur={ this.blur.bind(this) }
              onChange={ this.valueChange.bind(this) }
            />
            <i
              onMouseEnter={ () => (this.onClear = true) }
              onMouseLeave={ () => (this.onClear = false) }
              className={ this.state.delShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this) }
            />
          </div>
        </section>
        <button
          className={ this.state.canModify ? 'btn-blue' : 'btn-grey' }
          onClick={ this.registerBank.bind(this) }
        >
          下一步
        </button>
      </div>
    );
  }
}
