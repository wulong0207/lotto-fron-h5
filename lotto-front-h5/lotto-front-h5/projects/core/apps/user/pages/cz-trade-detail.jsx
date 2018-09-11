/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--充值交易详情子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import http from '@/utils/request';
import { formatMoney } from '@/utils/utils';
import session from '@/services/session';
import Message from '@/services/message';
import Header from '@/component/header';
import TradeDetail from './trade-detail';

import '../css/cz-trade-detail.scss';

export default class CzTradeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {}
    };
  }
  componentDidMount() {
    this.getRechargeDetail();
  }

  getRechargeDetail() {
    let { params } = this.props;
    http
      .get('/trans/rechargeDetail', {
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
    console.log(detailInfo, 'detailInfo');
    /*
         * 1、支付宝充值；2、微信支付；3、连连支付；4、百度支付；5、人工充值；6、易宝支付；7、代理系统充值；8、聚合支付
         * ；9、现在支付；10、神州支付；11、掌易付支付；12、威富通支付；13、兴业银行
         */
    let rechargeChannel = [
      '',
      '支付宝充值',
      '微信支付',
      '练练支付',
      '百度支付',
      '人工充值',
      '易宝支付',
      '代理系统充值',
      '聚合支付',
      '现金支付',
      '神州支付',
      '掌易付支付',
      '威富通支付',
      '兴业银行'
    ];
    // 1：进行中；2：交易成功；3：交易失败；4：订单已关闭；
    let transStatus = ['', '进行中', '交易成功', '交易失败', '订单已关闭'];
    let bankType = ['', '储蓄卡', '信用卡'];

    return (
      <div className="pt-header cz-trade-detail">
        <Header title="充值交易详情" />

        <section className="trade-section">
          <section className="trade-money">
            <span className="number red">
              <b>+{formatMoney(detailInfo.s_a)}</b>元
            </span>
            <p>{detailInfo.t_s_n}</p>
            <p>
              {' '}
              充值-
              {detailInfo.r_b_n}
              {bankType[detailInfo.bankCardType]}
              {detailInfo.bankCardNum}
            </p>
            {/* <span className="mini-btn-orange">去支付</span> */}
          </section>
          <section className="trade-detail">
            <div>
              <span className="red-detail">交易明细</span>
            </div>
            <div className="showflex">
              <div>
                {detailInfo.r_b_n} &nbsp;
                {bankType[detailInfo.bankCardType]} &nbsp;
                {detailInfo.bankCardNum}
              </div>
              <div className=" ar">
                {formatMoney(detailInfo.rechargeAmount)}
              </div>
            </div>
            {detailInfo.serviceCharge > 0 ? (
              <div className="showflex">
                <div>手续费</div>
                <div className="ar">
                  {formatMoney(detailInfo.serviceCharge)}
                </div>
              </div>
            ) : (
              ''
            )}
            {detailInfo.rechargeRemark ? (
              <div className="showflex">
                <div>优惠</div>
                <div className="ar">{detailInfo.rechargeRemark}</div>
              </div>
            ) : (
              ''
            )}
            <div className="showflex">
              <div>实到金额</div>
              <div className="ar">{formatMoney(detailInfo.arrivalAmount)}</div>
            </div>
          </section>
          <div className="trade-item showflex">
            <div>创建时间</div>
            <div className="ar">{detailInfo.createTime}</div>
          </div>
          {detailInfo.thirdTransTime ? (
            <div className="trade-item showflex">
              <div>交易时间</div>
              <div className="ar">{detailInfo.thirdTransTime}</div>
            </div>
          ) : (
            ''
          )}
          <div className="trade-item showflex">
            <div>交易流水号</div>
            <div className="ar">{detailInfo.transRechargeCode}</div>
          </div>
        </section>
      </div>
    );
  }
}
