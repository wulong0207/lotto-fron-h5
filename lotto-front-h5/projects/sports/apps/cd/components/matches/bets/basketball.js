import React from 'react';
import { Match, Bet, Sp, WinningStatus } from '../../../types';
import cx from 'classnames';
import { parseMatchContent } from '../../../helpers/match';
import './bets.scss';

function BetResult({ bet, sp, winningStatus }) {
  const isBet = function(bet, value) {
    return bet.value.indexOf(value) > -1;
  };
  return (
    <div className="bet">
      <div
        className={ cx('bet-item', {
          selected: isBet(bet, 0),
          result: isBetResult(sp, 0, bet.type, winningStatus)
        }) }
      >
        <i>客胜</i>
        {bet.type === 'r' ? sp.let_sp_f : sp.sp_f}
      </div>
      <div className="bet-score" />
      <div
        className={ cx('bet-item', {
          selected: isBet(bet, 3),
          result: isBetResult(sp, 3, bet.type, winningStatus)
        }) }
      >
        <i>主胜</i>
        {bet.type === 'r' ? sp.let_sp_s : sp.sp_s}
        {bet.type === 'r' && <span className="let-number">{bet.let}</span>}
      </div>
    </div>
  );
}

BetResult.propTypes = {
  bet: Bet,
  sp: Sp,
  winningStatus: WinningStatus.isRequired
};

export default function Bets({ match, winningStatus }) {
  const bets = parseMatchContent(match.betGameContent);
  return (
    <div className="bets">
      {bets.map(bet => (
        <BetResult
          key={ bet.type }
          bet={ bet }
          sp={ match.orderMatchLQBO }
          winningStatus={ winningStatus }
        />
      ))}
    </div>
  );
}

Bets.propTypes = {
  match: Match,
  winningStatus: WinningStatus.isRequired
};

function isBetResult(sp, value, type, winningStatus) {
  if (winningStatus === 1) return false;
  const result = type === 'r' ? sp['letSpf'] : sp['fullSpf'];
  if (!result) return false;
  return parseInt(result) === value;
}
