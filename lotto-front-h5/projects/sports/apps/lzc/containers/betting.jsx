import React, { PureComponent } from 'react';
import BettingComponent from '../components/betting.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { filterEmptybettings, composeLength } from '../utils/utils';
import Combinatorics from 'js-combinatorics';
import { bettingReset, setBettingTimes } from '../actions/betting';
import Orders from '@/component/orders.jsx';
import { generateOrderData } from '../utils/order';
import alert from '@/services/alert';

class Betting extends PureComponent {
  newOrder() {
    const {
      bettings,
      matchIds,
      courage,
      betNum,
      lotteryCode,
      currentIssue,
      times
    } = this.props;
    if (currentIssue.saleStatus !== 2 && currentIssue.saleStatus !== 3) {
      return alert.alert('当前彩期不在销售中');
    }
    const selectedLen = Object.keys(bettings).length;
    if (!selectedLen) return alert.alert('请选择投注');
    if (
      (lotteryCode === 304 && selectedLen < 14) ||
      (lotteryCode === 305 && selectedLen < 9)
    ) {
      const message = `你已选了 ${selectedLen} 场比赛, 还需选 ${
        lotteryCode === 304 ? 14 - selectedLen : 9 - selectedLen
      } 场比赛`;
      return alert.alert(message);
    }
    // let combinations;
    // if (lotteryCode === 305 && selectedLen > 9) {
    //   combinations = compose(bettings, courage, 9);
    // }
    const data = generateOrderData(
      bettings,
      courage,
      times,
      betNum,
      lotteryCode,
      currentIssue.issueCode,
      matchIds,
      null
    );
    this.order.newOrder(data);
  }

  render() {
    return (
      <div>
        <BettingComponent { ...this.props } newOrder={ this.newOrder.bind(this) } />
        <Orders
          ref={ order => (this.order = order) }
          lotteryCode={ this.props.lotteryCode }
          endSaleTime={
            this.props.currentIssue
              ? new Date(this.props.currentIssue.saleEndTimeStamp)
              : new Date()
          }
        />
      </div>
    );
  }
}

Betting.propTypes = {
  lotteryCode: PropTypes.number.isRequired
};

const serverTimeSelector = state => state.football.serverTime;
const localTimeSelector = state => state.football.localTime;
const currentIssueSelector = (state, props) =>
  state.currentIssue[props.lotteryCode];
const bettingsSelector = state => filterEmptybettings(state.bettings);
const combinationsSelector = (state, props) => {
  const bettings = bettingsSelector(state);
  const lotteryCode = props.lotteryCode;
  if (
    (lotteryCode === 304 && Object.keys(bettings).length < 14) ||
    (lotteryCode === 305 && Object.keys(bettings).length < 9)
  ) {
    return 0;
  }
  let combs = [];
  for (let b in bettings) {
    combs.push(bettings[b]);
  }
  if (lotteryCode === 304) {
    return Combinatorics.cartesianProduct(...combs).length;
  } else {
    if (combs.length === 9) {
      return Combinatorics.cartesianProduct(...combs).length;
    }
    return composeLength(bettings, state.bettingCourage, 9);
  }
};

const leftTimeSelector = createSelector(
  [serverTimeSelector, localTimeSelector, currentIssueSelector],
  (serverTime, localTime, currentIssue) => {
    if (!currentIssue) return 0;
    const timeFromFetchToNow = new Date().getTime() - localTime;
    const nowServerTime = serverTime + timeFromFetchToNow;
    return parseInt((currentIssue.saleEndTimeStamp - nowServerTime) / 1000);
  }
);

const betNumSelector = createSelector(
  [combinationsSelector],
  combinations => combinations
);

const mapStateToProps = (state, props) => {
  return {
    bettings: bettingsSelector(state),
    leftTime: leftTimeSelector(state, props),
    betNum: betNumSelector(state, props),
    times: state.bettingTimes,
    courage: state.bettingCourage,
    matchIds: state.matchIds,
    currentIssue: state.currentIssue[props.lotteryCode]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reset() {
      dispatch(bettingReset());
    },
    setBettingTimes(times) {
      dispatch(setBettingTimes(times));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Betting);
