/*
 * @Author: YLD
 * @Date: 2017-07-03 16:24:00
 * @Desc: 数字彩球组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import '../../scss/component/number/ball.scss';

export default class Ball extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sts: 0 // 0未选择, 1已选择, 2选择并设为胆
    };
  }

  // 点击球的事件处理
  onBallClickHandler() {
    let { sts } = this.state;
    let { type, dan, onBallClick, num, panelIndex, curIndex } = this.props;

    if (sts == 0) {
      sts = 1;
    } else if (sts == 1) {
      sts = dan ? 2 : 0;
    } else {
      sts = 0;
    }

    if (onBallClick) {
      onBallClick(
        {
          num,
          sts,
          oldSts: this.state.sts,
          curIndex
        },
        panelIndex
      );
    }

    this.setState({ sts });
  }

  // 点击球但是
  onPureBallClickHandler() {
    let { sts } = this.state;
    let { onPureBallClick, num, panelIndex, curIndex } = this.props;
    if (onPureBallClick) {
      onPureBallClick(this, { num, sts, curIndex }, panelIndex);
    }
  }

  // 设置状态
  setSts(newSts) {
    this.state.sts = newSts;
    this.setState({ sts: newSts });
  }

  // 获取当前的状态
  getResult() {
    let { type, dan, num } = this.props;
    let { sts } = this.state;
    num = num.indexOf(',') >= -1 ? num.split(',')[0] : num; // 对子直接选一个值
    return {
      num,
      sts // 0未选择, 1已选择, 2选择并设为胆
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sts != null && this.state.sts != nextProps.sts) {
      this.setState({ sts: nextProps.sts });
    }
  }

  componentDidMount() {
    if (this.props.sts != null && this.state.sts != this.props.sts) {
      this.setState({ sts: this.props.sts });
    }
  }

  render() {
    let { type, dan, num, deg, onBallClick, onPureBallClick } = this.props;
    let { sts } = this.state;
    let balltype = '',
      ballSts = '';
    switch (type) {
      case 1:
        {
          balltype = ' redball';
        }
        break;
      case 2:
        {
          balltype = ' blueball';
        }
        break;
    }

    // 0未选择, 1已选择, 2选择并设为胆
    switch (sts) {
      case 0:
        {
        }
        break;
      case 1:
        {
          ballSts = ' select';
        }
        break;
      case 2:
        {
          ballSts = ' set-dan';
        }
        break;
    }

    // num变数组，为双号码循环做准备

    if (!num.split) {
      num = num + '';
    }
    num = num.split(',');

    let degTitle = '',
      degColor = '';
    if (deg != null) {
      if (typeof deg === 'object') {
        degTitle = deg.title;
        degColor = deg.color || '';
      } else {
        degTitle = deg;
      }
    }

    let eventHandler = this.onBallClickHandler.bind(this);
    if (onPureBallClick != null) {
      eventHandler = this.onPureBallClickHandler.bind(this);
    }
    return (
      <div className={ 'yc-ball' + balltype }>
        <div className={ 'ball' + ballSts } onClick={ eventHandler }>
          {num.map((row, index) => {
            return <span key={ index }>{row}</span>;
          })}
        </div>
        <div className={ 'des ' + degColor }>{degTitle}</div>
      </div>
    );
  }
}

Ball.propTypes = {
  type: PropTypes.number,
  dan: PropTypes.bool,
  onBallClick: PropTypes.func,
  sts: PropTypes.number
};

Ball.defaultProps = {
  num: '01', // 数字  01 || 01,02 用于生成双号码
  type: 1, // 球的类型，1：红球，2：篮球
  dan: false, // 是否可设置胆，可设置胆则为true，否则为false
  deg: '', // 热度等数据，或者描述信息,
  onBallClick: null, // function (item) {} //球的点击事件 item:{sts: //状态, num: //号码, oldSts://更改前的状态}
  onPureBallClick: null, // function (e) {} //球的点击事件, 不返回任何状态，只在参数中传入自己
  panelIndex: 0, // 所属的面板序列号
  sts: null // 默认状态
};
