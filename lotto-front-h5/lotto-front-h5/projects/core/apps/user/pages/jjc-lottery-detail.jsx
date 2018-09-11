/**
 * Created by manaster
 * date 2017-03-21
 * desc:个人中心模块-竞技彩出票明细子模块
 */

import React, { Component } from 'react';
import Header from '@/component/header';
import '../css/jjc-lottery-detail.scss';

export default class JjcLotteryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goTo() {
    location.href = '#/number-lottery';
  }
  render() {
    return (
      <div className="pt-header jjc-lottery-detail">
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
        <section className="ticket-section margin-t10">
          <div className="ticket-item margin-b10">
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
            <section>
              <div className="jjc-detail-item">
                <div className="jjc-item-h">
                  <span>周一001 天皇杯</span>
                  <span>
                    东京FC <em className="c999">vs</em> FC本田
                  </span>
                  <span>
                    半：<em className="red">2:1</em> 全:{' '}
                    <em className="red">2:1</em>
                  </span>
                </div>
                <div className="jjc-item-b">
                  <span className="jjc-item-b-l">胜负平</span>
                  <div className="jjc-item-b-m">
                    <div>
                      <span className="orange-fill">胜@102.505</span>
                      <span>胜@102.505</span>
                      <span>胜@102.505</span>
                    </div>
                  </div>
                  <span className="jjc-item-b-r">胜</span>
                </div>
              </div>
              <div className="jjc-detail-item">
                <div className="jjc-item-h">
                  <span>周一001 天皇杯</span>
                  <span>
                    东京FC <em className="c999">vs</em> FC本田
                  </span>
                  <span>
                    <em className="grey">比赛中</em>{' '}
                    <em className="blue">直播</em>
                    <em className="orange fr" />
                  </span>
                </div>
                <div className="jjc-item-b">
                  <span className="jjc-item-b-l">胜负平</span>
                  <div className="jjc-item-b-m">
                    <div>
                      <span className="orange-fill">胜@102.505</span>
                      <span>胜@102.505</span>
                      <span>胜@102.505</span>
                    </div>
                  </div>
                  <span className="jjc-item-b-r">胜</span>
                </div>
              </div>
            </section>
            <div className="p-item">
              <span>过关方式：2串1</span>
              <em className="orange">[17721088注 * 1倍 = 123,456,789元]</em>
            </div>
          </div>
          <div className="ticket-item margin-b10">
            <div className="ticket-item-h">
              <div className="ticket-item-h-t">
                <span>
                  第<em className="orange">2</em>张 出票状态：<em className="green">
                    已出票
                  </em>
                </span>
                <span>
                  税前金额 <em className="red">123456.00</em>元
                </span>
              </div>
              <span>标识码：T201615456987*****</span>
            </div>
            <section>
              <div className="jjc-detail-item">
                <div className="jjc-item-h">
                  <span>周一001 天皇杯</span>
                  <span>
                    东京FC <em className="c999">vs</em> FC本田
                  </span>
                  <span>
                    半：<em className="red">2:1</em> 全:{' '}
                    <em className="red">2:1</em>
                  </span>
                </div>
                <div className="jjc-item-b">
                  <span className="jjc-item-b-l">胜负平</span>
                  <div className="jjc-item-b-m">
                    <div>
                      <span className="orange-fill">胜@102.505</span>
                      <span>胜@102.505</span>
                      <span>胜@102.505</span>
                    </div>
                  </div>
                  <span className="jjc-item-b-r">胜</span>
                </div>
              </div>
              <div className="jjc-detail-item">
                <div className="jjc-item-h">
                  <span>周一001 天皇杯</span>
                  <span>
                    东京FC <em className="c999">vs</em> FC本田
                  </span>
                  <span>
                    <em className="grey">比赛中</em>{' '}
                    <em className="blue">直播</em>
                    <em className="orange fr" />
                  </span>
                </div>
                <div className="jjc-item-b">
                  <span className="jjc-item-b-l">胜负平</span>
                  <div className="jjc-item-b-m">
                    <div>
                      <span className="orange-fill">胜@102.505</span>
                      <span>胜@102.505</span>
                      <span>胜@102.505</span>
                    </div>
                  </div>
                  <span className="jjc-item-b-r">胜</span>
                </div>
              </div>
            </section>
            <div className="p-item">
              <span>过关方式：2串1</span>
              <em className="orange">[17721088注 * 1倍 = 123,456,789元]</em>
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
