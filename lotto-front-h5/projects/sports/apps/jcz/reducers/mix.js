import { toggle } from '../utils';
import {
  FOOTBALL_MIX_TOGGLE_MATCH_DETAIL,
  FOOTBALL_MIX_TOGGLE_MODE,
  FOOTBALL_MIX_CHANGE_MODE,
  FOOTBALL_MIX_SINGLE_BETTING_TOGGLE,
  FOOTBALL_MIX_SINGLE_BETTING_CLEAR,
  FOOTBALL_MIX_SINGLE_BETTING_SUBMIT
} from '../actions/mix';

import { getParameter } from '@/utils/utils';
import { isInMixPage } from '../utils/football';

function getModeFromUrlParams() {
  const page = getParameter('page');
  if (isInMixPage(page)) return page;
  return 'mi';
}

const defaultState = {
  showMode: false,
  mode: getModeFromUrlParams(),
  showMatchDetail: false,
  detailMatchId: 0
};

export const footballMix = (state = defaultState, action) => {
  switch (action.type) {
    case FOOTBALL_MIX_TOGGLE_MODE:
      return Object.assign({}, state, { showMode: !state.showMode });
    case FOOTBALL_MIX_CHANGE_MODE:
      return Object.assign({}, state, { mode: action.mode });
    case FOOTBALL_MIX_TOGGLE_MATCH_DETAIL:
      if (action.matchId === state.detailMatchId) {
        return Object.assign({}, state, { showMatchDetail: true });
      }
      return Object.assign({}, state, {
        detailMatchId: action.matchId,
        showMatchDetail: true
      });
    case FOOTBALL_MIX_SINGLE_BETTING_SUBMIT:
      return Object.assign({}, state, { showMatchDetail: false });
    default:
      return state;
  }
};

export const footballMixSingle = (state = {}, action) => {
  switch (action.type) {
    case FOOTBALL_MIX_SINGLE_BETTING_TOGGLE:
      return singleToggle(state, action);
    case FOOTBALL_MIX_SINGLE_BETTING_CLEAR:
      return {
        ...state,
        [action.id]: {}
      };
    default:
      return state;
  }
};

export const footballMixSingleData = (state = [], action) => {
  switch (action.type) {
    case FOOTBALL_MIX_SINGLE_BETTING_TOGGLE:
      return toggle(state, action.data, '_id');
    case FOOTBALL_MIX_SINGLE_BETTING_CLEAR:
      return state.filter(i => i.id !== action.id);
    default:
      return state;
  }
};

function singleToggle(state, action) {
  const { type, id, index } = action.data;
  const singleData = state[id] || {};
  const typeData = singleData[type];
  if (typeData && typeData.indexOf(index) > -1) {
    const idData = {
      ...singleData,
      [type]: typeData.filter(i => i !== index)
    };
    return {
      ...state,
      [id]: idData
    };
  } else if (typeData && typeData.indexOf(index) < 0) {
    const idData = {
      ...singleData,
      [type]: typeData.concat([index])
    };
    return {
      ...state,
      [id]: idData
    };
  } else if (!typeData) {
    let data = Object.assign({}, state[id] || {});
    data[type] = [index];
    return {
      ...state,
      [id]: data
    };
  }
  return state;
}
