/*
 三同号
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import { getD3BetNum } from '../../../utils/bet-number';
import PropTypes from 'prop-types';
import queue from '../../../utils/update-queue';
import '../css/th2.scss';
import confirm from '@/services/confirm';
import alert from '@/services/alert';
import Combinatorics from 'js-combinatorics';
import Profit from '../../../components/profit';

const ballRange0 = range(1, 7).map(i => `${i}${i}`);
const ballRange1 = range(1, 7);
const ballRange2 = range(1, 7).map(i => `${i}${i}*`);

function getBonus(balls, betNum) {
  if (!balls[2].length) return [80];
  return [15, 95];
}

function getBetNum(balls) {
  return (
    getD3BetNum([balls[0], balls[1]]) +
    (typeof balls[2] !== 'undefined' ? balls[2].length : 0)
  );
}

function getLimitCombinations(balls, limitBets) {
  const combinations = Combinatorics.cartesianProduct(...balls)
    .toArray()
    .map(i => i.join('#'));
  return limitBets.filter(i => combinations.indexOf(i) > -1);
}

function getContentType(betNum, balls, idx) {
  if (idx === 2) {
    return balls[2].length > 1 ? 2 : 1;
  }
  return balls.slice(0, 2).reduce((acc, n) => acc + n.length, 0) > 2 ? 2 : 1;
}

export default class TH3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], [], []],
      betNum: 0
    };
    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      const betNum = getBetNum(balls);
      this.setState({ balls, betNum });
    });
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      balls = [
        this.panel0.random(1, highlight),
        this.panel1.random(1, highlight)
      ];
    } while (getBetNum(balls) === 0 || !this.checkLimit(balls));
    if (highlight) {
      balls = [balls[0], balls[1], []];
      this.panel2.clear();
    }
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], [], []] });
  }

  generateBet(balls, manual = true) {
    const betNum = getBetNum([balls[0], balls[1], []]);
    return balls.reduce((acc, ball, idx) => {
      if (!ball.length || idx === 1) return acc;
      if ((idx === 0 || idx === 1) && (!balls[0].length || !balls[1].length)) {
        return acc;
      }
      return acc.concat({
        betNum: idx === 2 ? ball.length : betNum,
        manual,
        balls:
          idx === 2
            ? ball.join(' ')
            : `${balls[0].join(' ')}#${balls[1].join(' ')}`,
        content:
          idx === 2
            ? ball.join(',')
            : `${balls[0].join(',')}#${balls[1].join(',')}`,
        label:
          idx === 2 ? `二同号复选 ${ball.length}注` : `二同号单选 ${betNum}注`,
        lotteryChildCode:
          idx === 2
            ? this.props.lottery.children.thfx2
            : this.props.lottery.children.th2,
        contentType: getContentType(betNum, balls, idx),
        page: 'th2'
      });
    }, []);
  }

  editHandle(content) {
    if (content.indexOf('*') > -1) {
      const balls = content.split(',');
      this.ballChangeHandle(balls, null, 2);
      this.panel0.clear();
      this.panel1.clear();
    } else {
      const balls = content.split('#');
      balls.forEach((ball, idx) =>
        this.ballChangeHandle(ball.split(','), null, idx)
      );
      this.panel2.clear();
    }
  }

  addNumber() {
    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length + balls[1].length;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber) {
          this.emptyTip.open().then(newBalls => {
            resolve({ balls: newBalls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm('还差1个号码才能组成一注', '帮我补足', '自己选')
            .then(() => {
              let newBalls = [balls[0], balls[1]];
              do {
                if (newBalls[0].length && newBalls[1].length) {
                  newBalls[1] = this['panel' + 1]
                    .random()
                    .concat(balls[1])
                    .sort();
                } else {
                  for (let i = 0; i < newBalls.length; i++) {
                    if (!newBalls[i].length) {
                      newBalls[i] = this['panel' + i].random();
                    }
                  }
                }
              } while (getBetNum(newBalls) === 0);
              resolve({ balls: newBalls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        if (!this.checkLimit(this.state.balls, false)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  checkLimit(balls, muted = true) {
    if ((!balls[0].length || !balls[1].length) && balls[2].length) return true; // 复选暂不处理
    const limitList = this.props.limitInfoList;
    const limitBalls = limitList.map(i => i.limitContent);
    const limitSelectedBalls = getLimitCombinations(
      [balls[0], balls[1]],
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
    const { betNum, balls } = this.state;
    const ballNumber = balls.reduce((acc, b) => acc + b.length, 0);
    const bonus = getBonus(balls, betNum);
    return (
      <div className="th2-page">
        <div className="ball-panel-box top">
          <div className="ball-panel-title">单选</div>
          <div className="ball-panel-tip">
            选择1对相同号码和1个不同号码投注，选号与奖号相同，即中奖 80 元
          </div>
          <h4 style={ { textAlign: 'center', fontWeight: 'normal' } }>同号</h4>
          <BallPanel
            balls={ ballRange0 }
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ ballRange0.map(n => data['t' + n]) }
            dataType={ this.props.omitFlag }
            selected={ this.state.balls[0] }
            name={ `${this.props.lottery.children.th2}0` }
            color="#1e88d2"
            rowLength={ 6 }
            random={ false }
            index={ 0 }
          />
        </div>
        <h4 style={ { textAlign: 'center', fontWeight: 'normal' } }>不同号</h4>
        <BallPanel
          balls={ ballRange1 }
          ref={ panel => (this.panel1 = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ ballRange1.map(n => data['tdb' + n]) }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
          selected={ this.state.balls[1] }
          name={ `${this.props.lottery.children.th2}1` }
          color="#1e88d2"
          rowLength={ 6 }
          random={ false }
          index={ 1 }
        />
        <div className="ball-panel-box">
          <div className="ball-panel-title">复选</div>
          <div className="ball-panel-tip">
            选号与奖号（包含11～66，不限顺序）相同，即中奖15元
          </div>
          <BallPanel
            balls={ ballRange2 }
            ref={ panel => (this.panel2 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ ballRange2.map(n => n.slice(0, 2)).map(i => data['tf' + i]) }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            selected={ this.state.balls[2] }
            name={ this.props.lottery.children.thfx2 }
            color="#1e88d2"
            rowLength={ 6 }
            random={ false }
            index={ 2 }
            sort={ ballSort }
          />
        </div>
        <BetInfo onDelete={ this.clear.bind(this) } isEmpty={ betNum === 0 }>
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
          sort={ false }
        />
      </div>
    );
  }
}

TH3.propTypes = {
  lotteryChildCode: PropTypes.number.isRequired,
  omitData: PropTypes.object,
  omitFlag: PropTypes.number,
  limitInfoList: PropTypes.array,
  omitQuery: PropTypes.shape({
    omitTypes: PropTypes.number
  }),
  lottery: PropTypes.object.isRequired
};

function ballSort(a, b) {
  return parseInt(a.split('*')[0]) - parseInt(b.split('*')[0]);
}
