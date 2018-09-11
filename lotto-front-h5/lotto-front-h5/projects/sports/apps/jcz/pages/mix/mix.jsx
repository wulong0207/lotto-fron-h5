import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from '../../components/list.jsx';
import {
  MixWDFContainer,
  MixWDFConcedeContainer
} from '../../containers/mix/mix.jsx';
import { toggleMatchDetail } from '../../actions/mix';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const Match = props => {
  const onView = e => {
    if (typeof props.onViewDetail !== 'function') return undefined;
    props.onViewDetail(props.match.id);
  };
  const { match } = props;
  return (
    <div className="jjc-list">
      <div className="match" onClick={ onView }>
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
          {!props.single ? (
            <span>
              {props.num > 0 ? (
                <span className="more-text">
                  已选 <em>{props.num}</em>&gt;
                </span>
              ) : (
                <span className="more-text">更多&gt;</span>
              )}
            </span>
          ) : (
            ''
          )}
        </p>
        {!props.single &&
        (match.status_wdf === 1 || match.status_letWdf === 1) ? (
            <span className="single-icon" />
          ) : (
            ''
          )}
      </div>
      <div className="match-detail mix-match-detail two-row-detail">
        <MixWDFContainer
          shortened={ true }
          match={ props.match }
          id={ props.match.id }
          category="wdf"
          single={ props.single }
        />
        <MixWDFConcedeContainer
          shortened={ true }
          match={ props.match }
          id={ props.match.id }
          category="let_wdf"
          single={ props.single }
        />
      </div>
    </div>
  );
};

const bettingsSelector = state => state.footballBettings;

const selectedNumber = id =>
  createSelector([bettingsSelector], bettings => {
    const betting = bettings.filter(s => s.name === 'mix')[0];
    return betting.selected.filter(s => s.id === id).length;
  });

const mapStateToProps = (_, initialProps) => state => {
  const { id } = initialProps.match;
  return {
    num: selectedNumber(id)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    view(matchId) {
      dispatch(toggleMatchDetail(matchId));
    }
  };
};

const WDFMatch = connect(mapStateToProps, mapDispatchToProps, null, {
  pure: true
})(Match);

const Header = props => {
  return (
    <div className="date">
      <span>
        {props.week} {props.date}
      </span>
      <span>胜</span>
      <span>平</span>
      <span>负</span>
    </div>
  );
};

// 比赛胜平负列表组件
const WDFMixListComponent = props => {
  const headerElement = (
    <Header date={ props.date } week={ props.matchs[0].week } />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return (
            <WDFMatch
              key={ m.id }
              single={ props.single }
              onViewDetail={ props.onViewDetail }
              match={ m }
            />
          );
        })}
      </section>
    </FootballPageList>
  );
};

WDFMixListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired,
  onViewDetail: PropTypes.func,
  single: PropTypes.bool
};

export default WDFMixListComponent;
