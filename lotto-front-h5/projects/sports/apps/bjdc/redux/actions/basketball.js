import http from '@/utils/request';
// import { recoveryBetting } from './betting';

import { BET_CALC } from './bet';
import {
  getCurrentMode,
  getCurrentStore,
  getLotteryChildCode
} from '../../utils/basketball.js';
import { fetchRules } from './rules.js';

export const BASKETBALL_CHANGE_PAGE = 'BASKETBALL_CHANGE_PAGE';
export const BASKETBALL_CHANGE_FILTER = 'BASKETBALL_CHANGE_FILTER';
export const BASKETBALL_TOGGLE_FILTER = 'BASKETBALL_TOGGLE_FILTER';
export const BASKETBALL_FETCH_DATA = 'BASKETBALL_DATA_REQUEST';
export const BASKETBALL_FETCH_DATA_SUCCESS = 'BASKETBALL_FETCH_DATA_SUCCESS';
export const BASKETBALL_FETCH_DATA_FAIL = 'BASKETBALL_FETCH_DATA_FAIL';
export const BASKETBALL_CHANGE_FILTER_TYPE = 'BASKETBALL_CHANGE_FILTER_TYPE';

export const CHANGE_DATA_SOURCE = 'CHANGE_DATA_SOURCE';

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
  let param = {
    playFlag: getLotteryChildCode(getCurrentMode(), true)
  };
  return dispatch => {
    dispatch({ type: BASKETBALL_FETCH_DATA });
    http
      .get('/jc/bj', { params: param })
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

// 更换数据源
export function changeDataSource(page) {
  return dispatch => {
    let store = getCurrentStore();
    let pageData = store.basketball.pageData;

    if (!pageData[page]) {
      dispatch(fetch(page));
    } else {
      dispatch({
        type: CHANGE_DATA_SOURCE,
        page
      });
    }

    dispatch(fetchRules());
  };
}
