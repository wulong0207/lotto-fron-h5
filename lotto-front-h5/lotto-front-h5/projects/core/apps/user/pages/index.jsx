/**
 * Created by manaster
 * date 2017-03-03
 * desc:个人中心模块
 */

import React, { Component } from 'react';
import { Router, Route, hashHistory, Link } from 'react-router';
import Message from '@/services/message';
// import { NoOrder } from '../components/no-order'; // 没有订单显示模块
// import { PlanTabList } from '../plan-tablist'; // 个人中心首页-方案tab
import Navigator from '@/utils/navigator'; // 页面跳转
import http from '@/utils/request';
import { formatMoney } from '@/utils/utils';
import session from '@/services/session';
import cx from 'classnames';
import Proxy from '@/component/proxy/proxy'; // 代理入口
import { LinkList } from '../tools/list';
import PropTypes from 'prop-types';

import '../css/index.scss';

export default class SelfCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyHide: true,
      userInfo: {
        acc: '', // 账户名
        hd_url: '', // 头像url
        pst_d_ct: '', // 过期红包个数
        u_wlt_blc: '', // 钱包余额
        u_pk_blc: '--', // 账户余额
        att_rn: '' // 是否认证
      }, // 用户信息
      orderInfo: {},
      hasData: true,
      visible: true
    };
    this.loaded = false;
  }
  componentDidMount() {
    session.clear('takenAmount');
    this.getMemberInfo();
    this.getAgent();
  }
  getMemberInfo() {
    http
      .post('/member/index', {
        token: session.get('token'),
        limitPlatform: 2
      })
      .then(res => {
        this.setState({ userInfo: res.data || {} });
        this.loaded = true;
        if (!this.state.userInfo.set_pwd) {
          // 是否设置密码
          this.setState({ visible: false });
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  getAgent() {
    http
      .get('/sys/agent/adFlag')
      .then(res => {
        if (res.data == '1') {
          // 开
          this.setState({ visible: true });
        } else if (res.data == '0') {
          // 关
          this.setState({ visible: false });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  warringPop(userInfo) {
    console.log(userInfo);
    let result, clickEvent, needShow;
    if (!userInfo.set_pwd) {
      // 是否设置密码
      clickEvent = () => (window.location.href = '#/set-password');
      needShow = true;
    } else if (!userInfo.mob_sts) {
      // 是否设置手机号码
      clickEvent = () => (window.location.href = '#/register-phone');
      needShow = true;
    } else if (!userInfo.att_rn) {
      // 是否实名认证
      clickEvent = Navigator.goAddr.bind(Navigator, '#/real-name');
      needShow = true;
    } else if (userInfo.bk_ct < 1) {
      // 是否绑定银行卡
      clickEvent = Navigator.goAddr.bind(Navigator, '#/add-bank');
      needShow = true;
    } else if (
      !userInfo.acc_m &&
      userInfo.is_upd != 1 &&
      userInfo.is_upd != 3
    ) {
      // is_upd 0：都未修改，1：修改帐户名，2：修改昵称，3：都已修改
      // 安全等级只与账户名有关
      // 是否修改账户名
      clickEvent = Navigator.goAddr.bind(Navigator, '#/modify-user-name');
      needShow = true;
    } else if (!userInfo.em_sts) {
      // 邮箱是否验证
      clickEvent = () => (window.location.href = '#/register-mail');
      needShow = true;
    }
    if (needShow) {
      result = (
        <span className="top-pop" onClick={ clickEvent }>
          建议补全账户信息，提高安全等级
        </span>
      );
    }
    return result;
  }
  /* warringPop(event, userInfo) {
        debugger
        if(!userInfo.set_pwd){
            //是否设置密码
            location.href = "#/set-password";
            this.setState({ visible: false })
        }else if(!userInfo.mob_sts){
            //是否设置手机号码
            location.href = "#/register-phone";
            this.setState({ visible: false })
        }else if(!userInfo.att_rn){
            //是否实名认证
            location.href = '#/real-name';
            this.setState({ visible: false })
        }else if(userInfo.bk_ct<1){
            //是否绑定银行卡
            location.href = '#/my-bank';
            this.setState({ visible: false })
        }else if(!userInfo.acc_m && userInfo.is_upd == 0){
            //是否修改账户名
            location.href = '#/modify-user-name';
            this.setState({ visible: false })
        }else if(!userInfo.em_sts){
            //邮箱是否验证
            location.href = "#/register-mail";
            this.setState({ visible: false })
        }
    } */
  personalInfo(e) {
    window.location.hash = '/user-info';
  }
  moneyHide() {
    // 余额钱数隐藏与显示
    this.setState({
      moneyHide: !this.state.moneyHide
    });
  }
  gotoPage(index) {
    switch (index) {
      case 1:
        Navigator.goHome();
        break;
      case 2:
        Navigator.goZB();
        break;
      case 3:
        Navigator.goZX();
        break;
    }
  }
  render() {
    let { moneyHide, userInfo, orderInfo } = this.state;
    let last = encodeURIComponent('/sc.html');
    let links1 = [
      {
        target: '/recharge?next=' + last,
        icon: require('../img/index/icon/recharg.png'),
        txt: '充值'
      },
      {
        target:
          userInfo.att_rn == 1 ? '/draw-money' : '/real-name?draw_money=1',
        icon: require('../img/index/icon/drawing.png'),
        txt: '提款'
      }
    ];

    let links2 = [
      {
        target: '/devote-recorde',
        icon: require('../img/index/icon/devote-recorde.png'),
        txt: '投注记录'
      },
      {
        target: '/trade-info?next=' + last,
        icon: require('../img/index/icon/trader-info.png'),
        txt: '交易明细'
      },
      {
        target: '/red-packet',
        icon: require('../img/index/icon/redpack.png'),
        txt: '我的红包'
      }
    ];

    let links3 = [
      this.state.visible
        ? {
          target: `/cd/#/dashboard`,
          icon: require('../img/index/icon/ic_recommend.png'),
          txt: '我的推荐'
        }
        : '',
      this.state.visible
        ? {
          target: '/register-proxy',
          icon: require('../img/index/icon/agent.png'),
          txt: '我要代理'
        }
        : '',
      {
        target: '/help.html',
        icon: require('../img/index/icon/help.png'),
        txt: '帮助中心'
      },
      {
        target: '/msg.html',
        icon: require('../img/index/icon/msg.png'),
        txt: '消息中心'
      },
      {
        target: '//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663',
        icon: require('../img/index/icon/sevice.png'),
        txt: '联系客服'
      },
      {
        target: '/setting',
        icon: require('../img/index/icon/setting.png'),
        txt: '设置'
      }
    ];
    return (
      <div className="sc pt-header index">
        <section className="main-cont">
          <div className="head">
            <div className="account">
              <div className="account-cont">
                <img
                  src={ userInfo.hd_url || require('../img/head.png') }
                  alt=""
                />
                {this.warringPop(userInfo)}
                {/* <span className={ cx("top-pop", { "hide" : this.state.visible }) } onClick={ (event) => this.warringPop(event, userInfo) }>建议补全账户信息，提高安全等级</span> */}
                <p className="nk_nm">{userInfo.nk_nm || ''}</p>
                <p
                  className="wrap"
                  onClick={ event => this.personalInfo(event) }
                />
                <span
                  className="personal"
                  onClick={ event => this.personalInfo(event) }
                >
                  {' '}
                </span>
              </div>
            </div>
            <div className="recorde">
              <div className="balance clearfix">
                <div
                  onClick={ Navigator.go.bind(
                    Navigator,
                    Navigator.Pages.TradeInfo
                  ) }
                >
                  <span
                    className="font20"
                    onClick={ Navigator.go.bind(
                      Navigator,
                      Navigator.Pages.TradeInfo
                    ) }
                  >
                    {moneyHide ? formatMoney(userInfo.u_wlt_blc) : '***'}
                  </span>
                  <div className="num-cont">
                    <span>{moneyHide ? '账户余额(元)' : '余额已隐藏'}</span>
                  </div>
                </div>
                <i
                  className={ moneyHide ? 'eye-open' : 'eye-close' }
                  onClick={ this.moneyHide.bind(this) }
                />
                <span className="border" />
                <div
                  onClick={ Navigator.go.bind(
                    Navigator,
                    Navigator.Pages.RedPacket
                  ) }
                >
                  <span
                    className="font20"
                    onClick={ Navigator.go.bind(
                      Navigator,
                      Navigator.Pages.RedPacket
                    ) }
                  >
                    {moneyHide ? formatMoney(userInfo.u_pk_blc) : '***'}
                  </span>
                  <span>{moneyHide ? '红包余额(元)' : '余额已隐藏'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="list">
            <LinkList links={ links1 } />
            <LinkList links={ links2 } />
            <LinkList links={ links3 } />
          </div>
        </section>
        <section className="sc-footer">
          <dl onClick={ this.gotoPage.bind(this, 1) }>
            <dt className="icon-buya" />
            <dd>购彩</dd>
          </dl>
          <dl onClick={ this.gotoPage.bind(this, 2) }>
            <dt className="icon-livea" />
            <dd>直播</dd>
          </dl>
          <dl onClick={ this.gotoPage.bind(this, 3) }>
            <dt className="icon-servia" />
            <dd>资讯</dd>
          </dl>
          <dl onClick={ this.gotoPage.bind(this, 4) } className="active">
            <dt className="icon-me" />
            <dd>我的</dd>
          </dl>
        </section>
      </div>
    );
  }
}
