import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { setDate } from '@/utils/utils';
import BetCalc from './bet_calc.jsx';
import '../css/football.scss';
import {
  getDefaultDisplayMatch,
  getSmallestSpBetting,
  generateOrderData,
  calculateBetNumAndMaxProfit,
  getCurrentBettings
} from '../utils/football';
import cx from 'classnames';

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
      showOptions: false
    };
  }

  toggle() {
    this.setState({ showOptions: !this.state.showOptions });
  }

  selectHandle(value) {
    this.toggle();
    if (value === this.state.selected) return undefined;
    this.setState({ selected: value });
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    const { showOptions } = this.state;
    return (
      <div className="select">
        <div className="selector" onClick={ this.toggle.bind(this) }>
          <span>换比赛</span>
          <img
            className="triangle"
            src={ require('../img/triangle.png') }
            alt=""
          />
        </div>
        <div className={ cx('drop-menu', showOptions ? '' : 'hide') }>
          {this.props.options.map(option => {
            return (
              <div
                className="option-list"
                key={ option.value }
                onClick={ this.selectHandle.bind(this, option.value) }
              >
                {option.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

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
        <span>VS</span>
        <span>平 {match.newestSpDraw}</span>
      </div>
      <div
        className={ cx({ selected: selected.indexOf(0) > -1 }) }
        onClick={ () => toggleBetting(match.id, 0) }
      >
        <span>
          {match.visitiShortName ? match.visitiShortName : match.visitiName}
        </span>
        <span>负 {match.newestSpFail}</span>
      </div>
    </div>
  );
}

function Match({
  matchs,
  match,
  selected = [],
  index,
  changeMatch,
  toggleBetting,
  deadline
}) {
  const handleMatchChange = id => {
    changeMatch(id, index);
  };
  const options = matchs.map(m => {
    const homeName = m.homeShortName ? m.homeShortName : m.homeName;
    const visitiName = m.visitiShortName ? m.visitiShortName : m.visitiName;
    return {
      value: m.id,
      label: `${homeName} vs ${visitiName}`
    };
  });

  return (
    <div className="match">
      <div className="top">
        <img
          className={ cx('logoImg', match.visitiLogoUrl ? '' : 'opacity') }
          src={
            match.homeLogoUrl ? match.homeLogoUrl : require('../img/team.png')
          }
        />
        <Select options={ options } onChange={ handleMatchChange } />
        <img
          className={ cx('logoImg', match.visitiLogoUrl ? '' : 'opacity') }
          src={
            match.visitiLogoUrl
              ? match.visitiLogoUrl
              : require('../img/team.png')
          }
        />
      </div>

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

    // 默认显示比赛
    let matchs = getDefaultDisplayMatch(props.matchs);
    // 默认选中的投注
    const bettings = matchs.reduce((acc, m) => {
      const matchs = props.matchs.filter(i => i.id === m)[0];
      return {
        ...acc,
        [m]: [getSmallestSpBetting(matchs)]
      };
    }, {});

    this.state = {
      matchs,
      bettings,
      times: 5,
      showMatchs: false
    };
  }

  componentDidMount() {
    this.changeHandle(this.state.matchs, this.state.bettings, this.state.times);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.matchs !== this.props.matchs) {
      // 默认显示比赛
      let matchs = getDefaultDisplayMatch(nextProps.matchs);

      // 默认选中的投注
      const bettings = matchs.reduce((acc, m) => {
        const matchs = nextProps.matchs.filter(i => i.id === m)[0];
        return {
          ...acc,
          [m]: [getSmallestSpBetting(matchs)]
        };
      }, {});
      this.setState({ matchs, bettings });
    }
  }

  // 针对select 做的修改
  getSaleEndTime(matchs) {
    const allMatchs = this.props.matchs;
    const selectedMatchs = matchs.map(
      m => allMatchs.filter(i => i.id === m)[0]
    );
    return selectedMatchs
      .map(m => new Date(setDate.convertTime(m.saleEndTime)).getTime())
      .sort((a, b) => a - b)[0];
  }

  // 更换比赛
  changeMatch(id, index) {
    let matchs = this.state.matchs.concat();
    let newBettings = { ...this.state.bettings };
    matchs[index] = id;
    this.setState({ matchs });
    const bet = this.state.bettings[id];

    if (!bet) {
      newBettings = matchs.reduce((acc, m) => {
        const matchs = this.props.matchs.filter(i => i.id === m)[0];
        return {
          ...acc,
          [m]: [getSmallestSpBetting(matchs)]
        };
      }, {});
      this.setState({ bettings: newBettings });
    }

    this.changeHandle(matchs, newBettings, this.state.times);
  }

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
    const lastEndSaleTime = this.getSaleEndTime(matchs);
    console.log(lastEndSaleTime);
    this.props.onMatchChange(betNum, max, lastEndSaleTime);
  }

  render() {
    const matchs = this.props.matchs;

    // 默认显示比赛
    // const matchsId = getDefaultDisplayMatch(this.props.matchs);
    // this.state.matchs = matchsId;

    if (matchs && matchs.length >= 2) {
      this.state.showMatchs = true;
    } else {
      this.state.showMatchs = false;
    }

    return (
      <div>
        <div className="matchs">
          {this.props.deadline && (
            <div className="deadline">{this.props.deadline}</div>
          )}
          {this.state.matchs.map((match, idx) => {
            return (
              <Match
                key={ idx }
                match={ matchs.filter(m => m.id === match)[0] }
                matchs={ this.props.matchs.filter(
                  m => this.state.matchs.indexOf(m.id) < 0 || m.id === match
                ) }
                selected={
                  this.state.bettings[match] ? this.state.bettings[match] : []
                }
                index={ idx }
                changeMatch={ this.changeMatch.bind(this) }
                toggleBetting={ this.toggleBetting.bind(this) }
              />
            );
          })}
        </div>
      </div>
    );
  }
}

FootballWidget.propTypes = {
  matchs: PropTypes.array.isRequired,
  onMatchChange: PropTypes.func.isRequired
};
