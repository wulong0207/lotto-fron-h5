import {
  FOOTBALL_CHANGE_PAGE,
  FOOTBALL_CHANGE_FILTER,
  FOOTBALL_TOGGLE_FILTER,
  FOOTBALL_FETCH_DATA,
  FOOTBALL_FETCH_DATA_SUCCESS,
  FOOTBALL_FETCH_DATA_FAIL,
  FOOTBALL_CHANGE_FILTER_TYPE
} from '../actions/football';

import { getParameter } from '@/utils/utils';
import {
  isInMixPage,
  isValidPage,
  getCurrentMode,
  updateField
} from '../utils/football';

function getPageNameFromUrlParmas() {
  const page = getParameter('page');
  if (isInMixPage(page)) return 'mix';
  if (isValidPage(page)) return page;
  return 'mix';
}

const defaultState = {
  page: getPageNameFromUrlParmas(),
  filter: {},
  filterType: 'id',
  requestStatus: 'pending',
  data: [],
  serverTime: new Date().getTime(),
  requestSuccessTime: new Date().getTime(),
  showFilter: false
};

export function football(state = defaultState, action) {
  switch (action.type) {
    case FOOTBALL_CHANGE_PAGE:
      return Object.assign({}, state, { page: action.page });
    case FOOTBALL_CHANGE_FILTER:
      let mode = getCurrentMode();
      state.filter[mode] = action.filter;
      return updateField(state, 'filter');
    case FOOTBALL_FETCH_DATA:
      return Object.assign({}, state, { requestStatus: 'pending' });
    case FOOTBALL_FETCH_DATA_SUCCESS:
      // 过滤过期的数据
      // safari 不能识别 2017-09-08 的时间格式 需要转换为 2017/09/08
      const data = action.data.data.filter(d => {
        return (
          new Date(
            ('20' + d.saleDate + ' ' + d.saleEndTime).replace(/-/g, '/')
          ).getTime() >
          new Date(action.data.serverTime.replace(/-/g, '/')).getTime()
        );
      });
      return Object.assign({}, state, {
        requestStatus: 'success',
        data: data,
        serverTime: new Date(
          action.data.serverTime.replace(/-/g, '/')
        ).getTime(),
        requestSuccessTime: new Date().getTime()
      });
    case FOOTBALL_FETCH_DATA_FAIL:
      return Object.assign({}, state, { requestStatus: 'fail' });
    case FOOTBALL_TOGGLE_FILTER:
      return Object.assign({}, state, { showFilter: !state.showFilter });
    case FOOTBALL_CHANGE_FILTER_TYPE:
      return Object.assign({}, state, { filterType: action.filterType });
    default:
      return state;
  }
}
