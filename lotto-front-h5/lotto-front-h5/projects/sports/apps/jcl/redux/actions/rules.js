import http from '@/utils/request';

export const BASKETBALL_FETCH_RULES = 'BASKETBALL_FETCH_RULES';
export const BASKETBALL_FETCH_RULES_SUCCESS = 'BASKETBALL_FETCH_RULES_SUCCESS';
export const BASKETBALL_FETCH_RULE_FAIL = 'BASKETBALL_FETCH_RULE_FAIL';
import { LOTTERY_CODE } from '../../constants';

export function fetchRules() {
  return dispatch => {
    dispatch({ type: BASKETBALL_FETCH_RULES });
    // const res = require('./basketball.json');
    // const data = res.data;
    // return dispatch({
    //   type: BASKETBALL_FETCH_RULES_SUCCESS,
    //   data
    // });
    http
      .get('/lottery/betRule/' + LOTTERY_CODE)
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
