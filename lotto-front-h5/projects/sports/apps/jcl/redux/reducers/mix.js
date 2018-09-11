import { toggle } from '../../utils'
import {
  BASKETBALL_MIX_TOGGLE_MATCH_DETAIL,
  BASKETBALL_MIX_TOGGLE_MODE,
  BASKETBALL_MIX_CHANGE_MODE,
  BASKETBALL_MIX_SINGLE_BETTING_TOGGLE,
  BASKETBALL_MIX_SINGLE_BETTING_CLEAR,
  BASKETBALL_MIX_SINGLE_BETTING_SUBMIT
} from '../actions/mix';

import { getParameter } from '@/utils/utils';
import { isInMixPage, isValidPage } from '../../utils/basketball';

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
}

export const basketballMix = (state=defaultState, action) => {
  switch (action.type) {
    case BASKETBALL_MIX_TOGGLE_MODE:
      return Object.assign({} , state, { showMode: !state.showMode });
    case BASKETBALL_MIX_CHANGE_MODE:
      return Object.assign({}, state, { mode: action.mode });
    case BASKETBALL_MIX_TOGGLE_MATCH_DETAIL:
      if (action.matchId === state.detailMatchId) {
        return Object.assign({}, state, { showMatchDetail: true });;
      }
      return Object.assign({}, state, { detailMatchId: action.matchId, showMatchDetail: true });
    case BASKETBALL_MIX_SINGLE_BETTING_SUBMIT:
      return Object.assign({}, state, { showMatchDetail: false });
    default:
      return state;
  }
}

export const basketballMixSingle = (state={}, action) => {
  switch (action.type) {
    case BASKETBALL_MIX_SINGLE_BETTING_TOGGLE:
      return singleToggle(state, action);
    case BASKETBALL_MIX_SINGLE_BETTING_CLEAR:
      return {
        ...state,
        [action.id]: {}
      }
    default:
      return state;
  }
}

export const basketballMixSingleData = (state=[], action) => {
  switch (action.type) {
    case BASKETBALL_MIX_SINGLE_BETTING_TOGGLE:
      return toggle(state, action.data, '_id');
    case BASKETBALL_MIX_SINGLE_BETTING_CLEAR:
      return state.filter(i => i.id !== action.id);
    default:
      return state;
  }
}


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
    }
  } else if (typeData && typeData.indexOf(index) < 0) {
    const idData = {
      ...singleData,
      [type]: typeData.concat([index])
    };
    return {
      ...state,
      [id]: idData
    }
  } else if (!typeData) {
    let data = Object.assign({}, (state[id] || {}));
    data[type] = [index];
    return {
      ...state,
      [id]: data
    }
    return newState;
  }
}
