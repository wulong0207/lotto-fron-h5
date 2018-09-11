//import { toggleBetting } from './betting';

export const BASKETBALL_MIX_TOGGLE_MATCH_DETAIL = 'BASKETBALL_MIX_TOGGLE_MATCH_DETAIL';
export const BASKETBALL_MIX_TOGGLE_MODE = 'BASKETBALL_MIX_TOGGLE_MODE';
export const BASKETBALL_MIX_CHANGE_MODE = 'BASKETBALL_MIX_CHANGE_MODE';
export const BASKETBALL_MIX_SINGLE_BETTING_TOGGLE = 'BASKETBALL_MIX_SINGLE_BETTING_TOGGLE';
export const BASKETBALL_MIX_SINGLE_BETTING_CLEAR = 'BASKETBALL_MIX_SINGLE_BETTING_CLEAR';
export const BASKETBALL_MIX_SINGLE_BETTING_SUBMIT = 'BASKETBALL_MIX_SINGLE_BETTING_SUBMIT';


export function toggleMatchDetail(matchId) {
  return {
    type: BASKETBALL_MIX_TOGGLE_MATCH_DETAIL,
    matchId
  }
}

export function toggleMode() {
  return {
    type: BASKETBALL_MIX_TOGGLE_MODE
  }
}

export function changeMode(mode) {
  return {
    type: BASKETBALL_MIX_CHANGE_MODE,
    mode
  }
}

export function singleBettingToggle(data) {
  return (dispatch, getState) => {
    const selected = getState().basketballBettings.filter(b => b.name === 'mix')[0].selected;
    if(selected.filter(s => s._id === data._id).length) {
      //return dispatch(toggleBetting(data));
    }
    return dispatch({
      type: BASKETBALL_MIX_SINGLE_BETTING_TOGGLE,
      data
    });
  }
}

export function singleBettingClear(id) {
  return {
    type: BASKETBALL_MIX_SINGLE_BETTING_CLEAR,
    id
  }
}

export function singleBettingSubmit(data) {
  return {
    type: 'BASKETBALL_MIX_SINGLE_BETTING_SUBMIT',
    data
  }
}
