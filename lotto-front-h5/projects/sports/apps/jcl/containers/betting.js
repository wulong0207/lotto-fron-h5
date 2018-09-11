/*
  封装 react redux connect 方法
  统一从 redux 的 store 里获取投注数据
*/

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchAddOrder as  submit } from '../redux/actions/order.js';
import { getSelectedMatchs } from '../utils';
import {getSelectedBets, getDefaultGGType} from '../utils/bet.js';

const pageSelector = state => state.basketball.page;
const modeSelector = state => state.basketballMix.mode;
const bettingsSelector = state => state.betSelected;
const matchDataSelector = state => state.basketball.data;

// 获取投注数据
const getBettingSelector = createSelector(
  [pageSelector, modeSelector, bettingsSelector],
  (page, mode, bettings) => {
    let name = page;
    if (page === 'mix' && mode !== 'mi') {
      name = mode;
    }

    let bet = bettings.bets[name];
    let betCalc = bettings.betCalc[name];
    let result = Object.assign({}, betCalc, bet);
    let sb = getSelectedBets();
    result.selected = sb.bets;
    result.courage = sb.dan;
    result.times = betCalc.multiple;
    if(result.ggType.length == 0){
       if(result.isSingle){
          result.ggType = ["1串1"];
          result.ggLabel = "1串1";
       }else{
          let gg = getDefaultGGType(bettings.bets, name);
          result.ggType = gg.ggList;
          result.ggLabel = gg.ggStr;
       }
    }

    //投注最大值
    result.maxInfo = bettings.maxInfo;

    return result ? result : {};
  }
);

// 获取已选对阵的信息
const getSelectedDataSelector = createSelector(
  [getBettingSelector],
  (betting) => betting.selected ? betting.selected : []
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
  (selectedMatchs) => {
    return selectedMatchs.map(m => new Date(m.saleEndDate.replace(/-/g, '/') + ' ' + m.saleEndTime).getTime()).sort((a, b) => {
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
    }
  };
  const mapDispatchToPropsWrapper = (dispatch, ownProps) => {
    let dispatchs = {
      submitOrder(betting, combinations, times) {
        dispatch(submit(betting, ownProps.latestEndSaleDate, combinations, times, true));
      }
    };
    if (typeof mapDispatchToProps !== 'function') {
      return dispatchs;
    }
    return {
      ...mapDispatchToProps(dispatch, ownProps),
      ...dispatchs
    }
  };
  return connect(mapStateToPropsWrapper, mapDispatchToPropsWrapper)(Component);
}
