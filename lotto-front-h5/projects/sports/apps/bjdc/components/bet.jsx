import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BetBar from '@/component/bet-bar.jsx';
import { getCurrentMode } from '../utils/basketball.js';
import Alert from '@/services/message';
import Timer from '@/component/number/timer.jsx';
import NumberHelper from '@/utils/number-helper.js';

import { fetch } from '../redux/actions/basketball';
import { fetchRules } from '../redux/actions/rules';
import {
  clearCart,
  toggleGGType,
  toggleDan,
  toggleKeyboard,
  setMaxInfo,
  toggleBonusCal
} from '../redux/actions/bet.js';
import { connect } from 'react-redux';
import {
  selectGameCout,
  getDefaultGGType,
  checkHasSelect,
  getBetID
} from '../utils/bet.js';
import { fetchAddOrder } from '../redux/actions/order.js';

class Bet extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.innitTimer();
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // this.forceUpdate();
    let { rules } = nextProps;
    let curIssue = rules.curIssue;

    let minTime = this.getMinTime(nextProps);
    if (minTime && minTime !== this.minTime && curIssue) {
      this.minTime = minTime;
      this.timer.start(this.minTime);
    }
  }

  // 获取最小时间
  getMinTime(nextProps) {
    let { data, bets } = nextProps;
    if (!data || data.length === 0) {
      return '';
    }
    let mode = getCurrentMode();
    let minTime, timeStr;
    let index = 0;
    for (let i = 0; i < data.length; i++) {
      if (
        bets[getBetID(data[i])] &&
        checkHasSelect(bets[getBetID(data[i])], mode).hasSelect
      ) {
        let date = data[i].saleEndTimeStamp;
        if (index === 0 || minTime > date) {
          minTime = date;
          timeStr = data[i].saleEndDate + ' ' + data[i].saleEndTime;
        }
        index++;
      }
    }

    return timeStr;
  }

  refresh() {
    this.props.fetch();
    this.props.fetchRules();
  }

  innitTimer() {
    let { rules } = this.props;
    let self = this;

    self.timer = new Timer(); // 计时器
    self.openTimer = new Timer(); // 开奖的计数器
    self.openTimer.setTickSpan(5000); // 每5秒开始一次
    self.openTimer.onTick = timeInfo => {
      // 最新开奖彩期及详情
      let curIssue = rules.curIssue || {};

      if (self.oldLatestIssue === curIssue.issueCode) {
        self.openTimer.clear();
      } else if (timeInfo.seconds === 0) {
        self.openTimer.clear();
      } else {
        self.refresh();
      }
    };
    self.timer.onTick = timeInfo => {
      // 最新开奖彩期及详情
      let { rules } = this.props;
      let lotBetMulList = rules.lotBetMulList;
      // 设置当前最大倍数
      let maxInfo = NumberHelper.getMaxTimes(lotBetMulList, timeInfo.seconds);

      if (
        maxInfo.MaxMultipleNum &&
        maxInfo.MaxBettindNum &&
        (maxInfo.MaxMultipleNum !== this.props.maxInfo.multiple ||
          maxInfo.MaxBettindNum !== this.props.maxInfo.betNum)
      ) {
        this.props.setMaxInfo({
          betNum: maxInfo.MaxBettindNum,
          multiple: maxInfo.MaxMultipleNum
        });
      }

      let timeStr = timeInfo.timeStr;
      if (timeInfo.seconds < 3600) {
        timeStr =
          timeInfo.minutes +
          '分' +
          (timeInfo.seconds - timeInfo.minutes * 60) +
          '秒';
      }

      if (self.betBar && self.betBar.getChild('tzsj')) {
        self.betBar.getChild('tzsj').innerText = timeStr + '后截止';
      }
    };

    self.timer.onTimeout = timeInfo => {
      // 最新开奖彩期及详情
      let { rules } = this.props;
      let curIssue = rules.curIssue || {};
      // 当前期号
      let issueCode = curIssue.issueCode;

      self.oldLatestIssue = issueCode;

      // self.openTimer.start(curIssue.officialEndTime, curIssue.currentDateTime);
      Alert.alert({
        btnFn: [
          () => {
            self.props.clearCart();
            self.props.fetch();
            self.props.fetchRules();
          }
        ],
        children: <span>比赛已经停止销售</span>
      });

      self.timer.clear();
    };
  }

  // 底部投注栏各子项点击事件
  onBetBarItemClick(item, index, e) {
    let mode = getCurrentMode();
    let { betCalc } = this.props;
    let bet = betCalc[mode];

    if (bet.betNum === 0) {
      if (item.mark === 'no') {
        Alert.toast(item.msg);
      }

      return;
    }
    switch (item.mark) {
      // 设置倍数
      case 'mul':
        this.props.toggleKeyboard();
        break;
      // 设置过关方式
      case 'gg':
        this.props.toggleGGType();
        break;
      // 设胆
      case 'dan':
        this.props.toggleDan();
        break;
      // 下单
      case 'pay': {
        let timeStr = this.betBar.getChild('tzsj').innerText;
        if (
          timeStr &&
          this.props.maxInfo.betNum < bet.betNum * 2 * bet.multiple
        ) {
          Alert.alert({
            title: '哇, 土豪！',
            btnTxt: ['我知道了'], // 可不传，默认是确定
            children: (
              <span>
                对不起,当前单注金额最大为<em className="orange">
                  {this.props.maxInfo.betNum * 2}
                </em>元！
              </span>
            )
          });

          return;
        }
        this.props.fetchAddOrder();
      }
    }
  }

  // 获取投注栏目设置
  getBetBarDefault() {
    let { rules } = this.props;
    let curLottery = rules.curLottery || {};
    let time = parseInt(Math.abs(curLottery.buyEndTime / 60));

    let mode = getCurrentMode();
    let msg = mode === 'sfgg' ? '请至少选择3场比赛' : '请至少选择1场比赛';

    if (isNaN(time)) {
      time = 8;
    }

    return [
      {
        title: msg,
        subTitle: '复式截止时间：赛前' + time + '分钟',
        flex: 1,
        mark: ''
      },
      {
        title: <span className="btn-pay">立即投注</span>,
        bg: 'btn-gray',
        mark: 'no',
        msg: msg
      }
    ];
  }

  // 获取过关方式
  getGGStr() {
    let mode = getCurrentMode();
    let { betCalc, bets } = this.props;
    let ggInfo = getDefaultGGType(bets, mode);
    let str = '';
    if (betCalc[mode].isSingle) {
      return '单关';
    }
    if (betCalc[mode].ggType.length > 0) {
      let max = 0;
      for (let i = 0; i < betCalc[mode].ggType.length; i++) {
        let num = parseInt(betCalc[mode].ggType[i]);
        if (max < num) {
          max = num;
          str = betCalc[mode].ggType[i];
        }
      }
    } else {
      str = ggInfo.ggStr;
    }

    if (str === '1串1') {
      str = '单关';
    }

    return str;
  }

  getBetBar() {
    let mode = getCurrentMode();
    let { betCalc, bets } = this.props;
    let bet = betCalc[mode];
    if (mode === 'single') {
      return [
        {
          title: (
            <span className="bet-nor">
              投<em>{bet.multiple}</em>倍
            </span>
          ),
          flex: 1,
          mark: 'mul'
        },
        {
          title: '立即投注',
          subTitle: '',
          bg: 'red',
          subRef: 'tzsj',
          mark: 'pay'
        }
      ];
    } else {
      let gameCount = selectGameCout(bets, mode).count;

      return [
        { title: <span className="bet-nor">设胆</span>, mark: 'dan' },
        {
          title: <span className="bet-nor">{this.getGGStr()}</span>,
          num: gameCount,
          flex: 1,
          mark: 'gg',
          onMarkClick: () => {
            this.props.toggleGGType();
          }
        },
        {
          title: (
            <span className="bet-nor">
              投<em>{bet.multiple}</em>倍
            </span>
          ),
          flex: 1,
          mark: 'mul'
        },
        {
          title: <span className="btn-pay">立即投注</span>,
          subTitle: '',
          bg: 'red',
          subRef: 'tzsj',
          mark: 'pay'
        }
      ];
    }
  }

  // 前往奖金优化
  gotoOptimization() {
    let { betCalc } = this.props;
    let mode = getCurrentMode();
    let bet = betCalc[mode];

    if (bet.betNum > 200) {
      Alert.alert({
        title: '温馨提示',
        btnTxt: ['我知道了'], // 可不传，默认是确定
        children: '奖金优化的原始注数不能超过200注'
      });

      return;
    }

    window.location.hash = '#/optimization';
  }

  render() {
    let { betCalc, hasDan } = this.props;
    let items, betInfoStyle;
    let mode = getCurrentMode();
    let bet = betCalc[mode];

    if (bet.betNum) {
      items = this.getBetBar();
      betInfoStyle = (
        <div className="bet-info-tip" style={ betInfoStyle }>
          <div className="del" onClick={ this.props.clearCart } />
          <div className="info flex">
            投<em className="red">{bet.betNum * 2 * bet.multiple}</em>元，最高奖<em
              className="red"
              onClick={ this.props.toggleBonusCal }
            >
              {bet.maxBonus}
            </em>元
          </div>
          {/* 屏蔽奖金优化入口 */}
          {/* mode=="single"?"": <div onClick={this.gotoOptimization.bind(this)} className="jiangjin">奖金优化</div> */}

          <div id="calcing" className="cal-load" />
        </div>
      );
    } else {
      items = this.getBetBarDefault();
    }

    return (
      <div>
        {betInfoStyle}
        <div className="bottom-bar">
          <BetBar
            ref={ betBar => this.betBar = betBar }
            items={ items }
            onItemClick={ this.onBetBarItemClick.bind(this) }
          />
        </div>
        {hasDan && betInfoStyle ? <div className="dan-mark" /> : ''}
      </div>
    );
  }
}

