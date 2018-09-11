/**
 * Created by YLD on 21/9/21.
 */

import React from 'react';
import PropTypes from 'prop-types';
import '../css/pages/mix.scss';
import QCBF from '../components/qcbf.jsx'; // 胜负
import { getSelected } from '../utils/bet.js';
import { renderGames } from './common/gameHelper.jsx';

import { selectSFC, calc } from '../redux/actions/bet.js';
import { toggle } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';
import LazyPage from './common/lazy-page.jsx';

const lotteryMark = 'qcbf';

// 上下单双
class QCBFPage extends LazyPage {
  componentWillReceiveProps(nextProps) {}

  // 胜负, 让分胜负,大小分,通用选择
  onSelectSF(selection, data, betKind) {
    this.props.onSelectSF(selection, data, betKind);
    this.props.calc();
  }

  // 生成比赛
  renderGame(game, i) {
    let { toggleSP, bets } = this.props;
    let selection = getSelected(bets, game, lotteryMark);

    return (
      <div className="game" key={ i }>
        <div className="">
          <QCBF
            sellMark={ 2 }
            field={ lotteryMark }
            select={ selection }
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
      <div className="yc-mix no-bottom">
        {this.lazyRender(
          renderGames(lotteryMark, data, this.renderGame.bind(this))
        )}
      </div>
    );
  }
}

QCBFPage.propTypes = {};

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
      dispatch(selectSFC(selection, data, lotteryMark));
    },
    calc() {
      dispatch(calc());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QCBFPage);
