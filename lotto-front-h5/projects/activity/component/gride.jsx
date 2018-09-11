import React, { Component } from 'react';
import { chunk } from 'lodash';
import cx from 'classnames';
import http from '@/utils/request.js';
import session from '@/services/session.js';
import Interaction from '@/utils/interaction';
import Message from '@/services/message.js';
import { browser } from '@/utils/utils'; // 判断浏览器内核

import '../scss/gride.scss';

import Register from './register'; // 注册弹框
import RealName from './real-name'; // 实名认证
import LogVerify from './login-verify'; // 账号登录
import { Agree } from './agree';

export class Gride extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click: false,
      awardList: [],
      visibleGetPrize: false,
      phonenumber: '',
      light: '',
      agreeStyle: true
    };
    this.running = false;
    this.interval = null;
  }

  componentWillMount() {
    this.getAwardInfo();
  }
  getAwardInfo() {
    let params = {
      activityCode: 'CJ20171019'
    };
    http
      .get('/activity/awardInfo', { params })
      .then(res => {
        let awardList = res.data;
        awardList = awardList.concat([awardList[0], awardList[1]]);
        awardList = awardList.map((a, index) => {
          return {
            ...a,
            img: this.redTypereq(a.orderId),
            index: this.getRollIndex(index),
            selected: false
          };
        });
        // awardData = awardData.concat([{ ...awardData[0], index: 6}, { ...awardData[1], index: 7}]);
        // console.log(awardList);
        this.setState({ awardList });
      })
      .catch(err => {
        // console.log(err);
        Message.toast(err.message);
      });
  }

  getRollIndex(index) {
    switch (index) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 7;
      case 4:
        return 3;
      case 5:
        return 6;
      case 6:
        return 5;
      case 7:
        return 4;
    }
  }

  getLotteryResult(tk) {
    return new Promise((resolve, reject) => {
      let params = {
        activityCode: 'CJ20171019',
        token: tk
      };
      http
        .get('/activity/awardExcute', { params })
        .then(res => {
          // debugger;
          var valueId = res.data.id;
          var orderId = res.data.type;
          // console.log(res.data);
          resolve(res.data);
        })
        .catch(err => {
          this.commonAlert(err.code, err.message);
        });
    });
  }

  getItem(index) {
    const idx = this.state.awardList.findIndex(l => l.index === index);
    return {
      item: this.state.awardList[idx],
      idx
    };
  }

  roll(index) {
    let idx = index > 8 ? index % 8 : index;
    const prev = idx === 0 ? this.getItem(7) : this.getItem(idx - 1);
    const next = idx === 8 ? this.getItem(0) : this.getItem(idx);
    let nextList = this.state.awardList.concat();
    nextList.splice(prev.idx, 1, { ...prev.item, selected: false });
    nextList.splice(next.idx, 1, { ...next.item, selected: true });
    this.setState({ awardList: nextList });
  }

  // 我要抽奖触发
  draw(e) {
    var tk = session.get('token');
    if (tk) {
      let params = {
        token: tk
      };
      let _ = this;
      // console.log('token----------->', tk);
      http
        .post('/activity/verifyPerfectInfo', params, { muted: true })
        .then(res => {
          // console.log('抽奖啦～');
          var tk = session.get('token');
          const result = this.getLotteryResult(tk).then(res => {
            let index = 0;
            // console.log(this.state.awardList);
            for (var i = 0; i < this.state.awardList.length; i++) {
              if (res.id == this.state.awardList[i].id) {
                // console.log(this.state.awardList[i]);
                var resultVal = this.state.awardList[i].index + 4 * 8;
              }
            }
            if (this.running) return undefined;
            this.running = true;
            this.interval = setInterval(() => {
              if (index === resultVal) {
                clearInterval(this.interval);
                // 抽中奖品
                // console.log(res.id);
                // console.log(res.type);
                this.gainPrize(res.type, res.msg);
                this.interval = null;
                this.running = false;
                return undefined;
              }
              index++;
              this.roll(index);
            }, 80);
          });
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
    /* if (this.running) return undefined;
        this.running = true;
        var tk = session.get('token');
        const result = this.getLotteryResult(tk).then(id => {
            let index = 0;
            console.log(this.state.awardList);
            for(var i = 0; i<this.state.awardList.length ; i++ ){
                if(id == this.state.awardList[i].id){
                    console.log(this.state.awardList[i]);
                    var resultVal = this.state.awardList[i].index+4*8;
                }
            }
            this.intervalVal = setInterval(() => {
                if (index === resultVal) {
                    clearInterval(this.interval);
                    this.interval = null;
                    this.running = false;
                    return undefined;
                }
                index++;
                this.roll(index);
            }, 50);
        }); */
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
    this.refs.freeReg.show(false);
    this.draw();
    // Message.toast('您的信息已完善，可以开始抽奖了哦！')
  }
  // 实名认证弹框
  identify(e, token) {
    // 判断能否参加该活动
    this.refs.realName.show(false);
    this.draw();
  }
  // 登录弹框--验证码
  login(e, res) {
    if (e.target.innerText === '免费注册') {
      // console.log(e.target.innerText);
      this.refs.loginVer.show(false);
      this.refs.register.show(true);
    } else if (!res.data.mob) {
      // console.log(res.data);
      this.refs.loginVer.show(false);
      // this.setState({phonenumber: acc});
      this.refs.mobVer.show(true);
    } else if (res.data.att_rn != 1) {
      session.set('token', res.data.tk);
      this.refs.loginVer.show(false);
      this.refs.realName.show(true);
    } else if (res.data.att_rn == 1) {
      // 我已经认证，可参与抽奖活动
      this.refs.loginVer.show(false);
      this.draw();
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
        // 我已经认证了，可参与抽奖活动
        this.refs.accLogin.show(false);
        this.draw();
      }
    }
  }
  // 登记手机号
  mobVerify(e, res, tk) {
    this.refs.mobVer.show(false);
    this.draw();
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

  // 中奖类型图片logo统计
  redTypereq(itemType) {
    switch (itemType) {
      case 1:
        itemType = require('../img/grid_01.png');
        break;
      case 2:
        itemType = require('../img/grid_02.png');
        break;
      case 3:
        itemType = require('../img/grid_03.png');
        break;
      case 4:
        itemType = require('../img/grid_04.png');
        break;
      case 5:
        itemType = require('../img/grid_05.png');
        break;
      case 6:
        itemType = require('../img/grid_06.png');
        break;
    }
    return itemType;
  }
  /*
    错误码：
    41201=当前渠道不参与活动
    41202（抽中优惠券情况下）=本活动每位用户仅限参与一次，您已经参与过抽奖了!感谢您的参与，祝您中奖！
    41203=您已经参与过抽奖了哦，获得了{0}的机会！
    41204（什么也没抽中情况下）=本活动每位用户仅限参与一次，您已经参与过抽奖了!感谢您的参与，祝您中奖！
    41205=您已经有账户参与过抽奖了哦,感谢您的参与，祝您中奖！
    41206=非常遗憾，今日奖品已抽完，明天再来参与吧！
    41207=恭喜您，抽中了{0}的机会哦！
    41208=恭喜您，抽中了{0}
    41209=很遗憾！您没有抽中活动奖品！买一注彩票试试运气吧！大奖在等着您~！
    40956='该活动已结束，感谢您的关注！'
    40958='该活动未开始，感谢您的关注！' */
  commonAlert(errcode, errmsg) {
    if (errcode == '41201') {
      Message.toast(errmsg);
    } else if (errcode == '41202') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['去购彩', '查看我的红包'],
        btnFn: [directToBetPage, directToRedPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41203') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即充值'],
        btnFn: [
          () => {
            // 立即充值
            this.gainBag();
          }
        ],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41204') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['去购彩'],
        btnFn: [directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41205') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['去购彩'],
        btnFn: [directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41206') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['去购彩'],
        btnFn: [directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41207') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即充值'],
        btnFn: [
          () => {
            // 立即充值
            this.gainBag();
          }
        ],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41208') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即使用', '查看我的红包'],
        btnFn: [() => {}, directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '41209') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['去购彩'],
        btnFn: [() => {}, directToBetPage],
        children: (
          <div>
            <p>{errmsg}</p>
          </div>
        )
      });
    } else if (errcode == '40956') {
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
    } else if (errcode == '40958') {
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
    }
  }
  // 送红包错误码
  PrizecommonAlert(errcode, errmsg) {
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
        btnFn: [
          directToRecharge,
          directToBetPage
        ],
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

  // 去充值(充20得88)
  gainBag() {
    let tk = session.get('token');
    let params = {
      token: tk
    };
    http
      .get('/activity/queryFirstRecSend', { params })
      .then(res => {
        if (res.success == 1) {
          let recharInfo = {
            activityCode: res.data.activityCode,
            minMoney: res.data.minMoney
          };
          session.set('token', params.token);
          directToRecharge(recharInfo.minMoney, recharInfo.activityCode);
        }
      })
      .catch(err => {
        this.PrizecommonAlert(err.code, err.message);
      });
  }
  // 抽中奖品
  gainPrize(type, msg) {
    // debugger;
    if (type == '1') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即使用', '查看我的红包'],
        btnFn: [directToBetPage, directToRedPage],
        children: (
          <div>
            <p>{msg}</p>
          </div>
        )
      });
    } else if (type == '2') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['立即充值'],
        btnFn: [
          () => {
            // 去充值
            this.gainBag();
          }
        ],
        children: (
          <div>
            <p>恭喜您，抽中了“充20得88红包”的机会哦！</p>
          </div>
        )
      });
    } else if (type == '0') {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['去购彩'],
        btnFn: [directToBetPage],
        children: (
          <div>
            <p>
              很遗憾！您没有抽中活动奖品！买一注彩票试试运气吧！大奖在等着您~{' '}
            </p>
          </div>
        )
      });
    }
  }
  agreeToggle(event) {
    this.setState({ agreeStyle: !this.state.agreeStyle });
  }
  render() {
    if (!this.state.awardList.length) return null;
    let newList = this.state.awardList.concat();
    // console.log(newList)
    newList.splice(4, 0, '');
    const table = chunk(newList, 3);
    return (
      <div className="box-wrap" id="lottery">
        <table>
          <tbody>
            {table.map((row, idx) => {
              return (
                <tr key={ idx }>
                  {row.map((e, index) => {
                    // console.log(e);
                    if (idx * 3 + index === 4) {
                      // console.log(idx);
                      // console.log(index)
                      return (
                        <td
                          key={ index }
                          className="draw"
                          onClick={ this.draw.bind(this) }
                        />
                      );
                    }
                    return (
                      <td
                        key={ index }
                        className={ cx(
                          'item lottery-unit lottery-unit-' + e.index,
                          { active: e.selected }
                        ) }
                      >
                        <div className="img">
                          <img src={ e.awardImg ? e.awardImg : e.img } alt="" />
                        </div>
                        <span className="name">{e.awardText}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
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
  // debugger;
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
