/**
 * Created by manaster
 * date 2017-03-16
 * desc:个人中心模块--确认提款信息子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Circle from '@/component/circle';
import http from '@/utils/request';
import { formatMoney, browser } from '@/utils/utils';
import session from '@/services/session';
import Message from '@/services/message';
import Navigator from '@/utils/navigator'; // 页面跳转
import Reg from '@/utils/reg';
import Interaction from '@/utils/interaction';
import Header from '@/component/header';
import '../css/comfirm-draw-money.scss';
import cx from 'classnames';

export default class ComfirmDrawMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false,
      amoutData: {},
      active: false,
      takenAfterBalance: 0,
      deal: 0, // 笔数
      serverFee: 0
    };
  }
  componentDidMount() {
    this.reqBankInfo();
  }
  modify() {
    let item = session.get('drawMoney');
    Navigator.goAddr('/draw-money?takenAmount=' + item.takenAmount);
  }
  comfirmOK() {
    let { active } = this.state;
    if (active) {
      this.submitDraw();
    }
  }
  reqBankInfo() {
    let self = this;
    let item = session.get('drawMoney');
    let { deal, serverFee } = this.state;
    http
      .post('/taken/takenAmountReq', {
        token: session.get('token'),
        bankCardId: item.bankCardId,
        takenAmount: item.takenAmount,
        bankName: item.bankName
      })
      .then(res => {
        self.setState({ amoutData: res.data || {} });
        let amountData = res.data;
        let list = amountData.list || [];
        let takenAfterBalance = amountData.takenUserWallet.takenAfterBalance;
        if (list) {
          if (list.length == 1) {
            let active = true;
            if (list[0].status == 3) {
              active = false;
            }
            this.setState({
              active: active
            });
            return;
          }
          deal = list.length;
          for (var i = 0; i < list.length; i++) {
            serverFee += parseFloat(list[i].serviceFee);
          }
          this.setState({
            deal: deal,
            serverFee: serverFee,
            takenAfterBalance: takenAfterBalance
          });
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  // 暂不提款
  stopDrawThis(item) {
    let { amoutData, takenAfterBalance, deal } = this.state;
    let serverFee = parseFloat(this.state.serverFee);
    let list = amoutData.list || [];

    // 提款后余额
    if (!item.active) {
      item.active = true;
      this.refs.btnVal.innerText = '继续提款';
      takenAfterBalance += parseFloat(item.takenAmount.replace(',', ''));
      deal -= 1;
      serverFee -= parseFloat(item.serviceFee);
    } else {
      item.active = false;
      this.refs.btnVal.innerText = '暂不提款';
      takenAfterBalance -= parseFloat(item.takenAmount.replace(',', ''));
      deal += 1;
      serverFee += parseFloat(item.serviceFee);
    }
    this.refs.takenAfterBalance.innerText = takenAfterBalance;
    item.stopDrawThis = true;
    this.setState({
      takenAfterBalance: takenAfterBalance,
      deal: deal,
      serverFee: serverFee
    });
  }

  // 提交提款需求
  submitDraw() {
    let takenIds = '';
    let { amoutData } = this.state;
    let list = amoutData.list || [];
    let self = this;
    let drawMoneyitem = session.get('drawMoney');

    for (var i = 0; i < list.length; i++) {
      let item = list[i];
      if (!item.stopDrawThis && item.status != 3) {
        takenIds += item.takenId + ',';
      }
    }

    takenIds = takenIds.substr(0, takenIds.length - 1);

    http
      .post('/taken/takenConfirm', {
        token: session.get('token'),
        bankCardId: drawMoneyitem.bankCardId,
        takenAmount: drawMoneyitem.takenAmount,
        takenIds: takenIds
      })
      .then(res => {
        session.set('totalBalance', (res.data || {}).totalBalance);
        if (browser.yicaiApp) {
          window.location.href = './sctkqrok.html';
        } else {
          Navigator.goAddr('#/comfirm-draw-money-ok?tc');
        }
      })
      .catch(err => {
        Message.toast(err.message);

        // Message.toast("当前提款暂不可提");
      });
  }
  // "2017-04-14 09:50:59充值1.00元，只消费了0元，不足20%(差1元)" 分成三部分
  handleDivLine(string) {
    let arr = [];
    arr[0] = string.split('充值')[0];
    arr[1] = string.substring(string.indexOf('充值'), string.indexOf('未达'));
    arr[2] = string.slice(string.indexOf('未达'));
    return (
      <div className="recharge-detail">
        <span>{arr[0]}</span>
        <span>{arr[1]}</span>
        <span>{arr[2]}</span>
      </div>
    );
  }

  getDetailView() {
    let { amoutData } = this.state;
    let list = amoutData.list || [];
    let result = [];

    for (var i = 0; i < list.length; i++) {
      let item = list[i];
      session.set('takenAmount', item.takenAmount);
      // status  1正常提款 2原路返回、3异常提款（不能提款）
      if (item.status == 1) {
        // 正常
        result.push(
          <section key={ i } className="sf-section">
            <div className="sf-item">
              <span>
                {item.title}
                <i className="green-i">{item.serviceFeeTips}</i>
              </span>
            </div>
            <div className="dm-item">
              <span>提款金额</span>
              <em>{item.takenAmount}元</em>
            </div>
            <div className="dm-item">
              <span>到账银行</span>
              <em>
                {item.bankName} {/* (尾号{item.bankId}) */}
              </em>
            </div>
            <div className="dm-item">
              <span>到账时间</span>
              <em>{item.arrivalTime}</em>
            </div>
          </section>
        );
      } else if (item.status == 2) {
        // 原路返回
        result.push(
          <div
            key={ i }
            className={ cx(
              'bank-section err-color',
              item.active ? 'err-draw' : ''
            ) }
          >
            <div className="sf-item">
              <span className="orange">{item.title}</span>
            </div>
            <div className="err-detail">
              <div className="dm-item">
                <span>提款金额</span>
                <em>{item.takenAmount}元</em>
              </div>
              <div className="dm-item">
                <span className="red">手续费</span>
                <em className="red">{item.serviceFee}元</em>
              </div>
              <div className="dm-item">
                <span className="red">实际到账金额</span>
                <em className="red">
                  {formatMoney(
                    parseFloat(item.takenAmount.replace(',', '')) -
                      parseFloat(item.serviceFee.replace(',', ''))
                  )}元
                </em>
              </div>
              {/* <div className="dm-item" style={{position: "relative"}}>
                            <span className="red">原路返还手续费</span>
                                                        <em className="red">1,120.00元</em>
                            <span className="red">{item.serviceFeeTips}</span>
                            <i className="no-draw" onClick={this.stopDrawThis.bind(this, item)} style={{top: "0"}}>暂不提款</i>
                        </div> */}
              <div className="err-info">
                <div>{this.handleDivLine(item.exceptionTips)}</div>
                <i
                  ref="btnVal"
                  className="no-draw"
                  onClick={ this.stopDrawThis.bind(this, item) }
                >
                  暂不提款
                </i>
              </div>
              <div className="explain">{item.exceptionRemark}</div>
              <div className="dm-item">
                <span>到账银行</span>
                <em>
                  {item.bankName} {/* (尾号{item.bankId}) */}
                </em>
              </div>
              <div className="dm-item">
                <span>到账时间</span>
                <em>{item.arrivalTime}</em>
              </div>
            </div>
          </div>
        );
      } else if (item.status == 3) {
        // 异常申请
        result.push(
          <div key={ i } className="bank-section err-color err-draw">
            <div className="sf-item">
              <span className="title">{item.title}</span>
              <span className="red">不可提款：余额不足以扣手续费</span>
            </div>
            <div className="err-detail">
              <div className="dm-item">
                <span>提款金额</span>
                <em>{item.takenAmount}元</em>
              </div>
              <div className="dm-item">
                <span>手续费</span>
                <em>{formatMoney(item.serviceFee)}元</em>
              </div>
              <div className="err-info">
                <div>{this.handleDivLine(item.exceptionTips)}</div>
              </div>
              <div className="explain">{item.exceptionRemark}</div>
            </div>
          </div>
        );
      }
    }

    return result;
  }
  handleChecked() {
    let { active } = this.state;
    this.setState({
      active: !active
    });
  }

  render() {
    let { coverShow, amoutData, active, deal, serverFee } = this.state;
    let takenUserWallet = amoutData.takenUserWallet || {};
    let list = amoutData.list || [];
    let item = session.get('drawMoney');
    let all =
      takenUserWallet.winningBalance +
        takenUserWallet.top20Balance +
        takenUserWallet.top80Balance +
        takenUserWallet.top20Balance || 1;
    let angleOne = takenUserWallet.winningBalance / all;
    let angleTwo =
      (takenUserWallet.top20Balance + takenUserWallet.top80Balance) / all;
    let angleThree = takenUserWallet.top20Balance / all;

    let ok;
    if (isNaN(angleOne)) {
      angleOne = 0;
    } else {
      ok = true;
    }
    if (isNaN(angleTwo)) {
      angleTwo = 0;
    }
    if (isNaN(angleThree)) {
      angleThree = 0;
    }

    let circle;
    if (ok) {
      circle = (
        <Circle
          width={ 300 }
          height={ 300 }
          colorOne="#fe7a0d"
          colorTwo="#22c354"
          colorThree="#3da2e9"
          angleOne={ angleOne }
          angleTwo={ angleTwo }
          angleThree={ angleThree }
        />
      );
    }

    let headStyle = { paddingTop: '10px' };
    if (!browser.yicaiApp) {
      headStyle = {};
    }
    return (
      <div className="pt-header comfirm-draw-money" style={ headStyle }>
        <Header title="确认提款信息">
          <div className="operation">
            <span onClick={ this.modify.bind(this) }>修改</span>
          </div>
        </Header>
        <div className="sf-section">
          <div className="sf-item">
            <span className="orange">账户总余额</span>
            <em className="orange f16">
              {formatMoney(takenUserWallet.totalAmount)}元
            </em>
          </div>
          <div className="pan-section">
            <div className="pan">
              <div className="pan-circle">{circle}</div>
            </div>
            <div className="pan-r">
              <div className="pan-r-item">
                <i className="square-orange" />
                <span>
                  <em>中奖金额</em>
                </span>
                <em>{formatMoney(takenUserWallet.winningBalance)}元</em>
              </div>
              <div className="pan-r-item">
                <i className="square-green" />
                <span>
                  <em>充值金额</em>
                </span>
                <em>
                  {formatMoney(
                    takenUserWallet.top80Balance + takenUserWallet.top20Balance
                  )}元
                </em>
              </div>
              <div className="pan-r-item">
                <i className="square-blue" />
                <span>
                  <em>充值未消费</em>
                  <em>(20%余额)</em>
                </span>
                <em>{formatMoney(takenUserWallet.top20Balance)}元</em>
              </div>
            </div>
          </div>
        </div>
        {this.getDetailView()}
        <section className="sf-section">
          <div className="sf-item">
            <span className="c666">提款后余额</span>
            <em className="f16c333" ref="takenAfterBalance">
              {formatMoney(takenUserWallet.takenAfterBalance)}元
            </em>
          </div>
        </section>
        <p className="dm-desc">
          提款免手续费,你提款所产生的银行手续费由2N彩票为您承担。（异常提款除外)
        </p>
        <button
          className={ cx('dm-comfirm-btn', active ? 'btn-blue' : 'btn-grey') }
          onClick={ this.comfirmOK.bind(this) }
        >
          确认
        </button>
        <p className={ cx('dm-desc', list.length > 1 ? '' : 'hide') }>
          <input
            type="checkbox"
            checked={ active }
            onChange={ this.handleChecked.bind(this) }
          />
          本次提款分{deal}笔到，手续费{formatMoney(serverFee)}元，如没有问题确认提交申请
        </p>
        <br />
        <br />
        {/* 路由调整 */}
      </div>
    );
  }
}
