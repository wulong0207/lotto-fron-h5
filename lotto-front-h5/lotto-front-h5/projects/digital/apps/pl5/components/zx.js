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
      balls: [[], [], [], [], []],
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

  // componentDidMount() {
  //   messages.success('文字文字文字文字文字文字文字', 50000);
  //   setTimeout(() => messages.success('哈哈哈哈哈还', 5000), 3000)
  // }

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
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.panel2.clear();
    this.panel3.clear();
    this.panel4.clear();
    this.setState({ balls: [[], [], [], [], []] });
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
      balls: balls
        .map(ball => ball.sort((a, b) => parseInt(a) - parseInt(b)).join(' '))
        .join(' | '),
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
            .confirm('各位至少选择一个号码才能组成一注', '帮我补足', '自己选')
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
        <button
          className="random-button"
          onClick={ this.ballRandom.bind(this, true) }
        />
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            title="万位"
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data.slice(0, 10) }
            highlightMin={ this.props.omitFlag !== 1 }
            name={ 1030110 }
            random={ false }
            selected={ this.state.balls[0] }
            index={ 0 }
            randomLabel="一位"
          >
            <button
              className="clear-icon"
              onClick={ () => this.panel0.clear() }
            />
          </BallPanel>
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="千位"
            ref={ panel => (this.panel1 = panel) }
            data={ data.slice(10, 20) }
            highlightMin={ this.props.omitFlag !== 1 }
            selected={ this.state.balls[1] }
            name={ 1030111 }
            random={ false }
            index={ 1 }
            randomLabel="一位"
          >
            <button
              className="clear-icon"
              onClick={ () => this.panel1.clear() }
            />
          </BallPanel>
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="百位"
            ref={ panel => (this.panel2 = panel) }
            name={ 1030112 }
            selected={ this.state.balls[2] }
            index={ 2 }
            random={ false }
            data={ data.slice(20, 30) }
            highlightMin={ this.props.omitFlag !== 1 }
            randomLabel="一位"
          >
            <button
              className="clear-icon"
              onClick={ () => this.panel2.clear() }
            />
          </BallPanel>
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="十位"
            ref={ panel => (this.panel3 = panel) }
            name={ 1030113 }
            selected={ this.state.balls[3] }
            index={ 3 }
            random={ false }
            highlightMin={ this.props.omitFlag !== 1 }
            data={ data.slice(30, 40) }
            randomLabel="一位"
          >
            <button
              className="clear-icon"
              onClick={ () => this.panel3.clear() }
            />
          </BallPanel>
        </div>
        <div className="number-panel-box last">
          <BallPanel
            balls={ numberRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="个位"
            ref={ panel => (this.panel4 = panel) }
            name={ 1030114 }
            selected={ this.state.balls[4] }
            index={ 4 }
            random={ false }
            highlightMin={ this.props.omitFlag !== 1 }
            data={ data.slice(40, 50) }
            randomLabel="一位"
          >
            <button
              className="clear-icon"
              onClick={ () => this.panel4.clear() }
            />
          </BallPanel>
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选一个5位数投注形成一注彩票，单注中奖奖金<em>{amount}</em>元！
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{ballNumber}</em>个号码，共<em>{betNum}</em>注，共<em>
                {betNum * 2}
              </em>元
            </p>
            <p>
              若中奖，奖金{betNum ? amount : 0}元，{profit < 0
                ? '亏损'
                : '盈利'}
              {Math.abs(profit)}元
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
