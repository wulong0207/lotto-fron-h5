import {
  LZC_TOGGLE_BETTING,
  LZC_SET_BETTING_TIME,
  LZC_RESET_BETTING,
  LZC_TOGGLE_COURAGE
} from '../actions/betting';

function toggle(arr, value) {
  if (!arr || arr.length === 0) return [value];
  if (arr.indexOf(value) < 0) {
    return [...arr, value];
  } else {
    return arr.filter(a => a !== value);
  }
}

export const betting = (state = [], action) => {
  switch (action.type) {
    case LZC_TOGGLE_BETTING:
      return toggle(state, action.value);
    default:
      return state;
  }
};

export const bettings = (state = {}, action) => {
  switch (action.type) {
    case LZC_TOGGLE_BETTING:
      return {
        ...state,
        [action.id]: betting(state[action.id], action)
      };
    case LZC_RESET_BETTING:
      return {};
    default:
      return state;
  }
};

export const bettingTimes = (state = 1, action) => {
  switch (action.type) {
    case LZC_SET_BETTING_TIME:
      return action.times;
    case LZC_RESET_BETTING:
      return 1;
    default:
      return state;
  }
};

export const bettingCourage = (state = [], action) => {
  switch (action.type) {
    case LZC_TOGGLE_COURAGE:
      return toggle(state, action.id);
    case LZC_RESET_BETTING:
      return [];
    default:
      return state;
  }
};
