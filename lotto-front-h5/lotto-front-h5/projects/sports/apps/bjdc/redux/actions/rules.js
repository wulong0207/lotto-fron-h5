import http from '@/utils/request';

import {
  getLotteryCode,
  getCurrentMode,
  getCurrentStore
} from '../../utils/basketball.js';

export const BASKETBALL_FETCH_RULES = 'BASKETBALL_FETCH_RULES';
export const BASKETBALL_FETCH_RULES_SUCCESS = 'BASKETBALL_FETCH_RULES_SUCCESS';
export const BASKETBALL_FETCH_RULE_FAIL = 'BASKETBALL_FETCH_RULE_FAIL';

export function fetchRules() {
  return dispatch => {
    dispatch({ type: BASKETBALL_FETCH_RULES });
    // const res = require('./basketball.json');
    // const data = res.data;
    // return dispatch({
    //   type: BASKETBALL_FETCH_RULES_SUCCESS,
    //   data
    // });

    let store = getCurrentStore();
    let mode = getCurrentMode();
    let currentPage = getLotteryCode(getCurrentMode());
    let cdata = store.basketballRules.pageData[currentPage];
    if (cdata) {
      return dispatch({
        type: BASKETBALL_FETCH_RULES_SUCCESS,
        data: cdata
      });
    }

    http
      .get('/lottery/betRule/' + getLotteryCode(getCurrentMode()))
      .then(res => {
        const data = res.data;
        return dispatch({
          type: BASKETBALL_FETCH_RULES_SUCCESS,
          data
        });
      })
      .catch(error => {
        dispatch({ type: BASKETBALL_FETCH_RULE_FAIL });
      });
  };
}
