import React from 'react';
import PropTypes from 'prop-types';
import { PAGES } from '../constants';
import FootballPageMode from './mode';
import cx from 'classnames';
import { changePage } from '../actions/football';
import { setHistoryState } from '../utils/football';
import { connect } from 'react-redux';
import analytics from '@/services/analytics';

const FootballPageMenu = props => {
  const pages = PAGES.slice(1); // 混合过关为单独组件
  return (
    <menu className="header-menu">
      <div className="menu-fix" id="football_global_menu">
        <div className={ cx({ 'curr-tab': props.page === 'mix' }) }>
          <FootballPageMode changePage={ props.change.bind(this) } />
        </div>
        {pages.map(p => {
          return (
            <div
              onClick={ e => props.change(p) }
              className={ cx({ 'curr-tab': props.page === p.name }) }
              key={ p.name }
            >
              {p.label}
            </div>
          );
        })}
      </div>
    </menu>
  );
};

FootballPageMenu.propTypes = {
  page: PropTypes.oneOf(PAGES.map(f => f.name)).isRequired,
  change: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    page: state.football.page
  };
};

const mapDispatchToProps = dispatch => {
  return {
    change(page) {
      if (page.analyticsId) {
        analytics.send(page.analyticsId);
      }
      setHistoryState(page.name);
      return dispatch(changePage(page.name));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FootballPageMenu);