Bet.propTypes = {
  rules: PropTypes.object,
  rulesRequestStatus: PropTypes.string,
  toggleBonusCal: PropTypes.func,
  clearCart: PropTypes.func,
  bets: PropTypes.object,
  toggleKeyboard: PropTypes.func,
  fetch: PropTypes.func,
  fetchAddOrder: PropTypes.func,
  fetchRules: PropTypes.func,
  maxInfo: PropTypes.object,
  setMaxInfo: PropTypes.func,
  betCalc: PropTypes.object,
  toggleDan: PropTypes.func,
  toggleGGType: PropTypes.func,
  hasDan: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    data: state.basketball.data,
    rulesRequestStatus: state.basketballRules.status,
    bets: state.betSelected.bets, // 投注选择
    betCalc: state.betSelected.betCalc, // 奖金计算数
    basketballRules: state.basketballRules, // 规则
    rules: state.basketballRules.rules,
    maxInfo: state.betSelected.maxInfo,
    hasDan: state.betSelected.hasDan
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
    // 清除选号内容
    clearCart() {
      dispatch(clearCart());
    },
    // 打开或关闭过关设置
    toggleGGType() {
      dispatch(toggleGGType());
    },
    // 打开或关闭过关设置
    toggleDan() {
      dispatch(toggleDan());
    },
    // 下单
    fetchAddOrder() {
      dispatch(fetchAddOrder());
    },
    // 设置最大投注信息
    setMaxInfo(maxInfo) {
      dispatch(setMaxInfo(maxInfo));
    },
    // 打开或关闭奖金计算器
    toggleBonusCal() {
      dispatch(toggleBonusCal());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bet);
