import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from '../components/list.jsx';
import WDFConcedeContainer from '../containers/wdf-concede.jsx';

export const WDFConcedeMatch = props => {
  const { match } = props;
  if (match.status_letWdf === 4) return <div />;
  return (
    <div className="jjc-list">
      <div className="match">
        <h4>{match.m_s_name ? match.m_s_name : match.m_f_name}</h4>
        <p>{match.num}</p>
        <p>
          <span>{match.saleEndTime}截止</span>
        </p>
      </div>
      {match.status_letWdf === 1 ? <span className="single-icon" /> : ''}
      <div className="match-detail">
        <WDFConcedeContainer match={ props.match } id={ props.match.id } />
      </div>
    </div>
  );
};

const Header = props => {
  return (
    <div className="date">
      <span>{props.date + ' ' + props.week}</span>
      <span>胜</span>
      <span>平</span>
      <span>负</span>
    </div>
  );
};

// 比赛胜平负列表组件
const WDFConcedeListComponent = props => {
  const headerElement = (
    <Header date={ props.date } week={ props.matchs[0].week } />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return <WDFConcedeMatch match={ m } key={ m.id }
            category="let_wdf" />;
        })}
      </section>
    </FootballPageList>
  );
};

WDFConcedeListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default WDFConcedeListComponent;
