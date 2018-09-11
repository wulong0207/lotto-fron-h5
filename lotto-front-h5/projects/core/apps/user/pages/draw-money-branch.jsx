/**
 * Created by manaster
 * date 2017-03-16
 * desc:个人中心模块--提款分支行子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Header from '@/component/header';
import FootCopy from '../components/foot-copy';
import Interaction from '@/utils/interaction';
import '../css/draw-money-branch.scss';

export default class DrawMoneyBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBranch: 0,
      isSearchBranch: false
    };
  }
  chooseBranch(e) {
    let index = +e.currentTarget.getAttribute('data-index');
    this.setState({
      activeBranch: index
    });
  }
  goBranch() {
    this.setState({
      isSearchBranch: true
    });
  }
  goTo() {
    location.href = '#/draw-money';
  }
  render() {
    let { activeBranch, isSearchBranch } = this.state;
    return (
      <div className="pt-header draw-money-branch">
        {/* <div className="header">
                    <a href="#/draw-money" className="back"></a>
                    <div className="user-info big">提款申请</div>
                </div> */}
        <Header title="提款申请" back={ this.goTo.bind(this) } />
        {/* 新增银行卡 */}
        <section style={ { display: isSearchBranch ? 'none' : '' } }>
          <div className="bank-section">
            <div className="bank-item">
              <img
                className="bank-img"
                src={ require('../img/bank/cmb@2x.png') }
                alt="农行"
              />
              <div className="bank-item-r">
                <div className="bank-name">
                  <span>招商银行 *****679</span>
                  <em>储蓄卡 快捷</em>
                </div>
              </div>
            </div>
          </div>
          <section className="sf-section">
            <div className="sf-item">
              <span>开户行地区</span>
              <em>广东省 深圳市 南山区</em>
              <i className="icon-arrow-r" />
            </div>
            <div className="sf-item" onClick={ this.goBranch.bind(this) }>
              <span>分支行名称</span>
              <em>请选择开户分支行名称</em>
              <i className="icon-arrow-r" />
            </div>
          </section>
          <p className="money-p">
            <span className="orange">可提金额：12,345,678.00元</span>
            <span>中奖金额：12,000,000.00元</span>
          </p>
          <p className="money-p">
            <span>充值金额：345,678.00元</span>
          </p>
          <button className="btn-grey">确认</button>
        </section>
        {/* 分支行查找页面 */}
        <section
          className="draw-money-search"
          style={ { display: isSearchBranch ? '' : 'none' } }
        >
          <section className="service-search">
            <div className="search-contian">
              <div className="search-wrapper">
                <i className="icon-search" />
                <input type="text" placeholder="请输入关键字" />
                <i className="icon-delete" />
              </div>
            </div>
          </section>
          {/* 查询有结果 */}
          <section style={ { display: '' } }>
            <div
              className="draw-item"
              data-index={ 1 }
              onClick={ this.chooseBranch.bind(this) }
            >
              <div className="draw-item-l">
                <span>招商银行威盛大厦支行</span>
                <span>深南大道9966号威盛科技大厦首层</span>
              </div>
              <i className={ activeBranch == 1 ? 'icon-bank-sup' : '' } />
            </div>
            <div className="draw-item">
              <div className="draw-item-l">
                <span>招商银行威盛大厦支行</span>
                <span>深南大道9966号威盛科技大厦首层</span>
              </div>
              <i className="" />
            </div>
            <div className="draw-item">
              <div className="draw-item-l">
                <span>招商银行威盛大厦支行</span>
                <span>深南大道9966号威盛科技大厦首层</span>
              </div>
              <i className="" />
            </div>
            <div className="draw-item">
              <div className="draw-item-l">
                <span>招商银行威盛大厦支行</span>
                <span>深南大道9966号威盛科技大厦首层</span>
              </div>
              <i className="" />
            </div>
          </section>
          {/* 查询无结果 */}
          <div className="no-msg" style={ { display: 'none' } }>
            <i className="icon-errpic" />
            <span>未找到相关的支行！</span>
            <span>
              填写支付名称遇到问题，请点击<a href="#/">这里</a>参考
            </span>
            <span>
              如未找到你银行卡的分支行名称，请联系<a href="#/">在线客服</a>
            </span>
          </div>
        </section>
        {/* 路由调整 */}
      </div>
    );
  }
}
