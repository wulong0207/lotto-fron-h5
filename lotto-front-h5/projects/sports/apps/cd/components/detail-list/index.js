import React from 'react';
import { FollowData } from '../../types';
import PropTypes from 'prop-types';
import './detail-list.scss';

export default function DetailList({ data }) {
  return (
    <div className="detail-list">
      {data.map((item, index) => {
        return (
          <div className="item" key={ index }>
            <div className="info">
              <div className="follow-info">
                <h2>{item.nickName}</h2>
                <span>
                  【跟单金额￥{item.followAmount
                    ? item.followAmount
                    : item.orderAmount}】
                </span>
              </div>
              <span className="datetime">
                {item.createTime ? item.createTime : item.followedTime}
              </span>
            </div>
            <div className="amount">
              {item.winStatus === 4 ? `￥${item.commissionAmount}(提成)` : '--'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

DetailList.propTypes = {
  data: PropTypes.arrayOf(FollowData)
};
