import { LOTTERY_NAME, VISIBLE, WINNING_STATUS } from '../constants';

export function getLotteryName(lotteryCode) {
  return LOTTERY_NAME[lotteryCode] || '';
}

export function getVisibleLabel(visible) {
  const visibleObj = VISIBLE.find(v => v.value === visible);
  return visibleObj ? visibleObj.label : '';
}

export function mapWinningStatusToLabel(status) {
  const winningStatus = WINNING_STATUS.find(w => w.value === status);
  if (status === 4) return WINNING_STATUS[2].label; // 已派奖映射为已中奖
  if (!winningStatus) return '';
  return winningStatus.label;
}
