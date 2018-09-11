/*
 * @Author: nearxu
 * @Date: 2017-12-16 14:52:43
 * 投注列表
 */

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import iScroll from 'iscroll/build/iscroll-probe';
// import ReactIScroll from 'react-iscroll';
import session from '@/services/session';
import { setDate, formatMoney } from '@/utils/utils';
import http from '@/utils/request';
import Message from '@/services/message';
import Const from '@/utils/const';
import Navigator from '@/utils/navigator';
import OrderHelper from '../components/order-helper';
import NoMsg from '@/component/no-msg';
import '../css/plan-tablist.scss';
import cx from 'classnames';
import Ssq from '../components/quick-ssq';

export class PlanTabList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false, // 方案的显示与否
      activeTab: 0,
      activeLi: 4, // 列表按钮激活
      total: null, // 订单总数
      orderInfoAll: [], // 订单信息
      buyType: 0 // 默认全部类型
    };
    this.pageindex = 0; // 默认第一页
    this.orderType = ['', '未推', '已推', '']; // 抄单状态
    this.classList = [
      {
        name: '代购'
      },
      {
        name: '追号'
      },
      {
        name: '合买'
      },
      {
        name: '抄单'
      },
      {
        name: '全部购买类型'
      }
    ];
  }
  componentDidMount() {
    this.callOrderService(0, 0);
  }
  callOrderService(type, buyType) {
    let date = new Date();
    let datePre = new Date();
    setDate.setYears(datePre, -1);
    http
      .post('/order/orderlist', {
        beginDate: setDate.formatDate(datePre, 'yyyy-MM-dd'),
        buyType: buyType, // 1：代购；2：追号；3：合买 ;4:抄单，全部传0
        lotteryCode: '',
        endDate: setDate.formatDate(date, 'yyyy-MM-dd'),
        pageIndex: this.pageindex,
        pageSize: 10,
        source: 1,
        token: session.get('token'),
        type: type // 2：中奖方案；3：待开奖，全部传0
      })
      .then(res => {
        let resultData = res.data;
        if (type === 0 && buyType === 0) {
          if (res.data.data.length) {
            // 全部投注记录为空
            this.setState({ newPersonal: true });
          }
        }
        let { orderInfoAll } = this.state;
        orderInfoAll = this.state.orderInfoAll.concat(resultData.data);
        this.setState({
          orderInfoAll,
          total: res.data.total
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  tabClick(e) {
    this.pageindex = 0;
    if (this.planList) {
      this.planList.scrollTop = 0; // tab切换默认回顶部
    }
    let index = +e.currentTarget.getAttribute('data-index');
    if (index === 1) {
      let show = false;
      if (index === 1) {
        show = !this.state.show;
      }
      index = 0; // type 2：中奖方案；3：待开奖，全部传0
      this.setState({
        show: show,
        activeTab: index
      });
    } else {
      this.setState({
        activeTab: index,
        show: false,
        orderInfoAll: []
      });
      this.callOrderService(index, 0);
    }
  }
  checkPlan(index) {
    // 订单类型 点击
    switch (index) {
      case 0:
        this.title.innerText = '代购';
        break;
      case 1:
        this.title.innerText = '追号';
        break;
      case 2:
        this.title.innerText = '合买';
        break;
      case 3:
        this.title.innerText = '抄单';
        break;
      default:
        this.title.innerText = '全部方案';
        break;
    }
    let buyType = 0;
    // 1：代购；2：追号；3：合买 ，全部传0
    if (index > 4) {
      buyType = 0;
    } else {
      buyType = index + 1;
    }
    this.setState({
      activeLi: index,
      show: false,
      activeTab: 0,
      buyType: buyType,
      orderInfoAll: []
    });
    this.callOrderService(0, buyType);
  }
  gotoLotteryDetail(resultItem) {
    // 订单详情
    Navigator.handleLotteryDetail(resultItem);
  }
  loadMore() {
    this.pageindex++;
    this.callOrderService(this.state.activeTab, this.state.buyType);
  }
  render() {
    let { activeTab, show, activeLi, orderInfoAll, total } = this.state;
    // if (!total) return null;
    return (
      <div className="tab-list yc-pt">
        <section className="tab-header">
          <div
            data-index={ 1 }
            className={ activeTab === 0 ? 'tab-active' : '' }
            onClick={ this.tabClick.bind(this) }
          >
            <span ref={ title => (this.title = title) }> 全部方案 </span>
            <i
              className={
                activeTab === 0
                  ? show ? 'icon-arrow-u-blue' : 'icon-arrow-d-blue'
                  : 'icon-arrow-d'
              }
            />
          </div>
          <div
            className={ activeTab === 2 ? 'tab-active' : '' }
            data-index={ 2 }
            onClick={ this.tabClick.bind(this) }
          >
            中奖方案
          </div>
          <div
            className={ activeTab === 3 ? 'tab-active' : '' }
            data-index={ 3 }
            onClick={ this.tabClick.bind(this) }
          >
            待开奖方案
          </div>
        </section>
        <section className={ cx('all-plan', show ? '' : 'cxHide') }>
          <ul>
            {this.classList.map((m, i) => {
              return (
                <li
                  className="showflex align-items"
                  onClick={ this.checkPlan.bind(this, i) }
                  key={ i }
                >
                  <div className={ activeLi === i ? 'blue flex' : 'flex' }>
                    {' '}
                    {m.name}{' '}
                  </div>
                  <div className={ activeLi === i ? 'icon-choice' : '' } />
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          {orderInfoAll.length < 1 ? (
            <NoMsg style={ { marginTop: 50 } } msg="没有方案！" />
          ) : (
            <div
              className="plan-list-bet"
              ref={ planList => (this.planList = planList) }
            >
              {orderInfoAll.map((resultItem, index) => {
                let {
                  message,
                  date,
                  noListColor,
                  nowLottery
                } = OrderHelper.getUnionDescription(resultItem);
                let riclassName = 'red';
                if (noListColor) {
                  riclassName = '';
                }
                // 推单 状态
                let copyStyle = '';
                if (resultItem.orderType) {
                  switch (resultItem.orderType) {
                    case 1: // 未推
                      copyStyle = 'copy-red';
                      break;
                    case 2: // 已推单
                    case 3: // 已跟单
                      copyStyle = 'copy-grey';
                      break;
                    default:
                      break;
                  }
                }
                return (
                  <div
                    key={ index }
                    className="tab-item"
                    onClick={ this.gotoLotteryDetail.bind(this, resultItem) }
                  >
                    <div className="tab-item-top">
                      <span className="title">
                        <span>{resultItem.lotteryName}</span>
                        <span className="title-issue">
                          {resultItem.lotteryIssue}期
                        </span>
                        {resultItem.orderType === 1 ||
                        resultItem.orderType === 2 ? (
                            <b className={ copyStyle }>
                              {' '}
                              {this.orderType[resultItem.orderType]}{' '}
                            </b>
                          ) : (
                            ''
                          )}
                      </span>
                      <span className={ riclassName }>{message}</span>
                      {nowLottery ? (
                        <img
                          className="nowLottery"
                          src={ require('@/img/dangqian@2x.png') }
                          alt=""
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="tab-item-bottom">
                      <span>
                        {resultItem.orderType === 3
                          ? '抄单'
                          : Const.getBuyType(resultItem.buyType)}
                        <em className="red">
                          {formatMoney(resultItem.orderAmount)}
                        </em>
                        元
                      </span>
                      <span className="grey">{date}</span>
                    </div>
                  </div>
                );
              })}
              {parseInt(this.state.total) > parseInt(orderInfoAll.length) ? (
                <div className="load-more" onClick={ this.loadMore.bind(this) }>
                  <span> 加载更多 </span>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </section>
      </div>
    );
  }
}
