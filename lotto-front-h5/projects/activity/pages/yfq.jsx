/*
 * @Author: nearxu
 * @Date: 2017-11-22 10:15:21
 */
import React, { Component } from 'react';
import Message from '@/services/message.js';
import http from '@/utils/request.js';
import session from '@/services/session.js';
import cx from 'classnames';
import { formatMoney, browser } from '@/utils/utils';

// 公用组件
import Register from '../component/register'; // 下单 弹窗的逻辑单独出来
import RealName from '../component/real-name'; // 实名认证
import Login from '../component/login-verify'; // 账号登录 手机号码认证
import { Agree } from '../component/agree';
import Rule from '../components/rule'; // 活动规则
import LoadApp from '../components/load-app'; // 下载APP
import ScrollUp from '../components/scrollup';

import CountDownComponent from '@/component/countdown.jsx'; // 倒计时的公共组件
import Interaction from '@/utils/interaction';

import '../scss/yfq.scss';

export class Gd11x5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      numberArr: [],
      lotteryinfo: {},
      activityInfo: {},
      winData: [],
      value: 3,
      remaining: 0,
      agreeStyle: true,
      phonenumber: '',
      orderCode: ''
    };
    this.bagArr = [
      {
        id: 1,
        minus: 1.99,
        checked: false
      },
      {
        id: 2,
        minus: 3,
        checked: false
      },
      {
        id: 3,
        minus: 4,
        checked: true
      }
    ];
  }
  componentWillMount() {
    this.getInfo();
    this.getLotteryInfo();
    this.getRecentWin();
    this.changeDouble(8);
  }
  getInfo() {
    // 活动信息 目前是没有 意义的
    http
      .get('/gd11x5/activity/yfgc/info')
      .then(res => {
        this.setState({ activityInfo: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  handleTimeout() {
    console.log('timeout执行了');
    this.getLotteryInfo();
  }
  getLotteryInfo() {
    // 彩种信息
    http
      .get(`/gd11x5/activity/yfgc/lottoinfo?t=${+new Date()}`)
      .then(res => {
        let lotteryinfo = res.data || {};
        const remaining = this.getRemaining(lotteryinfo.curIssue);
        console.log(remaining, 'remain');
        this.setState({
          remaining,
          lotteryinfo: lotteryinfo
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  getRemaining(curIssue) {
    let saleTime = new Date(curIssue.saleEndTime.replace(/-/g, '/')).getTime();
    let curTime = new Date(
      curIssue.currentDateTime.replace(/-/g, '/')
    ).getTime();
    let cutTime = parseInt(saleTime - curTime);
    console.log(cutTime, 'cutTime');
    return cutTime;
  }
  getRecentWin() {
    http
      .get('/gd11x5/activity/yfgc/win')
      .then(res => {
        let winData = res.data || [];
        this.setState({
          winData: winData
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 换一组双色球
  changeDouble(redNum) {
    let resultRed = {},
      reusltRedArr = [];
    while (reusltRedArr.length < redNum) {
      let num = parseInt(Math.random() * 12);
      if (num < 10) {
        num = '0' + num;
      }
      if (num != '00' && !resultRed[num]) {
        reusltRedArr.push(num);
        resultRed[num] = true;
      }
    }
    let result = reusltRedArr.sort((a, b) => {
      return a - b;
    });
    this.setState({ numberArr: result });
  }
  handleChange(i) {
    this.bagArr.map((m, index) => {
      if (i == index) {
        m.checked = true;
      } else {
        m.checked = false;
      }
    });
    let { value } = this.state;
    this.setState({
      value: i + 1
    });
  }

  // 立即购买
  addOrder(type) {
    // e.stopPropagation();
    // e.preventDefault();
    this.handleValidData(type);
  }
  // 活动校验
  handleValidData(type) {
    let url = '/chase/addChase'; // 默认是 没有活动原价
    if (type == 'active') {
      url = '/gd11x5/activity/yfgc/order';
    }
    let { value, lotteryinfo, numberArr, activityInfo } = this.state;
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
        activityId: activityInfo.activityCode, // 活动编号
        addAmount: parseInt(2 * value), // 追号总金额
        addCount: 1, // 追号投注数
        addIssues: value, // 移动端追号期数 活动只支持1,2,3期
        addMultiples: 1, // 移动端追号倍数 活动只支持1倍
        addType: 1, // 追号类型； 1：固定选号；2：随机选号
        isDltAdd: 0,
        issueCode: lotteryinfo.curIssue.issueCode, // 彩期编号
        lotteryCode: 210,
        multipleNum: value * 1, // curCart.mul * curCart.zh, // 订单总倍数   number  必填。
        orderAddContentList: [
          {
            amount: 2, //  单个方案投注金额    number  必填。
            buyNumber: 1, //   单个方案投注注数    number  必填。
            codeWay: 2, // 投注方式    number  必填。1：手选；2：机选；3：上传
            contentType: 1, // 玩法  number  必填。如竞彩，1：单式；2：复式；3：胆拖；
            lotteryChildCode: 21008, //    子玩法   ID   number  必选。
            multiple: 1, //    单个方案投注倍数    number  必填。
            planContent: numberArr.toString() // 投注内容    string
          }
        ], // 追号内容列表
        platform: 2, // 平台类型 1:Web,2:Wap;
        stopType: 3, // 停追类型； 1：奖项；2：金额；3：永追
        token: session.get('token')
      };
      http
        .post(url, params, { muted: true })
        .then(res => {
          let orderCode = res.data.orderAddCode || '';
          this.handleOrder(orderCode); // 成功的请求 生成订单
        })
        .catch(err => {
          this.handleErrorCode(err);
        });
    }
  }
  // 跳转支付
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
  handleErrorCode(err) {
    switch (err.code) {
      // 未实名认证
      case '40133':
        this.refs.freeReg.show(true);
        break;
      case '41102':
      case '41103':
      case '41106':
      case '41107':
        Message.alert({
          title: '温馨提示',
          btnTxt: ['取消', '确认'], // 可不传，默认是确定
          btnFn: [
            () => {},
            () => {
              this.addOrder();
            }
          ],
          children: (
            <div className="message-alert">
              <div className="content">{err.message}</div>
            </div>
          )
        });

        break;
      case '41104':
      case '41105':
      case '40312':
        // 未支付订单
        console.log(err.data.orderAddCode, 'err.orderCode');
        Message.alert({
          title: '温馨提示',
          btnTxt: ['关闭', '去支付'], // 可不传，默认是确定
          btnFn: [
            () => {},
            () => {
              window.location.href = 'sc.html#/orders/' + err.data.orderAddCode;
            }
          ],
          children: (
            <div className="message-alert">
              <div className="content">{err.message}</div>
            </div>
          )
        });

        break;
      default:
        Message.alert({
          title: '温馨提示',
          btnTxt: ['确定'], // 可不传，默认是确定
          btnFn: [() => {}],
          children: (
            <div className="message-alert">
              <div className="content">{err.message}</div>
            </div>
          )
        });

        break;
    }
  }
  // 先去方案详情 然后去支付
  goToJjcLottery(code) {
    window.location.href = 'sc.html#/orders/' + code;
  }
  handleOnBlur(e, res, acc) {
    if (res.data.set_pwd != 1) {
      this.refs.login.show(false);
      this.refs.noPsw.show(true);
      this.setState({ phonenumber: acc });
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
  handleRegister(e) {
    if (e.target.innerHTML === '已有账号，请登录') {
      this.refs.register.show(false);
      this.refs.login.show(true);
    } else if (e.target.innerText === '《2N彩票用户购彩须知》') {
      this.setState({ agreeStyle: !this.state.agreeStyle });
    } else {
      this.refs.register.show(false);
      this.refs.freeReg.show(true);
    }
  }
  goIndex() {
    window.location.href = '/index.html';
  }
  agreeToggle(event) {
    this.setState({ agreeStyle: !this.state.agreeStyle });
  }
  render() {
    let { numberArr, lotteryinfo, winData, checked, remaining } = this.state;
    let curLottery = lotteryinfo.curLottery || {};
    let curIssue = lotteryinfo.curIssue || {};
    let code = curIssue.issueCode || '';
    let saledIssue = parseInt(code.substring(code.length - 2)) - 1 || 0;
    let unsaleIssue = parseInt(84 - parseInt(saledIssue)) || 0;
    return (
      <div className="firact">
        <header>
          <div className="image-box">
            <img
              className="headbk-01"
              src={ require('../img/headbk_01.png') }
              alt=""
            />
            <img
              className="headbk-02"
              src={ require('../img/headbk_02.png') }
              alt=""
            />
            <img
              className="headbk-03"
              src={ require('../img/headbk_03.png') }
              alt=""
            />
          </div>
        </header>
        <section>
          <div className="block" />
          <div className="wrap-fir">
            <div className="box select-wrap">
              <div className="stage">
                <div className="left">
                  <img src={ require('../img/logo_11x5.png') } alt="" />
                  <div className="text">
                    <div className="line1">
                      <span>{curLottery.lotteryName}</span>
                      <span>第{curIssue.issueCode}期</span>
                    </div>
                    <div className="line2">
                      <span>
                        距截止还剩
                        <CountDownComponent
                          remaining={ remaining / 1000 }
                          formats={ '时,分,秒' }
                          timeout={ this.handleTimeout.bind(this) }
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <p className="line1">
                    已售<i>{saledIssue}</i>期
                  </p>
                  <p className="line2">
                    还剩<i>{unsaleIssue}</i>期
                  </p>
                </div>
              </div>
              <div className="ball">
                <ul className="balllist no-order-number">
                  {numberArr.map((item, index) => {
                    return (
                      <li className="color-ball" key={ index }>
                        {item}
                      </li>
                    );
                  })}
                </ul>
                <p onClick={ this.changeDouble.bind(this, 8) }>换一注</p>
              </div>
              <div className="bag">
                {this.bagArr.map((info, i) => {
                  return (
                    <div
                      className="bg"
                      key={ i }
                      onClick={ this.handleChange.bind(this, i) }
                    >
                      <div
                        className={ cx('input', info.checked ? 'checked' : '') }
                      />
                      <div className="bag-info">
                        <p>买{info.id}期</p>
                        <p> &yen; {formatMoney(2 * info.id - info.minus)}</p>
                        <p>原价: {formatMoney(2 * info.id)}元</p>
                      </div>
                      <div className="send">
                        <span>立减{info.minus}元</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="btn">
                <p
                  className="buy-btn"
                  onClick={ e => {
                    this.addOrder('active');
                  } }
                />
                <p className="buy-text">仅限本活动页面参加有效</p>
              </div>
            </div>
            <ScrollUp winData={ winData } />
            <LoadApp />
          </div>
          <div className="wrap-sec">
            <p className="title">
              <i>活动说明：</i>
            </p>
            <Rule lotteryClass={ '广东' } />
            {/* app 没有进入首页 footer  */
              browser.yicaiApp ? (
                ''
              ) : (
                <p className="enter-btn" onClick={ this.goIndex.bind(this) }>
                进入2N彩首页
                </p>
              )}
          </div>
        </section>
        <Register ref="register" onClick={ this.handleRegister.bind(this) } />
        <RealName ref="realName" title="实名认证" />
        <Login
          ref="login"
          title="账号"
          isShow="true"
          onBlur={ this.handleOnBlur.bind(this) }
          onClick={ this.handleLogin.bind(this) }
        />
        <Login
          ref="noPsw"
          title="账号登录"
          phonenumber={ this.state.phonenumber }
          onClick={ this.handleNoPsw.bind(this) }
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
