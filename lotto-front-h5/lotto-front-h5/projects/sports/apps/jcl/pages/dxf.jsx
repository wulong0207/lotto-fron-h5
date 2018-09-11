import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/pages/mix.scss';
import Match from '../components/match.jsx'; // 胜负
import { getSelected } from '../utils/bet.js';
import { renderGames } from './common/gameHelper.jsx';

import { select } from '../redux/actions/bet.js';
import { toggle } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';

// 大小分
class DXFPage extends Component {
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

  // 生成比赛
  renderGame(game, i) {
    let { toggleSP, onSelectSF, bets } = this.props;
    let selections = getSelected(bets, game, 'dxf');

    return (
      <div className="game" key={ i }>
        <div className="">
          <Match
            sellMark={ 2 }
            field="dxf"
            select={ selections }
            onSelect={ this.onSelectSF.bind(this) }
            onCenterClick={ toggleSP }
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
        {renderGames('dxf', data, this.renderGame.bind(this))}
      </div>
    );
  }
}

DXFPage.propTypes = {
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
    onSelectSF(selection, data, mainBetKind) {
      dispatch(select(selection, data, 'dxf'));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DXFPage);
