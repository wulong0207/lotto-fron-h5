/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--问题列表子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Header from '@/component/header';

import '../css/question-list.scss';

export default class QuestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  questionDetail() {
    let questionDetail = ReactDOM.findDOMNode(this.refs.questionDetail);
    questionDetail.click();
  }
  goTo() {
    location.href = '#/service-hall';
  }
  render() {
    return (
      <div className="pt-header question-list">
        {/* <div className="header">
                    <a href="#/service-hall" className="back"></a>
                    <div className="user-info big">问题列表</div>
                </div> */}
        <Header title="问题列表" back={ this.goTo.bind(this) } />
        <p className="section-title">热点问题</p>
        <section className="sf-section">
          <div className="sf-item" onClick={ this.questionDetail.bind(this) }>
            <span>如何更换提款银行卡？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>网站充值方式有哪些？</span>
            <i className="icon-voice" />
          </div>
          <div className="sf-item">
            <span>充值需要手续费吗？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>如何提取账户上的奖金？</span>
            <i className="icon-voice" />
          </div>
          <div className="sf-item">
            <span>如何给账户充值？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>提款后，金额怎么冻结了？</span>
            <i className="icon-voice" />
          </div>
        </section>
        <p className="section-title">注册充值</p>
        <section className="sf-section">
          <div className="sf-item">
            <span>如何更换提款银行卡？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>网站充值方式有哪些？</span>
            <i className="icon-voice" />
          </div>
          <div className="sf-item">
            <span>充值需要手续费吗？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>如何提取账户上的奖金？</span>
            <i className="icon-voice" />
          </div>
          <div className="sf-item">
            <span>如何给账户充值？</span>
            <i className="" />
          </div>
          <div className="sf-item">
            <span>提款后，金额怎么冻结了？</span>
            <i className="icon-voice" />
          </div>
        </section>
        {/* 路由跳转 */}
        <Link to="/question-detail" ref="questionDetail" />
      </div>
    );
  }
}
