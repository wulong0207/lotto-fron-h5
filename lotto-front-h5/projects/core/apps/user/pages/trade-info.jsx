/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--交易明细子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import http from '@/utils/request';
import Message from '@/services/message';
import session from '@/services/session';
import NoMsg from '@/component/no-msg';
import Header from '@/component/header';
import OrderHelper from '../components/order-helper';
import Navigator from '@/utils/navigator.js';

import '../css/trade-info.scss';

export default class TradeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transList: [],
      totalPage: 0
    };
    this.page = 1;
  }
  componentDidMount() {
    this.getTradeInfo();
  }
  tradeDetail(subItem) {
    // debugger;
    console.log(subItem);
    switch (subItem.transType) {
      case 1: // 充值
        if (subItem.tradeCode) {
          window.location.hash = '#/cz-trade-detail/' + subItem.tradeCode;
        } else {
          window.location.hash = '#/trade-detail/' + subItem.transCode;
        }

        break;
      case 5: // 提款
        if (subItem.tradeCode) {
          window.location.hash = '#/tk-trade-detail/' + subItem.tradeCode;
        } else {
          window.location.hash = '#/trade-detail/' + subItem.transCode;
        }

        break;
      case 2: // 购彩
      case 3: // 返奖
      case 4: // 退款
        if (subItem.lotteryCode && subItem.orderCode && subItem.transCode) {
          Navigator.goLotteryDetail(subItem);
        }
        break;
      default:
        return ' ';
        break;
    }
  }
  getTradeInfo() {
    http
      .get('/trans/transList', {
        params: {
          token: session.get('token'),
          currentPage: this.page,
          showCount: 20
        }
      })
      .then(res => {
        let transList = [];
        if (res.data) {
          this.state.totalPage = res.data.totalPage;
          transList = res.data.dataList.reduce((acc, d) => {
            let list = acc.concat();
            const month = d.month;
            const monthIndex = list.map(l => l.month).indexOf(month);
            if (monthIndex > -1) {
              list[monthIndex].list = list[monthIndex].list.concat(d.list);
              return list;
            }
            list.push(d);
            return list;
          }, this.state.transList);
          // transList=this.state.transList.concat(res.data.dataList);
        }
        this.setState({ transList: transList });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  goPay(item) {
    OrderHelper.goDirectPay(item.orderCode, item.buyType);
  }

  // 加载更多
  loadMore() {
    this.page++;
    this.getTradeInfo();
  }

  /**
   * 生成列表
   */
  generateList() {
    let transList = this.state.transList || [];
    let self = this;
    let result = [];
    // 交易类型1：充值；2：购彩；3：返奖；4：退款；5：提款；6：其它；7：活动赠送；8：活动消费
    let transType = [
      '',
      '充值',
      '购彩',
      '返奖',
      '退款',
      '提款',
      '其它',
      '活动赠送',
      '活动消费',
      '扣款'
    ];

    for (var i = 0; i < transList.length; i++) {
      let item = transList[i];
      let subItemList = [];
      for (var j = 0; j < item.list.length; j++) {
        let subItem = item.list[j];
        let color = ''; // 1：充值；3：返奖；4：退款 red
        if (subItem.showAmount.substring(0, 1) === '+') {
          // + red - green
          color = 'red';
        } else if (subItem.showAmount.substring(0, 1) === '-') {
          color = 'green';
        }
        let colorFont = '';
        // 0：交易失败；1：交易成功；2：待审核； 3：审核通过； 4：审核不通过
        switch (subItem.transStatus) {
          case 0:
          case 2:
          case 4:
            colorFont = 'grey';

            break;
          case 1:
          case 3:
            colorFont = 'green';

            break;
          default:
            break;
        }
        let timeInfo = subItem.createTimeStr.split(' ');
        if (timeInfo.length == 1) {
          timeInfo.push(subItem.createTime.split(' ')[1]);
        }
        let lotterySub = subItem.orderInfo || '';
        subItemList.push(
          <div
            key={ i + '' + j }
            className="sf-item"
            onClick={ this.tradeDetail.bind(this, subItem) }
          >
            <div className="trade-l">
              <span>{timeInfo[0]}</span>
              <span>{timeInfo[1]}</span>
            </div>
            <div className="trade-m">
              {/* <span className={color}>{mark+subItem.transAmount.toFixed(2)}</span> */}
              <span className={ color }>{subItem.showAmount}</span>
              <span>
                {transType[subItem.transType]}
                {subItem.orderInfo ? '-' : ''}
                {lotterySub.split('|')[0]}
              </span>
              <span> {lotterySub.split('|')[1]} </span>
            </div>
            <div className="trade-r" className={ colorFont }>
              <span>{subItem.t_s_n}</span>
            </div>
          </div>
        );
      }
      result.push(
        <div key={ i } className="trade">
          <p
            className="section-title"
            style={ { display: self.month == item.month ? 'none' : '' } }
          >
            {item.month}
          </p>
          <section className="sf-section">{subItemList}</section>
        </div>
      );
    }
    if (result.length > 0) {
      if (this.state.totalPage > this.page) {
        result.push(
          <div
            className="load-more"
            key={ 'li' }
            onClick={ this.loadMore.bind(this, this.params2) }
          >
            点击加载更多
          </div>
        );
      }
      return result;
    }
    return <NoMsg msg={ '暂无数据！' } />;
  }
  goTo() {
    window.location.href = 'sc.html';
  }
  render() {
    return (
      <div className="pt-header trade-info">
        <Header title="交易明细" />
        {this.generateList()}
        {/* 路由跳转 */}
        {/* <Link to="/cz-trade-detail" ref="czTradeDetail"/> */}
        {/* <Link to="/tk-trade-detail" ref="tkTradeDetail"/> */}
      </div>
    );
  }
}
