import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatMatchData } from '../utils';
import { isSaleout, getNextOpenDateTime } from '../utils/football';
import FootballMixPage from './mix/index.jsx'; // 混合过关
import Alternative from './2to1.jsx'; // 二选一
import Single from './single.jsx'; // 单关
import SingleWin from './single-win.jsx'; // 单场致胜
import FootballPageNavigator from '../components/navigator.jsx';
import FootballPageMenu from '../components/menu.jsx';
import FootballFilterComponent, { filterData } from '../components/filter.jsx';
import FootballBettingComponent from '../components/betting.jsx';
import { fetch, toggleFilter } from '../actions/football';
import { fetchRules } from '../actions/rules';
import { connect } from 'react-redux';
import OrderComponent from '../components/order.jsx';
import { createSelector } from 'reselect';
import alert from '@/services/alert';
import { isEmpty } from 'lodash';
import CountDownComponent from '../components/countdown.jsx';
import analytics from '@/services/analytics';

class FootballPageContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetch();
    this.props.fetchRules();
    analytics.send(211);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.rulesRequestStatus === 'pendding' &&
      nextProps.rulesRequestStatus === 'success'
    ) {
      if (isSaleout(nextProps.rules)) {
        const content = (
          <div className="saleout-content">
            <h4>该彩种暂停销售</h4>
            <p>由此给你带来的不便，我们深感抱歉，望你谅解</p>
            <p>
              你可访问：<a href="/">首页</a>
              <a href="/ssq.html">双色球</a>
              <a href="/11xuan5.html">11选5</a>
            </p>
          </div>
        );
        alert.alert(content);
      }
    }
  }

  openFilter() {
    // this.filter.getWrappedInstance().open();
    this.props.toggleFilter();
  }

  renderPage() {
    const { page, data } = this.props;
    const formatedData = formatMatchData(data);
    if (page === 'mix') {
      return (
        <div className="mix-page">
          <FootballMixPage data={ formatedData } />
        </div>
      );
    }
    if (page === 'single') {
      return (
        <div className="single-page">
          <Single data={ formatedData } />
        </div>
      );
    }
    if (page === 'alternative') {
      return (
        <div className="alternative-page">
          <Alternative data={ formatedData } />
        </div>
      );
    }
    if (page === 'singlewin') {
      return (
        <div className="singleWin-page">
          <SingleWin data={ formatedData } />
        </div>
      );
    }
    /* return (
      <div>

        <div className="single-page" style={{'display': this.props.page === 'single' ? 'block': 'none'}} >
          <Single data={ formatedData } />
        </div>
        <div className="alternative-page" style={{'display': this.props.page === 'alternative' ? 'block': 'none'}}>
          <Alternative data={ formatedData } />
        </div>
        <div className="singleWin-page" style={{'display': this.props.page === 'singlewin' ? 'block': 'none'}}>
          <SingleWin data={ formatedData } />
        </div>
      </div>
    ); */
  }

  renderContent() {
    const {
      rulesRequestStatus,
      footballRequestStatus,
      dataOrigin,
      rules
    } = this.props;
    if (
      rulesRequestStatus === 'pendding' ||
      footballRequestStatus === 'pendding'
    ) {
      return <div className="loading page-status">加载中</div>;
    } else if (footballRequestStatus === 'success' && !dataOrigin.length) {
      return <div className="empty page-status">暂无数据</div>;
    } else if (rulesRequestStatus === 'success' && isSaleout(rules)) {
      return <div className="empty page-status">已停止销售</div>;
    }
    return this.renderPage();
  }

  renderCountDown() {
    const { rulesRequestStatus, rules } = this.props;
    if (rulesRequestStatus !== 'success' || isEmpty(rules)) {
      return <div />;
    }
    const officialEndTime = new Date(
      rules.curIssue.officialEndTime.replace(/-/g, '/')
    );
    const serverTime = new Date(
      rules.curIssue.currentDateTime.replace(/-/g, '/')
    );
    if (serverTime.getTime() < officialEndTime.getTime()) {
      return <div />;
    }
    const remaining =
      getNextOpenDateTime(serverTime).getTime() - serverTime.getTime();
    return (
      <div className="football-sale-countdown-tip">
        <span>温馨提示：距离出票还剩</span>
        <CountDownComponent
          remaining={ Math.floor(remaining / 1000) }
          formats={ '小时,分,秒' }
        />
      </div>
    );
  }

  render() {
    return (
      <div className="mainPage">
        <FootballPageNavigator openFilter={ this.openFilter.bind(this) } />
        <FootballPageMenu />
        {this.renderCountDown()}
        <div
          className="main"
          style={ {
            paddingBottom:
              this.props.betting && this.props.betting.selected.length
                ? '2.6rem'
                : '1.4rem'
          } }
        >
          {this.renderContent()}
        </div>
        {this.props.showFilter ? (
          <FootballFilterComponent
            ref={ filter => (this.filter = filter) }
            data={ this.props.dataOrigin }
          />
        ) : (
          ''
        )}
        <FootballBettingComponent
          buyEndTime={
            this.props.rules.curLottery
              ? this.props.rules.curLottery.buyEndTime
              : 0
          }
        />
        <OrderComponent />
      </div>
    );
  }
}

FootballPageContainer.propTypes = {
  fetch: PropTypes.func.isRequired,
  footballRequestStatus: PropTypes.string.isRequired
};

const DataSelector = state => state.football.data;
const filter = state => state.football.filter;
const bettingsSelector = state => state.footballBettings;
const pageSelector = state => state.football.page;
const modeSelector = state => state.footballMix.mode;
const filterType = state => state.football.filterType;

const getBettingSelector = createSelector(
  [pageSelector, modeSelector, bettingsSelector],
  (page, mode, bettings) => {
    const name = page === 'mix' && mode !== 'mi' ? mode : page;
    const betting = bettings.filter(b => b.name === name)[0];
    return betting || {};
  }
);

const mapStateToProps = state => {
  return {
    footballRequestStatus: state.football.requestStatus,
    rulesRequestStatus: state.footballRules.status,
    rules: state.footballRules.rules,
    saleStatus: state.footballRules.saleStatus,
    data: filterData(state.football.data),
    dataOrigin: state.football.data,
    page: pageSelector(state),
    filter: filter(state),
    betting: getBettingSelector(state),
    showFilter: state.football.showFilter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetch() {
      dispatch(fetch());
    },
    fetchRules() {
      dispatch(fetchRules());
    },
    toggleFilter() {
      dispatch(toggleFilter());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  FootballPageContainer
);
