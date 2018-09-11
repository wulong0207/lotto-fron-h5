import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/scss/jcl/pages/mix.scss';
import VsInfo from '../components/vs-info.jsx';
import MatchBar from '../components/matchbar.jsx';
import SFC from '../components/sfc.jsx'; // 胜分差
import { getSelected } from '../utils/bet.js';
import { renderGames } from './common/gameHelper.jsx';

import { select, selectSFC, calcBet } from '../redux/actions/bet.js';
import { toggle } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';

class SinglePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  // 胜负, 让分胜负,大小分,通用选择
  onSelectSF(selection, data, betKind) {
    this.props.onSelectSF(selection, data, betKind);
    this.props.calc(this.props.data, this.props.bets);
  }

  // 胜分差选择
  onSelectSFCPage(data, selectMark, add) {
    this.props.onSelectSFCPage(data, selectMark, add);
    this.props.calc(this.props.data, this.props.bets);
  }

  // 生成比赛
  renderGame(game, i) {
    let { toggleSP, bets } = this.props;
    let sfs = getSelected(bets, game, 'single', 'sf');
    let rfsfs = getSelected(bets, game, 'single', 'rfsf');
    let dxfs = getSelected(bets, game, 'single', 'dxf');
    let sfcs = getSelected(bets, game, 'single', 'sfc');

    return (
      <div className="game" key={ i }>
        <VsInfo data={ game } />

        <div className="bet-select">
          <MatchBar
            sellMark={ 1 }
            onCenterClick={ toggleSP }
            onSelect={ this.onSelectSF.bind(this) }
            select={ sfs }
            field="sf"
            data={ game }
            linebox="lineboxb"
          />
          <MatchBar
            sellMark={ 1 }
            onCenterClick={ toggleSP }
            onSelect={ this.onSelectSF.bind(this) }
            select={ rfsfs }
            field="rfsf"
            data={ game }
            linebox="lineboxb"
          />
          <MatchBar
            sellMark={ 1 }
            onCenterClick={ toggleSP }
            onSelect={ this.onSelectSF.bind(this) }
            select={ dxfs }
            field="dxf"
            leftTitle="大分"
            rightTitle="小分"
            data={ game }
            linebox="lineboxb"
          />
          <SFC
            sellMark={ 1 }
            select={ sfcs }
            onSelect={ this.onSelectSFCPage.bind(this) }
            data={ game }
          />
        </div>
      </div>
    );
  }

  render() {
    let { data } = this.props;

    return (
      <div className="yc-mix">
        {renderGames('single', data, this.renderGame.bind(this))}
      </div>
    );
  }
}

SinglePage.propTypes = {};

const mapStateToProps = state => {
  return {
    bets: state.betSelected.bets // 投注选择
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleSP(data, betKind) {
      dispatch(toggle(data, betKind));
    },
    onSelectSF(selection, data, betKind) {
      dispatch(select(selection, data, 'single', betKind));
    },
    onSelectSFCPage(data, selectMark, add) {
      dispatch(selectSFC(data, selectMark, 'single'));
    },
    // 计算奖金
    calc(games, bets) {
      dispatch(calcBet(games, bets));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePage);
