/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range, intersection } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import PropTypes from 'prop-types';
import '../css/hz.scss';
import cx from 'classnames';
import alert from '@/services/alert';
import Profit from '../../../components/profit';

const ballRange = range(3, 19);
const bonusBase = [240, 80, 40, 25, 16, 12, 10, 9];
const bonusRange = bonusBase.concat(bonusBase.concat().reverse());
const labels = bonusRange.map(i => `${i}元`);
const bonusMap = ballRange.reduce((acc, n, index) => {
  return {
    ...acc,
    [n]: bonusRange[index]
  };
}, {});

function getMaxBonus(balls) {
  const bonus = balls.map(b => bonusMap[b]);
  return Math.max(...bonus);
}

function getMinBonus(balls) {
  const bonus = balls.map(b => bonusMap[b]);
  return Math.min(...bonus);
}

function getDataType(type) {
  switch (type) {
    case 1:
      return '冷热';
    case 2:
      return '遗漏';
    case 3:
      return '最大';
    case 4:
      return '上次';
  }
}

export default class HZ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0,
      size: '',
      type: ''
    };
  }

  ballChangeHandle(balls, _, idx, shortcuts = false) {
    if (!shortcuts) {
      this.setState({ size: '', type: '' });
    }
    const betNum = balls.length;
    this.setState({ betNum, balls: balls });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      balls = this.panel.random(1, highlight);
    } while (!this.checkLimit(balls));
    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true) {
    const betNum = balls.length;
    return {
      betNum,
      manual,
      balls: balls.join(' '),
      content: balls.join(','),
      label: `和值 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: betNum > 1 ? 2 : 1,
      page: 'hz'
    };
  }

  editHandle(content) {
    const balls = content.split(',').map(b => parseInt(b));
    this.ballChangeHandle(balls);
  }

  addNumber() {
    const { betNum } = this.state;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        this.emptyTip.open().then(balls => {
          resolve({ balls, open: true, manual: false });
        });
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
    const limitList = this.props.limitInfoList;
    const limitBalls = limitList.map(i => i.limitContent);
    const limitSelectedBalls = intersection(
      limitBalls,
      balls.map(b => b.toString())
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

  static getSizedBall(size, allBalls = ballRange) {
    let balls = [];
    if (size === 'small') {
      balls = allBalls.filter(b => b <= 10);
    } else {
      balls = allBalls.filter(b => b > 10);
    }
    return balls;
  }

  static getTypedBall(type, allBalls = ballRange) {
    let balls = [];
    if (type === 'odd') {
      balls = allBalls.filter(b => b % 2 > 0);
    } else {
      balls = allBalls.filter(b => b % 2 === 0);
    }
    return balls;
  }

  setSizeHandle(size) {
    let balls = [];
    let allBalls = ballRange.concat();
    if (this.state.size && this.state.size === size) {
      this.setState({ size: '' });
      balls = [];
      if (this.state.type) {
        balls = HZ.getTypedBall(this.state.type);
      }
    } else {
      if (this.state.type) {
        allBalls = HZ.getTypedBall(this.state.type, ballRange);
      }
      balls = HZ.getSizedBall(size, allBalls);
      this.setState({ size });
    }
    this.ballChangeHandle(balls, [], 0, true);
  }

  setTypeHandle(type) {
    let balls = [];
    let allBalls = ballRange.concat();
    if (this.state.type && this.state.type === type) {
      this.setState({ type: '' });
      balls = [];
      if (this.state.size) {
        balls = HZ.getSizedBall(this.state.size);
      }
    } else {
      if (this.state.size) {
        allBalls = HZ.getSizedBall(this.state.size);
      }
      balls = HZ.getTypedBall(type, allBalls);
      this.setState({ type });
    }
    this.ballChangeHandle(balls, [], 0, true);
  }

  render() {
    const data = this.props.omitData.baseOmit[0];
    const dataType = getDataType(this.props.omitQuery.omitTypes);
    const omitData = range(3, 19).map(n => {
      const value = data['s' + n];
      return {
        value,
        label: `${dataType}: ${value.toString()}`
      };
    });
    const amount = 240;
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    return (
      <div className="hz-page">
        <BallPanel
          balls={ ballRange }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ omitData }
          selected={ this.state.balls }
          name={ this.props.lotteryChildCode }
          labels={ labels }
          color="#1e88d2"
          rowLength={ 4 }
          random={ false }
        />
        <h3 className="shortcuts-title">快速选号</h3>
        <div className="shortcuts">
          <button
            onClick={ this.setSizeHandle.bind(this, 'big') }
            className={ cx({ active: this.state.size === 'big' }) }
          >
            大
          </button>
          <button
            onClick={ this.setSizeHandle.bind(this, 'small') }
            className={ cx({ active: this.state.size === 'small' }) }
          >
            小
          </button>
          <button
            onClick={ this.setTypeHandle.bind(this, 'odd') }
            className={ cx({ active: this.state.type === 'odd' }) }
          >
            单
          </button>
          <button
            onClick={ this.setTypeHandle.bind(this, 'even') }
            className={ cx({ active: this.state.type === 'even' }) }
          >
            双
          </button>
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ betNum === 0 }
          emptyNode={
            <p className="empty-tip">
              所选和值与开奖的3个号码的和值相同即中奖，最高可中<em>{amount}</em>元！
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
              若中奖，奖金<Profit
                money={
                  betNum > 1
                    ? [getMinBonus(balls), getMaxBonus(balls)]
                    : [bonusMap[balls[0]]]
                }
              />元，<Profit
                money={
                  balls.length > 1
                    ? [
                      getMinBonus(balls) - betNum * 2,
                      getMaxBonus(balls) - betNum * 2
                    ]
                    : [bonusMap[balls[0]] - betNum * 2]
                }
                showLabel={ true }
              />元
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

HZ.propTypes = {
  lotteryChildCode: PropTypes.number.isRequired,
  omitData: PropTypes.object,
  omitFlag: PropTypes.number,
  limitInfoList: PropTypes.array,
  omitQuery: PropTypes.shape({
    omitTypes: PropTypes.number
  }),
  lottery: PropTypes.object.isRequired
};
