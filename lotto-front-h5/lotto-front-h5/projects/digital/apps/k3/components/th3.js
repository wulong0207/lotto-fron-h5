/*
 三同号
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range, intersection } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import PropTypes from 'prop-types';
import queue from '../../../utils/update-queue';
import alert from '@/services/alert';
import Profit from '../../../components/profit';

const ballRange = range(1, 7).map(i => `${i}${i}${i}`);

function getBonus(balls, betNum) {
  if (betNum === 7) return [280];
  if (!balls[0].length) return [40];
  if (!balls[1].length) return [240];
  return [40, 280];
}

function getBetNum(balls) {
  return balls.reduce((acc, b) => acc + b.length, 0);
}

export default class TH3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], []],
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
    let balls;
    do {
      balls = this.panel0.random(1, highlight);
    } while (!this.checkLimit(balls));
    if (highlight) {
      balls = [balls[0], []];
      this.panel1.clear();
    }
    return [balls];
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], []] });
  }

  generateBet(balls, manual = true) {
    return balls.reduce((acc, ball, idx) => {
      if (!ball.length) return acc;
      return acc.concat({
        betNum: ball.length,
        manual,
        balls: idx === 1 ? '三同号通选' : ball.join(' '),
        content: idx === 1 ? '3T' : ball.join(','),
        label: idx === 1 ? '三同号通选 1注' : `三同号单选 ${ball.length}注`,
        lotteryChildCode:
          idx === 1
            ? this.props.lottery.children.thtx3
            : this.props.lottery.children.th3,
        contentType: ball.length > 1 ? 2 : 1,
        page: 'th3'
      });
    }, []);
  }

  editHandle(content) {
    if (content === '3T') {
      this.ballChangeHandle(['三同号通选'], null, 1);
      this.panel0.clear();
    } else {
      const balls = content.split(',');
      this.ballChangeHandle(balls, null, 0);
      this.panel1.clear();
    }
  }

  addNumber() {
    const { betNum } = this.state;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        this.emptyTip.open().then(balls => {
          resolve({ balls, open: true, manual: false });
        });
      } else {
        if (!this.checkLimit(this.state.balls[0], false)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  checkLimit(balls, muted = true) {
    const limitList = this.props.limitInfoList;
    const limitBalls = limitList.map(i => i.limitContent);
    const limitSelectedBalls = intersection(limitBalls, balls);
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
    const omitData = ballRange.map(n => data['t' + n]);
    const { betNum, balls } = this.state;
    const ballNumber = balls.reduce((acc, b) => acc + b.length, 0);
    const bonus = getBonus(balls, betNum);
    return (
      <div className="th3-page">
        <div className="ball-panel-box top">
          <div className="ball-panel-title">单选</div>
          <BallPanel
            balls={ ballRange }
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ omitData }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            selected={ this.state.balls[0] }
            name={ this.props.lottery.children.th3 }
            labels={ Array(6).fill('240元') }
            color="#1e88d2"
            rowLength={ 3 }
            random={ false }
            index={ 0 }
          />
        </div>
        <div className="ball-panel-box">
          <div className="ball-panel-title">通选</div>
          <BallPanel
            balls={ ['三同号通选'] }
            ref={ panel => (this.panel1 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ [data.t3] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            selected={ this.state.balls[1] }
            name={ this.props.lottery.children.thtx3 }
            labels={ ['任意一个豹子开出，即中40元'] }
            color="#1e88d2"
            rowLength={ 1 }
            random={ false }
            index={ 1 }
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
          klass="k3-th3-balls"
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
