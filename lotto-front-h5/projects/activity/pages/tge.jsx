import React, { Component } from 'react';
import Message from '@/services/message.js';
import http from '@/utils/request.js';
import session from '@/services/session.js';
import Interaction from '@/utils/interaction';

import cx from 'classnames';
import { browser } from '@/utils/utils'; // 判断浏览器内核

import Register from '../component/register'; // 注册弹框
import RealName from '../component/real-name'; // 实名认证
import LogVerify from '../component/login-verify'; // 账号登录
import { Agree } from '../component/agree';

import '../scss/tge.scss';

export class Thiact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleGetPrize: false,
      phonenumber: '',
      light: '',
      agreeStyle: true
    };
  }

  // 下载app
  download() {
    if (browser.android) {
      http
        .get('/home/channelVersion', {})
        .then(res => {
          var url = res.data.wapAppUrl;
          window.location = url;
        })
        .catch(err => {
          Message.toast(err.message);
        });
      // window.location ='http://sit.cp.2ncai.com/_upload_file/app/Android_V1.0.5_6_activities_20170814_1101.apk';
    } else {
    }
  }
  goHome() {
    window.location = '/index.html';
  }
  // 请求下单的接口
  getQueryFirstRecSend(params, type) {
    // queryFirstRecSend  享受活动资格验证接口
    http
      .get('/activity/queryFirstRecSend', {
        params
      })
      .then(res => {
        if (res.success == 1) {
          if (type == 'freeReg') {
            this.refs.freeReg.show(false);
          }
          if (type == 'realName') {
            this.refs.realName.show(false);
          }
          let recharInfo = {
            activityCode: res.data.activityCode,
            minMoney: res.data.minMoney
          };
          console.log(recharInfo);
          session.set('token', params.token);
          // session.set('firstRecharge',res.data);
          Message.confirm({
            title: '温馨提示',
            btnTxt: ['关闭', '立即充值'],
            btnFn: [
              () => {},
              () => {
                directToRecharge(recharInfo.minMoney, recharInfo.activityCode);
              }
            ],
            children: (
              <div>
                <p>您还没有充值哦，单笔充值金额需≥20元才可获得红包哦！</p>
              </div>
            )
          });
        }
      })
      .catch(err => {
        this.commonAlert(err.code, err.message);
      });
  }
  gainBag(e) {
    e.preventDefault();
    var tk = session.get('token');
    // alert(tk)
    if (tk) {
      // 验证用户信息是否完善
      let params = {
        token: tk
      };
      let _ = this;
      http
        .post('/activity/verifyPerfectInfo', params, { muted: true })
        .then(res => {
          this.getQueryFirstRecSend(params);
        })
        .catch(err => {
          if (err.data) {
            if (err.data.status == 0) {
              // 未绑定手机号
              _.refs.mobVer.show(true);
            } else if (err.data.status == 1) {
              // 未实名认证
              _.refs.realName.show(true);
            }
          } else {
            if (err.code == '40118') {
              this.refs.accLogin.show(true);
            } else {
              Message.toast(err.message);
            }
          }
        });
    } else {
      if (browser.yicaiApp) {
        // 调APP登录
        Interaction.sendInteraction('toLogin', []);
      } else {
        // 注册登录
        this.refs.register.show(true);
      }
    }
  }
  // 注册弹框
  register(e) {
    if (e.target.innerText === '已有账号，请登录') {
      this.refs.register.show(false);
      this.refs.accLogin.show(true);
    } else if (e.target.innerText === '《2N彩票用户购彩须知》') {
      this.setState({ agreeStyle: !this.state.agreeStyle });
    } else {
      this.refs.register.show(false);
      this.refs.freeReg.show(true);
    }
  }
  // 免费注册弹框--实名认证
  freeReg(e, token) {
    // 判断能否参加该活动
    let params = { token: token };
    this.getQueryFirstRecSend(params, 'freeReg');
  }
  // 实名认证弹框
  identify(e, token) {
    let params = { token: token };
    this.getQueryFirstRecSend(params, 'realName');
  }
  // 登录弹框--验证码
  login(e, res) {
    // console.log(res.data);
    if (e.target.innerText === '免费注册') {
      this.refs.loginVer.show(false);
      this.refs.register.show(true);
    } else if (!res.data.mob) {
      console.log(res.data);
      this.refs.loginVer.show(false);
      // this.setState({phonenumber: acc});
      this.refs.mobVer.show(true);
    } else if (res.data.att_rn != 1) {
      session.set('token', res.data.tk);
      this.refs.loginVer.show(false);
      this.refs.realName.show(true);
    } else if (res.data.att_rn == 1) {
      this.refs.loginVer.show(false);
      console.log('我已经认证啦啊啊啊啊');
      let params = {
        token: res.data.tk
      };
      this.getQueryFirstRecSend(params);
    }
  }
  // 登录弹框--密码
  accLogin(e, res) {
    if (e.target.innerText === '免费注册') {
      this.refs.accLogin.show(false);
      this.refs.register.show(true);
    } else if (!res.data.mob) {
      session.set('mob_token', res.data.tk);
      this.refs.accLogin.show(false);
      this.refs.mobVer.show(true);
    } else if (res.data.mob) {
      if (res.data.att_rn != 1) {
        session.set('token', res.data.tk);
        this.refs.accLogin.show(false);
        this.refs.realName.show(true);
      } else if (res.data.att_rn == 1) {
        console.log('我已经认证啦啊啊啊啊');
        let params = {
          token: res.data.tk
        };
        this.getQueryFirstRecSend();
        this.refs.accLogin.show(false);
      }
    }
  }
  // 登记手机号
  mobVerify(e, res, tk) {
    let params = {
      token: tk
    };
    var _ = this;
    http
      .post('/activity/verifyPerfectInfo', params, { muted: true })
      .then(res => {
        if (res.success == 1) {
          this.getQueryFirstRecSend(params);
        }
      })
      .catch(err => {
        // console.log('err.data', err.data.status);
        if (err.data) {
          if (err.data.status == 1) {
            // 未实名认证
            _.refs.mobVer.show(false);
            _.refs.realName.show(true);
          }
        } else {
          if (err.code == '40118') {
            this.refs.accLogin.show(true);
          } else {
            Message.toast(err.message);
          }
        }
      });
  }
  mobBlur(e, res, acc) {
    if (res.data.set_pwd != 1) {
      this.setState({ phonenumber: acc, light: 'loginBtn-act' });
      this.refs.accLogin.show(false);
      this.refs.loginVer.show(true);
    }
  }
  mobBlur2(e, res, acc) {
    if (res.data.set_pwd == 1) {
      this.setState({ phonenumber: acc, light: 'loginBtn-act' });
      this.refs.accLogin.show(true);
      this.refs.loginVer.show(false);
    }
  }
  commonAlert(errcode, errmsg) {
    /* 错误编码对应情况：
        40951 已充值 ,
        40952 当该用户名已参与过活动 ,
        40953 已有其他账号参与过活动（身份证号码及手机号码排重） ,
        40954 同一真实姓名，已经有10个用户领取活动的情况下 ,
        40955 红包已派完,
        40956:该活动已结束，感谢您的关注,
        40957:您已经有账户充值过了哦，不符合活动要求。感谢您的参与，祝您中奖！ */
    if (errcode == '40951') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['关闭', '立即购彩'],
        btnFn: [() => {}, directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40952') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即购彩', '查看我的红包'],
        btnFn: [directToBetPage, directToRedPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40953') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['继续充值', '立即购彩'],
        btnFn: [directToRecharge, directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40954') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['关闭', '联系客服'],
        btnFn: [
          () => {},
          () => {
            window.open(
              '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663'
            );
          }
        ],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40955') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['继续充值', '立即购彩'],
        btnFn: [directToRecharge, directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40956') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['继续充值', '立即购彩'],
        btnFn: [directToRecharge, directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40957') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即购彩', '查看我的红包'],
        btnFn: [directToBetPage, directToRedPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '10002') {
      Message.toast('服务器忙，请稍候重试！');
    } else if (errcode == '40118') {
      // 请重新登录
      this.refs.accLogin.show(true);
    }
  }
  agreeToggle(event) {
    this.setState({ agreeStyle: !this.state.agreeStyle });
  }
  // tokenExpires token失效后出发这个方法，让app重新登录获取token
  /*
    - (void)toLive;
    - (void)toLastVC;
    - (void)toLogin;
    - (void)toRealName;
    - (void)toPay:(NSString *)param;
    - (void)goAddbankCard;
    - (void)tokenExpires;
    - (void)goCenter;
    - (void)toBetVC:(YCLotteryType)lotteryType;
    - (void)toURL:(NSString *)url;
    , {'hide': this.state.agreeStyle}
    */
  render() {
    return (
      <div className="thiact" ref="bodyBox">
        <header>
          <div className="img-box">
            <img className="bga" src={ require('../img/thi_top_bg01.png') } />
            <img className="bgd" src={ require('../img/thi_coin.png') } />
            <img className="bgb" src={ require('../img/thi_bag.png') } />
            <img className="bgc" src={ require('../img/thi_top_bg02.png') } />
          </div>
          <div className="text-box">
            <p className="text-info">
              新注册用户首次单笔<br />充值≥20元即可获得88元红包
            </p>
            <p
              className="text-btn"
              id="getPrize"
              onTouchEnd={ e => {
                this.gainBag(e);
              } }
            >
              <img src={ require('../img/thi_bag_btn.png') } alt="" />
            </p>
          </div>
        </header>
        <section>
          <div className="step-wrap">
            <div className="container">
              <p className="cont-title">- 领取流程 -</p>
              <ul className="step-list">
                <li className="img">
                  <img src={ require('../img/thi_step01.png') } />
                  <p>免费注册</p>
                </li>
                <li className="next">
                  <img src={ require('../img/thi_then.png') } />
                </li>
                <li className="img">
                  <img src={ require('../img/thi_step02.png') } />
                  <p>实名认证</p>
                </li>
                <li className="next">
                  <img src={ require('../img/thi_then.png') } />
                </li>
                <li className="img">
                  <img src={ require('../img/thi_step03.png') } />
                  <p>
                    首次单笔<br />充值≥20元{' '}
                  </p>
                </li>
                <li className="next">
                  <img src={ require('../img/thi_then.png') } />
                </li>
                <li className="img">
                  <img src={ require('../img/thi_step04.png') } />
                  <p>获得红包</p>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={ cx('down-wrap', {
              hide: browser.ios || browser.yicaiApp
            }) }
          >
            <div className="container">
              <img className="logo" src={ require('../img/thi_logo.png') } />
              <span className="text">下载客户端，随时查看中奖</span>
              <span className="btn" onClick={ event => this.download(event) }>
                立即下载
              </span>
            </div>
          </div>
          <div className="act-info">
            <div className="container">
              <p className="cont-title">- 活动说明 -</p>
              <ul className="intro-list">
                <li>
                  1、本活动仅限活动期间内新注册的用户参与(未购买过彩票的用户)；
                </li>
                <li>2、需在活动页面注册并进行实名认证的用户方可参与活动；</li>
                <li>3、实名认证后首次单笔充值金额≧20元，即可获得88元红包；</li>
                <li>4、每位实名用户仅限参与一次；</li>
                <li>5、每日赠送的红包数量有限，送完即止；</li>
                <li>
                  6、参与活动获得的红包，充值的本金及赠送的红包仅限于购彩，中奖的奖金可提现；
                </li>
                <li>
                  7、恶意操作的用户，将取消活动资格，本站有权将赠送的红包作废处理；
                </li>
                <li>
                  8、在法律许可范围内，2N彩票保留本次活动解释权，如有疑问请联系客服:
                  0755-61988504。
                </li>
              </ul>
              <p
                className={ cx('btn', { hide: browser.yicaiApp }) }
                onClick={ event => this.goHome(event) }
              >
                进入2N彩票首页
              </p>
            </div>
          </div>
          {/* <div
            className={ cx(
              'mask-wrap',
              this.state.visibleGetPrize ? 'animation-show' : 'animation-hide'
            ) }
          >
            <img
              onTouchEnd={ e => {
                this.gainBag(e);
              } }
              src={ require('../img/thi_gain_btn.png') }
            />
            </div> */}
          <div className={ cx('mask-wrap') }>
            <img
              onClick={ event => this.gainBag(event) }
              src={ require('../img/thi_gain_btn.png') }
            />
          </div>
        </section>
        <Register ref="register" onClick={ this.register.bind(this) } />
        <RealName
          ref="freeReg"
          title="免费注册"
          onClick={ this.freeReg.bind(this) }
        />
        <RealName
          ref="realName"
          title="实名认证"
          onClick={ this.identify.bind(this) }
        />
        <LogVerify
          ref="loginVer"
          title="账号登录"
          onClick={ this.login.bind(this) }
          onBlur={ this.mobBlur2.bind(this) }
          phonenumber={ this.state.phonenumber }
          light={ this.state.light }
        />
        <LogVerify
          ref="mobVer"
          title="手机号码认证"
          onClick={ this.mobVerify.bind(this) }
        />
        <LogVerify
          ref="accLogin"
          title="账号"
          onClick={ this.accLogin.bind(this) }
          onBlur={ this.mobBlur.bind(this) }
          phonenumber={ this.state.phonenumber }
          light={ this.state.light }
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

function directToBetPage() {
  if (browser.yicaiApp) {
    return Interaction.toBetVC(300);
  } else {
    window.location = '/jczq.html#/';
  }
}

function directToRedPage() {
  if (browser.yicaiApp) {
    return Interaction.sendInteraction('toRedPacket', []);
    // return Interaction.toRedPacket();
  } else {
    window.location = '/sc.html#/red-packet';
  }
}

// 参与活动跳转充值
function directToRecharge(minMoney, hdCode) {
  if (browser.yicaiApp) {
    if (minMoney && hdCode) {
      return Interaction.sendInteraction('toRecharge', [minMoney, hdCode]);
    } else {
      return Interaction.sendInteraction('toRecharge', []);
    }
  } else {
    if (minMoney && hdCode) {
      window.location =
        '/sc.html#/recharge?' +
        'activityCode=' +
        hdCode +
        '&minMoney=' +
        minMoney;
    } else {
      window.location = '/sc.html#/recharge';
    }
  }
}
