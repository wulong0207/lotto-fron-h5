import http from '@/utils/request';
import { LOTTERY_CODE } from '../constants';

export const FOOTBALL_FETCH_RULES = 'FOOTBALL_FETCH_RULES';
export const FOOTBALL_FETCH_RULES_SUCCESS = 'FOOTBALL_FETCH_RULES_SUCCESS';
export const FOOTBALL_FETCH_RULE_FAIL = 'FOOTBALL_FETCH_RULE_FAIL';

export function fetchRules() {
  return dispatch => {
    dispatch({ type: FOOTBALL_FETCH_RULES });
    // const res = require('./football.json');
    // const data = res.data;
    // return dispatch({
    //   type: FOOTBALL_FETCH_RULES_SUCCESS,
    //   data
    // });
    http
      .get('/lottery/betRule/' + LOTTERY_CODE)
      .then(res => {
        const data = res.data;
        return dispatch({
          type: FOOTBALL_FETCH_RULES_SUCCESS,
          data
        });
      })
      .catch(error => {
        dispatch({ type: FOOTBALL_FETCH_RULE_FAIL });
        console.log(error);
      });
  };
}
