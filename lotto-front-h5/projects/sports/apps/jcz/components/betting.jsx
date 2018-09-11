import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import '@/scss/component/footer.scss';
import { getMaxProfit, getSelectedMatchs, groupArrayByKey } from '../utils';
import { formatMoney } from '@/utils/utils';
import {
  clearBettings,
  setBettingTimes,
  submitOrder
} from '../actions/betting';
import Keyboard from './keyboard.jsx';
import CountDownComponent from './countdown.jsx';
import FootballBundler from './bundler.jsx';
import FootballCourageComponent from './courage.jsx';
import Alert from '@/services/message';
import cx from 'classnames';
import { getMaxBetNumberAndTimes, getSaleEndLeftTime } from '../utils/football';
import ProfitDetailComponent from './profit.jsx';
import {
  generateSinglewinCombinations,
  getSinglewinMaxProfit,
  generateOrderData
} from '../utils/singlewin';
import { hashHistory } from 'react-router';
import analytics from '@/services/analytics';

const shortcuts = [
  {
    label: '投10倍',
    value: 10,
    analyticsId: 211301
  },
  {
    label: '投50倍',
    value: 50,
    analyticsId: 211302
  },
  {
    label: '投100倍',
    value: 100,
    analyticsId: 211303
  }
];

class FootballBettingComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeout: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.timeout && Math.floor(nextProps.leftTime / 1000) > 0) {
      this.setState({ timeout: false });
    }
  }

  // 倒计时为 0 时的处理
  timeout() {
    this.setState({ timeout: true });
  }

  toggleCourageLayout() {
    this.courage.getWrappedInstance().toggle();
  }

  goOptimization() {
    const { betting } = this.props;
    if (!betting.betNum) return undefined;
    if (betting.betNum > 800) return Alert.alert({ msg: '奖金优化的原始注数不能超过800注' });
    return hashHistory.push('/optimization');
  }

  renderContent(combs) {
    const { selected, betting, buyEndTime } = this.props;
    const optimizationAvailablePage = ['mix', 'wdf', 'let_wdf', 'alternative'];
    const optimizationAvailable =
      optimizationAvailablePage.indexOf(betting.name) > -1 &&
      groupArrayByKey(selected, 'id').length > 1;
    const combinations = combs.reduce((acc, c) => acc.concat(c), []);

    if (!selected.length) {
      return (
        <section className="no-selbet">
          <p>
            请至少选择{this.props.betting.name === 'single' ||
            this.props.betting.name === 'singlewin'
              ? '一'
              : '两'}场比赛
          </p>
          <span>复式截止时间：赛前 {Math.floor(Math.abs(buyEndTime) / 60)} 分钟</span>
        </section>
      );
    }

    return (
      <section className="bet-opt">
        <section className="bet-opt-menu">
          {betting.name === 'single' ||
          betting.name === 'singlewin' ||
          groupArrayByKey(betting.selected, 'id').length < 2 ? (
              ''
            ) : (
              <div onClick={ e => this.toggleCourageLayout() }>
              设胆 {betting.courage.length ? <span className="dot-tips" /> : ''}
              </div>
            )}
          <FootballCourageComponent
            betting={ this.props.betting }
            ref={ page => (this.courage = page) }
            latestEndSaleDateTime={ this.props.latestEndSaleDateTime }
            leftTime={ Math.floor(this.props.leftTime / 1000) }
          />
          {betting.name === 'single' || betting.name === 'singlewin' ? (
            ''
          ) : (
            <div>
              <FootballBundler
                matchs={ this.props.selected }
                betting={ this.props.betting }
              />
            </div>
          )}
          <div onClick={ e => this.keyboard.toggle(this.props.betting.times) }>
            投<em>{this.props.betting.times}</em>倍
          </div>
        </section>
        <section className="attach">
          <span className="del">
            <img
              src={ require('@/img/public/icon_del@2x.png') }
              onClick={ this.onClear.bind(this) }
            />
          </span>
          <span>
            投注金额<em>
              {combinations.length
                ? betting.selected.length * betting.times * 2
                : betting.betNum * betting.times * 2}
            </em>元，最高奖金<em onClick={ () => this.profitDetail.open() }>
              {formatMoney(
                combinations.length
                  ? getSinglewinMaxProfit(combs)
                  : betting.maxBonus
              )}
            </em>元
          </span>
          {optimizationAvailable ? (
            <span
              onClick={ this.goOptimization.bind(this) }
              className="prize-optimize"
            >
              奖金优化
            </span>
          ) : (
            ''
          )}
        </section>
        <Keyboard
          ref={ keyboard => (this.keyboard = keyboard) }
          onOpen={ this.onKeyboardOpen.bind(this) }
          onClose={ this.onKeyBoardClose.bind(this) }
          value={ betting.times }
          onDone={ this.onKeyBoardDone.bind(this) }
          min={
            betting.name === 'singlewin' || betting.ggName === 'singlewin'
              ? 5
              : 1
          }
          label="倍数"
          shortcuts={ shortcuts }
          messages={
            betting.name === 'singlewin' || betting.ggName === 'singlewin'
              ? { min: '单场制胜的最小投注倍数为5倍' }
              : undefined
          }
        />
      </section>
    );
  }

  onKeyboardOpen(height) {
    // this.footer.style.bottom = height + 'px';
  }

  onKeyBoardClose() {
    this.footer.style.bottom = 0;
  }

  onKeyBoardDone(number) {
    if (!this.validMaxTimesAndMaxBetNum(number)) return undefined;
    analytics.send(211304);
    this.props.setTimes(this.props.betting.name, number === 0 ? 1 : number);
  }

  onClear() {
    this.onKeyBoardClose();
    analytics.send(211311);
    this.props.clear(this.props.betting.name);
  }

  validMaxTimesAndMaxBetNum(times) {
    const {
      latestEndSaleDateTime,
      serverTime,
      requestSuccessTime,
      betting
    } = this.props;
    const leftTime = getSaleEndLeftTime(
      latestEndSaleDateTime,
      serverTime,
      requestSuccessTime
    );
    const { bettingNum, multipleNum } = getMaxBetNumberAndTimes(
      this.props.rules,
      Math.floor(leftTime / 1000)
    );
    if (
      betting.betNum > bettingNum ||
      (betting.name === 'singlewin' &&
        groupArrayByKey(betting.selected, 'id').length * betting.times >
          bettingNum)
    ) {
      const content = (
        <div>
          <p>哇，土豪！</p>
          <p>对不起，当前单注最大金额为￥{betting.betNum * 2}.00元！</p>
        </div>
      );
      Alert.alert({ btnTxt: ['返回修改'], children: content });
      return false;
    }
    if (times > multipleNum) {
      const content = (
        <div>
          <p>哇，土豪！</p>
          <p>对不起，单个方案最大倍为{multipleNum}倍！</p>
        </div>
      );
      const btnTxt = ['返回修改', `${multipleNum}倍投注`];
      const setNumber = () => {
        this.props.setTimes(betting.name, multipleNum);
        this.keyboard.set(multipleNum);
      };
      Alert.pconfirm({ children: content, btnTxt })
        .then(setNumber)
        .catch(e => console.log(e));
      return false;
    }
    return true;
  }

  submit(combinations) {
    const selected = this.props.selected;
    const matchs = groupArrayByKey(selected, 'id');
    if (!selected.length) {
      return Alert.alert({
        msg: `请至少选择${this.props.betting.name === 'single' ||
        this.props.betting.name === 'singlewin'
          ? '一'
          : '两'}场比赛`
      });
    }
    if (
      matchs.length === 1 &&
      this.props.betting.ggName !== 'single' &&
      !combinations.length
    ) {
      return Alert.alert({ msg: `请至少选择两场比赛` });
    }
    if (this.keyboard) this.keyboard.close();
    if (this.state.timeout) return Alert.alert({ msg: '已到投注截至时间' });
    const betting = this.props.betting;
    if (matchs.length > 1) {
      if (!betting.ggType.length) {
        return Alert.alert({ msg: '请选择过关方式' });
      }
    } else {
      if (!betting.ggType.length && !combinations.length) { return Alert.alert({ msg: '请选择过关方式' }); }
      if (!betting.amount && !combinations.length) return undefined;
    }
    if (!this.validMaxTimesAndMaxBetNum(betting.times)) return undefined;
    analytics.send(211310);
    this.bettingAnalytics(betting).then(() => {
      debugger;
      this.props.submit(
        betting,
        this.props.latestEndSaleDate,
        combinations,
        betting.name === 'singlewin' || betting.ggName === 'singlewin'
      );
    });
  }

  bettingAnalytics(betting) {
    const selected = betting.selected;
    if (!selected || !selected.length) return undefined;
    return analytics.send(selected.map(s => mapBetTypeToAnalyticsId(s.type)));
  }

  render() {
    const { betting } = this.props;
    // 单场制胜
    let combinations = [];
    if (betting.name === 'singlewin' || betting.ggName === 'singlewin') {
      combinations = generateSinglewinCombinations(betting, this.props.data);
    }
    return (
      <footer className="footer" ref={ footer => (this.footer = footer) }>
        <div className="bet-info">{this.renderContent(combinations)}</div>
        <div
          className={ cx('bet-btn', { disabled: this.state.timeout }) }
          onClick={ this.submit.bind(this, combinations) }
        >
          <p>立即投注</p>
          {this.props.selected.length ? (
            <p className="countdown">
              <CountDownComponent
                remaining={
                  this.state.timeout
                    ? 0
                    : Math.floor(this.props.leftTime / 1000)
                }
                timeout={ this.timeout.bind(this) }
              />
              <span>后截止</span>
            </p>
          ) : (
            ''
          )}
        </div>
        <ProfitDetailComponent
          betting={ this.props.betting }
          combinations={ combinations }
          ref={ modal => (this.profitDetail = modal) }
        />
      </footer>
    );
  }
}

