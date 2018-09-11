import React, { PureComponent } from 'react';
import { browser } from '@/utils/utils';
import interaction from '@/utils/interaction';
import Header from '@/component/header';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class HeaderComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  static propTypes = {
    title: PropTypes.string
  };

  goBack() {
    if (browser.yicaiApp) {
      interaction.sendInteraction('toLastVC');
    } else {
      window.history.go(-1);
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
    const { title } = this.props;
    return (
      <div className="global-header">
        <Header
          title={ title || '老足彩' }
          bg="green"
          back={ this.goBack.bind(this) }
        >
          <div className="operation">
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
                </ul>
              </div>
            </div>
          </div>
        </Header>
        {React.createElement(withRouter(Menu), { ...this.props })}
      </div>
    );
  }
}

function Menu({ router, lotteryCode }) {
  return (
    <div className="header-tab">
      <ul>
        <li>
          <button
            className={ lotteryCode === 304 ? 'active' : '' }
            onClick={ () => router.replace('/') }
          >
            胜负彩
          </button>
        </li>
        <li>
          <button
            className={ lotteryCode === 305 ? 'active' : '' }
            onClick={ () => router.replace('/9') }
          >
            任选九场
          </button>
        </li>
      </ul>
    </div>
  );
}

Menu.propTypes = {
  router: PropTypes.object.isRequired,
  lotteryCode: PropTypes.number.isRequired
};

export default HeaderComponent;
