import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import queue from '../../../utils/update-queue';
import CALC from './bet.jsx';
import NumberHelper from '@/utils/number-helper.js';
import alert from '@/services/alert';

const ballRange = range(0, 19);

function RandomBallsTips({ balls }) {
  return (
    <p className="balls">
      {balls.map((b, index) =>
        b.map((a, index) => (
          <span className="ball" key={ index }>
            {a}
          </span>
        ))
      )}
    </p>
  );
}
function formatBall(balls, middle) {
  return balls[0].sort((a, b) => a - b).join(middle);
}

export default class QIANSANSELECT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[]],
      betNum: 0,
      profit: 0,
      bonus: 0
    };
    CALC(this);

    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      let bet = this.CALC({ betArr: balls, ind: 9, money: 100 });
      let betNum = bet.num;
      let profit = bet.profit;
      let bonus = bet.bonus;
      this.setState({ balls, betNum, profit, bonus });
    });
  }

  componentWillUnmount() {
    queue.unsubscribe();
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls;
    do {
      let one = this.panel.random(1, highlight);

      balls = [one];
    } while (!this.checkLimit(balls, this.props.limitInfoList, false));

    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [[]] });
  }

  generateBet(balls, manual = true) {
    let betNum = this.CALC({ betArr: balls, ind: 9, money: 100 }).num;
    return {
      betNum,
      manual,
      balls: formatBall(balls, ' '),
      content: formatBall(balls, ','),
      label: `二星直选和值 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: 6,
      page: 'qianerSelect'
    };
  }

  editHandle(content) {
    let lists = content.split(',');
    let balls = [lists];

    let bet = this.CALC({ betArr: balls, ind: 9, money: 100 });
    let betNum = bet.num;
    let profit = bet.profit;
    let bonus = bet.bonus;
    this.setState({ balls, betNum, profit, bonus });
  }

  checkLimit(balls, limits, isAlert = true) {
    let flag = true;
    let sum = 0;
    let limit = limits[0] || {};
    let limitContent = limit.limitContent || '';
    let limitArr = limitContent.split('|') || [];

    if (limitArr.length) {
      for (var i = 0; i < limitArr.length; i++) {
        sum += parseInt(limitArr[i]);
      }
      flag = NumberHelper.isContained(balls, [sum]);
    }
    if (flag && isAlert) {
      alert.alert(
        <div>
          <p>您购买的号码中包含了限制的号码</p>
          <p>
            <em>{sum}</em>
          </p>
        </div>
      );
      return false;
    } else {
      return true;
    }
  }

  addNumber() {
    const { betNum, balls } = this.state;

    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (balls[0].length === 0) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>每位至少选择一个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat();
                newBalls.map((item, index) => {
                  if (item.length < 1) {
                    item.push(this.panel.random(1));
                  }
                });
              } while (!this.checkLimit(newBalls, this.props.limitInfoList));
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
        if (!this.checkLimit(this.state.balls, this.props.limitInfoList)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    let omit = this.props.omitData.baseOmit[0];
    let sums2 = omit.sums2 || [];
    const { betNum, balls, profit, bonus } = this.state;
    return (
      <div className="rener-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ sums2 }
          dataType={ this.props.omitFlag }
          name={ this.props.lotteryChildCode }
          betSize={ 1 }
          index={ 0 }
          selected={ this.state.balls[0] }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ balls[0].length === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>所选和值号码与开奖号码后两位之和相同，即中奖100元</span>
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{balls[0].length}</em>个红球，共<em>{betNum}</em>注，共<em
              >
                {betNum * 2}
              </em>元
            </p>
            <p>
              若中奖，奖金<em style={ { color: '#FF7A0D' } }> {bonus} </em>元，
              盈利<em style={ { color: '#FF7A0D' } }> {profit} </em>元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          template={ RandomBallsTips }
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
        />
      </div>
    );
  }
}