const pageSelector = state => state.football.page;
const modeSelector = state => state.footballMix.mode;
const bettingsSelector = state => state.footballBettings;
const matchDataSelector = state => state.football.data;
const serverTimeSelector = state => state.football.serverTime;
const requestSuccessTimeSelector = state => state.football.requestSuccessTime;
const nowSelector = state => new Date().getTime();

const getBettingSelector = createSelector(
  [pageSelector, modeSelector, bettingsSelector],
  (page, mode, bettings) => {
    let name = page;
    if (page === 'mix' && mode !== 'mi') {
      name = mode;
    }
    const betting = bettings.filter(b => b.name === name)[0];
    return betting || {};
  }
);

const getSelectedDataSelector = createSelector(
  [getBettingSelector],
  betting => (betting.selected ? betting.selected : [])
);

const getMaxProfitSelector = createSelector([getBettingSelector], betting =>
  getMaxProfit(betting)
);

const getSelectedMatchsSelector = createSelector(
  [getSelectedDataSelector, matchDataSelector],
  (selected, data) => {
    const matchs = getSelectedMatchs(selected);
    return matchs.reduce((acc, m) => {
      return acc.concat(data.filter(d => d.id === m));
    }, []);
  }
);

const selectedMatchsSelector = createSelector([getBettingSelector], betting =>
  groupArrayByKey(betting.selected)
);

