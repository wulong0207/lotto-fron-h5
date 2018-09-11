import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/pages/mix.scss';
import VsInfo from '../components/vs-info.jsx';
import MatchBar from '../components/matchbar.jsx';
import SFC from '../components/sfc.jsx'; // 胜分差
import { getSelected } from '../utils/bet.js';
import { renderGames } from './common/gameHelper.jsx';

import { select, selectSFC } from '../redux/actions/bet.js';
import { toggle } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';

class MixPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  // 胜负, 让分胜负,大小分,通用选择
  onSelectSF(selection, data, betKind) {
    this.props.onSelectSF(selection, data, betKind);
  }

  // 胜分差选择
  onSelectSFCPage(data, selectMark, add) {
    this.props.onSelectSFCPage(data, selectMark, add);
  }

  // 生成比赛
  renderGame(game, i) {
    let { toggleSP, bets } = this.props;
    let sfs = getSelected(bets, game, 'mix', 'sf');
    let rfsfs = getSelected(bets, game, 'mix', 'rfsf');
    let dxfs = getSelected(bets, game, 'mix', 'dxf');
    let sfcs = getSelected(bets, game, 'mix', 'sfc');

    return (
      <div className="game" key={ i }>
        <VsInfo data={ game } />

        <div className="bet-select">
          <MatchBar
            sellMark={ 2 }
            onCenterClick={ toggleSP }
            onSelect={ this.onSelectSF.bind(this) }
            select={ sfs }
            field="sf"
            data={ game }
            linebox="lineboxb"
          />
          <MatchBar
            sellMark={ 2 }
            onCenterClick={ toggleSP }
            onSelect={ this.onSelectSF.bind(this) }
            select={ rfsfs }
            field="rfsf"
            data={ game }
            linebox="lineboxb"
          />
          <MatchBar
            sellMark={ 2 }
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
            sellMark={ 2 }
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
        {renderGames('mix', data, this.renderGame.bind(this))}
      </div>
    );
  }
}

MixPage.propTypes = {
  data: PropTypes.array,
  onSelectSF: PropTypes.func,
  onSelectSFCPage: PropTypes.func,
  toggleSP: PropTypes.func,
  bets: PropTypes.object
};

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
      dispatch(select(selection, data, 'mix', betKind));
    },
    onSelectSFCPage(data, selectMark, add) {
      dispatch(selectSFC(data, selectMark, 'mix'));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MixPage);
