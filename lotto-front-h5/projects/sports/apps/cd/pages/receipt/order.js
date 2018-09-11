import React from 'react';
import Matches from '../../components/matches';
import { Order, Visible, WinningStatus } from '../../types';
import PropTypes from 'prop-types';
import './order.scss';
import cx from 'classnames';
import { getLotteryName } from '../../helpers';

function InvisibleTip({ children }) {
  return (
    <div className="invisible-tip">
      <div className="invisible-tip-img">
        <img src={ require('./images/ic_key@2x.png') } />
      </div>
      <div>{children}</div>
    </div>
  );
}

InvisibleTip.propTypes = {
  children: PropTypes.node
};

export function OrderInfo({ order, visible, follow, winningStatus }) {
  if (order.orderMatchInfoBOs) {
    return (
      <div className="order-detail">
        <Matches
          matches={ order.orderMatchInfoBOs }
          lotteryCode={ order.orderBaseInfoBO.lotteryCode }
          lotteryChildCode={order.orderBaseInfoBO.lotteryChildCode}
          winningStatus={ winningStatus }
        />
      </div>
    );
  }
  if (visible === 1) {
    return <InvisibleTip>开奖后可见</InvisibleTip>;
  }
  if (visible === 3) {
    return <InvisibleTip>跟单后可见</InvisibleTip>;
  }
  if (visible === 4) {
    return (
      <InvisibleTip>
        关注后可见，<em onClick={ follow }>点击关注</em>
      </InvisibleTip>
    );
  }
  return <InvisibleTip>不可见</InvisibleTip>;
}

OrderInfo.propTypes = {
  order: Order,
  visible: Visible,
  follow: PropTypes.func.isRequired,
  winningStatus: WinningStatus.isRequired
};

export default function OrderComponent({
  order,
  isRecommend,
  visible,
  follow,
  receipt
}) {
  const { winningStatus } = order.orderBaseInfoBO;
  return (
    <div
      className={ cx('order', {
        'not-winning': winningStatus === 2,
        winning: winningStatus === 3 || winningStatus === 4
      }) }
    >
      <div className="order-header">
        {isRecommend && <span className="recommend" />}
        <strong>{getLotteryName(receipt.orderFullDetailInfoBO.orderBaseInfoBO.lotteryCode)}：</strong>
        {formatBunchStr(order.orderBaseInfoBO.bunchStr).map((b, i) => (
          <span key={ i }>{b}</span>
        ))}
      </div>
      <OrderInfo
        order={ order }
        visible={ visible }
        follow={ follow }
        winningStatus={ winningStatus }
      />
    </div>
  );
}

OrderComponent.propTypes = {
  order: Order,
  isRecommend: PropTypes.bool,
  visible: Visible.isRequired,
  follow: PropTypes.func.isRequired
};

function formatBunchStr(bunchStr) {
  return bunchStr.split(',').map(b => {
    if (b === '1_1') return '单关';
    return b.replace('_', '串');
  });
}
