/**
 * Created by manaster
 * date 2017-03-10
 * desc:个人中心模块--添加银行卡子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import FootCopy from '../components/foot-copy';
import Reg from '@/utils/reg';
import session from '@/services/session';
import http from '@/utils/request';
import Navigator from '@/utils/navigator'; // 页面跳转
import Message from '@/services/message';
import Header from '@/component/header';
import cx from 'classnames';

import '../css/bank-info.scss';

export default class BankInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false,
      bankOtherInfo: {},
      kjzf: null
    };

    this.cBankInfo = {};
  }

  componentDidMount() {
    this.cBankInfo = session.get('bankInfo') || {};
    let { bankOtherInfo } = this.state;
    let item = this.cBankInfo;
    let self = this;
    // session.get('token')+'/'+item.bk_id+'/'+item.bk_tp
    http
      .post('/bankcard/getCardLimitDetail', {
        bankid: item.bk_id, // 	银行id
        banktype: item.bk_tp, // 银行卡类型
        token: session.get('token')
      })
      .then(res => {
        self.setState({ bankOtherInfo: res.data || {} });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  manage() {
    this.setState({
      coverShow: !this.state.coverShow
    });
  }

  // 删除卡片
  deleteCard() {
    // { params: { token: session.get('token'), id: this.cBankInfo.p_id } }
    http
      .post('/bankcard/delete', {
        id: this.cBankInfo.p_id,
        token: session.get('token')
      })
      .then(res => {
        Navigator.goback(Navigator.Pages.MyBank);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  // 关闭快捷支付
  // closeQuikPay(){
  //     let self = this;
  //     let status = 1;
  //     if(this.cBankInfo.op_bk){
  //         status = 0;
  //     }

  //     http.get('/bankCard/closeQuickPay/'+session.get('token')+"/"+this.cBankInfo.p_id+"/"+status, {params: {}}).then(res => {
  //         self.cBankInfo.op_bk = status;
  //         if(status){
  //             Message.toast("已开启快捷支付");
  //         }else{
  //             Message.toast("已关闭快捷支付");
  //         }
  //         self.setState({});
  //     }).catch(err => {
  //         Message.toast(err.message);
  //     });
  // }

  recharge() {
    Navigator.goAddr('#/recharge');
  }
  goTo() {
    location.href = '#/my-bank';
  }

  render() {
    let { coverShow, bankOtherInfo, kjzf } = this.state;
    let kjStatus;

    let bankNo = this.props.params.bankNo;

    return (
      <div className="pt-header bank-info">
        <Header title="银行卡详情">
          <div className="operation">
            <span onClick={ this.manage.bind(this) }>管理</span>
          </div>
        </Header>
        <section className="bank-section">
          <div className="bank-item">
            <img className="bank-img" src={ this.cBankInfo.blg }
              alt="银行" />
            <div className="bank-item-r" style={ { borderBottom: '0px' } }>
              <div className="bank-name">
                <span>
                  {this.cBankInfo.bk_nm}{' '}
                  {Reg.bankCardHide2(this.cBankInfo.cc || '')}
                </span>
                <em>
                  {this.cBankInfo.bk_tp == 1 ? '储蓄卡' : '信用卡'}{' '}
                  {this.cBankInfo.op_bk ? '快捷' : ''}
                </em>
              </div>
              <span
                className="small-btn-orange"
                onClick={ this.recharge.bind(this) }
              >
                充值
              </span>
            </div>
          </div>
        </section>
        <section className="sf-section">
          <div className="sf-item">
            <span>单笔限额(元)</span>
            <em>{bankOtherInfo.lt || '-'}</em>
          </div>
          <div className="sf-item">
            <span>每日限额(元)</span>
            <em>{bankOtherInfo.ld || '-'}</em>
          </div>
          <div className="sf-item">
            <span>每月限额(元)</span>
            <em>{bankOtherInfo.lm || '-'}</em>
          </div>
          <div className="sf-item">
            <span>备注</span>
            <em>{bankOtherInfo.rk || '-'}</em>
          </div>
        </section>
        <FootCopy />
        <section className={ cx('cover', coverShow ? ' ' : 'cxHide') }>
          <section className="cover-bottom">
            <ul>
              <li onClick={ this.recharge.bind(this) }>充值</li>
              <li onClick={ this.deleteCard.bind(this) }>删除</li>
              <li onClick={ this.manage.bind(this) }>取消</li>
              {/* <li onClick={this.closeQuikPay.bind(this)}>
                                {this.cBankInfo.op_bk?"关闭快捷支付": "打开快捷支付"}
                            </li>
                            <li onClick={this.manage.bind(this)}>我知道了</li> */}
            </ul>
          </section>
        </section>
        {/* 路由跳转 */}
      </div>
    );
  }
}
