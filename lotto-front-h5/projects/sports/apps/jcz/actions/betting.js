import {
  generateOrderData,
  generateOptimizedOrderData
} from '../utils/football';
import { placeNewOrder } from './order';

export const FOOTBALL_TOGGLE_BETTING = 'FOOTBALL_TOGGLE_BETTING';
export const FOOTBALL_BETTING_CHANGE = 'FOOTBALL_BETTING_CHANGE';
export const FOOTBALL_CLEAR_BETTINGS = 'FOOTBALL_CLEAR_BETTINGS';
export const FOOTBALL_SET_BETTING_TIMES = 'FOOTBALL_SET_BETTING_TIMES';
export const FOOTBALL_TOGGLE_GGTYPE = 'FOOTBALL_TOGGLE_GGTYPE';
export const FOOTBALL_TOGGLE_COURAGE = 'FOOTBALL_TOGGLE_COURAGE';
export const FOOTBALL_REMOVE_BETTING_MATCH = 'FOOTBALL_REMOVE_BETTING_MATCH';
export const FOOTBALL_SUBMIT_ORDER = 'FOOTBALL_SUBMIT_ORDER';
export const EMPTY_ACTION = 'EMPTY_ACTION';
export const FOOTBALL_SET_BETTING_COURAGE = 'FOOTBALL_SET_BETTING_COURAGE';
export const FOOTBALL_SET_BETTING_GGTYPE = 'FOOTBALL_SET_BETTING_GGTYPE';
export const FOOTBALL_RECOVERY_BETTINGS = 'FOOTBALL_RECOVERY_BETTINGS';

export const toggleBetting = (data, single = false) => {
  // return (dispatch, getState) => {
  //   const state = getState();
  //   const football = state.football;
  //   const mode = state.footballMix.mode;
  //   // 判断选择的赛事是否大于 15 场
  //   const page = football.page;
  //   const name = page === 'mix' && mode !== 'mi' ? mode : page;
  //   const betting = state.footballBettings.filter(b => b.name === name)[0];
  //   let selectedDataList = betting.selected.concat();
  //   if(getArrIndexByKey(selectedDataList, '_id', data._id) === -1) {
  //     selectedDataList.push(data);
  //     if (groupArrayByKey(selectedDataList, 'id').length > 15) {
  //       alert('选择场次不得大于15场');
  //       return {type: EMPTY_ACTION}
  //     }
  //   }
  //   // 将 match 信息加入到 selected item
  //   const allMatchs = football.data;
  //   const match = allMatchs.filter(d => d.id === data.id)[0];
  //   // 根据页面判断所属的投注类型
  //   let category = data.category;
  //   if (!category) {
  //     category = page === 'mix' && mode !== 'mi' ? mode : page;
  //   }
  //   const selectedData = Object.assign({}, data, {category: category });
  //   dispatch(toggleBettingData(selectedData, match, single));
  // }
  return {
    type: FOOTBALL_TOGGLE_BETTING,
    data,
    single
  };
};

export const toggleBettingData = (data, match, single = false) => {
  const selectedData = Object.assign({}, data, { match }, { single });
  return {
    type: FOOTBALL_TOGGLE_BETTING,
    data: Object.assign({}, selectedData),
    single
  };
};

export const clearBettings = name => {
  return {
    type: FOOTBALL_CLEAR_BETTINGS,
    name
  };
};

export const setBettingTimes = (name, times) => {
  return {
    type: FOOTBALL_SET_BETTING_TIMES,
    name,
    times
  };
};

export const toggleGGType = (name, ggType) => {
  return {
    type: FOOTBALL_TOGGLE_GGTYPE,
    ggType,
    name
  };
};

export const toggleCourage = (name, matchId) => {
  return {
    type: FOOTBALL_TOGGLE_COURAGE,
    name,
    matchId
  };
};

export const removeBettingMatch = (name, matchId) => {
  return {
    type: FOOTBALL_REMOVE_BETTING_MATCH,
    name,
    matchId
  };
};

export const submitOrder = (
  betting,
  latestEndSaleDate,
  combinations = [],
  times = 1,
  optimized = false,
  isSinglewin = false
) => {
  return dispatch => {
    let data;
    if (combinations.length || optimized) {
      data = generateOptimizedOrderData(
        combinations,
        times,
        betting,
        isSinglewin
      );
    } else {
      data = generateOrderData(betting);
    }
    dispatch(placeNewOrder(data, betting.name, latestEndSaleDate));
  };
};

export const setBettingCourage = (name, courage) => {
  return {
    type: FOOTBALL_SET_BETTING_COURAGE,
    name,
    courage
  };
};

export const setBettingGGtype = (name, types) => {
  return {
    type: FOOTBALL_SET_BETTING_GGTYPE,
    name,
    types
  };
};

export const recoveryBetting = () => {
  return {
    type: FOOTBALL_RECOVERY_BETTINGS
  };
};
