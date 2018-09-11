/*
 * @Author: yubei
 * @Date: 2017-12-16 17:27:05
 * Desc: 安全支付
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import http from '@/utils/request';
import auth from '@/utils/auth';
import { isEmpty } from 'lodash';
import { getParameter, browser } from '@/utils/utils';
import deepAssign from '@/utils/deep-assign';
import session from '@/services/session';

import Message from '@/services/message';
import Header from '@/component/header';
import Countdown from './components/countdown';
import Paylist from './components/pay-info';
import RedPackage from './components/red-package';
import PayWay from './components/pay-way';
import PayBtn from './components/pay-btn';
import lotteryCode from '@/utils/lottery-code';

import Interaction from '@/utils/interaction';
import analytics from '@/services/analytics';

import './css/pay.scss';

export default class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      pay: {
        payState: false // 支付按钮状态
      }
    };
  }

  // ready
  componentWillMount() {
    if (!browser.yicaiApp) {
      // 非APP，直接请求支付信息。
      this.queryPayInfo();
    }
  }

  componentDidMount() {
    analytics.send(209);
  }

  // 获取支付信息
  queryPayInfo() {
    // 获取url参数
    const token = auth.getToken() || '';
    const orderCode = getParameter('orderCode') || '';
    const buyType = getParameter('buyType') || '';

    if (!orderCode) {
      Message.alert({ title: '对不起，订单号不能为空！' });
      return;
    }

    if (!token) {
      if (browser.yicaiApp) {
        Interaction.sendInteraction('toLogin', []);
      } else {
        // location.href = `/login/login.html?next=${encodeURIComponent(location.href)}`;
        location.href = `/account.html#/login?next=${encodeURIComponent(
          location.href
        )}`;
      }
      // Message.alert({ title: '对不起，token不能为空！' });
      return;
    }

    const params = {
      orderCode,
      buyType,
      token,
      clientType: 2
      // 'returnUrl': location.origin + '/payresult.html?orderCode=' + orderCode + '&buyType='+ buyType
    };

    // 判断是不是批量支付
    if (orderCode.indexOf(',') >= 0) {
      if (!buyType) {
        Message.toast('批量支付时购买类型不能为空');
        return;
      }
      http
        .post('/payCenter/toBatchPay', params)
        .then(res => {
          this.setDate(res, params);
        })
        .catch(err => {
          this.catch(err);
        });
    } else {
      http
        .get('/payCenter/toPay', { params })
        .then(res => {
          this.setDate(res, params);
        })
        .catch(err => {
          this.catch(err);
        });
    }
  }

  setDate(res, params) {
    this.initData(Object.assign({}, { data: res.data }, { pay: params }));
  }

  catch(err) {
    Message.toast(err.message);
  }

  // 初始化数据格式
  initData(obj) {
    // this.setState(obj);
    // return;

    let pay = {
      red: {},
      way: {}
    };
    const data = obj.data;
    const ptl = data.ptl && data.ptl[0];

    // 初始化默认红包 || 判断有没有可用红包
    if (data.cn) {
      let cl = data.cl[0];
      pay.red = {
        redCode: cl.r_c, // 红包编号
        // redBalance:  data.od.o_a - cl.r_b >= 0? cl.r_b: data.od.o_a,   // 彩金红包实际剩余可用金额
        redName: cl.r_n, // 红包名称 满100减20
        redType: cl.r_t, // 红包类型 1：充值优惠；2：消费折扣；3：彩金红包；4：加奖红包；5：大礼包；6：随机红包
        redValue: cl.r_v // 面额，彩金红包存的是初始金额，满减红包存的是满多少减多少，减的金额
      };
      switch (pay.red.redType) {
        case 2: // 折扣红包
          pay.red.redBalance = cl.r_v;
          break;
        case 3: // 彩金红包
          pay.red.redBalance = data.od.o_a - cl.r_b >= 0 ? cl.r_b : data.od.o_a;
          break;
        default:
          console.log(`当前红包类型是：${pay.red.redType}`);
          break;
      }
    }

    // 减去红包后还应该支付的金额
    const diffRedCost = data.od.o_a - (pay.red.redBalance || 0);
    if (diffRedCost > 0) {
      if (data.uw && diffRedCost <= data.uw.tot_c_b) {
        pay.balance = diffRedCost;
      } else {
        if (ptl) {
          pay.way = {
            bankCardId: ptl.b_c_i, // 银行卡ID
            bankId: ptl.b_i, // 银行ID
            bankName: ptl.b_n, // 银行名称
            cardCode: ptl.c_c, // 卡号
            bankType: ptl.b_t, // 银行类型
            payAmount: diffRedCost
          };
        }
      }
    }

    // pay = deepAssign({}, pay);

    // payState 如果支付状态没拿到，直接灰色支付按钮
    pay.payState = !isEmpty(obj.pay);
    obj = deepAssign({}, obj, { pay });
    this.setState(obj);
  }

  // 子组件支付信息设置
  setPayState(payObj) {
    this.setState({
      pay: Object.assign({}, deepAssign(this.state.pay, payObj))
    });
  }

  safePay() {
    const lotteryNum = this.state.data.od && this.state.data.od.l_c;
    let next = '/index.html';
    location.href = lotteryNum
      ? lotteryCode[lotteryNum].href + '?next=' + next
      : next;
  }
  render() {
    return (
      <div>
        <Header title="安全支付" bg="blue"
          back={ this.safePay.bind(this) } />
        <section className="pay">
          <Countdown remaining={ Math.floor(this.state.data.lpt) } />
          <div className="pay-info">
            <Paylist od={ this.state.data.od } />
            <RedPackage
              data={ this.state.data }
              pay={ this.state.pay }
              setPayState={ this.setPayState.bind(this) }
            />
            <PayWay
              data={ this.state.data }
              pay={ this.state.pay }
              setPayState={ this.setPayState.bind(this) }
            />
            <PayBtn data={ this.state.data } pay={ this.state.pay } />
          </div>
        </section>
      </div>
    );
  }
}

const Home = ReactDOM.render(<Pay />, document.getElementById('app'));

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           token token
 */
window.initializeApp = function(params) {
  // alert(JSON.stringify(params));
  var curParams = {};
  try {
    curParam = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
  Home.queryPayInfo();
};

// tokenExpires token失效后出发这个方法，让app重新登录获取token
