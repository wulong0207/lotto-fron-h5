/**
 * Created by manaster
 * date 2017-03-16
 * desc:个人中心模块--账户充值子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import http from '@/utils/request';
import { getParameter, browser, formatMoney } from '@/utils/utils';
import session from '@/services/session';
import ZhiFuBao from '@/img/blue_zhifubao@2x.png';
import Wechat from '@/img/green_weixin@2x.png';
import NewCard from '@/img/newcard_orange@2x.png';
import BankCard from '@/img/cmb@2x.png';
import Reg from '@/utils/reg';
import Navigator from '@/utils/navigator'; // 页面跳转
import Message from '@/services/message';
import Interaction from '@/utils/interaction';
import QRCode from 'qrcode';
import IconCuowu from '@/img/cuowu@2x.png';
import Header from '@/component/header';
import cx from 'classnames';

import '../css/recharge.scss';

class RechargeRedpacket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isshow: false,
      index: null,
      unuser: false
    };
  }
  toggle() {
    let { isshow } = this.state;
    this.setState({ isshow: !isshow });
  }

  selectPacket(i, m) {
    let { isshow, index, unuser } = this.state;
    this.setState({
      isshow: !isshow,
      index: i,
      unuser: false
    });
    this.props.changeRedCode(i, m.r_c, m.m_s_a);
  }
  unUsePacket() {
    let { isshow, index, unuser } = this.state;
    let length = this.props.redPackets.length + 1;
    this.setState({
      isshow: !isshow,
      index: length,
      unuser: !unuser
    });
    this.props.changeRedCode(length, '');
  }

  render() {
    let { isshow, index, unuser } = this.state;
    let { redPackets, handleReChargePacket } = this.props;
    let name = redPackets[index] || {};
    return (
      <div className="recharge-packet">
        <div className="title" onClick={ this.toggle.bind(this) }>
          <span>
            {name.r_n ? (
              <span>
                红包 <b>{name.r_n}</b>
              </span>
            ) : (
              <span>
                优惠券<b className="blue">{redPackets.length}张可用</b>
              </span>
            )}
          </span>
          <span>
            <b>{name.r_v ? <em>¥{name.r_v}</em> : '未选择'}</b>
            <i className={ cx('triangle', isshow ? '' : 'rotate') } />
          </span>
        </div>
        <div className={ cx('drop-menu', isshow ? '' : 'hide') }>
          <div className="nouse" onClick={ this.unUsePacket.bind(this) }>
            <span className="grey">不使用红包</span>
            {unuser ? <img src={ require('../img/bank/banksup@2x.png') } /> : ''}
          </div>
          {redPackets.map((m, i) => {
            let classname = ''; // 默认最大红包
            return (
              <div key={ i } onClick={ this.selectPacket.bind(this, i, m) }>
                <span>{m.r_n}</span>
                <span>
                  <b>&yen; {m.r_v}</b>
                  {index == i ? (
                    <img src={ require('../img/bank/banksup@2x.png') } />
                  ) : (
                    ''
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false,
      // 1 支付宝 2微信 3银行卡 4添加银行卡
      bankList: [],
      selectIndex: 0,
      redPackets: [],
      src: '',
      min: 0, // 活动 最小充值金额
      redIndex: null,
      redCode: '', // 充值 红包code,
      muchMoney: 0, // 享受红包必须满足的金额
      value: 0 // 享受活动立即充满
    };
    this.param = null;
    this.useChosen = false;
  }

  componentDidMount() {
    if (!browser.yicaiApp) {
      this.reqBankInfo();
    }
    let minMoney = getParameter().minMoney;
    if (minMoney) {
      this.refs.inputJE.value = minMoney;
      this.refs.btnConfirm.className = 'btn-blue';
    }
    this.param = this.getParams();
    this.reqRed(); // 充值红包接口
  }
  // 检查信用卡是否已过期
  checkOutDate() {}

  changeRedCode(index, redcode, value) {
    console.log(redcode, 'redcode');
    let { redCode, redIndex, muchMoney } = this.state;
    if (redCode == '') {
      muchMoney = 0;
    }
    this.setState({
      redIndex: index,
      redCode: redcode,
      muchMoney,
      value
    });
  }

  // 获取链接地址中的参数
  getParams() {
    let result;
    let param = getParameter();
    if (param.cardid != null && param.bankid != null) {
      result = {
        cardid: param.cardid,
        bankid: param.bankid
      };
    }
    return result;
  }

  /**
     * 生成选项
     */
  generateSlection() {
    let result = [];
    let { bankList, selectIndex } = this.state;
    bankList = bankList || [];
    // 如果是信用卡 就不显示在充值卡 列表里面
    bankList = bankList.filter((val, index, arr) => {
      // return val.b_t != 2 && (val.b_t ==3 && val.flag == 0) ;
      return val.b_t != 2;
    });
    let title, subtitle, src;
    let validCard = [],
      invalidCard = [];
    let bankType = ['', '储蓄卡', '信用卡', ''];
    let founded = false;

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
      if (this.useChosen) {
        if (selectIndex == i) {
          selectedClass = 'icon-bank-sup';
          founded = true;
        }
      } else {
        if (this.param && bankList.length != 0) {
          if (
            this.param.cardid == item.b_c_i &&
            this.param.bankid == item.b_i
          ) {
            this.state.selectIndex = i;
            selectedClass = 'icon-bank-sup';
            this.useChosen = true;
            this.setState({ selectIndex: i });
            founded = true;
          }
        } else if (selectIndex == i) {
          selectedClass = 'icon-bank-sup';
          founded = true;
        }
      }

      let selectionView;
      if (item.currentType != 4) {
        selectionView = <div className={ selectedClass } />;
      } else {
        selectionView = <i className="icon-arrow-r" />;
      }
      if (item.flag == 0) {
        // 0 暂停使用
        validClass = 'recharge-item-grey';
        selectionView = (
          <div>
            <span>暂停使用</span>,
            <span>{item.r_s}</span>
          </div>
        );
        isValid = false;
      } else if (item.flag == 2) {
        // 针对信用卡有效期
        validClass = 'recharge-item-grey';
        selectionView = (
          <i
            onClick={ this.activeBank.bind(this, item) }
            className="small-btn-white"
          >
            激活
          </i>
        );
        isValid = false;
      }

      if (!item.currentType || item.currentType == 3) {
        item.title = item.b_n + ' ' + (item.c_c || '');
        item.subtitle =
          (bankType[item.b_t] || '') + ' ' + (item.o_b == 1 ? '快捷' : '');
        if (item.b_n.indexOf('微信') >= 0) {
          item.src = item.b_lg || Wechat;
        } else if (item.b_n.indexOf('支付宝') >= 0) {
          item.src = item.b_lg || ZhiFuBao;
        } else {
          item.src = item.b_lg || BankCard;
        }

        item.currentType = 3;
        // item.mainTitle = item.bk_nm + " " +Reg.bankCardHide(item.cc);
      }

      let titleStyle;
      if (item.title.length > 16) {
        titleStyle = { fontSize: '13px' };
      }

      let resultItem = (
        <div
          key={ i + 1 }
          className={ 'recharge-item showflex ' + validClass }
          onClick={ this.selectionChanged.bind(this, item, i) }
        >
          <img className="bank-img" src={ item.src }
            alt={ item.title } />
          <div className="recharge-section-m flex">
            <span style={ titleStyle }>{item.title}</span>
            <div>{item.subtitle}</div>
          </div>
          <div className="recharge-section-r">
            {selectionView}
          </div>
        </div>
      );

      if (isValid) {
        validCard.push(resultItem);
      } else {
        invalidCard.push(resultItem);
      }
    }

    if (bankList.length > 1 && !founded) {
      this.setState({ selectIndex: 0 });
      this.useChosen = true;
    }

    return validCard.concat(invalidCard);
  }
  chooseBank() {
    this.setState({ coverShow: !this.state.coverShow });
  }
  // 已选择
  selectionChanged(item, index) {
    if(item.flag === 0) { // 暂停使用
      return '';
    }
    this.useChosen = true;
    if (item.currentType != 4) {
      this.setState({
        selectIndex: index,
        coverShow: false
      });
    } else {
      if (browser.yicaiApp) {
        Interaction.goAddbankCard();
      } else {
        // 设置增加银行卡的键值，来自页面1：充值，2，提款
        // Navigator.goAddr('#/add-bank?from=1');
        window.location.href =
          '/sc.html#/add-bank?from=1';
      }
    }
  }

  // 获取优惠红包
  reqRed() {
    http
      .post('/rechargeCenter/findRechargeRed', {
        token: session.get('token')
        // rechargeAmount: "100"
      })
      .then(res => {
        // 红包排序 由大到小
        let data = res.data;
        let redPackets = [];
        if (data.cl) {
          redPackets = data.cl.sort(function(a, b) {
            if (a.r_t > b.r_t) {
              return 1;
            }
            if (a.r_t < b.r_t) {
              return -1;
            }
            return 0;
          });
        }
        this.setState({ redPackets });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 提交充值 需求变成 校验一次是否享用充值红包
  submit() {
    let { redCode, muchMoney, value } = this.state;
    if (redCode == '') {
      this.submitRecharge();
    } else {
      if (muchMoney > 0) {
        Message.confirm({
          msg: '温馨提示',
          btnTxt: ['不使用优惠券', '立即充值'],
          btnFn: [
            () => {
              this.state.redCode = ' ';
              this.submitRecharge();
              this.setState({});
            },
            () => {
              this.refs.inputJE.value = value;
              this.state.redCode = redCode;
              this.state.muchMoney = 0;
              this.setState({});
            }
          ],
          children: (
            <p className="msg1">
              <em>此优惠劵还差 {this.state.muchMoney.toFixed(2)} 可用。</em>
            </p>
          )
        });
      } else {
        this.state.redCode = redCode;
        this.submitRecharge();
        this.setState({});
      }
    }
  }
  submitRecharge() {
    let self = this;
    if (this.refs.inputJE.value.length == 0) {
      Message.toast('请输入充值金额');
      return;
    }
    let { bankList, selectIndex, redCode, redPackets, redIndex } = this.state;
    let currentSelection = bankList[selectIndex] || {};

    if (
      parseFloat(this.refs.inputJE.value) > parseFloat(currentSelection.t_l)
    ) {
      Message.toast('充值金额超过单笔最大金额');
      return;
    }
    let returnUrl = location.origin + '/sc.html#/recharge-result';
    // let returnUrl = location.origin + '/static/pay/index.html';
    if (browser.yicaiApp) {
      returnUrl = location.origin + '/czjg.html';
    }
    // 活动的传参
    // this.refs.inputJE.value <20 最少20块
    let activityCode = getParameter().activityCode;

    // // 首次充值享受20 得80红包 最小充值20
    let params = {
      token: session.get('token'),
      bankCardId: currentSelection.b_c_i || '',
      bankId: currentSelection.b_i,
      rechargeAmount: this.refs.inputJE.value,
      redCode: redCode,
      returnUrl: returnUrl,
      clientType: 2
    };
    if (activityCode) {
      params.hdCode = activityCode;
    }
    http
      .post('/rechargeCenter/recharge', params)
      .then(res => {
        let data = res.data || {};
        if (data.type == 1) {
          // 1 form表单内容
          let node = document.createElement('div');
          node.style.display = 'none';
          node.innerHTML = data.formLink;
          document.body.appendChild(node);

          // 连连支付
          document.forms[0].submit();

          // if(res.data.channel == '10') { // 支付宝
          //     document.forms.punchout_form.submit();
          // }
          // if(res.data.channel == '11') { // 微信
          //     document.forms.divineForm.submit();
          // }
          // if(res.data.channel == '13') { // 充值卡
          //     document.forms.paySubmit.submit();
          // }
        } else if (data.type == 2) {
          // 2二维码链接
          QRCode.toDataURL(data.formLink, function(err, url) {
            self.setState({ src: url });
          });
        } else if (data.type == 4) {
          location.href = data.formLink;
        } else {
          // 3不需要调用第三方支付（用的余额或者彩金支付）
          Message.alert({
            title: '充值成功',
            btnTxt: ['确定'], // 可不传，默认是确定
            btnFn: [
              () => {
                if (browser.yicaiApp) {
                  Interaction.goCenter();
                } else {
                  Navigator.goback();
                }
              }
            ]
          });
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  reqBankInfo() {
    let self = this;

    http
      .get('/rechargeCenter/toRecharge', {
        params: {
          token: session.get('token'),
          clientType: 2
        }
      })
      .then(res => {
        let resultData = res.data || {};
        let bankList = resultData.ptl || [];
        let currentResult = bankList;

        this.setState({ bankList: currentResult });
        if (bankList.length > 0) {
          if (!self.getParams()) {
            this.setState({ selectIndex: 0 });
          }
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  // 激活银行卡
  activeBank(item) {
    http
      .post('/rechargeCenter/recharge', {
        token: session.get('token'),
        id: item.b_c_i || '',
        overdue: item.o_d,
        clientType: 2
      })
      .then(res => {
        Message.toast('激活成功');
        this.reqBankInfo();
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  textChange(e) {
    let { redPackets, redIndex, muchMoney } = this.state;
    if(isNaN(e.target.value.trim())) {
        this.refs.inputJE.value = '';
        return ;
    }
    if (this.refs.inputJE.value.length > 0) {
      this.refs.btnConfirm.className = 'btn-blue';
    } else {
      this.refs.btnConfirm.className = 'btn-grey';
    }
    let num = parseFloat(this.refs.inputJE.value);
    // if(isNaN(num)){
    //     this.refs.inputJE.value = "";
    // }else{
    //     if(!(/^[0-9]*$/.test(this.refs.inputJE.value) ||
    //          /^\d+(\.\d+)?$/.test(this.refs.inputJE.value+"0") ||
    //          /^\d+(\.\d+)?$/.test(this.refs.inputJE.value))){
    //              console.log(num,"num")
    //         this.refs.inputJE.value = num + "";

    //     }
    // }
    let redMoney = redPackets[redIndex] || {};
    if (redMoney.r_t) {
      muchMoney = redPackets[redIndex].m_s_a - num;
      this.setState({ muchMoney });
    }
  }

  handleReChargePacket() {}

  goTo() {
    location.href = '/sc.html';
  }

  render() {
    let { coverShow, bankList, selectIndex, redPackets } = this.state;
    let defaultBank;
    let currentSelection = bankList[selectIndex];

    if (bankList.length == 0 && !currentSelection) {
      currentSelection = {
        subtitle: '暂未设置银行卡,请点击添加',
        src: IconCuowu
      };
    }

    let headStyle = { paddingTop: '10px' };
    if (!browser.yicaiApp) {
      headStyle = {};
    }

    let qrcodeView;
    if (this.state.src) {
      qrcodeView = (
        <div className="scan-qrcode">
          <div>扫描二维码支付</div>
          <img src={ this.state.src } />
        </div>
      );
    }

    return (
      <div className="pt-header recharge" style={ headStyle }>
        {/* <Header title="账户充值" back={this.goTo.bind(this)}/> */}
        <Header title="账户充值" />
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
        <p className="section-title">
          该充值方式单天单笔最多可充值{currentSelection.t_l || '-'}元
        </p>
        <div>
          {redPackets.length > 0 ? (
            <RechargeRedpacket
              redPackets={ redPackets }
              changeRedCode={ this.changeRedCode.bind(this) }
            />
          ) : (
            ''
          )}
        </div>

        <section className="sf-section">
          <div className="sf-item">
            <span>金额</span>
            <input
              onChange={ this.textChange.bind(this) }
              ref="inputJE"
              placeholder="请输入充值金额"
              type="tel"
            />
            <i
              onClick={ (() => {
                this.refs.inputJE.value = '';
              }) }
              className="icon-delete"
            />
          </div>
        </section>
        <button
          ref="btnConfirm"
          className="btn-grey"
          onClick={ this.submit.bind(this) }
        >
          确认
        </button>
        {/* 弹窗样式 */}
        <section className="cover" style={ { display: coverShow ? '' : 'none' } }>
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
        <div ref="result" style={ { display: '' } } />
        {qrcodeView}
      </div>
    );
  }
}
