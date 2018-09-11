import React, { PureComponent } from "react";
import Modal from "./modal";
import alert from "../services/alert";
import dateFormat from "dateformat";
import { browser } from "../utils/utils";
import interaction from "../utils/interaction";
import session from "../services/session";
import PropTypes from "prop-types";
import http from "../utils/request";
import "../scss/component/orders.scss";
import { Path } from "../const/path";
import toast from "@/services/toast";

function goPay(orderCode) {
  if (browser.yicaiApp) {
    return interaction.sendInteraction("toPay", [
      JSON.stringify([{ oc: orderCode }])
    ]);
  } else {
    return (window.location.href = `/pay.html?orderCode=${orderCode}&buyType=${1}&token=${session.get(
      "token"
    )}`);
  }
}

function getAmount(selectedOrders, orders) {
  const selected = orders.filter(o => selectedOrders.indexOf(o.orderCode) > -1);
  if (!selected.length) return 0;
  return selected.reduce((acc, s) => acc + s.orderAmount, 0);
}

function goLogin() {
  if (browser.yicaiApp) {
    interaction.sendInteraction("toLogin", []);
  } else {
    window.location.href = Path.getLogin();
  }
}

const OrderItem = props => {
  const { order } = props;
  return (
    <li>
      <div className="order-summary">
        {props.current ? (
          <div
            className="scheme-num"
            onClick={e => props.toggle(order.orderCode)}
          >
            <p>当前提交方案</p>
            <span className={props.selected ? "selected" : "not-selected"} />
            <span>{order.orderCode}</span>
          </div>
        ) : (
          <div
            className="scheme-num"
            onClick={e => props.toggle(order.orderCode)}
          >
            <span className={props.selected ? "selected" : "not-selected"} />
            <span>{order.orderCode}</span>
          </div>
        )}
        <div className="scheme-money">￥{order.orderAmount}元</div>
        <div className="scheme-pay">
          <a onClick={() => goPay(order.orderCode)}>
            <span>去支付</span>
          </a>
        </div>
      </div>
      {props.detail && (
        <div className="order-detail">
          {React.createElement(props.detail, { order })}
        </div>
      )}
    </li>
  );
};

OrderItem.propTypes = {
  order: PropTypes.shape({
    orderCode: PropTypes.string.isRequired,
    orderAmount: PropTypes.number.isRequired
  }),
  current: PropTypes.bool,
  selected: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  detail: PropTypes.node
};

