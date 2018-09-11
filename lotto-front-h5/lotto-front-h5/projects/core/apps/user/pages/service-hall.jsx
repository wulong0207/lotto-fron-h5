/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--服务大厅子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import FootCopy from '../components/foot-copy';
import Navigator from '@/utils/navigator';
import Header from '@/component/header';

import '../css/service-hall.scss';

export default class ServiceHall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false
    };
  }
  cancelSearch() {
    this.setState({
      isSearch: false
    });
  }
  toSearch(e) {
    let index = e.currentTarget.getAttribute('data-index');
    if (index == 1) {
      this.setState({ isSearch: true });
    }
  }
  questionList() {
    // 跳转到问题列表页面
    let questionList = ReactDOM.findDOMNode(this.refs.questionList);
    questionList.click();
  }
  adviceFeedBack() {
    // 跳转到意见反馈页面
    let adviceFeedBack = ReactDOM.findDOMNode(this.refs.adviceFeedBack);
    adviceFeedBack.click();
  }
  goTo() {
    location.href = '/sc.html';
  }

  render() {
    let { isSearch } = this.state;
    return (
      <div className="pt-header service-hall">
        {/* <div className="header">
                    <a href="#/" className="back"></a>
                    <div className="user-info big">服务大厅</div>
                </div> */}
        <Header title="服务大厅" back={ this.goTo.bind(this) } />
        <section className="service-search">
          {isSearch ? (
            <div className="search-contian">
              <div className="search-wrapper">
                <i className="icon-search" />
                <input type="text" />
                <i className="icon-delete" />
              </div>
              <span onClick={ this.cancelSearch.bind(this) }>取消</span>
            </div>
          ) : (
            <div
              className="search-wrapper"
              data-index={ 1 }
              onClick={ this.toSearch.bind(this) }
            >
              <i className="icon-search" />
              <span>搜索</span>
            </div>
          )}
        </section>
        <section className="service-choice">
          <dl className="service-dl" onClick={ this.questionList.bind(this) }>
            <dt className="icon-question" />
            <dd>热点问题</dd>
          </dl>
          <dl className="service-dl">
            <dt className="icon-pay" />
            <dd>注册充值</dd>
          </dl>
          <dl className="service-dl">
            <dt className="icon-buytic" />
            <dd>购买彩票</dd>
          </dl>
        </section>
        <section className="service-choice">
          <dl className="service-dl">
            <dt className="icon-award" />
            <dd>兑奖提现</dd>
          </dl>
          <dl
            className="service-dl"
            onClick={ Navigator.go.bind(Navigator, Navigator.Pages.SafeAccount) }
          >
            <dt className="icon-casafe" />
            <dd>账号安全</dd>
          </dl>
          <dl className="service-dl">
            <dt className="icon-helpmore" />
            <dd>更多帮助</dd>
          </dl>
        </section>
        <section className="sf-section">
          <div className="sf-item">
            <span>在线客服</span>
            <em />
          </div>
          <div className="sf-item">
            <span>客服电话</span>
            <em>
              <a className="f16c666" href="tel:4008-123-123">
                4008-123-123
              </a>
            </em>
          </div>
          <div className="sf-item" onClick={ this.adviceFeedBack.bind(this) }>
            <span>意见反馈</span>
            <em />
          </div>
        </section>
        <FootCopy />
        {/* 路由跳转 */}
        <Link to="/question-list" ref="questionList" />
        <Link to="/advice-feed-back" ref="adviceFeedBack" />
      </div>
    );
  }
}
