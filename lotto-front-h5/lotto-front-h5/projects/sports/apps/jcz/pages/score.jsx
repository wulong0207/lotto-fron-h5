import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ScoreContainer from '../containers/score.jsx';
import FootballPageList from '../components/list.jsx';

export const ScoreMatch = props => {
  const { match } = props;
  if (match.status_score === 4) return <div />;
  return (
    <div className="match-score">
      <div className="score-title">
        <div>
          {match.num} {match.m_s_name ? match.m_s_name : match.m_f_name}{' '}
        </div>
        <h3>
          <sub>{match.h_order ? `[${match.h_order.split(',')[0]}]` : ''}</sub>
          {match.h_s_name ? match.h_s_name : match.h_f_name}
          <span>VS</span>
          {match.g_s_name ? match.g_s_name : match.g_f_name}
          <sub>{match.g_order ? `[${match.g_order.split(',')[0]}]` : ''}</sub>
        </h3>
        <div />
        {/* <div><div className="score-icon"></div></div> */}
      </div>
      <div className="jjc-list">
        <div className="match">
          <span>胜</span>
          <span>平</span>
          <span>负</span>
        </div>
        <ScoreContainer
          klass={ ['match-detail', 'score-match-detail', 'two-row-detail'] }
          match={ match }
          id={ match.id }
        />
      </div>
    </div>
  );
};

const Header = props => {
  return (
    <div className="date">
      <span>{props.date + ' ' + props.week}</span>
      <span>{props.num}场比赛可投注</span>
    </div>
  );
};

// 比赛胜平负列表组件
const ScoreListComponent = props => {
  const headerElement = (
    <Header
      date={ props.date }
      week={ props.matchs[0].week }
      num={ props.matchs.filter(i => i.status_score !== 4).length }
    />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return <ScoreMatch key={ m.id } match={ m }
            category="score" />;
        })}
      </section>
    </FootballPageList>
  );
};

ScoreListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default ScoreListComponent;
