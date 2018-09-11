/*
  封装 react redux connect 方法
  统一从 redux 的 store 里获取投注数据
*/

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { submitOrder as submit } from '../actions/betting';
import { getSelectedMatchs } from '../utils';

const pageSelector = state => state.football.page;
const modeSelector = state => state.footballMix.mode;
const bettingsSelector = state => state.footballBettings;
const matchDataSelector = state => state.football.data;

// 获取投注数据
const getBettingSelector = createSelector(
  [pageSelector, modeSelector, bettingsSelector],
  (page, mode, bettings) => {
    let name = page;
    if (page === 'mix' && mode !== 'mi') {
      name = mode;
    }
    const betting = bettings.filter(b => b.name === name)[0];
    return betting || {};
  }
);

// 获取已选对阵的信息
const getSelectedDataSelector = createSelector(
  [getBettingSelector],
  betting => (betting.selected ? betting.selected : [])
);

// 获取已选对阵的比赛数据
const getSelectedMatchsSelector = createSelector(
  [getSelectedDataSelector, matchDataSelector],
  (selected, data) => {
    const matchs = getSelectedMatchs(selected);
    return matchs.reduce((acc, m) => {
      return acc.concat(data.filter(d => d.id === m));
    }, []);
  }
);

// 获取已选比赛中最近结束销售的时间
const latestEndSaleMatchSelector = createSelector(
  [getSelectedMatchsSelector],
  selectedMatchs => {
    return selectedMatchs
      .map(m =>
        new Date(
          m.saleEndDate.replace(/-/g, '/') + ' ' + m.saleEndTime
        ).getTime()
      )
      .sort((a, b) => {
        return a - b;
      })[0];
  }
);

export default (mapStateToProps, mapDispatchToProps, Component) => {
  const mapStateToPropsWrapper = state => {
    return {
      ...mapStateToProps(state),
      betting: getBettingSelector(state),
      latestEndSaleDate: latestEndSaleMatchSelector(state)
    };
  };
  const mapDispatchToPropsWrapper = (dispatch, ownProps) => {
    let dispatchs = {
      submitOrder(betting, combinations, times) {
        dispatch(
          submit(betting, ownProps.latestEndSaleDate, combinations, times, true)
        );
      }
    };
    if (typeof mapDispatchToProps !== 'function') {
      return dispatchs;
    }
    return {
      ...mapDispatchToProps(dispatch, ownProps),
      ...dispatchs
    };
  };
  return connect(mapStateToPropsWrapper, mapDispatchToPropsWrapper)(Component);
};
