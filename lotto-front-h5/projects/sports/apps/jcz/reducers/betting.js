import {
  FOOTBALL_TOGGLE_BETTING,
  FOOTBALL_CLEAR_BETTINGS,
  FOOTBALL_SET_BETTING_TIMES,
  FOOTBALL_TOGGLE_GGTYPE,
  FOOTBALL_TOGGLE_COURAGE,
  FOOTBALL_REMOVE_BETTING_MATCH,
  FOOTBALL_SUBMIT_ORDER,
  FOOTBALL_SET_BETTING_COURAGE,
  FOOTBALL_SET_BETTING_GGTYPE,
  FOOTBALL_BETTING_CHANGE,
  FOOTBALL_RECOVERY_BETTINGS
} from '../actions/betting';
import { getArrIndexByKey, toggle } from '../utils';
import {
  calculateProfilt,
  calculateGGType,
  calculateCourage
} from '../utils/football';
import session from '@/services/session';
import {
  FOOTBALL_BETTING_STORAGE_KEY,
  FOOTBALL_BETTTING_SELECTED_STORAGE_KEY,
  PAGES,
  MODES
} from '../constants';

export function sessionWrap(key, value) {
  let data;
  try {
    data = JSON.parse(JSON.stringify(value));
  } catch (e) {
    throw new Error(key + 'value error');
  }
  if (key === FOOTBALL_BETTING_STORAGE_KEY) {
    data = value.map(v => {
      return {
        ...v,
        selected: v.selected.map(s => {
          return {
            ...s,
            match: null
          };
        })
      };
    });
  }
  session.set(key, data);
  return value;
}

export const calculateBetting = (state = {}) => {
  const { label, gTypes, maxGtype, name } = calculateGGType(state);
  const singlewinAutoTime =
    (name === 'singlewin' || state.name === 'singlewin') &&
    (state.times < 5 || state.times === 10);
  let times = state.times || 1;
  if (singlewinAutoTime) {
    times = 10;
  } else if (!singlewinAutoTime && state.autoTimes && state.times === 10) {
    times = 1;
  }
  const newState = Object.assign({}, state, {
    ggType: gTypes,
    ggLabel: label,
    ggName: name,
    maxGGTypes: maxGtype,
    times: times,
    autoTimes: singlewinAutoTime && !state.autoTimes
  });
  const { betNum, maxBonus, minBonus } = calculateProfilt(newState);
  return Object.assign({}, newState, {
    betNum: betNum || 0,
    maxBonus: maxBonus || 0,
    minBonus: minBonus || 0,
    amount: betNum ? betNum * 2 * state.times : 0,
    courage: calculateCourage(newState)
  });
};

export function toggleBetting(state, action) {
  let selectedData = state.selected.concat();
  const { data } = action;
  const idx = getArrIndexByKey(selectedData, '_id', data._id);
  if (idx < 0) {
    selectedData.push(data);
  } else {
    if (!data.single) selectedData.splice(idx, 1);
  }
  return Object.assign({}, state, { selected: selectedData });
}

export const footballBetting = (state = {}, action) => {
  switch (action.type) {
    case FOOTBALL_RECOVERY_BETTINGS:
      return calculateBetting(
        Object.assign({}, state, { autoGGType: !state.courage.length })
      );
    case FOOTBALL_BETTING_CHANGE:
      if (state.name !== action.data.category) {
        return state;
      }
      return calculateBetting(toggleBetting(state, action));
    case FOOTBALL_CLEAR_BETTINGS:
      if (state.name !== action.name) {
        return state;
      }
      return Object.assign({}, state, {
        selected: [],
        courage: [],
        times: state.name === 'singlewin' ? 10 : 1,
        autoGGType: true
      });
    case FOOTBALL_SET_BETTING_TIMES:
      if (state.name !== action.name) {
        return state;
      }
      return calculateBetting(
        Object.assign({}, state, { times: action.times })
      );
    case FOOTBALL_TOGGLE_GGTYPE:
      if (state.name !== action.name) {
        return state;
      }
      return calculateBetting(
        Object.assign({}, state, {
          ggType: toggle(state.ggType, action.ggType),
          autoGGType: false
        })
      );
    case FOOTBALL_TOGGLE_COURAGE:
      if (state.name !== action.name) {
        return state;
      }
      return calculateBetting(
        Object.assign({}, state, {
          courage: toggle(state.courage, action.matchId)
        })
      );
    case FOOTBALL_REMOVE_BETTING_MATCH:
      if (state.name !== action.name) {
        return state;
      }
      // switch 没有块级作用域 。。。。
      const newState1 = Object.assign({}, state, {
        selected: state.selected.filter(s => s.id !== action.matchId)
      });
      return calculateBetting(
        Object.assign({}, newState1, { courage: calculateCourage(newState1) })
      );
    // return calculateBetting(Object.assign({}, state, {selected: state.selected.filter(s => s.id !== action.matchId)}));
    case FOOTBALL_SET_BETTING_COURAGE:
      if (state.name !== action.name) {
        return state;
      }
      return calculateBetting(
        Object.assign({}, state, { courage: action.courage })
      );
    case FOOTBALL_SET_BETTING_GGTYPE:
      if (state.name !== action.name) {
        return state;
      }
      return calculateBetting(
        Object.assign({}, state, { ggType: action.types, autoGGType: false })
      );
    case FOOTBALL_SUBMIT_ORDER:
      if (state.name !== action.name) {
        return state;
      }
      return state;
    default:
      return state;
  }
};

