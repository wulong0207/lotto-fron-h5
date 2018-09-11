import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Order from '../types/order';
import { formatMoney, copyContent } from '@/utils/utils';
import Message from '@/services/message';
import session from '@/services/session';
import cx from 'classnames';
import OrderHelper from '../../components/order-helper.jsx';
import LotteryCode from '@/utils/lottery-code';
import Navigator from '@/utils/navigator';
import http from '@/utils/request';
import '../../css/lottoDetail/bottom.scss'; // 方案详情的 头部 底部写在一个scss

function copyOrder(str) {
  copyContent(str);
  Message.toast('方案订单编号复制成功');
}

function handleBet(e, orderBaseInfoBO) {
  e.stopPropagation();
  if (orderBaseInfoBO.payStatus === 1) {
    return OrderHelper.goDirectPay(
      orderBaseInfoBO.orderCode,
      orderBaseInfoBO.buyType
    );
  } else {
    return Navigator.goPage(LotteryCode[orderBaseInfoBO.lotteryCode].href);
  }
}

function ButtomBet({ orderBaseInfoBO }) {
  let result = {};
  if (orderBaseInfoBO.payStatus === 1) {
    // 待支付
    result = '去支付';
  } else {
    result = '继续投注本彩种';
  }
  return (
    <div
      className="button-bet"
      onClick={ e => {
        handleBet(e, orderBaseInfoBO);
      } }
    >
      <span>{result}</span>
    </div>
  );
}

