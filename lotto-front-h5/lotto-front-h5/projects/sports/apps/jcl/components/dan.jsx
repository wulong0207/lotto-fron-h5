/**
 * 设胆
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '@/services/message';
import '../css/component/dan.scss';
import {
  selectGameCout,
  getDefaultGGType,
  checkHasSelect,
  getBetDetail,
  getBetID,
  getDanCount,
  loopBets
} from '../utils/bet.js';
import { getCurrentMode, getGame } from '../utils/basketball.js';

import {
  calcBet,
  toggleDan,
  setBettingGGtype,
  clearCart,
  removeBet,
  setBettingDan
} from '../redux/actions/bet.js';
import { connect } from 'react-redux';

class Dan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }

  componentDidMount() {
    this.getSelected();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show != null && this.state.show !== nextProps.show) {
      this.setState({ show: nextProps.show });
      this.getSelected();
    }
  }

  // 获取已选择的
  getSelected() {
    let { betCalc, bets } = this.props;
    let mode = getCurrentMode();
    let ggInfo = getDefaultGGType(bets, mode);
    let ggTypes =
      betCalc[mode].ggType.length > 0 ? betCalc[mode].ggType : ggInfo.ggList;

    this.setState({ selected: ggTypes });
  }

  // 选择过关方式
  selectOp(ggstr) {
    let { selected } = this.state;
    let index = selected.indexOf(ggstr);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(ggstr);
    }

    this.setState({ selected: selected });
  }

  // 获取单个玩法的投注信息
  getSubBetDetail(betArr, game, mode) {
    let config = getBetDetail();
    let subDetails = [];
    betArr = betArr.sort((a, b) => {
      let av = parseInt(a);
      let bv = parseInt(b);
      return av - bv;
    });

    for (let i = 0; i < betArr.length; i++) {
      let item = betArr[i];
      subDetails.push(
        <div key={ i } className="item">
          {config[mode][item]}@{game[config[mode][item + 'val']]}
        </div>
      );
    }

    return (
      <li key={ mode } className="sub-bet display-flex">
        <div className="title">{config[mode].getTitle(game)}</div>
        <div className="flex sub-detail display-flex flex-wrap">
          {subDetails}
        </div>
      </li>
    );
  }

  // 获取投注的详情
  getBetResult(item, game, mode) {
    let result = [];

    if (mode == 'mix' || mode == 'single') {
      if (item[mode].sf.length > 0) {
        result.push(this.getSubBetDetail(item[mode].sf, game, 'sf'));
      }
      if (item[mode].rfsf.length > 0) {
        result.push(this.getSubBetDetail(item[mode].rfsf, game, 'rfsf'));
      }
      if (item[mode].dxf.length > 0) {
        result.push(this.getSubBetDetail(item[mode].dxf, game, 'dxf'));
      }
      if (item[mode].sfc.length > 0) {
        result.push(this.getSubBetDetail(item[mode].sfc, game, 'sfc'));
      }
    } else {
      result = this.getSubBetDetail(item[mode], game, mode);
    }

    return <ul className="bet-detail">{result}</ul>;
  }

  // 删除投注
  removeBet(game) {
    Alert.confirm({
      title: '提示',
      btnFn: [
        () => {},
        () => {
          this.count--;
          this.props.removeBet(getBetID(game));
          if (this.count <= 0) {
            this.toggle(false);
          }
        }
      ],
      children: '您确定删除本场赛事？'
    });
  }

  renderOptions() {
    let { bets, data } = this.props;
    let { selected } = this.state;
    let mode = getCurrentMode();
    let result = [];

    let i = 0;
    let canSetDanMark = this.canSetDan(getDanCount(bets, mode));
    this.count = 0;

    loopBets(bets, (item, field) => {
      if (checkHasSelect(item, mode).hasSelect) {
        let game = getGame(data, item.id).game;
        let cln =
          canSetDanMark || item.bravery[mode] ? 'add-dan' : 'add-dan no-edit';
        let addDanArea = (
          <span className={ cln }>
            <img
              height="18"
              src={
                item.bravery[mode]
                  ? require('../img/icon_radio@2x.png')
                  : require('../img/icon_radio2@2x.png')
              }
            />
          </span>
        );
        let li = (
          <li className="op-child" key={ i++ }>
            <div className="title-area">
              <span
                className="dan-span"
                onClick={ this.setDan.bind(this, game, item) }
              >
                {addDanArea}设胆
              </span>
              <span>{game.week}</span>
              <span>{game.num}</span>
              <span>{game.m_s_name}</span>
              <span>
                {game.g_s_name}
                <em className="gray">vs</em>
                {game.h_s_name}
              </span>
              <div
                className="item-close"
                onClick={ this.removeBet.bind(this, game) }
              />
            </div>
            {this.getBetResult(item, game, mode)}
          </li>
        );
        this.count++;
        result.push(li);
      }
    });

    return result;
  }

  toggle(isShow) {
    let show = !this.state.show;
    if (isShow != null) {
      show = isShow;
    }

    this.setState({ show });

    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  confirm() {
    let { selected } = this.state;
    this.props.setBettingGGtype(selected);
    this.props.calc();
    this.toggle();
  }

  // 清空列表
  clearCart() {
    Alert.confirm({
      title: '提示',
      btnFn: [() => {}, this.props.clearCart.bind(this)],
      children: '您确认清空列表内容？'
    });
  }

  // 设置胆
  setDan(game, bet) {
    let { bets, betCalc } = this.props;
    let mode = getCurrentMode();
    if (!bet.bravery[mode]) {
      // 设置为胆
      let cureentGGArray = betCalc[mode];
      if (this.canSetDan(getDanCount(bets, mode))) {
        this.props.setBettingDan(getBetID(game));
      }
    } else {
      this.props.setBettingDan(getBetID(game));
    }
  }

  // 是否可设置胆
  canSetDan(danCount) {
    let { bets, betCalc } = this.props;
    let mode = getCurrentMode();
    let defaultGG = getDefaultGGType(bets, mode);
    let cureentGGArray = betCalc[mode].ggType;
    let gameCount = selectGameCout(bets, mode);
    let max = 0;
    if (cureentGGArray.length == 0) {
      max = defaultGG.gg;
    } else {
      max = 8;
      for (let i = 0; i < cureentGGArray.length; i++) {
        let num = parseInt(cureentGGArray[i]);
        max = max > num ? num : max;
      }
    }
    if (gameCount.count < 2) {
      return false;
    }

    return danCount < max - 1;
  }

  // 获取最小时间
  getMinTime() {
    let { data, bets } = this.props;
    if (!data || data.length == 0) {
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
        if (index == 0 || minTime > date) {
          minTime = date;
          timeStr = data[i].saleEndDate + ' ' + data[i].saleEndTime;
        }
        index++;
      }
    }

    if (timeStr.lastIndexOf(':') == timeStr.indexOf(':')) {
      timeStr += ':00';
    }

    return timeStr;
  }

  render() {
    let mode = getCurrentMode();
    let { show, addDan } = this.state;
    let { bets, endTime, basketballRules } = this.props;
    let style = show ? {} : { display: 'none' };
    let gameCount = selectGameCout(bets, mode);

    return (
      <div className="yc-dan">
        <div className="take-position" onClick={ this.toggle.bind(this) } />

        <div className="dead-line">
          <div className="txt">
            投注截止时间：{this.getMinTime()}
            <span className="time">{endTime}</span>
          </div>
          <div onClick={ this.toggle.bind(this, false) } className="close" />
        </div>
        <div className="cart">
          <div className="tab">
            <ul>
              <li onClick={ this.toggle.bind(this) }>
                继续选择比赛
                <span className="subtitle">(已选{gameCount.count}场)</span>
              </li>
              <li onClick={ this.clearCart.bind(this) }>清空列表</li>
            </ul>
          </div>
          <div className="slide">
            <div className="export" />
            <div className="cart-area">
              <ul className="cart-all">{this.renderOptions()}</ul>
              <div className="bot" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dan.propTypes = {
  clearCart: PropTypes.func,
  onShow: PropTypes.func,
  setBettingGGtype: PropTypes.func,
  calc: PropTypes.func,
  removeBet: PropTypes.func,
  setBettingDan: PropTypes.func,
  basketballRules: PropTypes.object,
  data: PropTypes.array,
  bets: PropTypes.object,
  betCalc: PropTypes.object,
  endTime: PropTypes.string,
  show: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    basketballRules: state.basketballRules,
    data: state.basketball.data,
    bets: state.betSelected.bets, // 投注选择
    betCalc: state.betSelected.betCalc // 奖金计算数
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // 清空列表
    clearCart() {
      dispatch(clearCart());
      dispatch(toggleDan());
    },
    // 打开或关闭过关设置
    onShow() {
      dispatch(toggleDan());
    },
    // 设置过关方式
    setBettingGGtype(types) {
      dispatch(setBettingGGtype(types));
    },
    // 计算奖金
    calc(games, bets) {
      dispatch(calcBet(games, bets));
    },
    // 删除投注
    removeBet(id) {
      dispatch(removeBet(id));
      dispatch(calcBet());
    },
    // 设置胆
    setBettingDan(id) {
      dispatch(setBettingDan(id));
      dispatch(calcBet());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dan);