const latestEndSaleMatchSelector = createSelector(
  [getSelectedMatchsSelector],
  selectedMatchs => {
    return selectedMatchs
      .map(m =>
        new Date(
          m.saleEndDate.replace(/-/g, '/') + ' ' + m.saleEndTime
        ).getTime()
      )
      .sort((a, b) => {
        return a - b;
      });
  }
);

const latestEndSaleDateTime = createSelector(
  [getSelectedMatchsSelector],
  selectedMatchs => {
    const lastEndSaleMatch = selectedMatchs
      .map(m =>
        new Date(
          m.saleEndDate.replace(/-/g, '/') + ' ' + m.saleEndTime
        ).getTime()
      )
      .sort((a, b) => {
        return a - b;
      })[0];
    return lastEndSaleMatch || 0;
  }
);

const getLatestSaleEndLeftTimeSelector = createSelector(
  [
    latestEndSaleMatchSelector,
    serverTimeSelector,
    requestSuccessTimeSelector,
    nowSelector
  ],
  (matchsEndSaleDateTimes, serverTime, requestSuccessTime, now) => {
    const serverDateTime = new Date(serverTime);
    const nowDateFromServer = serverTime + (now - requestSuccessTime);
    const validEarliestMatch = matchsEndSaleDateTimes.filter(
      m => m > nowDateFromServer
    );
    return validEarliestMatch.length
      ? validEarliestMatch[0] - nowDateFromServer
      : 0;
  }
);

const mapStateToProps = state => {
  return {
    betting: getBettingSelector(state),
    selected: getSelectedDataSelector(state),
    maxProfit: getMaxProfitSelector(state),
    page: state.football.page,
    leftTime: getLatestSaleEndLeftTimeSelector(state),
    latestEndSaleDateTime: latestEndSaleDateTime(state),
    latestEndSaleDate: latestEndSaleMatchSelector(state)[0],
    serverTime: serverTimeSelector(state),
    requestSuccessTime: requestSuccessTimeSelector(state),
    data: matchDataSelector(state),
    matchs: selectedMatchsSelector(state),
    rules: state.footballRules.rules
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clear(name) {
      dispatch(clearBettings(name));
    },
    setTimes(name, times) {
      dispatch(setBettingTimes(name, times));
    },
    submit(betting, latestEndSaleDate, combinations = [], isSinglewin = false) {
      dispatch(
        submitOrder(
          betting,
          latestEndSaleDate,
          generateOrderData(combinations),
          1,
          isSinglewin,
          isSinglewin
        )
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: true
})(FootballBettingComponent);

function mapBetTypeToAnalyticsId(type) {
  switch (type) {
    case 'wdf':
      return 21121;
    case 'let_wdf':
      return 21122;
    case 'score':
      return 21123;
    case 'half':
      return 21124;
    case 'goal':
      return 21125;
    default:
      return 21121;
  }
}
