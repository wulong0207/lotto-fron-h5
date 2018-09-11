/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--意见反馈子模块
 */

import React, { Component } from 'react';
import FootCopy from '../components/foot-copy';
import Header from '@/component/header';
import '../css/advice-feed-back.scss';
import cx from 'classnames';

export default class AdviceFeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false
    };
  }
  showList() {
    this.setState({
      coverShow: !this.state.coverShow
    });
  }
  goTo() {
    window.location.href = '#/service-hall';
  }
  render() {
    let { coverShow } = this.state;
    return (
      <div className="pt-header advice-feed-back">
        <Header title="意见反馈" back={ this.goTo.bind(this) } />
        <section className="sf-section">
          <div className="sf-item">
            <span>手机号码</span>
            <input
              className="ipt"
              placeholder="请输入11位的手机号码"
              type="tel"
            />
            <i className="icon-delete" />
          </div>
          <div className="sf-item">
            <span>请选择问题分类</span>
            <em className="f16">登录问题</em>
            <i
              className="icon-arrow-d-grey"
              onClick={ this.showList.bind(this) }
            />
          </div>
        </section>
        <section className={ cx('feedback-section', coverShow ? ' ' : 'cxHide') }>
          <ul>
            <li>登录问题</li>
            <li>注册问题</li>
            <li>安装问题</li>
            <li>投注选号</li>
            <li>机选投注</li>
            <li>合买跟单</li>
            <li>充值问题</li>
            <li>提现问题</li>
            <li>查询问题</li>
            <li>资料修改</li>
            <li>其他问题</li>
          </ul>
        </section>
        <p className="section-title">请简要描述你的问题和建议</p>
        <section className="fb-section">
          <textarea placeholder="请输入" />
          <p>
            <span>14/140</span>
          </p>
        </section>
        <section className="fb-section">
          <p className="clearfix">
            <em className="fl">添加图片</em>
            <span>1/3</span>
          </p>
          <div className="fb-pic-section">
            <span className="fb-pic">
              <img src={ require('../img/bg.png') } alt="图片" />
              <i className="icon-delete-org" />
            </span>
            <i className="icon-picadd" />
          </div>
        </section>
        <button className="btn-blue">提交</button>
        <FootCopy name="st-copy" />
      </div>
    );
  }
}
