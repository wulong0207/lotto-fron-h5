import React, { Component } from 'react';
import { Match, Bet, WinningStatus } from '../../../types';
import cx from 'classnames';
import './bets.scss';

function BetResult({ bet }) {
  return (
    <div className={ cx('bet-item', { selected: bet.flag }) }>
      {bet.panKou + bet.planContent + '@' + bet.sp}
    </div>
  );
}

BetResult.propTypes = {
  bet: Bet
};

export default class Bets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBetMes: true
    };
  }

  moreHandle() {
    this.setState({ showBetMes: !this.state.showBetMes });
  }

  render() {
    let { match } = this.props;
    let { showBetMes } = this.state;
    let content = match.betContentBOs || [];
    let bets = content.concat();

    if (bets.length > 6 && showBetMes) {
      bets = bets.splice(0, 6);
    }

    return (
      <div className={ cx('bets_ht', { pb60: content.length > 6 }) }>
        <div className="bet_mes">
          <span className={ cx('mes', { mes_t: bets.length > 3 }) }>
            推荐内容
          </span>
        </div>
        <div className="bet_ht">
          {bets.map((bet, ind) => <BetResult key={ ind } bet={ bet } />)}
        </div>
        {content.length > 6 ? (
          <div className="more" onClick={ this.moreHandle.bind(this) }>
            <div className="txt">
              {showBetMes ? '显示全部内容' : '点击收起'}
            </div>
            <div className={ cx('arrow', { on: !showBetMes }) } />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Bets.propTypes = {
  match: Match.isRequired,
  winningStatus: WinningStatus.isRequired
};
