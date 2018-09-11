/**
 * Created by manaster
 * date 2017-03-08
 * desc:个人中心模块--我的银行卡子模块
 */

import React, { Component } from 'react';
// import App from '../../../app';
import session from '@/services/session';
import Reg from '@/utils/reg';
import http from '@/utils/request';
import Message from '@/services/message';
import Navigator from '@/utils/navigator'; // 页面跳转
import Header from '@/component/header';
import { formatMoney } from '@/utils/utils';

import '../css/my-bank.scss';

export default class MyBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyHide: true,
      userInfo: {
        hd_url: '', // 头像url
        pst_d_ct: 0, // 过期红包个数
        u_wlt_blc: 0, //  钱包余额
        u_pk_blc: 0 //    账户余额
      }, // 用户信息
      bankInfo: {}
    };
  }
  componentDidMount() {
    let _this = this;
    this.callService();
  }
  addBank() {
    // 跳转到添加银行卡界面
    Navigator.goAddr('#/add-bank');
  }
  bankInfo(value) {
    // 跳转到银行卡详细信息界面
    session.set('bankInfo', value);
    Navigator.goAddr('#/bank-info/');
  }
  moneyHide() {
    this.setState({ moneyHide: !this.state.moneyHide });
  }
  charge(item, e) {
    Navigator.goAddr(
      '#/recharge?cardid=' + item.p_id + '&bankid=' + item.bk_id
    );
    e.stopPropagation();
  }
  // 跳转‘交易明细’ 页面
  toTradeInfo() {
    Navigator.goAddr('#/trade-info');
  }
  // 跳转到‘我的红包’页面
  toRedPacket() {
    Navigator.goAddr('#/red-packet');
  }

  callService() {
    http
      .post('/member/index', {
        token: session.get('token')
      })
      .then(res => {
        this.setState({ userInfo: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });

    http
      .post('/bankcard/app/list', {
        token: session.get('token')
      })
      .then(res => {
        this.setState({ bankInfo: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  /**
   * 字段控制显示
   */
  showLabel(msg) {
    return msg || '--';
  }
  goTo() {
    location.href = '/sc.html';
  }

  render() {
    let { bankInfo, userInfo } = this.state;
    bankInfo = bankInfo || {};
    userInfo = userInfo || {};
    let bankCardListDatas = bankInfo.bankCardListDatas || [];

    let redouttime;
    if (userInfo.pst_d_ct) {
      redouttime = (
        <span className="redbao">{userInfo.pst_d_ct || 0}个红包即将过期</span>
      );
    }

    return (
      <div className="pt-header my-bank">
        {/* <PageHeader url="#/setting" accept={true} title="我的银行卡"></PageHeader> */}
        {/* <Header title="我的银行卡" back={this.goTo.bind(this)} /> */}
        <Header title="我的银行卡" />
        {/* 未登录显示登录模块 */}
        <section className="bank-header">
          {/* 余额和红包 */}
          <div className="balance clearfix">
            <div>
              <i
                className={ this.state.moneyHide ? 'eye-open' : 'eye-close' }
                onClick={ this.moneyHide.bind(this) }
              />
              <span className="font20" onClick={ this.toTradeInfo.bind(this) }>
                {this.state.moneyHide ? formatMoney(userInfo.u_wlt_blc) : '***'}
              </span>
              <span>{this.state.moneyHide ? '账户余额（元）' : '账户余额已隐藏'}</span>
            </div>
            <span className="border" />
            <div onClick={ this.toRedPacket.bind(this) }>
              <span className="font20">
                {this.state.moneyHide ? formatMoney(userInfo.u_pk_blc) : '***'}
              </span>
              <span>{this.state.moneyHide ? '红包余额（元）' : '红包余额已隐藏'}</span>
            </div>
            {redouttime}
          </div>
        </section>
        <div className="bank-section">
          {bankCardListDatas.map((item, index) => {
            let operate = <span />;
            item.bank_name = item.bk_nm;
            item.bank_type = item.bk_tp;
            item.open_bank = item.op_bk;
            item.bank_sts = item.sts;
            item.bank_number = item.cc;
            item.over_due = item.ov;

            if (item.bank_sts == 1 && item.bank_type != 2) {
              // 卡有效 信用卡 不能充值
              operate = (
                <span
                  className="small-btn-orange"
                  onClick={ this.charge.bind(this, item) }
                >
                  充值
                </span>
              );
            } else if (item.bank_sts == 2) {
              operate = <span className="small-btn-orange">开启快捷支付</span>;
            } else if (item.bank_sts == 3) {
              operate = (
                <div className="bank-operate">
                  <em>暂停使用</em>
                  <em>{item.up_tm}</em>
                </div>
              );
            } else if (item.bank_sts == 4) {
              operate = (
                <div>
                  <span className="small-btn-white">激活</span>
                </div>
              );
            }
            return (
              <div
                key={ index }
                className="bank-item"
                onClick={ this.bankInfo.bind(this, item) }
              >
                <img
                  className="bank-img"
                  src={ item.blg || require('../img/bank/cmb@2x.png') }
                  alt="银行"
                />
                <div className="bank-item-r">
                  <div className="bank-name">
                    <span
                      className={
                        item.bank_sts == 3 || item.bank_sts == 4
                          ? 'color999'
                          : ''
                      }
                    >
                      {item.bank_name}{' '}
                      {Reg.bankCardHide2(item.bank_number || '')}
                    </span>
                    {item.bank_type == 2 && item.over_due != 1 ? (
                      <em>此信用卡已过期</em>
                    ) : (
                      <em className="bankdes">
                        {item.bank_type == 1 ? '储蓄卡' : '信用卡'}{' '}
                        {item.open_bank ? '快捷' : ''}
                      </em>
                    )}
                  </div>
                  {operate}
                </div>
              </div>
            );
          })}
        </div>
        <div className="add-bank" onClick={ this.addBank.bind(this) }>
          <i className="icon-add" />
          <span>添加银行卡</span>
        </div>
        {/* 路由调整 */}
      </div>
    );
  }
}
