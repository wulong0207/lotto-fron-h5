import { getCurrentMode } from '../utils/basketball.js';
import { selectGameCout } from '../utils/bet.js';
import Alert from '@/services/message';

/*
利用 middleware 机制向 football 应用统一处理异常
*/
const ball = store => next => action => {
  // const state = store.getState();
  // const type = action.type;
  // if (type === BET_SIMPLE_SELECT || type === BET_SFC_SELECT ) {
  //   // 最大场数判断
  //   if (isMatchLimitReached(state, action, 2)) return undefined;
  //   next(action);

  //   return undefined;
  // }
  // 从 localStorage 读取之前的投注信息
  // if (type === FOOTBALL_RECOVERY_BETTINGS) {
  //   return recoveryBetting(state, next);
  // }
  return next(action);
};

// 选择的场次是否达到了场数限制
function isMatchLimitReached(state, action, max) {
  let gameCount = selectGameCout(state.betSelected.bets, getCurrentMode());
  if (gameCount.count > max) {
    Alert.alert({ msg: '选择场次不得大于' + max + '场' });
    return true;
  }

  return false;
}

export default ball;
