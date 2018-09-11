import React from 'react';
import { RecommendReceipt } from '../../types';
import { getVisibleLabel } from '../../helpers';
import { Link } from 'react-router';
import cx from 'classnames';
import './recommend.scss';
import PropTypes from 'prop-types';

function Receipt({ receipt, isEnd }) {
  return (
    <div
      className={ cx('recommend', {
        'not-winning': receipt.winStatus === 2,
        winning: receipt.winStatus === 3 || receipt.winStatus === 4
      }) }
    >
      <div className="content">
        <div className="roi">
          <h3>{receipt.maxRoi}</h3>
          <span>预计回报(倍)</span>
        </div>
        <Link to={ `/receipts/${receipt.id}` }>
          <div className="info">
            <div className="summary">
              <span>
                抄单数{receipt.followNumStr ? receipt.followNumStr : 0}
              </span>
              <span>
                方案金额￥{receipt.orderAmount ? receipt.orderAmount : 0}
              </span>
            </div>
            <div className="end-status">
              {receipt.winStatus === 1 ? `${receipt.endTime}` : '已截止'}
            </div>
          </div>
        </Link>
      </div>
      <div className="footer">
        <div className="date-time">
          {receipt.createTimeStr}发布{' '}
          {getVisibleLabel(receipt.orderVisibleType)}
        </div>
        {!isEnd && (
          <Link className="follow-button" to={ `/receipts/${receipt.id}` }>
            立即抄单
          </Link>
        )}
      </div>
    </div>
  );
}

Receipt.propTypes = {
  receipt: RecommendReceipt
};

export default function RecommendReceiptComponent({ receipt, isEnd }) {
  if (isEnd) {
    return (
      <Link to={ `/receipts/${receipt.id}` } className="recommend">
        <Receipt receipt={ receipt } isEnd={ isEnd } />
      </Link>
    );
  }
  return <Receipt receipt={ receipt } isEnd={ isEnd } />;
}

RecommendReceiptComponent.propTypes = {
  receipt: RecommendReceipt,
  isEnd: PropTypes.bool.isRequired
};
