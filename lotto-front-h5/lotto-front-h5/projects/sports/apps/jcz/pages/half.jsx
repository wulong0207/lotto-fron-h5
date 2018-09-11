import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from '../components/list.jsx';
import HalfContainer from '../containers/half.jsx';

export const HalfMatch = props => {
  const { match } = props;
  if (match.status_hfWdf === 4) return <div />;
  return (
    <div className="jjc-list">
      <div className="match">
        <h4>{match.num}</h4>
        <h4>{match.m_s_name ? match.m_s_name : match.m_f_name}</h4>
        <h4>{match.saleEndTime}截止</h4>
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
      <HalfContainer
        klass={ ['match-detail', 'half-match-detail', 'two-row-detail'] }
        match={ props.match }
        id={ props.match.id }
      />
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

const HalfListComponent = props => {
  const headerElement = (
    <Header
      date={ props.date }
      week={ props.matchs[0].week }
      num={ props.matchs.filter(i => i.status_hfWdf !== 4).length }
    />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return <HalfMatch key={ m.id } match={ m }
            category="hf" />;
        })}
      </section>
    </FootballPageList>
  );
};

HalfListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default HalfListComponent;
