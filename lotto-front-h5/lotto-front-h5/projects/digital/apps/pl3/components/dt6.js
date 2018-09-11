/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getC6BetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import alert from '@/services/alert';

function getContentType(betNum, fixedBalls = []) {
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}

function formatContent(balls, fixedBalls, middle) {
  if (!fixedBalls || !fixedBalls.length) {
    return balls.join(middle);
  }
  return `${fixedBalls.join(middle)}#${balls.join(middle)}`;
}

const ballRange = range(0, 10);

export default class BH6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      fixedBalls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls, _, index) {
    if (index === 0) {
      if (balls.length > 2) {
        alert.alert('最多可选2个胆码');
        throw new Error('最多可选2个胆码');
      }
      const selectedBalls = this.state.balls.concat();
      const newBalls = selectedBalls.filter(b => balls.indexOf(b) < 0);
      const betNum = getC6BetNum(newBalls, balls, true);
      this.setState({ betNum, fixedBalls: balls, balls: newBalls });
    } else if (index === 1) {
      setTimeout(() => {
        const fixedBalls = this.state.fixedBalls.concat();
        const newFixedBalls = fixedBalls.filter(b => balls.indexOf(b) < 0);
        const betNum = getC6BetNum(balls, newFixedBalls, true);
        this.setState({ betNum, balls, fixedBalls: newFixedBalls });
      }, 50);
    }
  }

  ballRandom(highlight = false) {
    return this.panel1.random(3, highlight);
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    const betNum = getC6BetNum(balls, fixedBalls);
    return {
      betNum,
      manual,
      balls: formatContent(
        balls.sort((a, b) => parseInt(a) - parseInt(b)),
        fixedBalls.sort((a, b) => parseInt(a) - parseInt(b)),
        ' '
      ),
      content: formatContent(balls, fixedBalls, ','),
      label: `组六${fixedBalls.length ? '胆拖' : '包号'} ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, fixedBalls),
      page: fixedBalls.length ? 'dt6' : 'bh6'
    };
  }

  editHandle(content) {
    const balls = content
      .split('#')
      .map(b => b.split(',').map(i => parseInt(i)));
    this.ballChangeHandle(balls[0], [], 0);
    this.ballChangeHandle(balls[1], [], 1);
  }

  addNumber() {
    const { betNum } = this.state;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        return alert.alert('胆码个数必须为1-2个，胆码+拖码个数必须大于等于3!');
      } else {
        resolve({
          balls: this.state.balls,
          fixedBalls: this.state.fixedBalls,
          manual: true
        });
        this.clear();
      }
    });
  }

  render() {
    const data = this.props.omitData;
    const amount = 173;
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="bh6-page">
        <div className="number-panel-box">
          <BallPanel
            balls={ ballRange }
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data }
            highlightMin={ this.props.omitFlag !== 1 }
            index={ 0 }
            name={ 1040340 }
            random={ false }
            selected={ this.state.fixedBalls }
            title="胆码"
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ ballRange }
            ref={ panel => (this.panel1 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data }
            highlightMin={ this.props.omitFlag !== 1 }
            name={ 1040341 }
            random={ false }
            selected={ this.state.balls }
            index={ 1 }
            title="拖码"
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              胆码个数必须为1-2个，胆码+拖码个数必须大于等于3!
            </p>
          }
        >
          <div className="profit-info">
            <p>
              <span>
                已选<em>{this.state.fixedBalls.length}</em>个胆码，{' '}
                <em>{ballNumber}</em>个拖码
              </span>
              <span>
                ，共<em>{betNum}</em>注，共<em>{betNum * 2}</em>元
              </span>
            </p>
            <p>
              若中奖，奖金{betNum ? amount : 0}元，{profit < 0
                ? '亏损'
                : '盈利'}
              {Math.abs(profit)}元
            </p>
          </div>
        </BetInfo>
      </div>
    );
  }
}
