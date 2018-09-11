import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from '../components/list.jsx';
import GoalContainer from '../containers/goal.jsx';

export const GoalMatch = props => {
  const { match } = props;
  if (match.status_goal === 4) return <div />;
  return (
    <div className="jjc-list">
      <div className="match">
        <h4>
          {match.num} {match.m_s_name ? match.m_s_name : match.m_f_name}{' '}
          {match.saleEndTime}截止
        </h4>
        <p>
          {match.h_s_name ? match.h_s_name : match.h_f_name}
          <sub>{match.h_order ? `[${match.h_order.split(',')[0]}]` : ''}</sub>
        </p>
        <p>
          <span>
            {match.g_s_name ? match.g_s_name : match.g_f_name}
            <sub>{match.g_order ? `[${match.g_order.split(',')[0]}]` : ''}</sub>
          </span>
          {/* <span className="alter-ico"></span> */}
        </p>
      </div>
      {match.status_goal === 4 ? (
        <div>
          <div className="grid-nosell">未开售</div>
        </div>
      ) : (
        <GoalContainer
          match={ props.match }
          id={ props.match.id }
          klass={ ['match-detail', 'goal-match-detail', 'two-row-detail'] }
        />
      )}
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
const GoalListComponent = props => {
  const headerElement = (
    <Header
      date={ props.date }
      week={ props.matchs[0].week }
      num={ props.matchs.filter(i => i.status_goal !== 4).length }
    />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return <GoalMatch key={ m.id } match={ m } />;
        })}
      </section>
    </FootballPageList>
  );
};

GoalListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default GoalListComponent;
