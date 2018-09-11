import PropTypes from 'prop-types';
import { VISIBLE } from '../constants';
import { range } from 'lodash';

export const Visible = PropTypes.oneOf(VISIBLE.map(i => i.value));

export const MissionRate = PropTypes.oneOf(range(0, 11));

export const Sp = PropTypes.shape({
  let_sp_s: PropTypes.number,
  let_sp_p: PropTypes.number,
  let_sp_f: PropTypes.number,
  sp_s: PropTypes.number,
  sp_p: PropTypes.number,
  sp_f: PropTypes.number
});

export const Match = PropTypes.shape({
  id: PropTypes.number.isRequired,
  officalMatchCode: PropTypes.string.isRequired,
  systemCode: PropTypes.string.isRequired,
  homeName: PropTypes.string.isRequired,
  visitiName: PropTypes.string.isRequired,
  matchShortName: PropTypes.string.isRequired,
  orderMatchZQBO: Sp,
  betGameContent: PropTypes.string.isRequired,
  matchStatus: PropTypes.number.isRequired,
  isDan: PropTypes.oneOf([0, 1]),
  isChooseMatchInfo: PropTypes.oneOf([0, 1]),
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
});

export const Bet = PropTypes.shape({
  flag: PropTypes.number.isRequired,
  panKou: PropTypes.string.isRequired,
  planContent: PropTypes.string.isRequired,
  sp: PropTypes.string.isRequired
});

export const OrderBase = PropTypes.shape({
  orderCode: PropTypes.string.isRequired,
  lotteryCode: PropTypes.number.isRequired,
  lotteryChildCode: PropTypes.number.isRequired,
  orderAmount: PropTypes.number.isRequired
});

export const Order = PropTypes.shape({
  sysDate: PropTypes.string.isRequired,
  orderBaseInfoBO: OrderBase,
  orderMatchInfoBOs: PropTypes.arrayOf(Match)
});

const UserObject = {
  userId: PropTypes.number.isRequired,
  followNum: PropTypes.number,
  headUrl: PropTypes.string,
  nickName: PropTypes.string.isRequired,
  userIssueId: PropTypes.number.isRequired,
  recentRecord: PropTypes.string,
  hitNum: PropTypes.number,
  issueNum: PropTypes.number,
  level: PropTypes.number
};

export const User = PropTypes.shape(UserObject);

export const Receipt = PropTypes.shape({
  ...UserObject,
  id: PropTypes.number.isRequired,
  userIssueId: PropTypes.number.isRequired,
  orderCode: PropTypes.string.isRequired,
  maxRoi: PropTypes.string.isRequired,
  recommendReason: PropTypes.string,
  isRecommend: PropTypes.oneOf([0, 1]),
  orderVisibleType: Visible,
  commissionRate: PropTypes.string,
  createTimeStr: PropTypes.number,
  orderFullDetailInfoBO: Order
});

export const Record = PropTypes.shape({
  prizeTotal: PropTypes.number.isRequired,
  notPrizeTotal: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired
});

export const RecommendReceipt = PropTypes.shape({
  continueHit: PropTypes.string,
  createTimeStr: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  followNum: PropTypes.number,
  headUrl: PropTypes.string,
  hitRate: PropTypes.string,
  id: PropTypes.number.isRequired,
  isRecommend: PropTypes.oneOf([0, 1]),
  isTop: PropTypes.oneOf([0, 1]),
  level: PropTypes.number,
  maxRoi: PropTypes.string.isRequired,
  nickName: PropTypes.string.isRequired,
  orderAmount: PropTypes.number.isRequired,
  orderCode: PropTypes.string.isRequired,
  orderVisibleType: PropTypes.number.isRequired,
  recentRecord: PropTypes.string,
  winStatus: PropTypes.oneOf([1, 2, 3, 4])
});

export const FollowData = PropTypes.shape({
  commissionAmount: PropTypes.number,
  followedTime: PropTypes.string,
  createTime: PropTypes.string,
  nickName: PropTypes.string.isRequired,
  orderAmount: PropTypes.number.isRequired
});

export const Follower = PropTypes.shape({
  focusTime: PropTypes.string.isRequired,
  nickName: PropTypes.string.isRequired,
  remark: PropTypes.oneOf([0, 1])
});

export const Rebate = PropTypes.shape({
  commissionAmount: PropTypes.number,
  followAmount: PropTypes.number.isRequired,
  followNum: PropTypes.number.isRequired,
  orderCode: PropTypes.string.isRequired
});

export const RebateDetail = FollowData;

export const WinningStatus = PropTypes.oneOf([1, 2, 3, 4]);
