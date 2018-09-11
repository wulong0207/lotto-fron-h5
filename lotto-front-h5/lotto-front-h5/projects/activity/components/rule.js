/*
 * @Author: nearxu
 * @Date: 2017-11-22 10:49:05
 * 活动说明
 */
import React from 'react';
import PropTypes from 'prop-types';

function Rule({ lotteryClass }) {
  return (
    <div className="rules">
      <ul>
        <li>
          1.活动仅限首次<i>购买{lotteryClass}11选5</i>的用户参与；
        </li>
        <li>
          2.用户<i>需实名认证</i>，且在活动页面购买方可参与活动；
        </li>
        <li>3.每位实名用户仅限参与一次；</li>
        <li>
          4.参与活动之后，<i>方案不可撤单</i>；
        </li>
        <li>
          5.恶意操作的用户将取消活动资格，不予返还本金，<i>
            中奖部分将有权扣回
          </i>;
        </li>
        <li>
          6.在法律许可范围内，2N彩票保留本次活动解释权，如有疑问请联系客服:
          0755-61988504。
        </li>
      </ul>
    </div>
  );
}

export default Rule;
Rule.propTypes = {
  lotteryClass: PropTypes.string
};
