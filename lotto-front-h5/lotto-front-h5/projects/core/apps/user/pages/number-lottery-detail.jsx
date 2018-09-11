/**
 * Created by manaster
 * date 2017-03-20
 * desc:个人中心模块-出票明细子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import http from '@/utils/request';
import session from '@/services/session';
import Message from '@/services/message';
import Const from '@/utils/const';
import OrderHelper from '../components/order-helper';
import Header from '@/component/header';
import '../css/lottery-container.scss';

export default class NumberLotteryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lotteryDataList: {}
    };
  }

  componentDidMount() {
    this.reqNumOrderList();
  }

  reqNumOrderList() {
    http
      .post('/order/queryUserNumOrderList', {
        token: session.get('token'),
        pageIndex: 0,
        pageSize: 5,
        source: 1,
        orderCode: this.numberLotteryDetail.orderCode
      })
      .then(res => {
        this.setState({ lotteryDataList: res.data || {} });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  goTo() {
    location.href = '#/number-lottery';
  }
  render() {
    this.numberLotteryDetail = session.get('numberLotteryDetail') || {};
    let userNumPage = this.state.lotteryDataList.data || [];

    return (
      <div className="pt-header number-lottery-detail">
        {/* <div className="header">
                    <a href="#/number-lottery" className="back"></a>
                    <div className="user-info big">出票明细</div>
                </div> */}
        <Header title="出票明细" back={ this.goTo.bind(this) } />
        <div className="p-item">
          <div className="p-item-div">
            <span className="mb">
              彩种名称：{this.numberLotteryDetail.lotteryName}
            </span>
            <span className="mb">
              彩期编号：{this.numberLotteryDetail.lotteryIssue}期
            </span>
            <span className="mb">
              方案编号：{this.numberLotteryDetail.orderCode}
            </span>
          </div>
        </div>
        <div className="lot-item">
          <span>开奖号码</span>
          <em className="lot-item-m">
            {OrderHelper.getNumberShow(this.numberLotteryDetail.drawCode, 1)}
          </em>
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
            <div className="plan-item">
              <div className="plan-item-h">
                <span>[普通]</span>
                <div className="plan-item-h-r">
                  <i className="red">02 05 11 15 19 28</i> +{' '}
                  <i className="blue">02</i>
                  <span className="orange">[1注 * 1倍 = 2元]</span>
                </div>
              </div>
            </div>
          </div>
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
            <div className="plan-item">
              <div className="plan-item-h">
                <span>[普通]</span>
                <div className="plan-item-h-r">
                  <i className="red">02 05 11 15 19 28</i> +{' '}
                  <i className="blue">02</i>
                  <span className="orange">[1注 * 1倍 = 2元]</span>
                </div>
              </div>
              <div className="plan-item-f">
                <div className="plan-item-f-w">
                  <i>[胆拖]</i>
                  <em className="green">[前区胆码]</em>
                  <span className="red">01 02 03</span>
                </div>
                <div className="plan-item-f-w">
                  <i />
                  <em>[前区拖码]</em>
                  <span className="red">
                    01 02 03 01 02 03 01 02 03 01 02 03 01 02 03 01 02 03 01 02
                    03 01 02 03 01 02 03 01 02 03
                  </span>
                </div>
                <div className="plan-item-f-w">
                  <i />
                  <em>[后区号码]</em>
                  <span className="blue">
                    01 02 03 01 02 03 01 02 03 01 02 03 01 02 03 01 02
                  </span>
                </div>
                <div className="plan-item-f-w">
                  <span className="tr orange">
                    [17721088注 * 1倍 = 123,456,789元]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="plan-other">
          还有1234个方案<i className="icon-arrow-d-grey" />
        </div>
        {/* 路由跳转 */}
      </div>
    );
  }
}
