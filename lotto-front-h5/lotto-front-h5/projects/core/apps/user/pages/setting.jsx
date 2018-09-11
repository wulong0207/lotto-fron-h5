/**
 * Created by manaster
 * date 2017-03-08
 * desc:个人中心模块--设置子模块
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Message from '@/services/message';
import http from '@/utils/request';
import session from '@/services/session';
import Reg from '@/utils/reg';
import Navigator from '@/utils/navigator';
import Header from '@/component/header';

import '../css/setting.scss';

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionShow: false,
      isLogin: false, // 是否登录
      userInfo: {
        acc: '', // 账户名
        hd_url: '', // 头像url
        bankList: [], // 银行卡信息
        em: '', // 邮箱地址
        em_log: 0, // 是否开启邮箱地址
        em_sts: 0, // 邮箱是否验证
        mob: '', // 手机号
        mob_log: 0, // 是否开启手机登录
        mob_sts: 0, //    手机号是否验证
        set_pwd: 0
      } // 用户信息
    };
  }
  componentDidMount() {
    let isLogin = !!session.get('token');
    this.setState({ isLogin: isLogin });
    this.callService();
  }
  toSelfInfo(e) {
    // 跳转到个人资料页面

    let toSelfInfo = ReactDOM.findDOMNode(this.refs.selfInfo);
    toSelfInfo.click();
    // let next = encodeURIComponent(window.location.href);
    // window.location.href = 'sc.html?next='+ next +'#/user-info';
  }
  toMyBank(e) {
    // 跳转到我的银行卡页面
    let myBank = ReactDOM.findDOMNode(this.refs.myBank);
    myBank.click();
  }
  toNoticeSetting(e) {
    // 跳转到消息设置页面
    let noticeSetting = ReactDOM.findDOMNode(this.refs.noticeSetting);
    noticeSetting.click();
  }
  toSafeAccount() {
    // 跳转到账户安全页面
    let safeAccount = ReactDOM.findDOMNode(this.refs.safeAccount);
    safeAccount.click();
  }
  aboutUs() {
    // 跳转到关于我们页面
    let aboutUs = ReactDOM.findDOMNode(this.refs.aboutUs);
    aboutUs.click();
    // let next = encodeURIComponent(window.location.href);
    // window.location.href = 'sc.html?next='+ next +'#/about-us';
  }

  toChangePwd() {
    // 跳转到修改密码页面
    // let set_pwd = session.get('userInfo').set_pwd;
    console.log(this.state.userInfo.set_pwd);
    let set_pwd = this.state.userInfo.set_pwd;
    if (set_pwd) {
      let changePwd = ReactDOM.findDOMNode(this.refs.changePwd);
      changePwd.click();
    } else {
      window.location.href = '/sc.html#/set-password';
    }
  }
  checkVersion() {
    let checkVersionCallback = this.checkVersionCallback;
    Message.confirm({
      title: '解除绑定后此账号不能快速登录！',
      msg: '若此账号须快速登录须重新绑定',
      btnTxt: ['取消', '确定'],
      btnFn: [
        () => {
          this.cancelCallback;
        },
        () => {
          this.checkVersionCallback;
        }
      ],
      children: <em>内容</em>
    });
  }
  checkVersionCallback() {
    alert(1);
  }
  cancelCallback() {
    alert(2);
  }
  callService() {
    http
      .post('/member/info', {
        token: session.get('token')
      })
      .then(res => {
        this.setState({ userInfo: res.data || {} });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  /**
   * 登出操作
   */
  logout() {
    session.clear('token');
    session.clear('userInfo');
    this.setState({ isLogin: false });
  }

  // 登录
  login() {
    // location.href="/login/login.html";
    location.href = '/account.html#/login';
  }

  // 找回密码
  forgetPassword() {
    // location.href="/login/forgotpsw.html";
    location.href = '/account.html#/findpwd';
  }

  goBack() {
    if (this.state.isLogin) {
      location.hash = '#/';
    } else {
      location.href = './index.html';
    }
  }
  goTo() {
    location.href = '/sc.html';
  }

  render() {
    let { versionShow, userInfo } = this.state;
    let topView, loginMenu, logoutBtn;
    let hasBindBank =
      userInfo.bankCardDetailBOList && userInfo.bankCardDetailBOList.length > 0;
    let contactInfo = '',
      contactNum = '';
    let pwd = this.state.userInfo.set_pwd;
    if (userInfo.mob) {
      contactInfo = '手机:';
      contactNum = Reg.phoneNumberHide(userInfo.mob || '');
    } else if (userInfo.em) {
      contactInfo = '邮箱:';
      contactNum = Reg.mailHide(userInfo.em || '');
    }

    contactInfo += contactNum;
    // userInfo.hd_url = "https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=437161406,3838120455&fm=58";
    let src = userInfo.hd_url
      ? userInfo.hd_url
      : require('@/img/custom@2x.png');

    if (this.state.isLogin) {
      /* 已登录显示个人信息 */
      topView = (
        <div className="st-item" onClick={ this.toSelfInfo.bind(this) }>
          <img className="custom custom-fix" src={ src }
            alt="头像" />
          <div className="info">
            <span>{userInfo.nk_nm}</span>
            <i className="level-z" />
            <div>
              <em className="version">{contactInfo}</em>
            </div>
          </div>
          <div className="icon-arrow-r" />
        </div>
      );

      loginMenu = (
        <section className="st-section">
          <div className="st-item" onClick={ this.toMyBank.bind(this) }>
            <div className="icon-bank-card" />
            <div className="info item-title">我的银行卡</div>
            {hasBindBank ? (
              <div className="icon-arrow-r" />
            ) : (
              <em>绑定银行卡提款更方便</em>
            )}
          </div>
          <div className="st-item" onClick={ this.toChangePwd.bind(this) }>
            <i className="icon-password" />
            <span className="info item-title">
              {pwd == 0 ? '设置密码' : '修改密码'}
            </span>
            <i className="icon-arrow-r" />
          </div>
          {/* <div className="st-item" onClick={this.toNoticeSetting.bind(this)}>
                        <i className="icon-notice"></i>
                        <span>消息通知设置</span>
                        <i className="icon-arrow-r"></i>
                    </div>
                    <div className="st-item" onClick={this.toSafeAccount.bind(this)}>
                        <i className="icon-account"></i>
                        <span>账户与安全</span>
                        <i className="icon-arrow-r"></i>
                    </div> */}
        </section>
      );

      logoutBtn = (
        <button className="quit" onClick={ this.logout.bind(this) }>
          退出
        </button>
      );
    } else {
      /* 未登录显示登录模块 */
      topView = (
        <section className="login-reg">
          {/* <img className="custom" src={require('../../img/custom@2x.png')} alt="头像"/> */}
          <i className="icon-custom" onClick={ this.login.bind(this) } />
          <div className="lr-desc" onClick={ this.login.bind(this) }>
            登录/注册
          </div>
          {/* <div className="dsf-desc">
                        <i></i>
                        <span>合作账号登录</span>
                        <i></i>
                    </div>
                    <div className="dsf">
                        <i className="icon-weixin"></i><i className="icon-qq"></i><i className="icon-weibo"></i><i className="icon-zfbao"></i>
                    </div> */}
          <span className="forget-pwd" onClick={ this.forgetPassword.bind(this) }>
            忘记密码
          </span>
        </section>
      );

      loginMenu = (
        <section className="st-section">
          {/* <div className="st-item" onClick={this.toNoticeSetting.bind(this)}>
                        <i className="icon-notice"></i>
                        <span>消息通知</span>
                        <i className="icon-arrow-r"></i>
                    </div> */}
        </section>
      );
    }

    return (
      <div className="pt-header yc-si setting">
        <Header title="设置" back={ this.goTo.bind(this) } />
        {/* <Header title="设置" /> */}
        {topView}
        {loginMenu}
        <section className="st-section">
          {/* <div className="st-item" onClick={this.checkVersion.bind(this)}>
                        <i className="icon-cloud"></i>
                        <span>新版本检测<i>new</i></span>
                        <em className="version">1.02</em>
                        <i className="icon-arrow-r"></i>
                    </div>
                    <div className="st-item">
                        <i className="icon-star"></i>
                        <span>去评分</span>
                        <i className="icon-arrow-r"></i>
                    </div>
                    <div className="st-item">
                        <i className="icon-help"></i>
                        <span>帮助与反馈</span>
                        <i className="icon-arrow-r"></i>
                    </div> */}
          <div className="st-item" onClick={ this.aboutUs.bind(this) }>
            <div className="icon-us" />
            <div className="info item-title">关于我们</div>
            <div className="icon-arrow-r" />
          </div>
        </section>
        {logoutBtn}
        {/* 路由调整 */}
        <Link to="/user-info" ref="selfInfo" />
        <Link to="/my-bank" ref="myBank" />
        <Link to="/notice-setting" ref="noticeSetting" />
        <Link to="/safe-account" ref="safeAccount" />
        <Link to="/about-us" ref="aboutUs" />
        <Link to="/change-pwd" ref="changePwd" />
      </div>
    );
  }
}
