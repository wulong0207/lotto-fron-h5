/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--问题内容子模块
 */

import React, { Component } from 'react';
import FootCopy from '../components/foot-copy';
import Header from '@/component/header';
import '../css/question-detail.scss';

export default class QuestionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goTo() {
    location.href = '#/question-list';
  }
  render() {
    return (
      <div className="pt-header question-detail">
        {/* <div className="header">
                    <a href="#/question-list" className="back"></a>
                    <div className="user-info big">问题内容</div>
                </div> */}
        <Header title="问题内容" back={ this.goTo.bind(this) } />
        <section className="question-section">
          <div className="question-title">充值需要手续费吗？</div>
          <div className="question-listen">
            <i className="icon-listen" />
            <div className="question-listen-r">
              <p>点击收听客服MM语音解答</p>
              <div className="question-listen-b">
                <span>
                  <i style={ { width: '40%' } } />
                  <em style={ { left: '35%' } } />
                </span>
                <em className="question-time">
                  11:02/<em>00:42</em>
                </em>
              </div>
            </div>
          </div>
          <p className="question-desc">
            您好，网站为您提供的服务均不收费，目前网上银行和支付宝等多个充值方式都免手续费，若充值涉及到第三方支付平台时，对方会收取一定的手续费用，收费标准在充值页面下方都有温馨提示哦。
          </p>
        </section>
        <p className="section-title">你可能遇到的问题</p>
        <section className="sf-section">
          <div className="sf-item">
            <span>没成功怎么办？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>充值太多怎么找送？</span>
            <i className="" />
          </div>
        </section>
        <FootCopy />
      </div>
    );
  }
}
