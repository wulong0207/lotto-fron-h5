import { SP_HISTORY_MODE, SP_HISTORY_DATA } from '../actions/sphistory.js';

const defaultState = {
  showMode: false,
  selectData: {},
  betKind: '', // 0胜负,1让分胜负，2大小分
  data: []
};

export const spHistory = (state = defaultState, action) => {
  switch (action.type) {
    case SP_HISTORY_MODE:
      return Object.assign({}, state, {
        showMode: !state.showMode,
        selectData: action.selectData,
        betKind: action.betKind
      });
    case SP_HISTORY_DATA:
      return Object.assign({}, state, {
        data: action.data
      });
    default:
      return state;
  }
};
