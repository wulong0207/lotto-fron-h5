import http from '@/utils/request';
import { BET_CALC } from './bet';
// import { recoveryBetting } from './betting';

export const BASKETBALL_CHANGE_PAGE = 'BASKETBALL_CHANGE_PAGE';
export const BASKETBALL_CHANGE_FILTER = 'BASKETBALL_CHANGE_FILTER';
export const BASKETBALL_TOGGLE_FILTER = 'BASKETBALL_TOGGLE_FILTER';
export const BASKETBALL_FETCH_DATA = 'BASKETBALL_DATA_REQUEST';
export const BASKETBALL_FETCH_DATA_SUCCESS = 'BASKETBALL_FETCH_DATA_SUCCESS';
export const BASKETBALL_FETCH_DATA_FAIL = 'BASKETBALL_FETCH_DATA_FAIL';
export const BASKETBALL_CHANGE_FILTER_TYPE = 'BASKETBALL_CHANGE_FILTER_TYPE';

export function changePage(page) {
  return {
    type: BASKETBALL_CHANGE_PAGE,
    page
  };
}

export function changeFilter(filter) {
  return {
    type: BASKETBALL_CHANGE_FILTER,
    filter
  };
}

export function fetch() {
  return dispatch => {
    dispatch({ type: BASKETBALL_FETCH_DATA });
    http
      .get('/jc/basketball', {})
      .then(res => {
        const data = res.data; // test from less data
        dispatch({
          type: BASKETBALL_FETCH_DATA_SUCCESS,
          data
        });
        dispatch({ type: BET_CALC });
        // dispatch(recoveryBetting());
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: BASKETBALL_FETCH_DATA_FAIL });
      });
    // dispatch({
    //   type: BASKETBALL_FETCH_DATA_SUCCESS,
    //   data: require('./football.json').data
    // });
  };
}

export function toggleFilter() {
  return {
    type: BASKETBALL_TOGGLE_FILTER
  };
}

export function changeFilterType(filterType) {
  return {
    type: BASKETBALL_CHANGE_FILTER_TYPE,
    filterType
  };
}
