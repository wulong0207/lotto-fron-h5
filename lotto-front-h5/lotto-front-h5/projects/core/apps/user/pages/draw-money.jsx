/**
 * Created by manaster
 * date 2017-03-16
 * desc:个人中心模块--提款子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Reg from '@/utils/reg';
import http from '@/utils/request';
import Navigator from '@/utils/navigator'; // 页面跳转
import BankCard from '@/img/cmb@2x.png';
import { formatMoney, browser, getParameter } from '@/utils/utils';
import session from '@/services/session';
import NewCard from '@/img/newcard_orange@2x.png';
import Message from '@/services/message';
import Interaction from '@/utils/interaction';
import IconCuowu from '@/img/cuowu@2x.png';
import Header from '@/component/header';
import '../css/draw-money.scss';
import cx from 'classnames';

export default class DrawMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false,
      bankList: [],
      info: {
        bankList: [],
        userWallet: {}
      },
      selectIndex: 0
    };
    this.param = null;
  }
  componentDidMount() {
    if (!browser.yicaiApp) {
      this.reqBankInfo();
    }
    // 确认提款 点击修改 返回 提款 默认把上次提款金额带过来 采用 URL带过来
    let takenAmount = getParameter('takenAmount');
    if (takenAmount) {
      this.refs.inputJE.value = takenAmount;
      this.refs.btnConfirm.className = 'btn-blue';
    }
  }

  reqBankInfo() {
    let self = this;
    http
      .get('/taken/takenReq', {
        params: {
          token: session.get('token')
        }
      })
      .then(res => {
        let resultData = res.data || {};
        let bankList = resultData.bankList || [];
        let currentResult = bankList;

        this.setState({ bankList: currentResult, info: resultData });
        this.setState({ selectIndex: 0 });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  chooseBank() {
    this.setState({ coverShow: !this.state.coverShow });
  }
  newBank() {
    if (browser.yicaiApp) {
      Interaction.goAddbankCard();
    } else {
      // 设置增加银行卡的键值，来自页面1：充值，2，提款
      // Navigator.goAddr('#/add-bank?from=1');
      Navigator.goAddr('#/add-bank?from=2');
    }
  }
  
  comfirm() {
    let { info } = this.state;
    let userWallet = (info || {}).userWallet || {};

    if (this.refs.inputZH.value.length == 0) {
      Message.toast('支行名称不能为空');
      return;
    }
    if (parseFloat(this.refs.inputJE.value) <= 1) {
      Message.toast('申请的提款金额不够扣除手续费');
      return;
    }
    if (this.refs.inputJE.value.length == 0) {
      Message.toast('提款金额不能为空');
      return;
    }

    let total = parseFloat(info.userWallet.totalAmount);
    if (isNaN(total)) {
      total = 0;
    }

    if (
      !info ||
      !info.userWallet ||
      !info.userWallet.totalAmount ||
      total <= 0
    ) {
      Message.toast('可提金额为0.00元');
      return;
    }

    let numin = parseFloat(this.refs.inputJE.value);

    if (numin > total) {
      Message.toast('提款金额不能大于账户余额' + formatMoney(total) + '元');
      return;
    }

    let { bankList, selectIndex } = this.state;
    let currentSelection = bankList[selectIndex] || {};

    session.set('drawMoney', {
      bankCardName: currentSelection.bk_nm,
      bankCardId: currentSelection.bankCardId,
      takenAmount: this.refs.inputJE.value,
      bankName: this.refs.inputZH.value,
      bankCardNum: currentSelection.bankCard
    });

    if (parseFloat(this.refs.inputJE.value) <= 10) {
      Message.alert({
        btnTxt: ['返回修改', '确认提款'], // 可不传，默认是确定
        btnFn: [
          () => {},
          () => {
            this.checkTakenAmount();
          }
        ],
        children: (
          <div className="message-alert">
            <div className="title">温馨提示</div>
            <div className="content">提款金额小于等于10元需收取1元手续费</div>
          </div>
        )
      });
    } else {
      this.checkTakenAmount();
    }
  }
  // 新添加校验接口
  checkTakenAmount() {
    let params = {
      token: session.get('token'),
      takenAmount: this.refs.inputJE.value
    };
    http
      .post('/taken/takenAmountCount', params)
      .then(res => {
        let resultData = res.data;
        if (resultData) {
          Message.alert({
            btnTxt: ['返回修改', '确认提款'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                if (browser.yicaiApp) {
                  location.href = './sctkqr.html';
                } else {
                  Navigator.goAddr('#/comfirm-draw-money');
                }
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">{resultData.confirmTips}</div>
              </div>
            )
          });
        } else {
          if (browser.yicaiApp) {
            location.href = './sctkqr.html';
          } else {
            Navigator.goAddr('#/comfirm-draw-money');
          }
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 已选择
  selectionChanged(item, index) {
    if (item.currentType != 4) {
      this.setState({
        selectIndex: index,
        coverShow: false
      });
    } else {
      if (browser.yicaiApp) {
        Interaction.goAddbankCard();
      } else {
        this.newBank();
      }
    }
  }
  /**
   * 生成选项
   */
  generateSlection() {
    let result = [];
    let { bankList, selectIndex, info } = this.state;
    let title, subtitle, src;
    let validCard = [],
      invalidCard = [];
    let bankType = ['', '储蓄卡', '信用卡'];

    for (let i = 0; i <= bankList.length; i++) {
      let item;
      if (i == bankList.length) {
        item = {
          title: '选择新卡',
          src: NewCard,
          currentType: 4
        };
      } else {
        item = bankList[i];
      }

      let validClass = '';
      let isValid = true;
      let selectedClass = '';
      if (selectIndex == i) {
        selectedClass = 'icon-bank-sup';
      }

      let selectionView;
      if (item.currentType != 4) {
        selectionView = <div className={ selectedClass } />;
      } else {
        selectionView = <i className="icon-arrow-r" />;
      }

      if (item.ov == 0) {
        // 针对信用卡有效期
        validClass = 'recharge-item-grey';
        selectionView = <div className="small-btn-white">激活</div>;
        isValid = false;
      }
      if (item.sts == 0) {
        validClass = 'recharge-item-grey';
        selectionView = [<span>暂停使用</span>, <span />];
        isValid = false;
      }

      if (!item.currentType || item.currentType == 3) {
        item.title = item.bankName + ' ' + item.bankCard;
        item.subtitle =
          (bankType[item.bankType] || '') + (item.openBank == 1 ? ' 快捷' : '');
        item.src = item.sLogo;
        item.currentType = 3;
        item.mainTitle = item.title;
      }

      let titleStyle;
      if (item.title.length > 16) {
        titleStyle = { fontSize: '13px' };
      }

      let resultItem = (
        <div
          key={ i }
          className={ 'recharge-item showflex ' + validClass }
          onClick={ this.selectionChanged.bind(this, item, i) }
        >
          <img className="bank-img" src={ item.src }
            alt={ item.title } />
          <div className="recharge-section-m flex">
            <span style={ titleStyle }>{item.title}</span>
            <div>{item.subtitle}</div>
          </div>
          <div className="recharge-section-r">{selectionView}</div>
        </div>
      );

      if (isValid) {
        validCard.push(resultItem);
      } else {
        invalidCard.push(resultItem);
      }
    }

    return validCard.concat(invalidCard);
  }
  textChange() {
    let reg = /[0-9]+/;
    if (!reg.test(this.refs.inputJE.value)) {
      Message.toast('提款金额输入格式必须是数字');
    }
    if (
      this.refs.inputJE.value.length > 0 &&
      (this.refs.inputJE.value.indexOf('.') !=
        this.refs.inputJE.value.length - 1 ||
        this.refs.inputJE.value.indexOf('.') == 0) &&
      !Reg.checkFloat(this.refs.inputJE.value)
    ) {
      this.refs.inputJE.value = this.refs.inputJE.value.substring(
        0,
        this.refs.inputJE.value.length - 1
      );
    }
    if (this.refs.inputJE.value.length > 0) {
      this.refs.btnConfirm.className = 'btn-blue';
    } else {
      this.refs.btnConfirm.className = 'btn-grey';
    }
  }
  nameChange() {
    this.refs.inputZH.value = this.refs.inputZH.value;
  }
  goTo() {
    if (window.location.href.indexOf('tc') > -1) {
      window.location = '/sc.html#/';
    } else {
      window.history.back();
    }
  }

  render() {
    let { coverShow, bankList, selectIndex, info } = this.state;
    let currentSelection = bankList[selectIndex];
    if (currentSelection) {
      if (currentSelection.bankName != currentSelection.branchBankName) {
        this.refs.inputZH.value = currentSelection.branchBankName;
      } else {
        this.refs.inputZH.value = currentSelection.bankName;
      }
    }

    if (bankList.length == 0 && !currentSelection) {
      currentSelection = {
        subtitle: '暂未设置银行卡,请点击添加',
        src: IconCuowu
      };
    }
    let userWallet = (info || {}).userWallet || {};

    let headStyle = { paddingTop: '10px' };
    if (!browser.yicaiApp) {
      headStyle = {};
    }
    return (
      <div className="pt-header draw-money" style={ headStyle }>
        {/* <Header title="提款申请" back={this.goTo.bind(this)} /> */}
        <Header title="提款申请" back={ this.goTo.bind(this) }>
          <span className="header-detail">
            <Link to="/draw-list">明细</Link>
          </span>
        </Header>
        <div className="bank-section">
          <div className="bank-item" onClick={ this.chooseBank.bind(this) }>
            <img className="bank-img" src={ currentSelection.src } />
            <div className="bank-item-r" style={ { borderBottom: '0px' } }>
              <div className="bank-name">
                <span>
                  {currentSelection.mainTitle || currentSelection.title}
                </span>
                <em>{currentSelection.subtitle}</em>
              </div>
              <i className="icon-arrow-r" />
            </div>
          </div>
        </div>
        <section className="sf-section">
          <div className="sf-item">
            <span>支行名称</span>
            <input
              onChange={ this.nameChange.bind(this) }
              ref="inputZH"
              placeholder="支行名称不能为空"
              type="text"
            />
            <i
              className="icon-delete"
              onClick={ () => {
                this.refs.inputZH.value = '';
              } }
            />
          </div>
          <div className="sf-item">
            <span>提款金额</span>
            <input
              onChange={ this.textChange.bind(this) }
              ref="inputJE"
              placeholder="请输入提款金额"
              type="number"
            />
            <i
              className="icon-delete"
              onClick={ () => {
                this.refs.inputJE.value = '';
              } }
            />
          </div>
        </section>
        <div
          className={ cx(
            'money-p',
            this.state.bankList.length > 0 ? '' : 'hide'
          ) }
        >
          <div className="flex orange">
            可提金额：{formatMoney(userWallet.totalCashBalance)}元
          </div>
          <div className="flex">
            中奖金额：{formatMoney(userWallet.winningBalance)}元
          </div>
        </div>
        <p
          className={ cx(
            'money-p',
            this.state.bankList.length > 0 ? '' : 'hide'
          ) }
        >
          <span>
            充值金额：{formatMoney(
              userWallet.top20Balance + userWallet.top80Balance
            )}元
          </span>
        </p>
        <button
          ref="btnConfirm"
          className="btn-grey"
          onClick={ this.comfirm.bind(this) }
        >
          下一步
        </button>
        <p className="p-desc">
          1. 为了保障您的资金安全，您的提款申请成功并经核对无误后，将通过
          人工处理到第三方支付平台再汇到您的账户。
        </p>
        <p className="p-desc">
          2. 处理时间:17点前的提款申请，当日内处理；17点后的提款申请，次日
          处理。节假日到账时间顺延。
        </p>
        <p className="p-desc">
          3.
          为了防止少数用户利用信用卡套现和洗钱的行为，保护正常用户的资金安全，所有充值金额未达最低消费的申请将原路返还，
          预计15个工作日内到账，并收取充值金额5%的手续费。
        </p>
        {/* 弹窗样式 */}
        <section className={ cx('cover', coverShow ? '' : 'cxHide') }>
          <section className="cover-bottom">
            <section className="pl10-section">
              <i
                className="icon-shutdown bank-shutdown"
                onClick={ this.chooseBank.bind(this) }
              />
              <div className="bank-list-area">{this.generateSlection()}</div>
            </section>
          </section>
        </section>
        {/* 路由调整 */}
        <Link to="/draw-money-branch" ref="draw-money-branch" />
        <Link to="/comfirm-draw-money" ref="comfirm-draw-money" />
      </div>
    );
  }
}
