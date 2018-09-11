import React from 'react';
import { Match, WinningStatus } from '../../types';
import Bets from './bets';
import PropTypes from 'prop-types';
import './matches.scss';
import { DEFAULT_LOTTERY_TEAM_LOGO } from '../../constants/bets';
// import { UPLOAD_RESOURCE_HOST } from '@/constants';

function getTeamLogo(logo, lotteryCode, team) {
  return typeof logo !== 'undefined'
    ? logo
    : DEFAULT_LOTTERY_TEAM_LOGO[lotteryCode][team];
}

export function MatchComponent({ match, lotteryCode, winningStatus, reverse, lotteryChildCode }) {
  let logo = reverse ? match.guestLogo : match.homeLogo;
  let team = reverse ? 'guest' : 'home';
  return (
    <div className="match">
      <div className="match-info">
        <div className="home-team team" style={{border: logo? '':'none'}}>
          <img
            src={ getTeamLogo(
              logo,
              lotteryCode,
              team
            ) }
          />
        </div>
        <div className="match-summary">
          <div className="match-meta">
            <div className="date">
              <span>{match.officalMatchCode}</span>
              <span>{match.matchShortName}</span>
            </div>
            <div className="time">
              <span>{match.date}</span>
              <span>{match.time}</span>
            </div>
          </div>
          {Boolean(match.isDan) && <span className="dan">设胆</span>}
        </div>
        <div className="guest-team team" style={{border: logo? '':'none'}}>
          <img
            src={ getTeamLogo(
              reverse ? match.homeLogo : match.guestLogo,
              lotteryCode,
              reverse ? 'home' : 'guest'
            ) }
            
          />
        </div>
      </div>
      <div className="team-names">
        <div className="home-team team-name">
          {reverse ? match.visitiName : match.homeName}
        </div>
        <div className="match-summary">
          <div className="match-meta">
            <div className="date">
              <span>{match.officalMatchCode}</span>
              <span>{match.matchShortName}</span>
            </div>
            <div className="time">
              <span>{match.date}</span>
              <span>{match.time}</span>
            </div>
          </div>
          {Boolean(match.isDan) && <span className="dan">设胆</span>}
        </div>
        <div className="guest-team team-name">
          {reverse ? match.homeName : match.visitiName}
        </div>
      </div>
      <Bets
        match={ match }
        hasDraw={ lotteryCode !== 301 }
        lotteryCode={ lotteryCode }
        winningStatus={ winningStatus }
        reverse={ reverse }
        lotteryChildCode={ lotteryChildCode }
      />
    </div>
  );
}

MatchComponent.propTypes = {
  match: Match,
  lotteryCode: PropTypes.number.isRequired,
  winningStatus: WinningStatus.isRequired,
  reverse: PropTypes.bool
};

export default function Matches({ matches, lotteryCode, winningStatus, lotteryChildCode }) {
  return (
    <div className="matches">
      {matches.map((match, idx) => (
        <MatchComponent
          match={ match }
          lotteryCode={ lotteryCode }
          key={ idx }
          winningStatus={ winningStatus }
          reverse={ lotteryCode === 301 }
          lotteryChildCode={ lotteryChildCode }
        />
      ))}
    </div>
  );
}

Matches.propTypes = {
  matches: PropTypes.arrayOf(Match),
  lotteryCode: PropTypes.number.isRequired,
  winningStatus: WinningStatus.isRequired
};
