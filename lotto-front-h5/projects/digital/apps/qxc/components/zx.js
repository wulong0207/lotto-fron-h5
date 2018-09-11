/*
直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getBasicBetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import queue from '../../../utils/update-queue';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

export default class ZX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], [], [], [], [], [], []],
      betNum: 0,
      randomBalls: []
    };
    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      const betNum = getBasicBetNum(balls);
      this.setState({ balls, betNum });
    });
  }

  componentWillUnmount() {
    queue.unsubscribe();
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
    // let newBalls = this.state.balls.concat();
    // newBalls[index] = balls;
    // const betNum = getBasicBetNum(newBalls);
    // this.setState({betNum, balls: newBalls});
  }

  ballRandom(highlight = false) {
    const balls = [];
    balls.push(this.panel0.random(1, highlight));
    balls.push(this.panel1.random(1, highlight));
    balls.push(this.panel2.random(1, highlight));
    balls.push(this.panel3.random(1, highlight));
    balls.push(this.panel4.random(1, highlight));
    balls.push(this.panel5.random(1, highlight));
    balls.push(this.panel6.random(1, highlight));
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.panel2.clear();
    this.panel3.clear();
    this.panel4.clear();
    this.panel5.clear();
    this.panel6.clear();
    this.setState({ balls: [[], [], [], [], [], [], []] });
  }

  editHandle(content) {
    const balls = content
      .split('|')
      .map(b => b.split(',').map(i => parseInt(i)));
    for (let i = 0; i < balls.length; i++) {
      setTimeout(() => this.ballChangeHandle(balls[i], [], i), i * 50);
    }
  }

  generateBet(balls, manual = true) {
    const betNum = getBasicBetNum(balls);
    return {
      betNum,
      manual,
      balls: balls.map(b => b.join(' ')).join(' | '),
      content: balls.map(b => b.join(',')).join('|'),
      label: `直选 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'zx'
    };
  }

  addNumber() {
    const { balls, betNum } = this.state;
    const ballNumber = balls.reduce((acc, n) => acc + n.length, 0);
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm('请每位至少选择一个号码进行投注', '帮我补足', '自己选')
            .then(() => {
              const balls = this.state.balls.concat();
              for (let i = 0; i < balls.length; i++) {
                if (!balls[i].length) {
                  balls[i] = this['panel' + i].random();
                }
              }
              resolve({ balls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    const data = this.props.omitData;
    const amount = 100000;
    const numberRange = range(0, 10);
    const { betNum, balls } = this.state;
    const ballNumber = balls.reduce((acc, n) => acc + n.length, 0);
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="zx-page">
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            title="第一位"
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data.slice(0, 10) }
            highlightMin={ this.props.omitFlag !== 1 }
            name={ 1070110 }
            selected={ this.state.balls[0] }
            index={ 0 }
            randomLabel="一位"
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="第二位"
            ref={ panel => (this.panel1 = panel) }
            data={ data.slice(10, 20) }
            highlightMin={ this.props.omitFlag !== 1 }
            selected={ this.state.balls[1] }
            name={ 1070111 }
            index={ 1 }
            randomLabel="一位"
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="第三位"
            ref={ panel => (this.panel2 = panel) }
            name={ 1070112 }
            selected={ this.state.balls[2] }
            index={ 2 }
            data={ data.slice(20, 30) }
            highlightMin={ this.props.omitFlag !== 1 }
            randomLabel="一位"
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="第四位"
            ref={ panel => (this.panel3 = panel) }
            name={ 1070113 }
            selected={ this.state.balls[3] }
            index={ 3 }
            data={ data.slice(30, 40) }
            highlightMin={ this.props.omitFlag !== 1 }
            randomLabel="一位"
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="第五位"
            ref={ panel => (this.panel4 = panel) }
            name={ 1070114 }
            selected={ this.state.balls[4] }
            index={ 4 }
            data={ data.slice(40, 50) }
            highlightMin={ this.props.omitFlag !== 1 }
            randomLabel="一位"
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="第六位"
            ref={ panel => (this.panel5 = panel) }
            name={ 1070115 }
            selected={ this.state.balls[5] }
            index={ 5 }
            data={ data.slice(50, 60) }
            highlightMin={ this.props.omitFlag !== 1 }
            randomLabel="一位"
          />
        </div>
        <div className="number-panel-box last">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="第七位"
            ref={ panel => (this.panel6 = panel) }
            name={ 1070116 }
            selected={ this.state.balls[6] }
            index={ 6 }
            data={ data.slice(60, 70) }
            dataType={ this.props.omitFlag }
            randomLabel="一位"
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={ <p className="empty-tip">每位请至少选择一个号码</p> }
        >
          <div className="profit-info">
            <p>
              当前已选<em>{ballNumber}</em>个号码，共<em>{betNum}</em>注，共<em>
                {betNum * 2}
              </em>元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
        />
      </div>
    );
  }
}
