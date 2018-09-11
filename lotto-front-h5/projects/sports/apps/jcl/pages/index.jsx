import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Alert from '@/services/message';
import { formatMatchData } from '../utils.js';
import { getCurrentMode, isSaleout } from '../utils/basketball.js';
import session from '@/services/session.js';
import {
  BASKETBALL_BETTING_STORAGE_KEY,
  BASKETBALL_BETTTING_CALC_STORAGE_KEY
} from '../constants.js';
import Timer from '@/component/number/timer.jsx';
import SpPush from '../services/sppush';

import { fetch, toggleFilter } from '../redux/actions/basketball';
import { fetchRules } from '../redux/actions/rules';
import { changMul, toggleKeyboard } from '../redux/actions/bet.js';
import { connect } from 'react-redux';
import { toggleOrder } from '../redux/actions/order.js';

import MixPage from './mix.jsx'; // 混合投注
import SFPage from './sf.jsx'; // 胜负
import SFCPage from './sfc.jsx'; // 胜分差
import RFPage from './rfsf.jsx'; // 让分胜负
import DXFPage from './dxf.jsx'; // 大小分
import SinglePage from './single.jsx'; // 单关投注

import SPHistory from '../components/sp-history.jsx';
import Keyboard from '../components/keyboard.jsx';
import FilterComponent, {
  filterData,
  filterMathOne
} from '../components/filter.jsx';
import Bet from '../components/bet.jsx';
import BasketballPageNavigator from '../components/navigator.jsx';
import BasketballPageMenu from '../components/menu.jsx';
import Bundler from '../components/bundler.jsx';
import Dan from '../components/dan.jsx';
import BetOrder from '@/component/bet-order.jsx';
import BonusCal from '../components/bonus-cal.jsx';
import PanKou from '../components/pankou';

class BasketballPageContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.previousPage = '';
    this.saveDataHandle = this.saveData.bind(this);
  }

  componentDidMount() {
    const { page } = this.props.basketball;
    const { mode } = this.props.basketballMix || {};
    if (page === 'mix') {
      this.previousPage = mode;
    } else {
      this.previousPage = page;
    }

    setTimeout(() => {
      document.body.scrollTop = 0;
    }, 50);

    this.props.fetch();
    this.props.fetchRules();

    let isOnIOS =
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i);
    this.eventName = isOnIOS ? 'pagehide' : 'beforeunload';
    // this.eventName = "unload";

    window.addEventListener(this.eventName, this.saveDataHandle); // 在页面刷新或离开前保存选中球的数据

    window.SP = SpPush;
    SpPush.startSocket();
  }

  componentWillUnmount() {
    // 保存未提交的号码
    this.saveDataHandle(); // 在组件销毁前保存选中球的数据
    window.removeEventListener(this.eventName, this.saveDataHandle); // 取消监听页面刷新事件
  }

  innitTimer(rules) {
    let curIssue = rules.curIssue || {};
    let self = this;

    self.timer = new Timer(); // 计时器
    self.timer.onTick = timeInfo => {
      this.timearea.style.display = '';
      this.cartBody.className = 'cart-body show-msg';
      let str = '';
      if (timeInfo.hour > 24) {
        str = parseInt(timeInfo.hour / 24) + '天' + timeInfo.hour % 24 + '小时';
      } else if (timeInfo.hour > 0) {
        str = timeInfo.hour + '小时';
      }

      if (str || timeInfo.minutes > 0) {
        str += timeInfo.minutes + '分钟';
      }

      str += (timeInfo.seconds % 3600) % 60 + '秒';

      this.timeTip.innerText = str;
    };
    self.timer.onTimeout = () => {
      this.timearea.style.display = 'none';
      this.cartBody.className = 'cart-body';
    };
    let time = this.timer.fixDate(curIssue.currentDateTime).getTime();
    this.timer.start((curIssue.officialStartTime - time) / 1000);
    // this.timer.start(5000, curIssue.currentDateTime);
  }

  // 保存数据
  saveData() {
    let { betSelected } = this.props;
    session.set(BASKETBALL_BETTING_STORAGE_KEY, betSelected.bets);
    session.set(BASKETBALL_BETTTING_CALC_STORAGE_KEY, betSelected.betCalc);
  }

  // 获取投注栏目设置
  getBetBarSetting(target) {
    return [
      {
        title: '请至少选择二场比赛',
        subTitle: '复式截止时间：赛前10分钟',
        flex: 1
      },
      {
        title: <span className="btn-pay">立即投注</span>,
        bg: 'red',
        subRef: 'tzsj'
      }
    ];
  }

  componentWillReceiveProps(nextProps) {
    const { page } = nextProps;
    const { mode } = nextProps.basketballMix || {};
    let checkPlay = condition => {
      if (nextProps.rulesRequestStatus === 'success') {
        if (condition) {
          const content = (
            <div className="saleout-content">
              <h4>该玩法暂停销售</h4>
            </div>
          );
          Alert.alert({ children: content });
        }
      }
    };

    if (
      this.props.rulesRequestStatus === 'pendding' &&
      nextProps.rulesRequestStatus === 'success'
    ) {
      this.innitTimer(nextProps.rules);
      if (
        nextProps.rules.curLottery.saleStatus !== 1 ||
        nextProps.rules.curIssue.saleStatus === 0
      ) {
        let str = '彩期暂停销售';
        if (nextProps.rules.curLottery.saleStatus !== 1) {
          str =
            nextProps.rules.curLottery.saleStatus === 0
              ? '该彩种暂停销售'
              : '该彩种停止销售';
        }
        const content = (
          <div className="jcl-saleout-content">
            <h4>{str}</h4>
            <p>由此给你带来的不便，我们深感抱歉，望你谅解</p>
            {/* <p>你可访问：<a href="/">首页</a><a href="/ssq.html">双色球</a><a href="/sd11x5.html">11选5</a></p> */}
          </div>
        );
        Alert.alert({ children: content });

        return;
      } else {
        checkPlay(!nextProps.basketballRules.saleStatus[mode]);
      }
    }

    checkPlay(
      !nextProps.basketballRules.saleStatus[mode] &&
        (mode !== this.props.basketballMix.mode ||
          (page === 'mix' && this.props.page !== 'mix'))
    );
  }

  openFilter() {
    this.props.toggleFilter();
  }

  // 键盘上的点击事件
  onKeyboardConfirm(mul) {
    let { page } = this.props;
    const { mode } = this.props.basketballMix || {};
    if (page === 'mix' && mode !== 'mi') {
      page = mode;
    }
    this.props.changMul(page, mul);
  }

  renderPage() {
    const { page, data } = this.props;
    const { mode } = this.props.basketballMix || {};
    const formatedData = formatMatchData(data);

    if (page === 'mix') {
      if (this.cartBody && mode !== this.previousPage) {
        document.body.scrollTop = 0;
      }

      this.previousPage = mode;

      switch (mode) {
        // 混合过关
        case 'mi':
          return (
            <div className="mix-page">
              <MixPage data={ formatedData } />
            </div>
          );
        // 胜负
        case 'sf':
          return (
            <div className="mix-page">
              <SFPage data={ formatedData } />
            </div>
          );
        // 胜分差
        case 'sfc':
          return (
            <div className="mix-page">
              <SFCPage data={ formatedData } />
            </div>
          );
        // 大小分
        case 'dxf':
          return (
            <div className="mix-page">
              <DXFPage data={ formatedData } />
            </div>
          );
        // 让分胜负
        case 'rfsf':
          return (
            <div className="mix-page">
              <RFPage data={ formatedData } />
            </div>
          );
      }
    } else if (page === 'single') {
      if (this.cartBody && page !== this.previousPage) {
        document.body.scrollTop = 0;
      }

      this.previousPage = page;
      return (
        <div className="mix-page">
          <SinglePage data={ formatedData } />
        </div>
      );
    }
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

  render() {
    let {
      basketball,
      basketballMix,
      betSelected,
      basketballRules,
      showSP,
      order,
      showFilter,
      showPanKou
    } = this.props;
    let mode = getCurrentMode(basketball, basketballMix);
    let maxInfo = betSelected.maxInfo;
    let keyboardMsg = {
      max: maxInfo.multiple,
      msg: (
        <span>
          对不起,单个方案最大倍为<em className="orange">{maxInfo.multiple}</em>倍！
        </span>
      ),
      title: '哇, 土豪！'
    };

    return (
      <div className="yc-jcl">
        <BasketballPageNavigator openFilter={ this.openFilter.bind(this) } />
        <BasketballPageMenu />
        <div
          style={ { display: 'none' } }
          ref={ timearea => (this.timearea = timearea) }
          className="tip-time"
        >
          温馨提示：距离出票时间还剩<span
            ref={ timeTip => (this.timeTip = timeTip) }
            className="red"
          />
        </div>
        <div ref={ cartBody => (this.cartBody = cartBody) } className="cart-body">
          <div className="num-panel-area">{this.renderContent()}</div>
        </div>
        <Bet mode={ mode } />
        {showFilter ? <FilterComponent /> : ''}
        {betSelected.showGGPanel ? (
          <Bundler show={ betSelected.showGGPanel } />
        ) : (
          ''
        )}
        {betSelected.showDanPanel ? (
          <Dan show={ betSelected.showDanPanel } />
        ) : (
          ''
        )}
        {betSelected.showBonusCal ? (
          <BonusCal show={ betSelected.showBonusCal } />
        ) : (
          ''
        )}
        {showSP ? <SPHistory /> : ''}
        {showPanKou ? <PanKou /> : ''}
        {betSelected.keyboardShow ? (
          <Keyboard
            show={ true }
            onShow={ this.props.toggleKeyboard }
            onConfirm={ this.onKeyboardConfirm.bind(this) }
            curNum={ betSelected.betCalc[mode].multiple }
            message={ keyboardMsg }
          />
        ) : (
          ''
        )}
        {order.show ? (
          <BetOrder
            orders={ order.data }
            endTime={ basketballRules.rules.curIssue.saleEndTime }
            reduxMode={ true }
            getItemTemplate={ () => {
              return '';
            } }
            show={ this.props.toggleOrder }
            currentOrder={ order.currentOrderId }
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

BasketballPageContainer.propTypes = {
  basketball: PropTypes.object,
  basketballMix: PropTypes.object,
  betSelected: PropTypes.any,
  basketballRules: PropTypes.object,
  showSP: PropTypes.bool,
  order: PropTypes.object,
  rules: PropTypes.object,
  showFilter: PropTypes.bool,
  showPanKou: PropTypes.bool,
  fetch: PropTypes.func,
  fetchRules: PropTypes.func,
  toggleFilter: PropTypes.func,
  toggleOrder: PropTypes.func,
  toggleKeyboard: PropTypes.func,
  footballRequestStatus: PropTypes.any,
  dataOrigin: PropTypes.any,
  changMul: PropTypes.func,
  page: PropTypes.string,
  rulesRequestStatus: PropTypes.any,
  data: PropTypes.any
};

const filter = state => state.basketball.filter;
// const bettingsSelector = state => state.footballBettings;
const pageSelector = state => state.basketball.page;

const mapStateToProps = state => {
  return {
    requestStatus: state.basketball.requestStatus,
    rulesRequestStatus: state.basketballRules.status,
    data: filterData(filterMathOne(state.basketball.data)),
    basketball: state.basketball,
    basketballMix: state.basketballMix,
    betSelected: state.betSelected,
    page: pageSelector(state),
    dataOrigin: state.basketball.data,
    filter: filter(state),
    basketballRules: state.basketballRules,
    showSP: state.spHistory.showMode,
    order: state.order,
    rules: state.basketballRules.rules,
    showFilter: state.basketball.showFilter,
    showPanKou: state.spHistory.showPanKou
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
    // 显示隐藏键盘
    toggleKeyboard() {
      dispatch(toggleKeyboard());
    },
    changMul(mode, mul) {
      dispatch(changMul(mul));
    },
    // 显示订单
    toggleOrder() {
      dispatch(toggleOrder());
    },
    toggleFilter() {
      dispatch(toggleFilter());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  BasketballPageContainer
);
