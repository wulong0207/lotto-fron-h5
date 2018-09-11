export const LZC_TOGGLE_BETTING = 'LZC_TOGGLE_BETTING';
export const LZC_SET_BETTING_TIME = 'LZC_SET_BETTING_TIME';
export const LZC_RESET_BETTING = 'LZC_RESET_BETTING';
export const LZC_TOGGLE_COURAGE = 'LZC_TOGGLE_COURAGE';

export function bettingToggle(id, value) {
  return (dispatch, getState) => {
    const state = getState();
    const bettings = state.bettings;
    const courage = state.bettingCourage;
    const bet = bettings[id];
    // 用户取消了已经设胆赛事的所有投注时，取消设胆
    if (
      bet &&
      bet.length === 1 &&
      bet[0] === value &&
      courage.indexOf(id) > -1
    ) {
      dispatch(courageToggle(id));
    }
    dispatch({
      id,
      value,
      type: LZC_TOGGLE_BETTING
    });
  };
}

export function setBettingTimes(times) {
  return {
    times,
    type: LZC_SET_BETTING_TIME
  };
}

export function bettingReset() {
  return {
    type: LZC_RESET_BETTING
  };
}

export function courageToggle(id) {
  return {
    id,
    type: LZC_TOGGLE_COURAGE
  };
}
