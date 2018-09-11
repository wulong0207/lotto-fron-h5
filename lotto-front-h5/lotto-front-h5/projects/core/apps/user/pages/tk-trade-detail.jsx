/**
 * Created by manaster
 * date 2017-03-14
 * desc:个人中心模块--提款交易详情子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import "../../../scss/user/lottery-container.scss";
import http from '@/utils/request';
import { formatMoney, setDate } from '@/utils/utils';
import session from '@/services/session';
import Message from '@/services/message';
import Header from '@/component/header';
import cx from 'classnames';
import '../css/tk-trade-detail.scss';

function TKDetail({ flowList }) {
  return (
    <div className="trade-list">
      <div className="line" />
      {flowList.map((m, i) => {
        return (
          <div className="flow-list" key={ i }>
            <div className={ cx('top', i == 0 ? 'active' : '') }>
              <b className="circle" />
              <span>{m.remark}</span>
            </div>
            <div className="bottom">{m.dealTime}</div>
          </div>
        );
      })}
    </div>
  );
}

export default class TkTradeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailinfo: {},
      flowList: []
    };
  }
  componentDidMount() {
    this.reqInfoDetail();
    // this.reqProgress();
  }
  // 请求详情信息
  reqInfoDetail() {
    let { params } = this.props;
    http
      .get('/trans/takenDetail', {
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
  goTo() {
    location.href = '#/trade-info';
  }

  render() {
    let { detailInfo, flowList } = this.state;
    detailInfo = detailInfo || {};
    flowList = flowList || [];
    if (detailInfo) {
      flowList = detailInfo.flowList;
    }
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

    let bankType = ['', '储蓄卡', '信用卡'];
    // 1：进行中；2：交易成功；3：交易失败；4：订单已关闭；
    let transStatus = ['', '进行中', '交易成功', '交易失败', '订单已关闭'];

    return (
      <div className="pt-header trade-detail">
        {/* <Header title="提款交易详情" back={this.goTo.bind(this)} /> */}
        <Header title="提款交易详情" />
        <section className="trade-section">
          <section className="trade-money">
            <span className="number green">
              <b> - {formatMoney(detailInfo.extractAmount)}</b>
              元
            </span>
            <p>{detailInfo.t_s_n}</p>
            <p>
              提款 -
              {detailInfo.t_b_n}
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
                {detailInfo.t_b_n} &nbsp;
                {bankType[detailInfo.bankCardType]} &nbsp;
                {detailInfo.bankCardNum}
              </div>
              <div className="ar">{formatMoney(detailInfo.extractAmount)}</div>
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

            <div className="showflex">
              <div>实到金额</div>
              <div className="ar">{formatMoney(detailInfo.realAmount)}</div>
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
            <div className="ar">
              {detailInfo.transTakenCode ? detailInfo.transTakenCode : '--'}
            </div>
          </div>
        </section>
        {/* 交易流程 */}
        {flowList ? <TKDetail flowList={ flowList } /> : ''}
      </div>
    );
  }
}
