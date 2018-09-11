/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--实名认证模块
 */

import React, { Component } from 'react';
import Message from '@/services/message';
// import App from '../../../app';
import session from '@/services/session';
import RegExp from '../components/reg-exp';
import http from '@/utils/request';
import PageHeader from '@/component/page-header';
import { getParameter, subInner } from '@/utils/utils';
import Reg from '@/utils/reg'; // 工具包
import Header from '@/component/header';

import '../css/real-name.scss';

export default class RealName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameDelShow: false,
      idDelShow: false,
      canModify: false,
      coverShow: false,
      userRealName: ''
    };
  }
  componentDidMount() {
    this.userRealName();
  }
  valueChange(type, e) {
    if (type == 'realname') {
      this.refs.realname.value
        ? this.setState({ nameDelShow: true, canModify: true })
        : this.setState({ nameDelShow: false, canModify: false });
    }
    if (type == 'card') {
      this.refs.card.value
        ? this.setState({ idDelShow: true, canModify: true })
        : this.setState({ idDelShow: false, canModify: false });
    }
  }
  clear(type, e) {
    let realname = this.refs.realname;
    let idcard = this.refs.card;
    if (type == 'realname') {
      realname.value = '';
      this.setState({ nameDelShow: false });
      idcard.value ? null : this.setState({ canModify: false });
    }
    if (type == 'card') {
      idcard.value = '';
      this.setState({ idDelShow: false });
      realname.value ? null : this.setState({ canModify: false });
    }
  }
  confirm() {
    let realName = this.refs.realname.value;
    let card = this.refs.card.value;
    let _this = this;
    if (this.state.canModify) {
      if (!realName || !RegExp.realnameReg.test(realName)) {
        if (realName.length > 6) {
          Message.confirm({
            title: '',
            msg: '你的名字超出了系统识别的长度，你可联系在线客服协助完成',
            btnTxt: ['修改', '在线客服'],
            btnFn: [
              () => {
                this.refs.realname.focus(); // 获取光标焦点
              },
              () => {
                _this.refs.tel.click();
              }
            ]
          });
          return;
        } else {
          Message.toast('领奖人姓名输入有误，请确认后重新输入。');
          return;
        }
      }
      if (!card || !Reg.checkIdcard(card)) {
        Message.toast('领奖人身份证错误，请确认后重新输入。');
        return;
      } else {
        let curDate = new Date();
        let cardYear = 0;
        if (card.length == 15) {
          cardYear = 1900;
        } else if (card.length == 18) {
          cardYear = parseInt(card.substring(6, 10));
        }

        if (curDate.getFullYear() - cardYear < 18) {
          Message.alert({ title: '不向未满18周岁的青少年出售彩票！' });
          return;
        }
      }
      Message.confirm({
        btnTxt: ['返回修改', '确认'],
        btnFn: [
          () => {
            console.log('返回修改');
          },
          () => {
            _this.updateRealname(realName, card);
          }
        ],
        children: (
          <div className="msg2">
            <p>
              真实姓名：{realName}
              <em className="red">（需与身份证号码对应）</em>
            </p>
            <span>身份证号码：{card}</span>
          </div>
        )
      });
    }
  }
  updateRealname(realName, card) {
    let self = this;
    http
      .post('/passport/set/realname', {
        token: session.get('token'),
        idCard: card,
        realName: realName
      })
      .then(res => {
        this.setState({ coverShow: false });
        if (!res.success) {
          Message.toast(res.message);
        }
        self.goResult();
        this.userRealName();
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  goResult() {
    let returnUrl = getParameter('next');
    let draw_money = getParameter('draw_money');
    console.log(returnUrl);
    if (returnUrl) {
      window.location.href = returnUrl;
    } else if (draw_money) {
      window.location.href = '/sc.html#/draw-money';
    } else {
      window.location.hash = '#/user-info';
    }
  }

  confirmAgain() {
    // 重新认证
    this.setState({ coverShow: false });
  }
  goTo() {
    location.href = '/sc.html';
  }
  // 获取用户信息
  userRealName() {
    let params = {
      token: session.get('token')
    };
    http
      .post('/member/info', params)
      .then(res => {
        // this.setState({ userRealName: res.data.att_rn });
        session.set('userInfo', res.data);
        if (res.data.att_rn != 1) {
          return Message.toast('您还未进行实名认证');
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    return (
      <div className="pt-header real-name">
        {/* <PageHeader url="#/user-info" title="实名认证"/> */}
        <Header title="实名认证" />
        <section className="sf-section">
          <div className="sf-item">
            <span>真实姓名</span>
            <input
              ref="realname"
              placeholder="实名认证为领奖和提款的唯一凭证"
              onChange={ this.valueChange.bind(this, 'realname') }
              type="text"
            />
            <i
              className={ this.state.nameDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'realname') }
            />
          </div>
          <div className="sf-item">
            <span>身份证号</span>
            <input
              ref="card"
              placeholder="请输入实名认证人身份证号码"
              onChange={ this.valueChange.bind(this, 'card') }
              type="text"
            />
            <i
              className={ this.state.idDelShow ? 'icon-delete' : '' }
              onClick={ this.clear.bind(this, 'card') }
            />
          </div>
        </section>
        <button
          className={ this.state.canModify ? 'btn-blue' : 'btn-grey' }
          onClick={ this.confirm.bind(this) }
        >
          提交
        </button>
        <p className="p-desc">温馨提示：</p>
        <p className="p-desc">
          1.
          真实姓名是您领奖和提款时的重要依据，填写后不可更改。网站不向未满18周岁的青少年出售彩票。
        </p>
        <p className="p-desc">
          2. 您的个人信息将被严格保密，不会用于任何第三方用途。
        </p>
        <p className="p-desc">
          3. 暂不支持港澳台身份证，军官证，护照等相关证件进行实名认证。
        </p>
        {/* 认证失败 */}
        <section
          className="cover"
          style={ { display: this.state.coverShow ? '' : 'none' } }
        >
          <div className="rn-section">
            <div className="rn-section-t">
              <h3 className="red">
                您所填写的身份证信息有误，实名认证未通过！
              </h3>
              <p>1.请检查您的真实姓名和身份证号码填写是否有误</p>
              <p>2.如对实名认证结果有疑问，请联系客服热线：4008-666-999</p>
              <div className="rn-section-wrapper">
                <h4>为什么要实名认证？</h4>
                <p>
                  1.实名购彩能够确保您的账户资金更加安全且是您领奖和提款的唯一凭证
                </p>
                <p>2.确认身份更加便捷，领取网站优惠，奖励迅速到位</p>
                <p>
                  3.实名认证能确保每一位用户公平参与网站活动，维护每个用户的权益
                </p>
              </div>
            </div>
            <a className="alert-btn" onClick={ this.confirmAgain.bind(this) }>
              重新认证
            </a>
          </div>
        </section>
        <a
          ref="tel"
          href="//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663"
          target="_blank"
        />
      </div>
    );
  }
}
