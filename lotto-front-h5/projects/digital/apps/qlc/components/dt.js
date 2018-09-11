/*
胆拖
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import {
  getFixedNumberCombination,
  getCombinationBetNum
} from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import alert from '@/services/alert';

function getContentType(betNum, fixedBalls = []) {
  console.log(betNum);
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 3 : 1;
}

function formatContent(balls, fixedBalls, middle) {
  if (!fixedBalls || !fixedBalls.length) {
    return balls.join(middle);
  }
  return `${fixedBalls.join(middle)}#${balls.join(middle)}`;
}

const ballRange = range(1, 31).map(i => `0${i}`.slice(-2));

export default class DT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      fixedBalls: [],
      betNum: 0,
      randomBalls: []
    };
  }

  ballChangeHandle(balls, _, index) {
    if (index === 0) {
      if (balls.length > 6) {
        alert.alert('最多可选6个胆码');
        throw new Error('最多可选6个胆码');
      }
      const selectedBalls = this.state.balls.concat();
      const newBalls = selectedBalls.filter(b => balls.indexOf(b) < 0);
      const betNum = getFixedNumberCombination(newBalls, balls, 7);
      this.setState({ betNum, fixedBalls: balls, balls: newBalls });
    } else if (index === 1) {
      const fixedBalls = this.state.fixedBalls.concat();
      const newFixedBalls = fixedBalls.filter(b => balls.indexOf(b) < 0);
      const betNum = getFixedNumberCombination(balls, newFixedBalls, 7);
      this.setState({ betNum, balls, fixedBalls: newFixedBalls });
    }
  }

  ballRandom(highlight = false, size = 7) {
    return this.panel1.random(size, highlight);
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [], fixedBalls: [] });
  }

  editHandle(content) {
    const balls = content
      .split('#')
      .map(b => b.split(',').map(i => parseInt(i)));
    this.ballChangeHandle(balls[0].map(b => `0${b}`.slice(-2)), [], 0);
    this.ballChangeHandle(balls[1].map(b => `0${b}`.slice(-2)), [], 1);
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    const betNum = fixedBalls.length
      ? getFixedNumberCombination(balls, fixedBalls, 7)
      : getCombinationBetNum(balls, 7);
    console.log(this.props.lotteryChildCode);
    return {
      betNum,
      manual,
      balls: formatContent(balls, fixedBalls, ' '),
      content: formatContent(balls, fixedBalls, ','),
      label: `${fixedBalls.length ? '胆拖' : '普通'}投注 ${betNum}注`,
      lotteryChildCode: fixedBalls.length ? this.props.lotteryChildCode : 10101,
      contentType: getContentType(betNum, fixedBalls),
      page: fixedBalls.length ? 'dt' : 'pt'
    };
  }

  addNumber() {
    const { betNum } = this.state;
    const ballNumber = this.state.balls.length || this.state.fixedBalls.length;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        // return alert.alert('胆码个数必须为1-6个，胆码+托胆个数必须大于7!');
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls: balls.sort(), open: true, manual: false });
          });
        } else {
          return alert.alert(
            '胆码个数必须为1-6个，胆码+托胆个数必须大于或等于7!'
          );
        }
      } else {
        resolve({
          balls: this.state.balls.sort(),
          fixedBalls: this.state.fixedBalls.sort(),
          manual: true
        });
        this.clear();
      }
    });
  }

  render() {
    const data = this.props.omitData;
    const amount = 500;
    const { betNum, balls, fixedBalls } = this.state;
    const ballNumber = balls.length + fixedBalls.length;
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="yc-qlc">
        <div className="number-panel-box">
          <BallPanel
            balls={ ballRange }
            title="胆码"
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data }
            dataType={ this.props.omitFlag }
            name={ 1010201 }
            betSize={ 7 }
            rowLength={ 7 }
            selected={ this.state.fixedBalls }
            index={ 0 }
            random={ false }
          >
            <div className="dm">
              <span>请选择1-6个你认为必出的号码</span>
            </div>
          </BallPanel>
        </div>
        <div className="ball-panel">
          <BallPanel
            balls={ ballRange }
            onChange={ this.ballChangeHandle.bind(this) }
            title="拖码"
            ref={ panel => (this.panel1 = panel) }
            data={ data }
            selected={ this.state.balls }
            dataType={ this.props.omitFlag }
            name={ 1010202 }
            betSize={ 7 }
            rowLength={ 7 }
            index={ 1 }
            random={ false }
          >
            <div className="dm">
              <span>选择1个以上你认为可能会出的号码</span>
            </div>
          </BallPanel>
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选择7个号码组合成一注彩票，单注最高奖金<em>{amount}</em>万元!
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{fixedBalls.length}</em>个胆码，<em>{balls.length}</em>个拖码，共<em
              >
                {betNum}
              </em>注，共<em>{betNum * 2}</em>元
            </p>
            {/* <p>若中奖，奖金{ betNum ? amount : 0 }元，{ profit < 0 ? '亏损' : '盈利' }{ Math.abs(profit) }元</p> */}
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
