/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-账户安全子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FootCopy from '../components/foot-copy';
import iScroll from 'iscroll/build/iscroll-probe';
import ReactIScroll from 'react-iscroll';
import http from '@/utils/request';
import Message from '@/services/message';
import session from '@/services/session';
import Header from '@/component/header';

import '../css/safe-account.scss';

export default class SafeAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      y: 0,
      iScrollOptions: {
        mouseWheel: false,
        scrollbars: false,
        scrollX: false,
        scrollY: true,
        probeType: 2
      },
      userInfo: {}
    };
  }
  componentDidMount() {
    this.callService();
  }
  callService() {
    http
      .get('/userinfo/index', {
        params: {
          token: session.get('token')
        }
      })
      .then(res => {
        this.setState({ userInfo: res.data || {} });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  onScroll(iScrollInstance) {
    // console.log(iScrollInstance);
    if (iScrollInstance.y > 50) {
      alert(111);
    }
  }
  onRefresh(iScrollInstance) {
    var yScroll = iScrollInstance.y;
    if (this.state.y != yScroll) {
      this.setState({ y: yScroll });
    }
  }
  /**
   * 字段控制显示
   */
  showLabel(msg) {
    return msg || '--';
  }

  /**
   * 获取问候语
   */
  getGreeting() {
    let result = '';
    let time = new Date();
    let early = 5 * 60 * 60;
    let morning = 8 * 60 * 60;
    let noon = 13 * 60 * 60;
    let afternoon = 18 * 60 * 60;

    let current =
      (time.getHours() * 60 + time.getMinutes()) * 60 + time.getSeconds();
    if (current < early) {
      result = '凌晨好，';
    } else if (current < morning) {
      result = '早晨好，';
    } else if (current < noon) {
      result = '中午好，';
    } else if (current < afternoon) {
      result = '下午好，';
    } else {
      result = '晚上好，';
    }

    return result;
  }

  /**
   * 获取等级
   */
  getLevel() {
    let { userInfo } = this.state;
    let result = {};
    let score = 0;

    // 手机号是否验证
    if (userInfo.mob_sts) {
      score += 18;
    }

    // 邮箱是否验证
    if (userInfo.em_sts) {
      score += 14;
    }

    // 实名认证
    if (userInfo.id_c) {
      score += 20;
    }

    // 绑定银行卡
    if (userInfo.bk_ct) {
      score += 14;
    }

    // 修改账户名
    if (userInfo.acc_m) {
      score += 15;
    }

    // 设置密码
    if (userInfo.set_pwd) {
      score += 20;
    }

    // 账号安全积分
    if (userInfo.sf_intgl < 60) {
      result.level = '低';
      result.levelClass = 'icon-levellow';
      result.levelPro = 'account-level-low';
    } else if (userInfo.sf_intgl >= 60 && userInfo.sf_intgl <= 99) {
      result.level = '中';
      result.levelClass = 'icon-levelmid';
      result.levelPro = 'account-level-mid';
    } else {
      result.level = '高';
      result.levelClass = 'icon-levelhigh';
      result.levelPro = 'account-level-high';
    }

    result.width = userInfo.sf_intgl + '%';

    return result;
  }
  goTo() {
    location.href = '#/setting';
  }

  render() {
    let { userInfo } = this.state;
    let levelInfo = this.getLevel();

    return (
      <div className="pt-header safe-account">
        {/* <div className="header">
                    <a href="#/setting" className="back"></a>
                    <div className="user-info big">账户安全</div>
                </div> */}
        <Header title="账户安全" back={ this.goTo.bind(this) } />
        <section className="sa-wrapper">
          <ReactIScroll
            iScroll={ iScroll }
            options={ this.state.iScrollOptions }
            onScroll={ this.onScroll.bind(this) }
            onRefresh={ this.onRefresh.bind(this) }
          >
            <div>
              <section className="account-section">
                <div className={ levelInfo.levelClass } />
                <div className="account-section-r">
                  <span className="account-name">
                    {this.getGreeting()}
                    {this.showLabel(userInfo.acc)}
                  </span>
                  <em>2014-07-04 10:45:16 在广东省登录了2N彩票账户</em>
                  <div className={ 'account-level ' + levelInfo.levelPro }>
                    账户安全等级：
                    <span>
                      <i style={ { width: levelInfo.width } } />
                    </span>
                    <em>
                      {userInfo.sf_intgl}分 {levelInfo.level}
                    </em>
                  </div>
                </div>
              </section>
              <p className="section-title">
                完成以下安全产品，可以提升安全指数！
              </p>
              <section className="sf-section">
                <div className="sf-item">
                  <div className="sf-item-l">
                    <span>
                      实名认证<i>+15分</i>
                    </span>
                    <em>实名认证是领大奖和提款的唯一凭证</em>
                  </div>
                  <i className="icon-arrow-r" />
                </div>
                <div className="sf-item">
                  <div className="sf-item-l">
                    <span>
                      绑定手机<i>+15分</i>
                    </span>
                    <em>90%的用户选择绑定手机来保护账户安全</em>
                  </div>
                  <i className="icon-arrow-r" />
                </div>
              </section>
              <p className="section-title">操作信息</p>
              <section className="sf-section">
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
                <div className="account-item">
                  <span>资金变动 _ 充值</span>
                  <span>招行储蓄卡 尾号888</span>
                  <span>12-18 13:15:52 中国广东省深圳市 电脑</span>
                </div>
              </section>
            </div>
          </ReactIScroll>
        </section>
      </div>
    );
  }
}
