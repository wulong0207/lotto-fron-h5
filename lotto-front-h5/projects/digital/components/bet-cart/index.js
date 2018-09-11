import React, { Component } from 'react';
import Modal from '@/component/modal.jsx';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import NumberInput from '@/component/number-input.jsx';
import './bet-cart.scss';
import confirm from '@/services/confirm';
import cx from 'classnames';
import Checkbox from '@/component/checkbox';
import { Bet } from '../../types/bet';

function Balls({ bet, ballFormat }) {
  if (typeof ballFormat === 'function') {
    const BallTemplate = ballFormat(bet);
    if (BallTemplate) {
      return (
        <div className="ball">
          <BallTemplate balls={ bet.balls } />
        </div>
      );
    }
  }
  return (
    <div className="ball">
      {Array.isArray(bet.balls)
        ? bet.balls.map((balls, idx) => {
          return (
            <div key={ idx } style={ { color: balls.color } }>
              {balls.ball}
            </div>
          );
        })
        : bet.balls}
    </div>
  );
}

Balls.propTypes = {
  bet: Bet.isRequired,
  ballFormat: PropTypes.func
};

export default class BetCart extends Component {
  clearHandle() {
    confirm.confirm('你确认清空列表内容？').then(() => this.props.onClear());
  }

  removeHandle(index) {
    confirm.confirm('你确认删除列表内容？').then(() => this.props.onRemove(index));
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  chaseFocus() {
    this.chaseInput.focus();
  }

  timesFocus() {
    this.timesInput.focus();
  }

  editHandle(bet, index) {
    this.props.onRemove(index);
    this.props.onBettingEdit(bet);
    this.close();
  }

  render() {
    const { bettings, times, chaseNum, betPrice } = this.props;
    const totalBetNum = bettings.reduce((acc, b) => acc + b.betNum, 0);
    const cartHeight = window.innerHeight - window.lib.flexible.rem * 1.333333;
    const isPending = this.props.payStatus === 'pending';
    // const pricePerbet = this.props.isDltAdd ? 3 : this.props.betPrice;
    const topShortcutsHeight = 1.48 * window.lib.flexible.rem;
    const bottomSettingHeight =
      (this.props.showDltAdd ? 5.333333 : 4.266667) * window.lib.flexible.rem;
    const cartListHeight =
      cartHeight - topShortcutsHeight - bottomSettingHeight;
    return (
      <Modal
        ref={ modal => (this.modal = modal) }
        klass={ ['yc-bet-cart-modal'] }
        headerTipText={ `投注截至时间 ${dateFormat(
          new Date(this.props.saleEndTime),
          'yyyy-mm-dd HH:MM:ss'
        )}` }
      >
        <div className="num-cart" style={ { height: cartHeight + 'px' } }>
          <div className="tab">
            <ul>
              <li onClick={ this.close.bind(this) }>投注页选号</li>
              <li onClick={ this.props.onRandom.bind(this) }>机选一注</li>
              <li onClick={ this.clearHandle.bind(this) }>清空列表</li>
            </ul>
          </div>
          <div className="slide">
            <div className="export" />
            <div
              className="cart-area"
              style={ { height: cartListHeight + 'px' } }
            >
              <div className="cart-all">
                {this.props.bettings.map((bet, idx) => {
                  return (
                    <div
                      className={ cx('cart-item', { overflow: bet.overflow }) }
                      key={ idx }
                    >
                      <div
                        className="item-info"
                        onClick={ this.editHandle.bind(this, bet, idx) }
                      >
                        <Balls bet={ bet } ballFormat={ this.props.ballFormat } />
                        <div className="label">
                          {Array.isArray(bet.label)
                            ? bet.label.map((t, index) => (
                              <span key={ index }>{t}</span>
                            ))
                            : bet.label}
                        </div>
                      </div>
                      <div
                        className="item-close"
                        onClick={ this.removeHandle.bind(this, idx) }
                      />
                    </div>
                  );
                })}
              </div>
              <div className="bot" />
            </div>
          </div>
          <div
            className={ cx('cart-setting', {
              'show-dlt-add': this.props.showDltAdd
            }) }
          >
            {this.props.showDltAdd && (
              <div className="dlt-add">
                <span>追加投注</span>
                <Checkbox onChange={ this.props.onToggleDltAdd.bind(this) } />
              </div>
            )}
            <div className="item-set">
              <div className="txt">追号</div>
              <div className="button-area">
                <NumberInput
                  onChange={ this.props.onChaseNumChange.bind(this) }
                  ref={ input => (this.chaseInput = input) }
                  number={ this.props.chaseNum }
                  label="追号"
                  min={ 1 }
                  shortcuts={
                    this.props.chaseShortcuts
                      ? this.props.chaseShortcuts
                      : [
                        {
                          label: '追10期',
                          value: 10
                        },
                        {
                          label: '追30期',
                          value: 30
                        },
                        {
                          label: '追50期',
                          value: 50
                        },
                        {
                          label: '追100期',
                          value: 100
                        }
                      ]
                  }
                />
              </div>
            </div>
            <div className="item-set">
              <div className="txt">倍数</div>
              <div className="button-area">
                <NumberInput
                  onChange={ this.props.onTimesChange.bind(this) }
                  onClose={ this.props.checkTimes.bind(this) }
                  ref={ input => (this.timesInput = input) }
                  number={ this.props.times }
                  label="倍数"
                  min={ 1 }
                  shortcuts={ [
                    {
                      label: '投5倍',
                      value: 5
                    },
                    {
                      label: '投10倍',
                      value: 10
                    },
                    {
                      label: '投50倍',
                      value: 50
                    },
                    {
                      label: '投100倍',
                      value: 100
                    }
                  ] }
                />
              </div>
            </div>
          </div>
          <div className="buy-bar">
            <div className="msg">
              共<span className="money">{betPrice * chaseNum * times}</span>元 ({totalBetNum}注{' '}
              {chaseNum}期 {times}倍)
            </div>
            <div
              className="btn-buy"
              disabled={ isPending }
              style={ {
                color: isPending && '#fff',
                background: isPending && '#ccc'
              } }
              onClick={ this.props.onPlaceOrder.bind(this) }
            >
              {isPending ? '正在投注' : '立即投注'}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

BetCart.propTypes = {
  bettings: PropTypes.arrayOf(Bet).isRequired, // 投注内容列表
  onRemove: PropTypes.func.isRequired, // 删除一条投注
  onClear: PropTypes.func.isRequired, // 清空投注
  onRandom: PropTypes.func.isRequired, // 机选一注
  times: PropTypes.number.isRequired, // 倍数
  chaseNum: PropTypes.number.isRequired, // 追号数
  onTimesChange: PropTypes.func.isRequired, // 倍数更改时的回调方法
  onChaseNumChange: PropTypes.func.isRequired, // 追期数更改时的回调方法
  saleEndTime: PropTypes.number.isRequired, // 销售截至时间
  onPlaceOrder: PropTypes.func.isRequired, // 下单的方法
  payStatus: PropTypes.string.isRequired, // 支付状态，用于防止用户重复提交订单
  onBettingEdit: PropTypes.func.isRequired, // 编辑投注的回调方法
  checkTimes: PropTypes.func.isRequired, // 检查倍数限制
  chaseShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      value: PropTypes.number.isRequired
    })
  ), // 追期键盘上的快捷投注
  timesShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      value: PropTypes.number.isRequired
    })
  ), // 倍数键盘上的快捷投注
  maxChaseNum: PropTypes.number, // 最大的追期数
  showDltAdd: PropTypes.bool, // 是否显示大乐透的追期选项(仅用于大乐透)
  isDltAdd: PropTypes.bool, // 是否为大乐透的追期(仅用于大乐透)
  onToggleDltAdd: PropTypes.func, // 大乐透的追期更改时的回调方法(仅用于大乐透)
  ballFormat: PropTypes.func, // 投注栏上的球格式化的方法
  betPrice: PropTypes.number.isRequired // 单倍的投注价格
};

BetCart.defaultProps = {
  maxChaseNum: 100,
  showDltAdd: false
};
