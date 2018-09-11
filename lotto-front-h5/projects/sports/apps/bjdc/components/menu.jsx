import React from 'react';
import PropTypes from 'prop-types';
import { PAGES } from '../constants';
import cx from 'classnames';
import { changePage, changeDataSource } from '../redux/actions/basketball';
import { setHistoryState, getCurrentMode } from '../utils/basketball';
import { connect } from 'react-redux';
import '../css/component/menu.scss';

const BasketballPageMenu = props => {
  const pages = PAGES; // 混合过关为单独组件

  return (
    <menu className="header-menu">
      <div className="menu-fix" id="basketball_global_menu">
        {/* <div className={ cx({ 'curr-tab': props.page === 'mix' }) }>
          <FootballPageMode changePage={props.change.bind(this)}/>
        </div> */}
        {pages.map(p => {
          return (
            <div
              onClick={ e => {
                let mode = getCurrentMode();
                props.change(p.name);
                if (mode !== p.name) {
                  props.changeDataSource(p.name);
                }
              } }
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

BasketballPageMenu.propTypes = {
  page: PropTypes.oneOf(PAGES.map(f => f.name)).isRequired,
  change: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    page: state.basketball.page
  };
};

const mapDispatchToProps = dispatch => {
  return {
    change(page) {
      setHistoryState(page);
      return dispatch(changePage(page));
    },
    changeDataSource(page) {
      return dispatch(changeDataSource(page));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasketballPageMenu);
