/**
 * Created by harry on 25/7/2017.
 */
import {
  LZC_SET_CURRENT_ISSUES,
  LZC_SET_SERVER_TIME,
  LZC_SET_MATCH_IDS
} from '../actions/football';

const defaultState = {
  issue: null,
  serverTime: new Date().getTime(),
  localTime: new Date().getTime()
};

export const football = (state = defaultState, action) => {
  switch (action.type) {
    case LZC_SET_SERVER_TIME:
      return {
        ...state,
        serverTime: action.time
      };
    default:
      return state;
  }
};

export const currentIssue = (state = {}, action) => {
  switch (action.type) {
    case LZC_SET_CURRENT_ISSUES:
      return { ...state, [action.lotteryCode]: action.data };
    default:
      return state;
  }
};

export const matchIds = (state = [], action) => {
  switch (action.type) {
    case LZC_SET_MATCH_IDS:
      return action.ids;
    default:
      return state;
  }
};
