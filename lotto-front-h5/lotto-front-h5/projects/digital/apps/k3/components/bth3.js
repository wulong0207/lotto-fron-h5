/*
 三不同号
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import PropTypes from 'prop-types';
import queue from '../../../utils/update-queue';
import confirm from '@/services/confirm';
import alert from '@/services/alert';
import { checkFixedCombination } from '../../../utils/limit';
import { getFixedNumberCombination } from '../../../utils/bet-number';
import Profit from '../../../components/profit';

const ballRange = range(1, 7);

function getBonus(balls, betNum) {
  if (balls[0].length < 3) return [10];
  if (!balls[1].length) return [40];
  return [10, 40];
}

function getBetNum(balls, fixedBalls) {
  return (
    getFixedNumberCombination(balls[0], fixedBalls, 3, false) +
    (typeof balls[1] !== 'undefined' ? balls[1].length : 0)
  );
}

function formatContent(balls, fixedBalls, divider = ',') {
  if (!fixedBalls.length) return balls.join(divider);
  return `${fixedBalls.join(divider)}#${balls.join(divider)}`;
}

function getContentType(index, betNum, fixedBalls) {
  if (index === 1) return 1;
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}

function Balls({ balls }) {
  if (!balls.length) return null;
  return (
    <div className="balls">
      {balls[0].map(ball => (
        <span className="ball" key={ ball }>
          {ball}
        </span>
      ))}
    </div>
  );
}

Balls.propTypes = {
  balls: PropTypes.array
};

export default class BTH3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], []],
      fixedBalls: [],
      betNum: 0
    };
    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      let fixedBalls = this.state.fixedBalls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
        if (d.index === 0) fixedBalls = d.fixedBalls;
      });
      const betNum = getBetNum(balls, fixedBalls);
      this.setState({ balls, fixedBalls, betNum });
    });
  }

  ballChangeHandle(balls, fixedBalls, index) {
    queue.dispatch({ index, balls, fixedBalls });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      balls = [this.panel0.random(3, highlight)];
    } while (!this.checkLimit(balls));
    if (highlight) {
      balls = [balls[0], []];
      this.panel1.clear();
    }
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], []] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    return balls.reduce((acc, ball, idx) => {
      const betNum = idx === 1 ? ball.length : getBetNum([ball], fixedBalls);
      if (!ball.length || betNum === 0) return acc;
      return acc.concat({
        betNum,
        manual,
        balls: idx === 1 ? '三连号通选' : formatContent(ball, fixedBalls, ' '),
        content: idx === 1 ? '3L' : formatContent(ball, fixedBalls, ','),
        label: idx === 1 ? '三连号通选 1注' : `三不同号 ${betNum}注`,
        lotteryChildCode:
          idx === 1
            ? this.props.lottery.children.lhtx3
            : this.props.lottery.children.bth3,
        contentType: getContentType(idx, betNum, fixedBalls),
        page: 'bth3'
      });
    }, []);
  }

  editHandle(content) {
    if (content === '3L') {
      this.ballChangeHandle(['三连号通选'], null, 1);
      this.panel0.clear();
    } else {
      const comb = content.split('#');
      const balls = comb.length === 2 ? comb[1].split(',') : comb[0].split(',');
      const fixedBalls = comb.length === 2 ? comb[0].split(',') : [];
      this.ballChangeHandle(balls, fixedBalls, 0);
      this.panel1.clear();
    }
  }

  addNumber() {
    const { betNum, balls, fixedBalls } = this.state;
    const ballNumber = balls[0].length + fixedBalls.length;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({
              balls,
              open: true,
              manual: false,
              fixedBalls: this.state.fixedBalls
            });
          });
        } else {
          confirm
            .confirm(
              `还差${3 - ballNumber}个号码才能组成一注`,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = [
                  balls[0].concat(this.panel0.completion(3 - ballNumber))
                ];
              } while (!this.checkLimit(newBalls, this.state.fixedBalls));
              resolve({
                balls: newBalls,
                open: true,
                manual: false,
                fixedBalls: this.state.fixedBalls
              });
              this.clear();
            });
        }
      } else {
        if (!this.checkLimit(this.state.balls, this.state.fixedBalls, false)) {
          return reject(new Error('限号限制'));
        }
        resolve({
          balls: this.state.balls,
          manual: true,
          fixedBalls: this.state.fixedBalls
        });
        this.clear();
      }
    });
  }

  checkLimit(balls, fixedBalls = [], muted = true) {
    if (
      balls[1] &&
      balls[1].length &&
      balls[0].length + fixedBalls.length < 3
    ) {
      return true;
    }
    const limitList = this.props.limitInfoList;
    const limitBalls = limitList.map(i => i.limitContent);
    const limitSelectedBalls = checkFixedCombination(
      balls[0],
      fixedBalls,
      3,
      limitBalls
    );
    if (limitSelectedBalls.length) {
      if (!muted) {
        alert.alert(
          <div>
            <p>您购买的号码中包含了限制的号码</p>
            <p>
              <em>{limitSelectedBalls.sort((a, b) => a - b).join(' ')}</em>
            </p>
          </div>
        );
      }
      return false;
    }
    return true;
  }

  render() {
    const data = this.props.omitData.baseOmit[0];
    const omitData = ballRange.map(n => data['b' + n]);
    const { betNum, balls, fixedBalls } = this.state;
    const ballNumber =
      balls.reduce((acc, b) => acc + b.length, 0) + fixedBalls.length;
    const bonus = getBonus(balls, betNum);
    return (
      <div className="th3-page">
        <div className="ball-panel-box top">
          <div className="ball-panel-title">三不同号</div>
          <div className="ball-panel-tip">
            选择3个不同号码投注，选号与奖号相同，即中奖 40 元
          </div>
          <BallPanel
            balls={ ballRange }
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            data={ omitData }
            selected={ this.state.balls[0] }
            name={ this.props.lottery.children.bth3 }
            color="#1e88d2"
            rowLength={ 6 }
            random={ false }
            index={ 0 }
            betSize={ 3 }
            fixedBalls={ this.state.fixedBalls }
            fixed={ true }
          />
        </div>
        <div className="ball-panel-box">
          <div className="ball-panel-title">三连号通选</div>
          <div className="ball-panel-tip">
            对所有3个相连的号码进行投注，任意号码开出即中奖，单注奖金10元
          </div>
          <BallPanel
            balls={ ['三连号通选'] }
            ref={ panel => (this.panel1 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            data={ [data.l3] }
            selected={ this.state.balls[1] }
            name={ this.props.lottery.children.lhtx3 }
            labels={ ['(123、234、345、456)任一开出即中10元'] }
            color="#1e88d2"
            rowLength={ 1 }
            random={ false }
            index={ 1 }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ betNum === 0 }
          emptyNode={
            <p className="empty-tip">
              点击两次可设胆(胆码至少选择1个，最多2个)
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
              若中奖，奖金<Profit money={ bonus } />元，<Profit
                money={ bonus.map(i => i - betNum * 2) }
                showLabel={ true }
              />元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
          template={ Balls }
        />
      </div>
    );
  }
}

BTH3.propTypes = {
  lotteryChildCode: PropTypes.number.isRequired,
  omitData: PropTypes.object,
  omitFlag: PropTypes.number,
  limitInfoList: PropTypes.array,
  omitQuery: PropTypes.shape({
    omitTypes: PropTypes.number
  }),
  lottery: PropTypes.object.isRequired
};
