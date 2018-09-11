import { toggleBetting } from './betting';

export const FOOTBALL_MIX_TOGGLE_MATCH_DETAIL =
  'FOOTBALL_MIX_TOGGLE_MATCH_DETAIL';
export const FOOTBALL_MIX_TOGGLE_MODE = 'FOOTBALL_MIX_TOGGLE_MODE';
export const FOOTBALL_MIX_CHANGE_MODE = 'FOOTBALL_MIX_CHANGE_MODE';
export const FOOTBALL_MIX_SINGLE_BETTING_TOGGLE =
  'FOOTBALL_MIX_SINGLE_BETTING_TOGGLE';
export const FOOTBALL_MIX_SINGLE_BETTING_CLEAR =
  'FOOTBALL_MIX_SINGLE_BETTING_CLEAR';
export const FOOTBALL_MIX_SINGLE_BETTING_SUBMIT =
  'FOOTBALL_MIX_SINGLE_BETTING_SUBMIT';

export function toggleMatchDetail(matchId) {
  return {
    type: FOOTBALL_MIX_TOGGLE_MATCH_DETAIL,
    matchId
  };
}

export function toggleMode() {
  return {
    type: FOOTBALL_MIX_TOGGLE_MODE
  };
}

export function changeMode(mode) {
  return {
    type: FOOTBALL_MIX_CHANGE_MODE,
    mode
  };
}

export function singleBettingToggle(data) {
  return (dispatch, getState) => {
    const selected = getState().footballBettings.filter(
      b => b.name === 'mix'
    )[0].selected;
    if (selected.filter(s => s._id === data._id).length) {
      return dispatch(toggleBetting(data));
    }
    return dispatch({
      type: FOOTBALL_MIX_SINGLE_BETTING_TOGGLE,
      data
    });
  };
}

export function singleBettingClear(id) {
  return {
    type: FOOTBALL_MIX_SINGLE_BETTING_CLEAR,
    id
  };
}

export function singleBettingSubmit(data) {
  return {
    type: 'FOOTBALL_MIX_SINGLE_BETTING_SUBMIT',
    data
  };
}
