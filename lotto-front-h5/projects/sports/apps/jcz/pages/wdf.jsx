import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from '../components/list.jsx';
import WDFContainer from '../containers/wdf.jsx';

export const WDFMatch = props => {
  const { match } = props;
  if (match.status_wdf === 4) return <div />;
  return (
    <div className="jjc-list">
      <div className="match">
        <h4>{match.m_s_name ? match.m_s_name : match.m_f_name}</h4>
        <p>{match.num}</p>
        <p>
          <span>{match.saleEndTime}截止</span>
          {/* <span className="alter-ico"></span> */}
        </p>
        {match.status_wdf === 1 ? <span className="single-icon" /> : ''}
      </div>
      <div className="match-detail">
        <WDFContainer match={ match } id={ match.id } />
      </div>
    </div>
  );
};

const Header = props => {
  return (
    <div className="date">
      <span>{props.week + ' ' + props.date}</span>
      <span>胜</span>
      <span>平</span>
      <span>负</span>
    </div>
  );
};

// 比赛胜平负列表组件
const WDFListComponent = props => {
  const headerElement = (
    <Header date={ props.date } week={ props.matchs[0].week } />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return <WDFMatch category="wdf" key={ m.id }
            match={ m } />;
        })}
      </section>
    </FootballPageList>
  );
};

WDFListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default WDFListComponent;
