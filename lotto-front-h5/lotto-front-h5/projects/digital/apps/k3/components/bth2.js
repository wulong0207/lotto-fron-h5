/*
 二不同号
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import { getFixedNumberCombination } from '../../../utils/bet-number';
import { checkFixedCombination } from '../../../utils/limit';
import PropTypes from 'prop-types';
import confirm from '@/services/confirm';
import alert from '@/services/alert';
import Profit from '../../../components/profit';

const ballRange = range(1, 7);

function formatContent(balls, fixedBalls, divider = ',') {
  if (!fixedBalls.length) return balls.join(divider);
  return `${fixedBalls.join(divider)}#${balls.join(divider)}`;
}

function getContentType(betNum, fixedBalls) {
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}

function getBetNum(balls, fixedBalls = []) {
  return getFixedNumberCombination(balls, fixedBalls, 2, false);
}

export default class BTH2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      fixedBalls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls, fixedBalls, index) {
    const betNum = getBetNum(balls, fixedBalls);
    this.setState({ balls, betNum, fixedBalls });
  }

  ballRandom(highlight = false) {
    if (highlight) this.setState({ fixedBalls: [], balls: [] }); // 摇一摇机选时去掉投注信息
    let balls = [];
    do {
      balls = this.panel.random(2, highlight);
    } while (!this.checkLimit(balls));
    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    const betNum = getBetNum(balls, fixedBalls);
    return {
      betNum,
      manual,
      balls: formatContent(balls, fixedBalls, ' '),
      content: formatContent(balls, fixedBalls, ','),
      label: `二不同号 ${betNum}注`,
      lotteryChildCode: this.props.lottery.children.bth2,
      contentType: getContentType(betNum, fixedBalls),
      page: 'bth2'
    };
  }

  editHandle(content) {
    const comb = content.split('#');
    const balls = comb.length === 2 ? comb[1].split(',') : comb[0].split(',');
    const fixedBalls = comb.length === 2 ? comb[0].split(',') : [];
    this.ballChangeHandle(balls, fixedBalls);
  }

  addNumber() {
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm(
              `还差${2 - ballNumber}个号码才能组成一注`,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = balls.concat(this.panel.completion(2 - ballNumber));
              } while (this.checkLimit(newBalls, this.state.fixedBalls));
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
    const limitList = this.props.limitInfoList;
    const limitBalls = limitList.map(i => i.limitContent);
    const limitSelectedBalls = checkFixedCombination(
      balls,
      fixedBalls,
      2,
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
    const ballNumber = balls.length + fixedBalls.length;
    const bonus = calculateBonus(balls, fixedBalls);
    const profit = calculateProfit(balls, fixedBalls, betNum);
    return (
      <div className="th3-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ omitData }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
          selected={ this.state.balls }
          fixedBalls={ this.state.fixedBalls }
          name={ this.props.lottery.children.bth2 }
          color="#1e88d2"
          fixed={ true }
          rowLength={ 3 }
          random={ false }
          index={ 0 }
          betSize={ 2 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ betNum === 0 }
          emptyNode={
            <p className="empty-tip">
              选择2个号码，猜中开奖的任意2位即可中<em>{8}</em>元！<br />点击两次可设胆(最多只能选1个胆码)
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
              若中奖，奖金<Profit money={ bonus } />元，
              <Profit money={ profit } showLabel={ true } />元
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

BTH2.propTypes = {
  lotteryChildCode: PropTypes.number.isRequired,
  omitData: PropTypes.object,
  omitFlag: PropTypes.number,
  limitInfoList: PropTypes.array,
  omitQuery: PropTypes.shape({
    omitTypes: PropTypes.number
  }),
  lottery: PropTypes.object
};

function calculateBonus(balls, fixedBalls) {
  if (fixedBalls.length) {
    if (balls.length < 1) return [0];
    if (balls.length === 1) return [8];
    return [8, 16];
  }
  if (balls.length < 2) return [0];
  if (balls.length === 2) return [8];
  return [8, 24];
}

function calculateProfit(balls, fixedBalls, betNum) {
  const bonus = calculateBonus(balls, fixedBalls);
  return bonus.map(b => b - betNum * 2);
}

function MoneyRender({ money }) {
  if (money.length === 1) {
    return <em>{money[0]}</em>;
  }
  return (
    <span>
      <em>{money[0]}</em>~<em>{money[1]}</em>
    </span>
  );
}

MoneyRender.propTypes = {
  money: PropTypes.arrayOf(PropTypes.number)
};
