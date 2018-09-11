import {
  BASKETBALL_CHANGE_PAGE,
  BASKETBALL_CHANGE_FILTER,
  BASKETBALL_TOGGLE_FILTER,
  BASKETBALL_FETCH_DATA,
  BASKETBALL_FETCH_DATA_SUCCESS,
  BASKETBALL_FETCH_DATA_FAIL,
  BASKETBALL_CHANGE_FILTER_TYPE,
  CHANGE_DATA_SOURCE
} from '../actions/basketball';

import { loopBets, getBetID } from '../../utils/bet.js';
import { getParameter } from '@/utils/utils';
import {
  updateField,
  isValidPage,
  getCurrentStore,
  getCurrentMode
} from '../../utils/basketball';

function getPageNameFromUrlParmas() {
  const page = getParameter('page');
  // if (isInMixPage(page)) return 'mix';
  if (isValidPage(page)) return page;
  return 'spf';
}

const defaultState = {
  page: getPageNameFromUrlParmas(),
  filter: {},
  pageData: {},
  filterType: 'id',
  requestStatus: 'pending',
  data: [],
  serverTime: new Date().getTime(),
  requestSuccessTime: new Date().getTime(),
  showFilter: false,
  keyboard: { show: false }
};

// 更改数据源
function changeData(state, data) {
  // 过滤过期的数据
  // safari 不能识别 2017-09-08 的时间格式 需要转换为 2017/09/08
  let betSelected = getCurrentStore('betSelected');
  let idArr = [];
  if (data) {
    data = data.filter(d => {
      idArr.push(getBetID(d));
      return (
        new Date(
          ('20' + d.saleDate + ' ' + d.saleEndTime).replace(/-/g, '/')
        ).getTime() > new Date().getTime()
      );
    });
  }

  loopBets(betSelected.bets, (item, field) => {
    if (idArr.indexOf(field) < 0) {
      delete betSelected.bets[field];
    }
  });

  state.pageData[state.page] = data;

  return Object.assign({}, state, {
    requestStatus: 'success',
    data: data,
    pageData: state.pageData,
    // serverTime: new Date(action.data.serverTime.replace(/-/g, '/')).getTime(),
    serverTime: new Date().getTime(),
    requestSuccessTime: new Date().getTime()
  });
}

export function basketball(state = defaultState, action) {
  switch (action.type) {
    case BASKETBALL_CHANGE_PAGE:
      return Object.assign({}, state, { page: action.page });
    case BASKETBALL_CHANGE_FILTER:
      let mode = getCurrentMode();
      state.filter[mode] = action.filter;
      return updateField(state, 'filter');
    case BASKETBALL_FETCH_DATA:
      return Object.assign({}, state, { requestStatus: 'pending' });
    case BASKETBALL_FETCH_DATA_SUCCESS:
      return changeData(state, action.data);
    case BASKETBALL_FETCH_DATA_FAIL:
      return Object.assign({}, state, { requestStatus: 'fail' });
    case BASKETBALL_TOGGLE_FILTER:
      return Object.assign({}, state, { showFilter: !state.showFilter });
    case BASKETBALL_CHANGE_FILTER_TYPE:
      return Object.assign({}, state, { filterType: action.filterType });

    // 更改数据源
    case CHANGE_DATA_SOURCE: {
      let page = action.page;
      return changeData(state, state.pageData[page]);
    }

    default:
      return state;
  }
}
