import React from 'react';
import { RecommendReceipt } from '../../types';
import { Link } from 'react-router';
import './receipt.scss';
import PropTypes from 'prop-types';

export default function ReceiptComponent({ receipt, isEnd }) {
  return (
    <div className="receipt" key={ receipt.id }>
      <div className="receipt-info">
        <div className="user-avatar">
          <Link to={ `/experts/${receipt.userIssueId}` }>
            <img
              src={
                receipt.headUrl ||
                require('../../../../../../lib/img/custom@2x.png')
              }
            />
          </Link>
        </div>
        <Link to={ `/receipts/${receipt.id}` }>
          <div className="receipt-summary">
            <div className="receipt-head">
              <h3 className="nickname">{receipt.nickName}</h3>
              {receipt.level === 1 && (
                <span className="expert-icon receipt-icon">专</span>
              )}
              {receipt.isRecommend === 1 && (
                <span className="recommend-icon receipt-icon">荐</span>
              )}
            </div>
            <div className="receipt-analytics">
              <span>
                预计回报<em>{receipt.maxRoi}</em>
              </span>
              <span>抄单数{receipt.followNumStr}</span>
              <span>金额￥{receipt.orderAmount}</span>
            </div>
            <div className="receipt-record">
              {receipt.recentRecord && (
                <span className="recent-record">{receipt.recentRecord}</span>
              )}
              {receipt.continueHit && (
                <span className="hit">{receipt.continueHit}</span>
              )}
            </div>
          </div>
        </Link>
      </div>
      <div className="receipt-date-time">
        <div className="end-time">{receipt.endTime}</div>
        {!isEnd && (
          <Link className="follow-button" to={ `/receipts/${receipt.id}` }>
            立即抄单
          </Link>
        )}
      </div>
    </div>
  );
}

ReceiptComponent.propTypes = {
  receipt: RecommendReceipt,
  isEnd: PropTypes.bool
};
