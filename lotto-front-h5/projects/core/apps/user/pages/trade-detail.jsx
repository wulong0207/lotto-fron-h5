/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--交易详情子模块
 */

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import { Link } from 'react-router';
import http from '@/utils/request';
import { formatMoney } from '@/utils/utils';
import session from '@/services/session';
import Message from '@/services/message';
import Header from '@/component/header';

import '../css/trade-detail.scss';

export default class CzTradeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {}
    };
  }

  componentDidMount() {
    this.reqInfoDetail();
  }

  // 请求详情信息
  reqInfoDetail() {
    let { params } = this.props;
    http
      .get('/trans/transDetail', {
        params: {
          token: session.get('token'),
          transCode: params.transCode
        }
      })
      .then(res => {
        this.setState({ detailInfo: res.data || {} });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let { detailInfo } = this.state;
    //  1：储蓄卡；2：信用卡；3：其它
    let cardType = ['', '储蓄卡', '信用卡', '其它'];
    // 1：支付宝充值；2：微信支付；3：练练支付；4：百度支付；5：人工充值
    let rechargeChannel = [
      '',
      '支付宝充值',
      '微信支付',
      '练练支付',
      '百度支付',
      '人工充值'
    ];
    // 1：进行中；2：交易成功；3：交易失败；4：订单已关闭；
    // let transStatus = ["", "进行中", "交易成功", "交易失败", "订单已关闭"];
    // 1：充值；2：购彩；3：返奖；4：退款；5：提款；6：其它
    let transType = ['', '充值', '购彩', '返奖', '退款', '提款', '其它'];
    // 0：交易失败；1：交易成功；
    let transStatus = ['交易失败', '交易成功'];

    let className = '';
    if (detailInfo.transType == 5) {
      className = ' green';
    }

    return (
      <div className="pt-header trade-detail">
        {detailInfo.transType === 1 ? (
          <Header title="充值交易详情" />
        ) : (
          <Header title="提款交易详情" />
        )}
        <section className="trade-section">
          <section className="trade-money">
            <span className={ 'number' + className }>
              <em className={ className }>
                {detailInfo.transType === 1 ? '+' : '-'}
                {formatMoney(detailInfo.transAmount)}
              </em>元
            </span>
            <p>{transStatus[detailInfo.transStatus]}</p>
            <p>
              {transType[detailInfo.transType]} - {detailInfo.orderInfo}
            </p>
            {/* <span className="mini-btn-orange">去支付</span> */}
          </section>
          <section className="trade-detail">
            <div>
              <span className="red">交易明细</span>
            </div>
            <div className="showflex">
              <div>
                {detailInfo.orderInfo} {cardType[detailInfo.bankCardType]}
              </div>
              <div>{formatMoney(detailInfo.cashAmount)}</div>
            </div>
            {detailInfo.serviceCharge ? (
              <div className="showflex">
                <div>手续费</div>
                <div>{formatMoney(detailInfo.serviceCharge)}</div>
              </div>
            ) : (
              ''
            )}
            <div className="showflex">
              <div>实到金额</div>
              <div>{formatMoney(detailInfo.transAmount)}</div>
            </div>
          </section>
          <div className="trade-item showflex">
            <div>创建时间</div>
            <div className="ar">{detailInfo.createTime}</div>
          </div>
          <div className="trade-item showflex">
            <div>交易时间</div>
            <div className="ar">{detailInfo.thirdTransTime}</div>
          </div>
          <div className="trade-item showflex">
            <div>交易流水号</div>
            <div className="ar">{detailInfo.transCode}</div>
          </div>
          {/* <div className="trade-item showflex">
                        <div className="flex">第三方流水号</div>
                        <div className="flex ar">{detailInfo.thirdTransId || "-"}</div>
                    </div> */}
        </section>
        {/* 路由跳转 */}

        <section className="trade-list" />
      </div>
    );
  }
}
