import React from 'react';
import HeaderComponent from '../components/header.jsx';
import IssueBarContainer from '../containers/issue-bar.jsx';
import MatchContainer from '../containers/match.jsx';
import { mapPageToLotteryCode } from '../utils/utils';
import BettingContainer from '../containers/betting.jsx';

export default props => {
  const { page } = props.params;
  const lotteryCode = mapPageToLotteryCode(page);
  return (
    <div className="lzc-page">
      <HeaderComponent lotteryCode={ lotteryCode } />
      <IssueBarContainer lotteryCode={ lotteryCode } />
      <MatchContainer lotteryCode={ lotteryCode } />
      <BettingContainer lotteryCode={ lotteryCode } />
    </div>
  );
};