const generateDefaultBettings = () => {
  return PAGES.concat(MODES).map(p => {
    return {
      name: p.name, // 用于个页面的标识
      selected: [], // 选择的投注数据
      times: p.name === 'singlewin' ? 10 : 1, // 投注倍数
      ggType: [], // 过关方式
      ggLabel: '', // 过关方式标签
      maxGGTypes: 0, // 最大的过关方式
      autoGGType: true, // 过关方式是否为系统自动
      courage: [], // 设胆
      maxBonus: 0, // 最高奖金
      minBonus: 0, // 最低奖金
      amount: 0, // 投注金额
      betNum: 0 // 投注数
    };
  });
};

console.log(generateDefaultBettings());

export const footballBettings = (state = generateDefaultBettings(), action) => {
  switch (action.type) {
    case FOOTBALL_BETTING_CHANGE:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_CLEAR_BETTINGS:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_SET_BETTING_TIMES:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_TOGGLE_GGTYPE:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_TOGGLE_COURAGE:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_REMOVE_BETTING_MATCH:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_SUBMIT_ORDER:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_SET_BETTING_COURAGE:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_SET_BETTING_GGTYPE:
      return sessionWrap(
        FOOTBALL_BETTING_STORAGE_KEY,
        state.map(b => footballBetting(b, action))
      );
    case FOOTBALL_RECOVERY_BETTINGS:
      if (!action.bettings) return state;
      return action.bettings.map(b => footballBetting(b, action));
    default:
      return state;
  }
};

/*
为了减少render量，将选中的数据存为两份，
这份的对象话的数据用于页面高亮
这份数据类似于
{
  mix: {
    wdf: {
      $id: [$index],
      $id: [$index]
    },
    let_wdf: {
      $id: [$index]
    }
  },
  single: {
    $id: [$index]
  }
}
这样数据能对应到页面的每个单元格，减少 render 数量
*/

const generateMixDefaultBettingSelecte = () => {
  let mix = {};
  let modes = MODES.concat();
  modes.pop();
  modes.map(m => {
    mix[m.name] = {};
  });
  return mix;
};

const generateDefaultBettingSelected = () => {
  let selected = {};
  const names = PAGES.concat(MODES);
  names.map(p => {
    selected[p.name] = {};
  });
  selected['mix'] = generateMixDefaultBettingSelecte();
  return selected;
};

export const footballBettingSelected = (
  state = generateDefaultBettingSelected(),
  action
) => {
  switch (action.type) {
    case FOOTBALL_RECOVERY_BETTINGS:
      if (!action.selected) return state;
      return action.selected;
    case FOOTBALL_TOGGLE_BETTING:
      const { category, type, id, index, single } = action.data;
      if (action.data.category === 'mix') {
        const mix = Object.assign({}, state.mix);
        let selected = mix[type][id] || [];
        const idx = selected.indexOf(index);
        if (idx < 0) {
          mix[type][id] = selected.concat([index]);
        } else {
          if (!single) mix[type][id] = selected.filter(i => i !== index);
        }
        return sessionWrap(
          FOOTBALL_BETTTING_SELECTED_STORAGE_KEY,
          Object.assign({}, state, { mix })
        );
      } else {
        const data = Object.assign({}, state);
        const selected = data[category][id] || [];
        data[category][id] = toggle(selected, action.data.index);
        return sessionWrap(
          FOOTBALL_BETTTING_SELECTED_STORAGE_KEY,
          Object.assign({}, state, data)
        );
      }
    case FOOTBALL_CLEAR_BETTINGS:
      if (action.name === 'mix') {
        const mix = generateMixDefaultBettingSelecte();
        return sessionWrap(
          FOOTBALL_BETTTING_SELECTED_STORAGE_KEY,
          Object.assign({}, state, { mix })
        );
      } else {
        return sessionWrap(FOOTBALL_BETTTING_SELECTED_STORAGE_KEY, {
          ...state,
          [action.name]: {}
        });
      }
    case FOOTBALL_REMOVE_BETTING_MATCH:
      if (action.name === 'mix') {
        const mix = Object.assign({}, state.mix);
        for (let k in mix) {
          if (mix[k][action.matchId]) mix[k][action.matchId] = [];
          // mix[k] = mix[k].filter(i => parseInt(i.split(':')[0]) !== action.matchId);
        }
        return sessionWrap(
          FOOTBALL_BETTTING_SELECTED_STORAGE_KEY,
          Object.assign({}, state, { mix })
        );
      } else {
        return sessionWrap(FOOTBALL_BETTTING_SELECTED_STORAGE_KEY, {
          ...state,
          [action.name]: {
            ...state[action.name],
            [action.matchId]: []
          }
        });
      }
    default:
      return state;
  }
};