export default class OrderComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      orders: [],
      currentOrder: null,
      requestStatus: "ide",
      selectedOrders: []
    };
  }

  newOrder(data) {
    const chase = !!data.addAmount;
    const url = chase ? "/h5/chase/addChase" : "/order/addOrder";
    if (!data.token) {
      return goLogin();
    }
    return new Promise((resolve, reject) => {
      http
        .post(url, data)
        .then(res => {
          resolve(res);
          const orderCode = chase ? res.data.orderAddCode : res.data.oc;
          if (
            (res.data.counter && res.data.counter > 8) ||
            (res.data.noPayCount && res.data.noPayCount > 8)
          ) {
            return this.getUnpaidOrder(orderCode);
          } else {
            return goPay(orderCode);
          }
        })
        .catch(err => {
          reject(err);
          if (err.code === "40312") {
            return this.getUnpaidOrder();
          } else if (
            err.code === "20100" &&
            err.code === "30602" &&
            err.code === "40118" &&
            err.code === "40261"
          ) {
            return undefined;
          } else {
            alert.alert(err.message, "提示");
          }
        });
    });
  }

  getUnpaidOrder(currentOrder = null) {
    return new Promise((resolve, reject) => {
      http
        .post("/order/queryNoPayOrderDetailList", {
          lotteryCode: this.props.lotteryCode,
          token: session.get("token")
        })
        .then(res => {
          this.setState({
            orders: res.data,
            currentOrder: currentOrder,
            show: true,
            selectedOrders: res.data.map(o => o.orderCode)
          });
          this.pop.open();
          resolve(res);
        })
        .catch(reject);
    });
  }

  removeOrders(orderIds) {
    return new Promise((resolve, reject) => {
      http
        .post("/order/batchCancelOrderList", {
          lotteryCode: this.props.lotteryCode,
          orderCodes: orderIds,
          token: window.sessionStorage.getItem("token")
        })
        .then(res => {
          toast.toast(`你已成功删除${orderIds.length}个方案`);
          resolve(res);
        })
        .catch(reject);
    });
  }

  onRemove() {
    const orderIds = this.state.orders
      .filter(o => this.state.selectedOrders.indexOf(o.orderCode) > -1)
      .map(i => i.orderCode);
    if (!orderIds.length) return toast.toast("请至少选择一个方案");
    return this.removeOrders(orderIds).then(() => {
      const newOrders = this.state.orders.filter(
        s => orderIds.indexOf(s.orderCode) < 0
      );
      this.setState(
        {
          selectedOrders: [],
          orders: newOrders
        },
        () => {
          if (!newOrders.length) this.pop.close();
        }
      );
    });
  }

  multiplePay() {
    if (!this.state.selectedOrders.length) {
      return alert.alert("请选择支付订单");
    }
    const selectedOrders = this.state.orders.filter(
      i => this.state.selectedOrders.indexOf(i.orderCode) > -1
    );
    if (browser.yicaiApp) {
      const data = selectedOrders.map(o => {
        return {
          oc: o.orderCode,
          bt: o.buyType
        };
      });
      interaction.sendInteraction("toPay", [JSON.stringify(data)]);
    } else {
      const orderCode = selectedOrders.map(o => o.orderCode).join(",");
      const buyType = selectedOrders.map(o => o.buyType).join(",");
      window.location.href = `/pay.html?orderCode=${orderCode}&buyType=${buyType}&token=${window.sessionStorage.getItem(
        "token"
      )}`;
    }
  }

  onClose() {
    this.setState({ show: false });
    this.props.onClose && this.props.onClose();
  }

  toggle(orderCode) {
    const selectedOrders = this.state.selectedOrders;
    const newSelectedOrders =
      selectedOrders.indexOf(orderCode) < 0
        ? [...selectedOrders, orderCode]
        : selectedOrders.filter(s => s !== orderCode);
    this.setState({ selectedOrders: newSelectedOrders });
  }

  reverse() {
    this.setState({
      selectedOrders: this.state.orders
        .filter(s => this.state.selectedOrders.indexOf(s.orderCode) < 0)
        .map(o => o.orderCode)
    });
  }

  selectAll() {
    this.setState({ selectedOrders: this.state.orders.map(s => s.orderCode) });
  }

  render() {
    return (
      <Modal
        ref={pop => (this.pop = pop)}
        modal={true}
        klass={["orders-popup"]}
        onClose={this.onClose.bind(this)}
        onOpen={this.props.onOpen}
      >
        <div>
          <section className="pay-scheme">
            <div className="bet-endtime">
              {this.props.endSaleTime ? (
                <div className="endtime">
                  投注截止时间：{dateFormat(
                    this.props.endSaleTime,
                    "yyyy-mm-dd HH:MM:ss"
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <div className="scheme-desc">
                每个彩期只能保存16个未支付方案，如需支付当前方案请删除已保存的方案；你也可以选择所有方案合并支付，包括提交的方案。
              </div>
              <div className="scheme-list">
                <ul>
                  {this.state.orders.map(order => {
                    return (
                      <OrderItem
                        key={order.orderCode}
                        toggle={this.toggle.bind(this)}
                        selected={
                          this.state.selectedOrders.indexOf(order.orderCode) >
                          -1
                        }
                        current={order.orderCode === this.state.currentOrder}
                        detail={this.props.detail}
                        order={order}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>
          <footer className="footer">
            <div className="footer-oper">
              <span
                className={
                  this.state.selectedOrders.length === this.state.orders.length
                    ? "sel-all"
                    : "sel-normal"
                }
                onClick={this.selectAll.bind(this)}
              >
                全选
              </span>
              <span className="invert" onClick={this.reverse.bind(this)}>
                反选
              </span>
              <span className="delete" onClick={this.onRemove.bind(this)}>
                删除
              </span>
            </div>
            <div
              className="bet-money-btn"
              onClick={this.multiplePay.bind(this)}
            >
              立即支付 {getAmount(this.state.selectedOrders, this.state.orders)} 元
            </div>
          </footer>
        </div>
      </Modal>
    );
  }
}

OrderComponent.propTypes = {
  onOpen: PropTypes.func, // 当用户未支付订单小于8个，打开订单列表的回调方法
  onClose: PropTypes.func, // 当用户未支付订单小于8个，关闭订单列表的回调方法
  lotteryCode: PropTypes.number.isRequired, // 彩种 id
  endSaleTime: PropTypes.instanceOf(Date), // 支付（小时）截至时间
  detail: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
    PropTypes.instanceOf(React.PureComponent)
  ]) // 订单详情的模板，请传 React 组件，会回传 order 属性
};
