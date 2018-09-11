/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--红包消费明细子模块
 */

import React, { Component } from 'react';
import '../css/red-packet-tans.scss';
import Header from '@/component/header';
import http from '@/utils/request';
import session from '@/services/session';
import NoMsg from '@/component/no-msg';
import Message from '@/services/message';
import { formatMoney } from '@/utils/utils.js';

export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
    this.page = 1;
    // 交易类型1：充值；2：购彩；3：返奖；4：退款；5：提款；6：其它
    this.transType = ['', '充值', '购彩', '返奖', '退款', '提款', '其它'];
  }

  componentDidMount() {
    this.reqRedData();
  }

  // 礼品数据接口
  reqRedData() {
    let self = this;
    // 搞不懂为什么之前的是ios
    http
      .get('/trans/transRedList', {
        params: {
          // http.get('/h5/trans/transRedList', {params: {
          token: session.get('token'),
          currentPage: this.page,
          showCount: 10,
          redCode: this.props.params.redCode
        }
      })
      .then(res => {
        let resultData = res.data || {};
        let resultDataList =
          resultData.dataList ||
          [
            // {
            //     transStatus: 0,
            //     aftTransAmount: 112321,
            //     lotteryName: "大乐透",
            //     lotteryIssue: "160888",
            //     orderCode: "534564123165456453",
            //     transAmount: "56454",
            //     createTime: "2017-06-05 19:50:01",
            //     transType: "1"
            // }
          ];
        let dataList = self.state.dataList.concat(resultDataList);
        dataList.totalResult = resultData.totalResult;
        dataList.totalPage = resultData.totalPage;
        self.setState({ dataList: dataList });
        if (resultDataList.length > 0) {
          self.page++;
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  goTo() {
    location.href = '/sc.html';
  }

  render() {
    let { dataList } = this.state;
    let result = [];
    let showMore = dataList.totalResult > dataList.length;
    let self = this;
    let style,
      hasrecord = dataList.length > 0;
    if (!hasrecord) {
      style = { visibility: 'hidden' };
    }

    return (
      <div className="yc-rpt red-packet-tans">
        <Header title="消费明细" />
        <div className="content">
          <div style={ style } className="rpt-header showflex gray">
            <div className="rpt-time">交易时间</div>
            <div className="rpt-info flex">订单信息</div>
            <div className="rpt-mul ar">交易金额/状态/剩余金额</div>
          </div>
          <div className="rpt-body">
            {dataList.map((val, i) => {
              let timeInfo = val.createTime.split(' ');
              let transAmount = formatMoney(val.transAmount);
              let aftTransAmount = formatMoney(val.aftTransAmount);
              if (timeInfo.length == 1) {
                timeInfo.push('');
              }
              let getTransType = '';
              if (val.transType) {
                switch (val.transType) {
                  case 1: // 充值
                  case 3: // 返奖
                  case 4: // 退款
                    getTransType = '+';
                    break;
                  case 1:
                  case 2: // 购彩
                  case 5: // 提款
                    getTransType = '-';
                    break;
                  default:
                    getTransType = '-';
                    break;
                }
              }

              return (
                <div className="body-item showflex" key={ i }>
                  <div className="rpt-time">
                    <div>{timeInfo[0]}</div>
                    <div className="gray">{timeInfo[1]}</div>
                  </div>
                  <div className="rpt-info flex">
                    <div className="gray">{val.orderCode}</div>
                    <div>{self.transType[val.transType]}</div>
                    <div>
                      {val.lotteryName}
                      {val.lotteryIssue}期
                    </div>
                  </div>
                  <div className="rpt-mul ar">
                    <div>
                      {getTransType} {transAmount}
                    </div>
                    <div>{!val.transStatus ? '交易失败' : '交易成功'}</div>
                    <div>{aftTransAmount}</div>
                  </div>
                </div>
              );
            })}
            {showMore ? (
              <div className="load-more" onClick={ this.reqRedData.bind(this) }>
                点击加载更多
                <div className="l-circle" />
                <div className="r-circle" />
              </div>
            ) : (
              ''
            )}
          </div>
          {hasrecord ? result : <NoMsg msg={ '暂无记录' } />}
        </div>
      </div>
    );
  }
}
