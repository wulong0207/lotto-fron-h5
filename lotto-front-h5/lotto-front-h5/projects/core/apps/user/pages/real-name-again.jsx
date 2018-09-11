/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--实名认证重新提交模块
 */

import React, { Component } from 'react';
import FootCopy from '../components/foot-copy';
import Header from '@/component/header';

import '../css/real-name-again.scss';

export default class RealNameAgain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goTo() {
    location.href = '#/user-info';
  }
  render() {
    return (
      <div className="pt-header real-name-again">
        {/* <div className="header">
                    <a href="#/user-info" className="back"></a>
                    <div className="user-info big">实名认证</div>
                </div> */}
        <Header title="实名认证" back={ this.goTo.bind(this) } />
        <section className="phone-detail">
          <div className="icon-identify" />
          <div className="phone-number">
            <p>您填写的身份证信息有误，实名认证未通过！</p>
          </div>
          <p className="phone-desc">
            1.请检查您的真实姓名和身份证号码填写是否有误。
          </p>
          <p className="phone-desc">
            2.如对实名认证结果有疑问，请联系客服热线4008-666-999。
          </p>
          <button className="btn-blue">重新提交</button>
        </section>
        <FootCopy />
      </div>
    );
  }
}
