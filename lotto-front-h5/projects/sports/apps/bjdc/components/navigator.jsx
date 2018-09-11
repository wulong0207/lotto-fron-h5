import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleFilter } from '../redux/actions/basketball';
import { browser } from '@/utils/utils';
import interaction from '@/utils/interaction';
import Header from '@/component/header';
import Navigator from '@/utils/navigator.js';

class BasketballPageNavigator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  goBack() {
    if (browser.yicaiApp) {
      interaction.sendInteraction('toLastVC');
    } else {
      Navigator.goHome();
    }
  }

  goLive() {
    if (browser.yicaiApp) {
      interaction.sendInteraction('toLive');
      this.toggle();
    } else {
      window.location.href = `http://m.13322.com/live/?wap=YC&YCURL=${
        window.location.href
      }`;
    }
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { title, openFilter } = this.props;
    return (
      <Header
        title={ title || '北京单场' }
        bg="green"
        back={ this.goBack.bind(this) }
      >
        <div className="operation">
          {openFilter ? (
            <div className="filt" onClick={ this.props.openFilter.bind(this) } />
          ) : (
            ''
          )}
          <div>
            <i className="opermore" onClick={ this.toggle.bind(this) } />
            <div
              className="oper-menu"
              style={ { display: this.state.open ? '' : 'none' } }
            >
              <span className="arrows" />
              <ul>
                <li>
                  <a onClick={ this.goLive.bind(this) }>
                    <img src={ require('../img/icon_score@2x.png') } />
                    比分直播
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Header>
    );
  }
}

BasketballPageNavigator.propTypes = {
  title: PropTypes.string,
  background: PropTypes.string,
  openFilter: PropTypes.func
};

const mapDispatchToProps = dispatch => {
  return {
    toggleFilter() {
      dispatch(toggleFilter());
    }
  };
};

export default connect(null, mapDispatchToProps)(BasketballPageNavigator);
