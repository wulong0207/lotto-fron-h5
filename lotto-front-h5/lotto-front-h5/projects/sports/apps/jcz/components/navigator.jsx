import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleFilter } from '../actions/football';
import { browser } from '@/utils/utils';
import interaction from '@/utils/interaction';
import Header from '@/component/header';
import analytics from '@/services/analytics';

class FootballPageNavigator extends PureComponent {
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
      // history.go(-1);
      if (this.props.onBack) return this.props.onBack();
      window.location.href = '/';
    }
  }

  goLive() {
    analytics.send(2111210).then(() => {
      if (browser.yicaiApp) {
        interaction.sendInteraction('toLive');
        this.toggle();
      } else {
        window.location.href = `http://m.13322.com/live/?wap=YC&YCURL=${
          window.location.href
        }`;
      }
    });
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { title, openFilter } = this.props;
    return (
      <Header
        title={ title || '竞彩足球' }
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
                    <img src={ require('@/img/jcz/icon_score@2x.png') } />
                    比分直播
                  </a>
                </li>
                {/* <li>
                  <img src={require('../../../../img/jcz/icon_win@2x.png')}/>
                  开奖详情
                </li>
                <li>
                  <img src={require('../../../../img/jcz/icon_game@2x.png')}/>
                  玩法说明
                </li>
                <li>
                  <img src={require('../../../../img/jcz/icon_money@2x.png')}/>
                  优惠活动
                </li>
                <li>
                  <img src={require('../../../../img/jcz/octopus@2x.png')}/>
                  召唤章鱼帝
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </Header>
    );
  }
}

FootballPageNavigator.propTypes = {
  title: PropTypes.string,
  background: PropTypes.string,
  openFilter: PropTypes.func,
  onBack: PropTypes.func
};

const mapDispatchToProps = dispatch => {
  return {
    toggleFilter() {
      dispatch(toggleFilter());
    }
  };
};

export default connect(null, mapDispatchToProps)(FootballPageNavigator);
