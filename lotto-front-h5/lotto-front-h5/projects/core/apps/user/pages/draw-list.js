/*
 * @Author: nearxu
 * @Date: 2017-12-20 10:21:57
 * 提款历史
 */

import React, { Component } from 'react';
import { Link } from 'react-router';
import http from '@/utils/request';
import Message from '@/services/message';
import session from '@/services/session';
import NoMsg from '@/component/no-msg';
import Header from '@/component/header';
import OrderHelper from '../components/order-helper';
import Navigator from '@/utils/navigator.js';
import { setDate, formatMoney, browser } from '@/utils/utils';
import Interaction from '@/utils/interaction';
import '../css/trade-info.scss';

class DrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transList: [],
      totalPage: null // 页数
    };
    this.page = 1;
  }
  componentDidMount() {
    this.getTradeInfo();
  }
  getTradeInfo() {
    let date = new Date();
    let datePre = new Date();
    setDate.setYears(datePre, -1);
    http
      .get('/trans/takenList', {
        params: {
          endDate: setDate.formatDate(date, 'yyyy-MM-dd'),
          startDate: setDate.formatDate(datePre, 'yyyy-MM-dd'),
          currentPage: this.page, // 当前页
          token: session.get('token'),
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
  // 生成列表
  generateList() {
    let transList = this.state.transList || [];
    let self = this;
    let result = [];
    for (var i = 0; i < transList.length; i++) {
      let item = transList[i];
      let subItemList = [];
      for (var j = 0; j < item.list.length; j++) {
        let subItem = item.list[j];
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
        let timeInfo = subItem.c_t_s.split(' ');
        if (timeInfo.length == 1) {
          timeInfo.push(subItem.c_t_s.split(' ')[1]);
        }
        // let lotterySub = subItem.orderInfo || '';
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
              <span className="green">{subItem.e_a}</span>
              <span>{subItem.s_r}</span>
              {/* <span> {lotterySub.split('|')[1]} </span> */}
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
  // 提款详情
  tradeDetail(subItem) {
    if (browser.yicaiApp) {
      Interaction.sendInteraction('toDealDetailDrawingInfo', [subItem.t_t_c]);
      // Interaction.toDealDetailDrawingInfo([subItem.t_t_c]);
    } else {
      if (subItem.t_t_c) {
        window.location.hash = '#/tk-trade-detail/' + subItem.t_t_c;
      } else {
        window.location.hash = '#/trade-detail/' + subItem.t_t_c;
      }
    }
  }
  loadMore() {
    this.page++;
    this.getTradeInfo();
  }
  goBackTc() {
    if (window.location.href.indexOf('tc') > -1) {
      window.location.href = 'sc.html#/draw-money?tc';
    } else {
      window.history.back();
    }
  }
  render() {
    let { transList } = this.state;
    return (
      <div className="pt-header trade-info">
        <Header title="提款明细" back={ this.goBackTc.bind(this) } />
        {this.generateList()}
      </div>
    );
  }
}

export default DrawList;
