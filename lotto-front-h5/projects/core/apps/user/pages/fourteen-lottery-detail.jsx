/**
 * Created by manaster
 * date 2017-03-22
 * desc:个人中心模块-14场出票明细子模块
 */

import React, { Component } from 'react';
import Header from '@/component/header';

import '../css/fourteen-lottery-detail.scss';

export default class FourteenLotteryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goTo() {
    location.href = '#number-lottery';
  }
  render() {
    return (
      <div className="pt-header fourteen-lottery-detail">
        {/* <div className="header">
                    <a href="#/number-lottery" className="back"></a>
                    <div className="user-info big">出票明细</div>
                </div> */}
        <Header title="出票明细" back={ this.goTo.bind(this) } />
        <div className="p-item">
          <div className="p-item-div">
            <span className="mb">税前金额：大乐透</span>
            <span className="mb">彩期编号：16138期</span>
            <span className="mb">方案编号：D2012556655455555555555</span>
          </div>
        </div>
        <div className="lot-item">
          <span>开奖号码</span>
          <em className="lot-item-m red">3 1 0 0 1 3 3 3 * 3 0 _ _ _ _</em>
        </div>
        <section className="ticket-section margin-t10">
          <div className="ticket-item">
            <div className="ticket-item-h">
              <div className="ticket-item-h-t">
                <span>
                  第<em className="orange">1</em>张 出票状态：<em className="green">
                    已出票
                  </em>
                </span>
                <span>
                  税前金额 <em className="red">123456.00</em>元
                </span>
              </div>
              <span>标识码：T201615456987*****</span>
            </div>
            <div className="plan-item plan-item-14">
              <span>[普通]</span>
              <span className="plan-item-14-m red">
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
              </span>
              <span className="plan-item-14-r">
                <em className="orange">[5注 * 1倍 = 10元]</em>
              </span>
            </div>
          </div>
          <div className="ticket-item">
            <div className="ticket-item-h">
              <div className="ticket-item-h-t">
                <span>
                  第<em className="orange">2</em>张 出票状态：<em className="green">
                    已出票
                  </em>
                </span>
                <span>未中奖</span>
              </div>
              <span>标识码：T201615456987*****</span>
            </div>
            <div className="plan-item plan-item-14">
              <span>[普通]</span>
              <span className="plan-item-14-m red">
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
                <em>3 1 0 0 1 3 3 3 3 3 0 0 0 1</em>
              </span>
              <span className="plan-item-14-r">
                <em className="orange">[5注 * 1倍 = 10元]</em>
              </span>
            </div>
          </div>
        </section>
        <div className="plan-other">
          还有1234张票<i className="icon-arrow-d-grey" />
        </div>
        {/* 路由跳转 */}
      </div>
    );
  }
}
