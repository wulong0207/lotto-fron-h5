import React, { Component } from 'react';
import Message from '@/services/message';
import session from '@/services/session';
import { setDate, formatDate } from '@/utils/utils';
import Header from '@/component/header';
import http from '@/utils/request';
import Ssq from '../components/quick-ssq'; // 没有订单显示模块
import { PlanTabList } from './plan-list'; // 个人中心首页-方案tab
import '../css/devote-recorde.scss';

export default class DevoteRecorde extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasData: 0
    };
  }
  componentWillMount() {
    // 全部
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
        pageIndex: 0,
        pageSize: 10,
        source: 1,
        token: session.get('token'),
        type: type // 2：中奖方案；3：待开奖，全部传0
      })
      .then(res => {
        if (res.data.total < 1) {
          // 全部投注记录为空
          this.setState({ hasData: 1 });
        } else {
          this.setState({ hasData: 2 });
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let { hasData } = this.state;
    if (hasData === 0) return null;
    console.log(hasData, 'hasdata');
    return (
      <div className="sc pt-header index devote-record">
        <Header title="投注记录" />
        {hasData === 1 ? <Ssq /> : <PlanTabList />}
      </div>
    );
  }
}
