/**
 * 过关方式
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '@/services/message';
import '../css/component/bundler.scss';
import {
  selectGameCout,
  getDefaultGGType,
  getDanCount,
  getMaxGG
} from '../utils/bet.js';
import { getCurrentMode } from '../utils/basketball.js';

import {
  calc,
  toggleGGType,
  setBettingGGtype,
  setBettingDan
} from '../redux/actions/bet.js';
import { connect } from 'react-redux';

class Bundler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      show: false
    };

    let mode = getCurrentMode();
    this.MaxGG = getMaxGG(mode);
    this.minGG = mode === 'sfgg' ? 3 : 1;
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
      betCalc[mode].ggType.length > 0
        ? betCalc[mode].ggType.map(val => val)
        : ggInfo.ggList;

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

    this.ggstr = ggstr;

    this.setState({ selected: selected });
  }

  renderOptions() {
    let { bets, betCalc } = this.props;
    let { selected } = this.state;
    let mode = getCurrentMode();
    let gameCount = selectGameCout(bets, mode);

    let count = gameCount.count;
    if (gameCount.hasSFC && count > 4) {
      count = 4;
    }
    if (count > this.MaxGG) {
      count = this.MaxGG;
    }

    let result = [];
    for (let i = this.minGG; i <= count; i++) {
      let str = i + '串1';
      let active =
        selected.indexOf(str) >= 0 || (betCalc[mode].isSingle && i === 1)
          ? 'active'
          : '';
      let text = i === 1 ? '单关' : str;

      result.push(
        <li
          key={ i }
          className={ 'op-li ' + active }
          onClick={ this.selectOp.bind(this, str) }
        >
          {text}
        </li>
      );
    }

    let isSingle = false;
    if (betCalc[mode].isSingle && result.length === 0) {
      isSingle = true;
    }

    return (
      <ul className="options">
        {result}
        {isSingle ? <li className="op-li active">单关</li> : ''}
      </ul>
    );
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
    let { bets } = this.props;
    let { selected } = this.state;
    let mode = getCurrentMode();
    let dan = getDanCount(bets, mode);
    let str = [];
    let min = this.MaxGG;

    let setGG = () => {
      let newArr = selected.map(val => {
        return val;
      });
      this.props.setBettingGGtype(newArr);
      this.props.calc();
      this.toggle();
    };

    // 最小的过关方式是否合法 过关方式不得小于等于 胆码 个数
    if (selected.length !== 0) {
      for (let i = 0; i < selected.length; i++) {
        let num = parseInt(selected[i]);
        if (dan >= num) {
          str.push(num + '串1');
        } else {
        }
        min = min > num ? num : min;
      }
    }

    if (str.length > 0) {
      let moveCount = dan - min + 1;
      Alert.confirm({
        title: '你当前选择' + dan + '个胆码',
        btnTxt: ['取消', '去掉' + moveCount + '胆码'],
        btnFn: [
          () => {},
          () => {
            let ids = [];
            for (let field in bets) {
              let betItem = bets[field];
              if (betItem.bravery[mode]) {
                ids.push(field);
              }

              if (ids.length === moveCount) {
                break;
              }
            }
            this.props.setBettingDan(ids);
            setGG();
          }
        ],
        children: ('不能选择' + str.join('，') + '的过关方式').replace(
          /1串1/g,
          '单关'
        )
      });
    } else {
      if (selected.length === 0) {
        this.toggle();
      } else {
        setGG();
      }
    }
  }

  render() {
    return (
      <div className="yc-bundler">
        <div className="take-position" onClick={ this.toggle.bind(this) } />

        <div className="main-area">
          <div className="options">{this.renderOptions()}</div>
          <div className="display-flex">
            <div className="btn flex" onClick={ this.toggle.bind(this) }>
              取消
            </div>
            <div className="btn flex confirm" onClick={ this.confirm.bind(this) }>
              确定
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Bundler.propTypes = {
  setBettingGGtype: PropTypes.func,
  setBettingDan: PropTypes.func,
  calc: PropTypes.func,
  onShow: PropTypes.func,
  betCalc: PropTypes.object,
  bets: PropTypes.object,
  show: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    bets: state.betSelected.bets, // 投注选择
    betCalc: state.betSelected.betCalc // 奖金计算数
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // 打开或关闭过关设置
    onShow() {
      dispatch(toggleGGType());
    },
    // 设置过关方式
    setBettingGGtype(types) {
      dispatch(setBettingGGtype(types));
    },
    // 计算奖金
    calc(games, bets) {
      dispatch(calc(games, bets));
    },
    // 设置胆
    setBettingDan(id) {
      dispatch(setBettingDan(id));
      dispatch(calc());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bundler);
