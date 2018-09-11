import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import './css/football.scss';

import {
  getDefaultDisplayMatch,
  getSmallestSpBetting,
  generateOrderData,
  calculateBetNumAndMaxProfit,
  getCurrentBettings
} from '../../util/football';
import cx from 'classnames';

function FbMatch({ match, selected, toggleBetting }) {
  return (
    <div className="bottom">
      <div
        className={ cx({ selected: selected.indexOf(3) > -1 }) }
        onClick={ () => toggleBetting(match.id, 3) }
      >
        <span>
          {match.homeShortName ? match.homeShortName : match.homeName}
        </span>
        <span>胜 {match.newestSpWin}</span>
      </div>
      <div
        className={ cx({ selected: selected.indexOf(1) > -1 }) }
        onClick={ () => toggleBetting(match.id, 1) }
      >
        <span>平局</span>
        <span>{match.newestSpDraw}</span>
      </div>
      <div
        className={ cx({ selected: selected.indexOf(0) > -1 }) }
        onClick={ () => toggleBetting(match.id, 0) }
      >
        <span>
          {match.visitiShortName ? match.visitiShortName : match.visitiName}
        </span>
        <span>胜 {match.newestSpFail}</span>
      </div>
    </div>
  );
}

function Match({ match, selected = [], toggleBetting }) {
  const handleMatchChange = id => {
    changeMatch(id, index);
  };

  return (
    <div className="match">
      <FbMatch
        match={ match }
        selected={ selected }
        toggleBetting={ toggleBetting }
      />
    </div>
  );
}

export default class FootballWidget extends PureComponent {
  constructor(props) {
    super(props);
    // if (props.matchs.length < 2) {
    //   throw new Error("至少需要两场比赛");
    // }
    // 默认显示比赛
    const matchs = getDefaultDisplayMatch(props.matchs);

    // 默认选中的投注
    const bettings = matchs.reduce((acc, m) => {
      const matchs = props.matchs.filter(i => i.id === m)[0];
      return {
        ...acc,
        [m]: [getSmallestSpBetting(matchs)]
      };
    }, {});

    // const saleEndTime=this.getSaleEndTime(matchs); //获取选中的两场截至时间 最小的
    this.state = {
      matchs,
      bettings,
      times: 1

      // show:false //显示menu
    };
  }

  componentDidMount() {
    this.changeHandle(this.state.matchs, this.state.bettings, this.state.times);
  }

  // 针对select 做的修改

  //   getSaleEndTime(matchs){
  //     const allMatchs = this.props.matchs;
  //     const selectedMatchs = matchs.map(m => allMatchs.filter(i => i.id === m)[0]);
  //     return selectedMatchs.map(m => new Date(setDate.convertTime(m.saleEndTime)).getTime()).sort((a, b) => a - b)[0];
  //   }

  // 更换比赛
  //   changeMatch(id, index) {

  //     let matchs = this.state.matchs.concat();
  //     let newBettings = { ...this.state.bettings };
  //     matchs[index] = id;
  //     this.setState({ matchs });
  //     const bet = this.state.bettings[id];
  //     // if (!bet) {
  //     //   newBettings = { ...this.state.bettings, [id]: [getSmallestSpBetting(matchs)] };
  //     //   this.setState({ bettings: newBettings });
  //     // }

  //     if(!bet) {
  //       newBettings = matchs.reduce((acc, m) => {
  //       const matchs = this.props.matchs.filter(i => i.id === m)[0];
  //         return {
  //           ...acc,
  //           [m]: [getSmallestSpBetting(matchs)]
  //         };
  //       }, {});
  //       this.setState({ bettings: newBettings });
  //     }

  //     this.changeHandle(matchs, newBettings, this.state.times);
  //   }

  // 投注选择
  toggleBetting(id, value) {
    const bettings = Object.assign({}, this.state.bettings);
    const bet = bettings[id];
    let newBettings;
    if (!bet) {
      newBettings = { ...bettings, [id]: [value] };
    } else {
      if (bet.indexOf(value) < 0) {
        newBettings = { ...bettings, [id]: bet.concat(value) };
      } else {
        newBettings = { ...bettings, [id]: bet.filter(i => i !== value) };
      }
    }
    this.setState({ bettings: newBettings });
    this.changeHandle(this.state.matchs, newBettings, this.state.times);
  }

  // 更改投注倍数
  changeTimes(times) {
    if (!/^\d+$/.test(times)) {
      throw new Error('times must be int');
    }
    const newTimes = parseInt(times);
    if (newTimes === this.state.times) return undefined;
    this.setState({ times: newTimes });
    this.changeHandle(this.state.matchs, this.state.bettings, newTimes);
  }

  // 换取投注注数和最大中奖金额
  getBetNumAndMaxProfit(matchs, bettings, times) {
    const allMatchs = this.props.matchs;
    const currentBettings = getCurrentBettings(bettings, matchs, allMatchs);
    return calculateBetNumAndMaxProfit(currentBettings, times);
  }

  // 获取订单数据
  getOrderData() {
    const { matchs, bettings, times } = this.state;
    const allMatchs = this.props.matchs;
    const currentBettings = getCurrentBettings(bettings, matchs, allMatchs);
    const { betNum } = calculateBetNumAndMaxProfit(currentBettings, times);
    const fullMatchs = matchs.map(m => allMatchs.filter(i => i.id === m)[0]);
    return generateOrderData(currentBettings, fullMatchs, times, betNum);
  }

  changeHandle(matchs, bettings, times) {
    if (!this.props.onMatchChange) return undefined;
    const { betNum, max } = this.getBetNumAndMaxProfit(matchs, bettings, times);
    // const lastEndSaleTime = this.getSaleEndTime(matchs);
    this.props.onMatchChange(betNum, max);
  }

  render() {
    const matchs = this.props.matchs;
    return (
      <div>
        <div className="matchs">
          {this.state.matchs.map((match, idx) => {
            return (
              <Match
                key={ match }
                match={ matchs.filter(m => m.id === match)[0] }
                selected={
                  this.state.bettings[match] ? this.state.bettings[match] : []
                }
                index={ idx }
                toggleBetting={ this.toggleBetting.bind(this) }
              />
            );
          })}
        </div>
        {/* <button onClick={ this.getOrderData.bind(this) }>立即投注</button> */}
      </div>
    );
  }
}

FootballWidget.propTypes = {
  matchs: PropTypes.array.isRequired,
  onMatchChange: PropTypes.func.isRequired
};
