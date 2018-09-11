/*
 * @Author: nearxu
 * @Date: 2017-10-13 19:50:13
 * 竞彩篮球
 */

import React, { Component } from 'react';
import http from '@/utils/request';
import Message from '@/services/message'; // 弹窗
import session from '@/services/session.js';

import Register from '../component/register'; // 下单 弹窗的逻辑单独出来
import RealName from '../component/real-name'; // 实名认证
import Login from '../component/login-verify'; // 账号登录 手机号码认证
// import Login from "../component/login"; //账号登录

import BacketballWidget from '../components/backetball'; // 竞彩篮球 组件
import '../scss/jcl.scss';
import cx from 'classnames';
import { browser, setDate } from '@/utils/utils'; // 判断浏览器内核
import { Agree } from '../component/agree';

import Interaction from '@/utils/interaction';
import load from '../utils/load';

export class Foract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchs: [],
      multiple: [], // 倍数立减
      multipleIndex: 1, // 默认倍数为一
      betNum: 1, // 注数
      maxProfit: 0,
      orderCode: '', // 订单编号
      timer: 20, // input 倍数
      discount: 10, // 折扣
      backetData: [], // 竟足投注的内容
      saleEndTime: new Date().getTime(),
      showMatchs: false, // 没有数据的情况
      agreeStyle: true,
      phonenumber: '',
      customerTel: ''
    };
    this.delay = null;
  }
  componentDidMount() {
    this.getMatchData(); // 赛事接口
    this.getCustomerTel(); // 客服电话号码
    this.queryActiveInfo(); // 竟篮立减倍数信息
  }
  queryActiveInfo() {
    http
      .get('/activity/queryJzsdActivityInfo', {
        params: { activityCode: 'JLHD20171015001' }
      })
      .then(res => {
        let multiple = res.data.jzstActivityRules;
        this.setState({ multiple });
      })
      .catch(err => {
        console.error(err);
        // Message.toast(err.message);
      });
  }
  matchChangeHandle(betNum, maxProfit, saleEndTime) {
    this.setState({ betNum, maxProfit, saleEndTime });
  }

  getCustomerTel() {
    http
      .get('/home/customertel', { params: {} })
      .then(res => {
        let customerTel = res.data;
        this.setState({ customerTel });
      })
      .catch(err => {
        console.error(err);
        // Message.toast(err.message);
      });
  }

  getMatchData() {
    http
      .get('/jc/bbRecom', { params: {} })
      .then(res => {
        let matchs = res.data || [];
        this.setState({ matchs });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 投注倍数
  tabMult(index) {
    if (!this.state.showMatchs) {
      Message.toast('没有赛事可以投注！');
      return;
    }
    if (this.delay) {
      clearTimeout(this.delay);
      this.delay = null;
    }
    this.delay = setTimeout(() => {
      let timer;
      if (index === 0) {
        timer = 5;
        this.setState({ discount: 2, timer: 5 });
      }
      if (index === 1) {
        timer = 20;
        this.setState({ discount: 10, timer: 20 });
      }
      if (index === 2) {
        if (this.refs.timer.value) {
          timer = this.refs.timer.value;
        } else {
          timer = 50;
        }
        this.setState({ discount: 20, timer: timer });
      }
      this.backetball.changeTimes(timer);
      let multpleIndex = this.state.multipleIndex;
      this.setState({
        multipleIndex: index
      });
    }, 50);
  }

  // 立即投注
  addOrder(e) {
    console.log(this.state.timer);
    e.stopPropagation();
    e.preventDefault();
    let { betNum, showMatchs } = this.state;
    if (!showMatchs) {
      Message.toast('没有赛事可以投注！');
      return;
    }
    if (betNum === 0) {
      Message.toast('2串1 最少选择两场比赛');
      return;
    }
    this.state.backetData = this.backetball.getOrderData();
    console.log(this.state.backetData, 'this.state.backetdata');
    this.checkOrder(this.state.backetData, 'activity');
  }
  // 下单
  checkOrder(data, type) {
    let self = this;
    let activityCode;
    let url = '/order/addOrder';
    let token = session.get('token');

    if (!token) {
      if (browser.yicaiApp) {
        // 调APP登录
        Interaction.sendInteraction('toLogin', []);
      } else {
        // 注册登录
        this.refs.login.show(true);
      }
    } else {
      let params = {
        // "categoryId":1,
        activityCode: activityCode,
        buyScreen: data.buyScreen,
        buyType: data.buyType,
        isDltAdd: data.isDltAdd,
        lotteryCode: data.lotteryCode,
        platform: data.platform,
        lotteryIssue: data.lotteryIssue,
        multipleNum: this.state.timer, // data.multipleNum,
        orderAmount: data.orderAmount,
        orderDetailList: data.orderDetailList,
        tabType: data.tabType,
        token: token
      };
      if (type === 'activity') {
        let activityCode = 'JLHD20171015001'; // 活动这个编号写死
        params.activityCode = activityCode;
        url = '/order/addJzsdOrder';
      }
      http
        .post(url, params, { muted: true })
        .then(res => {
          let orderCode;
          if (type === 'activity') {
            orderCode = res.data.orderCode;
            let { betNum, timer } = this.state;
            // 原价 活动价 奖金
            let price = timer * betNum * 2 || '';
            let activePrice = (price - this.state.discount).toFixed(2) || '';

            Message.confirm({
              title: '',
              btnTxt: ['关闭', '确认购买'],
              btnFn: [
                () => {},
                () => {
                  this.handleOrder(orderCode);
                }
              ],
              children: (
                <div className="message-alert">
                  <div className="title">活动优惠</div>
                  <div>
                    <span>订单名称：</span> <span>竞彩篮球 代购</span>
                  </div>
                  <div>
                    <span>实收金额：</span>{' '}
                    <span>
                      <b className="red">{activePrice}元</b>
                      <b className="line">原价{price} 元</b>
                    </span>
                  </div>
                </div>
              )
            });
          } else {
            orderCode = res.data.oc;
            this.handleOrder(orderCode);
          }
          this.setState({ orderCode });
        })
        .catch(err => {
          this.getHandleError(err);
        });
    }
  }
  // 根据返回的状态 弹窗
  getHandleError(err) {
    switch (err.code) {
      case '41017':
        {
          Message.alert({
            title: '',
            btnTxt: ['关闭', '确认购买'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                this.checkOrder(this.state.backetData, '');
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">
                  您已参加本活动，活动红包下发到您的红包账户， 您可通过本页面原价购买，付款页面可使用该红包！
                </div>
              </div>
            )
          });
        }
        break;
      case '40118':
        {
          // 请重新登录
          this.refs.login.show(true);
        }
        break;
      case '41100':
        {
          // 账号未绑定手机号  // 有token 但是没有绑定手机
          this.refs.noPhone.show(true);
        }
        break;
      case '41007':
        {
          let realName = err.data.realName || '';
          Message.alert({
            btnTxt: ['关闭', '联系客服'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                window.open(
                  '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663'
                );
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">
                  真实姓名为 "{realName}" 的已有多个用户参与活动， 为了防止恶意用户套现，请联系客服！
                </div>
              </div>
            )
          });
        }
        break;
      case '41008':
        {
          // 未付款
          this.state.orderCode = err.data.orderCode || '';
          Message.alert({
            btnTxt: ['关闭', '去支付'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                // 去方案详情
                this.goToJjcLottery(this.state.orderCode);
                // this.handleOrder(this.state.orderCode);
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">您本次活动有未付款的订单，请尽快支付</div>
              </div>
            )
          });
        }
        break;
      case '41009':
        {
          Message.alert({
            btnTxt: ['确定'], // 可不传，默认是确定
            btnFn: [() => {}],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">您有其他账户参加本活动的未付款订单，请您尽快登录并支付</div>
              </div>
            )
          });
        }
        break;
      case '41003':
        {
          let price = err.data.orderAmount;
          Message.alert({
            title: '',
            btnTxt: ['关闭', '确认购买'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                this.checkOrder(this.state.backetData, '');
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">
                  本活动每位用户仅限参与一次，你已参与活动了 ！将按原价进行购买。本次投注金额<span>{price}</span>
                  <b>元</b>，祝你中奖！
                </div>
              </div>
            )
          });
        }
        break;
      case '41004':
        {
          let price = err.data.orderAmount;
          Message.alert({
            title: '',
            btnTxt: ['关闭', '确认购买'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                this.checkOrder(this.state.backetData, '');
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">
                  您已经有账户参与活动了 ！将按原价进行购买。本次投注金额<span>{price}</span>
                  <b>元</b>，祝你中奖！
                </div>
              </div>
            )
          });
        }
        break;
      case '41005':
        {
          let price = err.data.orderAmount;
          Message.alert({
            title: '',
            btnTxt: ['关闭', '确认购买'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                this.checkOrder(this.state.backetData, '');
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">
                  您已经购买过竞彩篮球了 ！将按原价进行购买。本次投注金额<b className="red">{price}</b>元，祝你中奖！
                </div>
              </div>
            )
          });
        }
        break;
      case '41006':
        {
          let price = err.data.orderAmount;
          Message.alert({
            title: '',
            btnTxt: ['关闭', '确认购买'], // 可不传，默认是确定
            btnFn: [
              () => {},
              () => {
                this.checkOrder(this.state.backetData, '');
              }
            ],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">
                  您已经有其他账户购买过竞彩篮球了，将按原价购买。 本次投注金额<span>{price}</span>
                  <b>元</b>，祝你中奖！
                </div>
              </div>
            )
          });
        }
        break;

      case '40133':
        {
          this.refs.freeReg.show(true);
        }
        break;

      default:
        {
          Message.alert({
            title: '',
            btnTxt: ['确定'], // 可不传，默认是确定
            btnFn: [() => {}],
            children: (
              <div className="message-alert">
                <div className="title">温馨提示</div>
                <div className="content">{err.message}</div>
              </div>
            )
          });
        }
        break;
    }
  }
  // 跳到支付页支付
  handleOrder(code) {
    let token = session.get('token');
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toPay', [
        JSON.stringify([{ oc: code, bt: 1, token: token }])
      ]);
    } else {
      return (location.href = `/pay.html?orderCode=${code}&buyType=1&token=${token}`);
    }
  }
  // 先去方案详情 然后去支付
  goToJjcLottery(code) {
    window.location.href = `sc.html#/orders/${code}`;
  }

  // input 改变倍数
  getMultiple() {
    let { multiple } = this.state;
    let area;
    return multiple.map((val, index) => {
      if (index === 2) {
        area = (
          <span>
            投
            {/* defaultValue={this.state.timer} */}
            <input
              defaultValue="50"
              onChange={ this.handleMultiple.bind(this) }
              onBlur={ this.handleMulBlur.bind(this) }
              type="tel"
              ref="timer"
              min="50"
            />
            倍
          </span>
        );
      } else {
        area = <span>投{val.multipleNum}倍</span>;
      }
      return (
        <div
          className={ cx({ active: index == this.state.multipleIndex }) }
          key={ index }
          onClick={ this.tabMult.bind(this, index) }
        >
          {area}
          <span>减 {val.reduceAmount} 元</span>
        </div>
      );
    });
  }
  handleMultiple(e) {
    let max = e.target.value;
    if (max > 50000) {
      Message.toast('投注最大倍数为50000倍,超过将按50000倍取值');
      max = 50000;
      e.target.value = 50000;
      this.setState({ timer: 50000 });
    } else if (max < 50) {
      Message.toast('投注最小倍数为50倍，小于50倍将默认为50倍');
      max = 50;
      this.setState({ timer: 50 });
    } else {
      this.setState({ timer: max });
    }

    this.backetball.changeTimes(max);
  }

  handleMulBlur(e) {
    // 失去焦点 默认 小于 50倍 或 为空 都是 50倍
    if (parseInt(e.target.value) < 50 || e.target.value == '') {
      e.target.value = 50;
    }
  }

  handleLogin(e) {
    if (e.target.innerHTML === '免费注册') {
      this.refs.login.show(false);
      this.refs.register.show(true);
    } else {
      this.refs.login.show(false);
    }
  }
  freeReg() {
    this.refs.freeReg.show(false);
  }
  // 立即下载APP
  download() {
    load.download();
  }
  handleDate(saleEndTime) {
    let date = new Date(saleEndTime);
    return setDate.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
  }
  goIndex() {
    location.href = '/index.html';
  }
  handleRegister(e) {
    if (e.target.innerHTML === '已有账号，请登录') {
      this.refs.register.show(false);
      this.refs.login.show(true);
    } else if (e.target.innerText === '《2N彩票用户购彩须知》') {
      this.setState({ agreeStyle: !this.state.agreeStyle });
    }else{
      this.refs.register.show(false);
      this.refs.freeReg.show(true);
    }
  }
  agreeToggle(event) {
    this.setState({ agreeStyle: !this.state.agreeStyle });
  }

  handleOnBlur(e, res, acc) {
    if (res.data.set_pwd != 1) {
      this.refs.login.show(false);
      this.refs.noPsw.show(true);
      this.setState({
        phonenumber: acc
      });
    }
  }

  handleHasPwdUser(e, res, acc) {
    console.log(acc, 'acc');
    if (res.data.set_pwd == 1) {
      this.refs.login.show(true);
      this.refs.noPsw.show(false);
      this.setState({
        phonenumber: acc
      });
    }
  }
  handleNoPsw(e) {
    this.refs.noPsw.show(false);
    if (e.target.innerText === '免费注册') {
      this.refs.register.show(true);
    }
  }
  handleNoPhone(e) {
    this.refs.noPhone.show(false);
    if (e.target.innerText === '免费注册') {
      this.refs.register.show(true);
    }
  }
  // 什么是2串1 弹窗
  showExplain() {
    Message.confirm({
      title: '',
      btnTxt: ['知道了'],
      btnFn: [() => {}],
      children: (
        <div className="message-alert">
          <div className="title">什么是2串1</div>
          <span>
            两场比赛串在一起，组成一注，必须两场比赛竞猜正确。才算中奖，猜对一场也是没有中奖哦！返奖率高达69%，立即投注体验！
          </span>
        </div>
      )
    });
  }
  render() {
    let {
      betNum,
      maxProfit,
      timer,
      showMatchs,
      saleEndTime,
      customerTel
    } = this.state;
    let price, activePrice;
    //  没有数据默认隐藏对阵
    if (!this.state.matchs.length) {
      this.state.showMatchs = false;
      price = 0;
      activePrice = 0;
    } else {
      if (this.state.matchs.length >= 2) {
        this.state.showMatchs = true;
      }
      // 原价 活动价 奖金
      price = timer * betNum * 2 === 0 ? 0 : timer * betNum * 2;
      activePrice =
        (price - this.state.discount).toFixed(2) < 0
          ? 0
          : (price - this.state.discount).toFixed(2);
      // 存起来放在弹层用
    }

    return (
      <div className="jcl">
        <div className="header">
          <img className="title" src={ require('../img/jcl-title.png') }
            alt="" />
        </div>
        <div className="content">
          <div className="banner">
            <img src={ require('../img/jcl-chuan.png') } alt="" />
            <span onClick={ this.showExplain.bind(this) }>什么是2串1?</span>
          </div>
          <div className="game">
            <div
              className={ cx('data', this.state.showMatchs ? '' : 'gameHide') }
            >
              <div className="end-time">
                投注截止时间：{this.handleDate(saleEndTime)}
              </div>
              {this.state.matchs && this.state.matchs.length > 1 ? (
                <BacketballWidget
                  matchs={ this.state.matchs }
                  ref={ backetball => (this.backetball = backetball) }
                  onMatchChange={ this.matchChangeHandle.bind(this) }
                />
              ) : (
                ' '
              )}
            </div>
            <div
              className={ cx('noGame ', this.state.showMatchs ? 'gameHide' : '') }
            >
              <img src={ require('../img/no-game.png') } alt="" />
              <span>目前暂无可投注的赛事</span>
            </div>
            <div className="activty">
              <div className="tou">{this.getMultiple()}</div>
              <div className="price">
                <span className="line">
                  原价:<b className="yello">{price}</b>元
                </span>
                <span>
                  活动价:<b className="yello">{activePrice}</b>元
                </span>
                <span>
                  预测最高奖金:<b className="orange">{maxProfit}</b>元
                </span>
              </div>
              <div className="pay">
                {/* <span onClick={e => { this.addOrder(e) }}>立即投注</span> */}
                <img
                  src={ require('../img/jcl-buy.png') }
                  alt=""
                  onClick={ e => {
                    this.addOrder(e);
                  } }
                />
              </div>
              <div className="foot">
                <span>需点此投注，方可参与活动</span>
              </div>
            </div>
          </div>
          {browser.yicaiApp || browser.ios || browser.iPhone ? (
            ''
          ) : (
            <div className="load" onClick={ this.download.bind(this) }>
              <img src={ require('../img/jcl-load.png') } alt="" />
            </div>
          )}
          <div className="rule">
            <h3>活动规则：</h3>
            <p>1.本活动仅限未购买过竞彩篮球的新用户参与，每位实名用户仅限参与一次；</p>
            <p>2.参与活动用户需进行实名认证，且需通过活动页面购买；</p>
            <p>3. 用户投注5倍立减2元；投注20倍立减10元；投注50倍或以上立减20元；</p>
            <p>4.仅限比赛截止前购买,方案奖金以出票时SP值为准;</p>
            <p>5.恶意操作的用户将取消活动资格，不予返还本金,中奖部分将有权扣回；</p>
            <p>6.在法律许可范围内，2N彩票保留本次活动解释权，如有疑问请联系客服: {customerTel}</p>
          </div>
          {/* app 没有进入首页 footer  */}
          {browser.yicaiApp ? (
            ''
          ) : (
            <div className="footer" onClick={ this.goIndex.bind(this) }>
              <span>进入2N彩票首页</span>
            </div>
          )}
        </div>
        <Register ref="register" onClick={ this.handleRegister.bind(this) } />
        <RealName ref="realName" title="实名认证" />
        <Login
          ref="login"
          title="账号"
          isShow="true"
          phonenumber={ this.state.phonenumber }
          onBlur={ this.handleOnBlur.bind(this) }
          onClick={ this.handleLogin.bind(this) }
        />
        <Login
          ref="noPsw"
          title="账号登录"
          phonenumber={ this.state.phonenumber }
          onClick={ this.handleNoPsw.bind(this) }
          onBlur={ this.handleHasPwdUser.bind(this) }
        />
        <Login
          ref="noPhone"
          title="手机号码认证"
          onClick={ this.handleNoPhone.bind(this) }
        />
        <RealName
          ref="freeReg"
          title="实名认证"
          onClick={ this.freeReg.bind(this) }
        />
        <div className={ cx('p-agree', { hide: this.state.agreeStyle }) }>
          <header className="head">
            <span className="back" onClick={ this.agreeToggle.bind(this) } />
            <p className="title">2N彩票用户购彩须知</p>
          </header>
          <div className="agree-content">
            <Agree />
          </div>
        </div>
      </div>
    );
  }
}

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
};

// tokenExpires token失效后出发这个方法，让app重新登录获取token
