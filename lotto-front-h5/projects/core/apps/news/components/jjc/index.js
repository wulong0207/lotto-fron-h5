import React, { Component } from 'react';

import FootballWidget from '../football'; // 竞彩足球 组件

import './index.scss';

class MulpCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiple: 1, // 倍数
      maxProfit: props.maxProfit // 最大奖金
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      maxProfit: nextProps.maxProfit
    });
  }
  addTimer() {
    this.state.multiple++;
    this.setState({});
  }
  minusTimer() {
    if (parseInt(this.state.multiple) > 0) {
      this.state.multiple--;
      this.setState({});
    } else {
    }
  }
  changeMutiple(e) {
    let max = e.target.value;
    if (parseInt(max) > 50000) {
      this.setState({ multiple: 50000 });
    } else if (parseInt(max) > 0) {
      this.setState({ multiple: max });
    }
  }
  blurMultiple() {}
  render() {
    const { maxProfit } = this.state;
    return (
      <div>
        <div className="counter">
          <span className="but" onClick={ this.minusTimer.bind(this) }>
            -
          </span>
          <input
            value={ this.state.multiple }
            ref="timer"
            type="tel"
            onBlur={ this.blurMultiple.bind(this) }
            onChange={ this.changeMutiple.bind(this) }
          />
          <span className="but" onClick={ this.addTimer.bind(this) }>
            +
          </span>
        </div>
        <div className="bonus">最高奖金{maxProfit}</div>
      </div>
    );
  }
}

class Jjc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      betNum: 1, // 注数
      maxProfit: 0
    };
  }
  matchChangeHandle(betNum, maxProfit) {
    this.setState({ betNum, maxProfit });
  }

  render() {
    const { jjc } = this.props;
    if (!jjc) return <div />;
    console.log(jjc, 'jjc');
    return (
      <div className="jjc-content">
        <div className="title">
          <span>{jjc.sportSp[0].officialMatchCode}</span>
          <span>{jjc.sportSp[0].matchName}</span>
          <span>{jjc.sportSp[0].saleEndTime} 截止</span>
        </div>
        <div className="jjc-bet">
          <FootballWidget
            ref={ football => (this.football = football) }
            matchs={ jjc.sportSp }
            onMatchChange={ this.matchChangeHandle.bind(this) }
          />
        </div>
        <div className="bottom">
          <MulpCounter maxProfit={ this.state.maxProfit } />
        </div>
      </div>
    );
  }
}

export default Jjc;
