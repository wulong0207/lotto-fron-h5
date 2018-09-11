import http from '@/utils/request';
import { recoveryBetting } from './betting';

export const FOOTBALL_CHANGE_PAGE = 'FOOTBALL_CHANGE_PAGE';
export const FOOTBALL_CHANGE_FILTER = 'FOOTBALL_CHANGE_FILTER';
export const FOOTBALL_TOGGLE_FILTER = 'FOOTBALL_TOGGLE_FILTER';
export const FOOTBALL_FETCH_DATA = 'FOOTBALL_DATA_REQUEST';
export const FOOTBALL_FETCH_DATA_SUCCESS = 'FOOTBALL_FETCH_DATA_SUCCESS';
export const FOOTBALL_FETCH_DATA_FAIL = 'FOOTBALL_FETCH_DATA_FAIL';
export const FOOTBALL_CHANGE_FILTER_TYPE = 'FOOTBALL_CHANGE_FILTER_TYPE';

export function changePage(page) {
  return {
    type: FOOTBALL_CHANGE_PAGE,
    page
  };
}

export function changeFilter(filter) {
  return {
    type: FOOTBALL_CHANGE_FILTER,
    filter
  };
}

export function fetch(mode = 'mi') {
  return dispatch => {
    dispatch({ type: FOOTBALL_FETCH_DATA });
    http
      .get('/jc/football', { params: { playFlag: mode } })
      .then(res => {
        const data = res.data; // test from less data
        dispatch({
          type: FOOTBALL_FETCH_DATA_SUCCESS,
          data
        });
        dispatch(recoveryBetting());
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: FOOTBALL_FETCH_DATA_FAIL });
      });
    // dispatch({
    //   type: FOOTBALL_FETCH_DATA_SUCCESS,
    //   data: require('./football.json').data
    // });
  };
}

export function toggleFilter() {
  return {
    type: FOOTBALL_TOGGLE_FILTER
  };
}

export function changeFilterType(filterType) {
  return {
    type: FOOTBALL_CHANGE_FILTER_TYPE,
    filterType
  };
}