class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: props.order,
      zzBtn: '终止追号任务',
      refundAmount: 0, // 返回奖金
      noStop: false // 活动的追号不允许停追
    };
    this.page = 0;
    this.fAPage = 0;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      order: nextProps.order
    });
  }
  componentDidMount() {
    this.callService();
  }
  callService() {
    // this.sendOrderDetail();
    // this.reqStopCondition();
    this.sendReturnMoney();
  }

  // 请求追号信息
  // reqStopCondition() {
  //   let self = this;
  //   let { order } = this.state;
  //   http
  //     .post('/order/queryAddOrderStopReason', {
  //       token: session.get('token'),
  //       lotteryCode: order.orderBaseInfoBO.lotteryCode,
  //       orderCode: order.orderBaseInfoBO.orderCode
  //     })
  //     .then(res => {
  //       self.setState({ zhConditaion: res.data });
  //     })
  //     .catch(err => {
  //       Message.toast(err.message);
  //     });
  // }

  /**
   * 发送订单详情
   * 默认第一遍 追号列表
   */
  sendOrderDetail() {
    let self = this;
    let { order } = this.state;
    http
      .post('/order/queryAddOrderDetailInfo', {
        token: session.get('token'),
        source: '1',
        orderCode: order.orderBaseInfoBO.orderCode
      })
      .then(res => {
        self.setState({ order: res.data || {} });
        self.page++;
        self.fAPage++;
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  /**
   * 获取追号退款金额
   */
  sendReturnMoney() {
    let self = this;
    let { order } = this.state;
    http
      .post('/order/queyChaseRefund', {
        token: session.get('token'),
        orderAddCode: order.orderBaseInfoBO.orderCode
      })
      .then(res => {
        if (!res.success) {
          if (res.errorCode == '30115') {
            // 撤单彩期不存在或不符合撤单条件！
            return;
          }
          Message.toast(res.message);
        }
        let { refundAmount } = this.state;
        self.setState({
          refundAmount: res.data.refundAmount
          // canReturn: true
        });
      })
      .catch(err => {
        if (err.code == '30115') {
          // 撤单彩期不存在或不符合撤单条件！
          return;
        }
        this.setState({ noStop: true });
        // Message.toast(err.message);
      });
  }

  // 终止追号任务
  stopChase() {
    let { order, zzBtn, refundAmount } = this.state;
    if (zzBtn == '已终止追号') {
      return;
    }
    let orderBaseInfoBO = order.orderBaseInfoBO || {};
    let child;
    let self = this;
    Message.confirm({
      // 弹窗提醒
      btnFn: [
        () => {
          console.log('取消');
        },
        () => {
          // 确认终止追号
          http
            .post('/order/stopAddOrderPlan', {
              token: session.get('token'),
              orderAddCode: orderBaseInfoBO.orderCode
            })
            .then(res => {
              if (!res.success) {
                Message.toast(res.message);
              }
              self.setState({ zzBtn: '已终止追号' });
              self.callService();
              Message.toast('终止追号成功, 剩余的金额已返回到你的账户中');
              // 终止追号 默认刷新table 数据
              this.page = 0;
              this.setState({});
              this.props.onChaseChange();
            })
            .catch(err => {
              Message.toast(err.message);
            });
        }
      ],
      children: (
        <div className="stop-chase-alert">
          <div className="title">
            <span>你确认终止追号？</span>
          </div>
          <div>
            <span>使用过的红包将不会退回</span>
          </div>
          <div>
            <span>终止后返回的现金为: {formatMoney(refundAmount)}元</span>
          </div>
        </div>
      )
    });
  }

  render() {
    const { zzBtn, order, zhConditaion, noStop } = this.state;
    const orderBaseInfoBO = order.orderBaseInfoBO || {};
    const orderFlowInfoBO = orderBaseInfoBO.orderFlowInfoBO || {};
    const payMoney =
      (orderBaseInfoBO.orderAmount || 0) - (orderBaseInfoBO.redAmount || 0);
    console.log(noStop, 'nostop');
    return (
      <div>
        <section className="plan-info-section">
          <div className="pay-area showflex">
            <div className="flex">
              <div className="fadd">方案订单编号: {orderBaseInfoBO.orderCode}</div>
              {/* <em>方案订单支付流水号:D16712587963214789233</em> */}
            </div>
            <div
              className="flex ar"
              onClick={ copyOrder.bind(this, orderBaseInfoBO.orderCode) }
              className="btn-round-blue"
            >
              复制
            </div>
          </div>
          <div className="pay-area">
            <div className="pa-item">
              <div className="item-left">方案订单总额</div>
              <div className="item-right">
                &yen;{formatMoney(orderBaseInfoBO.orderAmount)}
              </div>
            </div>
            <div
              className="pa-item"
              style={ { display: orderBaseInfoBO.buyType == '4' ? 'none' : '' } }
            >
              <div className="item-left">方案总倍数</div>
              <div className="item-right red">
                {orderBaseInfoBO.multipleNum}
              </div>
            </div>
            <div
              className="pa-item last-item"
              style={ { display: orderBaseInfoBO.redCode ? '' : 'none' } }
            >
              <div className="item-left">
                方案订单优惠
                <div
                  className="gray direction-clumn"
                  style={ { display: orderBaseInfoBO.redCode ? '' : 'none' } }
                >
                  <span>{orderBaseInfoBO.redName}</span>
                  <span>({orderBaseInfoBO.redCode})</span>
                </div>
              </div>
              <div className="item-right">
                &yen;{formatMoney(orderBaseInfoBO.redAmount)}
              </div>
            </div>
          </div>
          <div className="pay-area showflex">
            <div className="flex">实际支付金额</div>
            <div className="flex ar red">&yen;{formatMoney(payMoney)}</div>
          </div>
        </section>
        <div className="h100" />
        {orderBaseInfoBO.buyType === 4 && !noStop ? ( // 追号
          // 3 追号中
          orderBaseInfoBO.addOrderUnionStatus === 3 ? (
            <div
              className={ cx(
                'button-bet',
                orderBaseInfoBO.addStatus === 4 ? 'hide' : ''
              ) }
              onClick={ this.stopChase.bind(this) }
            >
              <span>{zzBtn}</span>
            </div>
          ) : (
            <ButtomBet orderBaseInfoBO={ orderBaseInfoBO } />
          )
        ) // 1:等待支付, 2:支付成功,  3:未支付过期,
          : orderBaseInfoBO.payStatus === 1 ||
        orderBaseInfoBO.payStatus === 3 ||
        orderBaseInfoBO.payStatus === 2 ? (
              <ButtomBet orderBaseInfoBO={ orderBaseInfoBO } />
            ) : (
              ''
            )}
      </div>
    );
  }
}

export default OrderSummary;

OrderSummary.propTypes = {
  order: PropTypes.shape(Order).isRequired,
  onChaseChange: PropTypes.func.isRequired
};
