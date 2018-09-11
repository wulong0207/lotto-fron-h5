/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:02:32
 * Desc: 银行卡找回密码
 */

import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '@/component/header'; // 头部
import cx from 'classnames';
import session from '@/services/session.js';
import Message from '@/services/message';
import http from '@/utils/request';

import '../scss/verifylogin.scss';

export class BkCardWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clearnum: false,
      login: 'login-btn',
      num: ''
    };
  }
  verChange(e) {
    if (e.target.value) {
      this.setState({
        num: e.target.value,
        login: 'login-btn-blue',
        clearnum: true
      });
    } else {
      this.setState({ num: '', login: 'login-btn', clearnum: false });
    }
  }
  clearnum(e) {
    this.setState({ num: '', login: 'login-btn', clearnum: false });
  }
  Next(num) {
    let params = {
      cardNum: num,
      userName: session.get('userInfo_find').acc
    };
    http
      .post('/retrieve/validate/bankcard', params)
      .then(res => {
        if (res.success == 1) {
          window.location.hash = '/resetpwd';
        }
      })
      .catch(err => {
        if (err.code == '40155') {
          Message.toast(
            <span>
              您今天已输错银行卡号码10次!次数已用完,请明天再试!
              <a
                onClick={ () => {
                  Message.closeToast();
                  window.open(
                    '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663'
                  );
                } }
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
    let num = this.state.num;
    let clearnum = this.state.clearnum;
    let login = this.state.login;
    let bankcard = session.get('userInfo_find').dft_cd;
    return (
      <div className="bankcardway">
        <Header title="银行卡验证找回密码" />
        <div className="bankcard-cont">
          <p className="title">你的银行卡号</p>
          <p className="card-num">
            银行卡：<span>
              {session.get('bankName')} ****{bankcard
                .toString()
                .substring(bankcard.length - 2)}
            </span>
          </p>
          <div className="ver-input">
            <span className="text-left">银行卡后八位</span>
            <div className="input-part">
              <input
                type="tel"
                placeholder="请输入数字"
                value={ num }
                maxLength="8"
                onChange={ event => this.verChange(event) }
              />
              <span
                className={ cx(clearnum ? 'clear-part' : 'hide') }
                onClick={ event => this.clearnum(event) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } alt="" />
              </span>
            </div>
          </div>

          <button className={ login } onClick={ event => this.Next(num) }>
            下&nbsp;一&nbsp;步
          </button>
          <Link to="/Findway">
            <p className="resel-btn">重新选择验证方式</p>
          </Link>
        </div>
      </div>
    );
  }
}
