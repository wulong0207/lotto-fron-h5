import {
  FOOTBALL_TOGGLE_BETTING,
  toggleBetting as toggle,
  FOOTBALL_BETTING_CHANGE,
  FOOTBALL_RECOVERY_BETTINGS
} from '../actions/betting';
import { groupArrayByKey } from '../utils';
import { toggleBetting } from '../reducers/betting';
import { getMaxLimitPackageCount } from '../utils/football';
import {
  FOOTBALL_MIX_SINGLE_BETTING_SUBMIT,
  singleBettingClear
} from '../actions/mix';
import alert from '@/services/alert';
import confirm from '@/services/confirm';
import session from '@/services/session';
import {
  FOOTBALL_BETTING_STORAGE_KEY,
  FOOTBALL_BETTTING_SELECTED_STORAGE_KEY
} from '../constants';

function nope() {}
/*
利用 middleware 机制向 football 应用统一处理异常
*/
const football = store => next => action => {
  const state = store.getState();
  const type = action.type;
  if (type === FOOTBALL_TOGGLE_BETTING) {
    // 统一处理 action 中的 category 和 match 字段
    const fullAction = generateFullBettingData(state, action);
    // 最大场数判断
    if (isMatchLimitReached(state, fullAction, 15)) return undefined;
    next(fullAction);
    // 延迟最高奖金计算，避免卡住 ui
    setTimeout(function() {
      store.dispatch({
        type: FOOTBALL_BETTING_CHANGE,
        data: fullAction.data
      });
    }, 50);
    return undefined;
  }
  // 单场赛事详细页投注时，判断选择了其他投注选项时，判断设胆数量是否超过了最大过关方式
  if (type === FOOTBALL_MIX_SINGLE_BETTING_SUBMIT) {
    return detectMaxPackageChange(store, state, action, next);
  }
  // 从 localStorage 读取之前的投注信息
  if (type === FOOTBALL_RECOVERY_BETTINGS) {
    return recoveryBetting(state, next);
  }
  return next(action);
};

// 统一处理 action 中的 category 和 match 字段
function generateFullBettingData(state, action) {
  const page = state.football.page;
  const mode = state.footballMix.mode;
  const name = page === 'mix' && mode !== 'mi' ? mode : page;
  const allMatchs = state.football.data;
  const match = allMatchs.filter(d => d.id === action.data.id)[0];
  return {
    ...action,
    data: { ...action.data, match, single: action.single, category: name }
  };
}

// 选择的场次是否达到了场数限制
function isMatchLimitReached(state, action, max) {
  const betting = toggleBetting(
    state.footballBettings.filter(b => b.name === action.data.category)[0],
    action
  );
  if (groupArrayByKey(betting.selected, 'id').length > max) {
    alert.alert('选择场次不得大于' + max + '场');
    return true;
  }
  return false;
}

// 根据选择的投注类型获取最高过关方式
// 胜平负最高 8 * 1 ...
function getMaxPackageCount(state, data, single = false) {
  const action = {
    type: FOOTBALL_TOGGLE_BETTING,
    single,
    data
  };
  const fullAction = generateFullBettingData(state, action);
  const betting = toggleBetting(
    state.footballBettings.filter(b => b.name === fullAction.data.category)[0],
    fullAction
  );
  return getMaxLimitPackageCount(betting.selected);
}

// 检测是否选择了其他类型的投注 限制最高过关方式和设胆数量
function detectMaxPackageChange(store, state, action, next) {
  if (!action.data || !action.data.length) return next(action);
  const smallestMaxPackageCount = action.data
    .map(d => getMaxPackageCount(state, d, true))
    .sort((a, b) => a - b)[0];
  const betting = state.footballBettings.filter(b => b.name === 'mix')[0];
  const preMaxPackgeCount = getMaxLimitPackageCount(betting.selected);
  if (
    smallestMaxPackageCount < preMaxPackgeCount &&
    betting.courage.length >= smallestMaxPackageCount
  ) {
    const count = betting.courage.length - (smallestMaxPackageCount - 1);
    confirm
      .confirm(
        `当前玩法最高只能选择${smallestMaxPackageCount - 1}个胆码`,
        '去掉' + count + '胆码',
        '取消'
      )
      .then(() => {
        action.data.map(d => store.dispatch(toggle(d, true)));
        store.dispatch(singleBettingClear(action.data[0].id));
        next(action);
      })
      .catch(nope);
  } else {
    action.data.map(d => store.dispatch(toggle(d, true)));
    store.dispatch(singleBettingClear(action.data[0].id));
    next(action);
  }
}

function recoveryBetting(state, next) {
  const prevBettings = session.get(FOOTBALL_BETTING_STORAGE_KEY);
  const prevBettingsSelected = session.get(
    FOOTBALL_BETTTING_SELECTED_STORAGE_KEY
  );
  if (!prevBettings || !Array.isArray(prevBettings)) return undefined;
  const matchs = state.football.data;
  const bettings = prevBettings.map(b => {
    return {
      ...b,
      selected: b.selected
        .map(s => {
          const match = matchs.filter(m => m.id === s.id)[0];
          return {
            ...s,
            match
          };
        })
        .filter(i => Boolean(i.match))
    };
  });
  next({
    type: FOOTBALL_RECOVERY_BETTINGS,
    bettings,
    selected: prevBettingsSelected
  });
}

export default football;
