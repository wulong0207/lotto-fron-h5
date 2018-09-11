import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getUnpaidOrder,
  toggleOrder,
  selectAll,
  selecteReverse,
  deleteOrder,
  displayToggle
} from '../actions/order';
import Modal from './modal';
import { createSelector } from 'reselect';
import toast from '@/services/toast';
import { isEqual } from 'lodash';
import dateFormat from 'dateformat';
import { browser } from '@/utils/utils';
import interaction from '@/utils/interaction';
import session from '@/services/session';
import PropTypes from 'prop-types';
import { getToken } from '@/services/auth';

const OrderItem = props => {
  const goOrder = () => {
    if (browser.yicaiApp) {
      return interaction.sendInteraction('toPay', [
        JSON.stringify([{ oc: props.orderCode, bt: props.buyType }])
      ]);
    } else {
      return (window.location.href = `/pay.html?orderCode=${
        props.orderCode
      }&buyType=${props.buyType}&token=${session.get('token')}`);
    }
  };
  return (
    <li>
      {props.current ? (
        <div className="scheme-num">
          <p>当前提交方案</p>
          <span>{props.orderCode}</span>
        </div>
      ) : (
        <div
          className="scheme-num"
          onClick={ e => props.toggle(props.orderCode) }
        >
          <span className={ props.selected ? 'selected' : 'not-selected' } />
          <span>{props.orderCode}</span>
        </div>
      )}
      <div className="scheme-money">￥{props.orderAmount}元</div>
      <div className="scheme-pay">
        <a onClick={ goOrder }>
          <span>去支付</span>
        </a>
      </div>
    </li>
  );
};

class OrderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.orders, this.props.orders)) {
      this.pop.open();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.pop.open();
    }
  }

  onRemove() {
    const orderIds = this.props.orders
      .filter(o => o.selected && !o.current)
      .map(i => i.orderCode);
    if (!orderIds.length) return toast.toast('请至少选择一个方案');
    this.props.remove(orderIds);
  }

  mutiplePay() {
    const selectedOrders = this.props.orders.filter(i => i.selected);
    const current = this.props.orders.filter(i => i.current);
    if (!selectedOrders.length && !current.length) {
      return toast.toast('请至少选择一个方案');
    }
    if (browser.yicaiApp) {
      const data = selectedOrders.map(o => {
        return {
          oc: o.orderCode,
          bt: o.buyType
        };
      });
      interaction.sendInteraction('toPay', [JSON.stringify(data)]);
    } else {
      const orderCode = selectedOrders.map(o => o.orderCode).join(',');
      const buyType = selectedOrders.map(o => o.buyType).join(',');
      window.location.href = `/pay.html?orderCode=${orderCode}&buyType=${buyType}&token=${getToken()}`;
    }
  }

  onClose() {
    this.props.displayToggle();
    this.props.onClose && this.props.onClose();
  }

  render() {
    return (
      <Modal
        ref={ pop => (this.pop = pop) }
        modal={ true }
        klass={ ['football-orders-popup'] }
        onClose={ this.onClose.bind(this) }
        onOpen={ this.props.onOpen }
      >
        <div>
          <section className="pay-scheme">
            <div className="bet-endtime">
              <div className="endtime">
                投注截止时间：{dateFormat(
                  this.props.endTime,
                  'yyyy-mm-dd HH:MM:ss'
                )}
              </div>
            </div>
            <div>
              <div className="scheme-desc">
                每个彩期只能保存8个未支付方案，如需支付当前方案请删除已保存的方案；你也可以选择所有方案合并支付，包括提交的方案。
              </div>
              <div className="scheme-list">
                <ul>
                  {this.props.orders.map(order => {
                    return (
                      <OrderItem
                        key={ order.orderCode }
                        toggle={ this.props.toggle.bind(this) }
                        { ...order }
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>
          <footer className="footer">
            <div className="footer-oper">
              {/* sel-normal */}
              <span
                className={ this.props.allSelected ? 'sel-all' : 'sel-normal' }
                onClick={ this.props.selectAll.bind(this) }
              >
                全选
              </span>
              <span className="invert" onClick={ this.props.reverse.bind(this) }>
                反选
              </span>
              <span className="delete" onClick={ this.onRemove.bind(this) }>
                删除
              </span>
            </div>
            <div className="bet-money-btn" onClick={ this.mutiplePay.bind(this) }>
              立即支付{' '}
              <span>
                <em>{this.props.amount}</em>元
              </span>
            </div>
          </footer>
        </div>
      </Modal>
    );
  }
}

OrderComponent.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

const ordersSelector = state => state.footballOrders.data || [];

const allSelectedSelector = createSelector([ordersSelector], orders => {
  const selected = orders.filter(o => o.selected);
  if (orders.length === selected.length) return true;
  return false;
});

const amountSelector = createSelector([ordersSelector], orders => {
  return orders.reduce((acc, o) => {
    if (o.selected) return acc + o.orderAmount;
    return acc;
  }, 0);
});

const mapStateToProps = state => {
  return {
    show: state.footballOrders.show,
    endTime: state.footballOrders.endTime,
    orders: ordersSelector(state),
    allSelected: allSelectedSelector(state),
    amount: amountSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUnpaidOrder() {
      dispatch(getUnpaidOrder());
    },
    toggle(orderId) {
      dispatch(toggleOrder(orderId));
    },
    selectAll() {
      dispatch(selectAll());
    },
    reverse() {
      dispatch(selecteReverse());
    },
    remove(orderIds) {
      dispatch(deleteOrder(orderIds));
    },
    displayToggle() {
      dispatch(displayToggle());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderComponent);
