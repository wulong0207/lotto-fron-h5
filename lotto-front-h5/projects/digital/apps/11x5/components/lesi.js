import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import Bet from '@/bet/bet.js';
import Common from './common.js';

function getContentType(betNum, fixedBalls = []) {
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}

const ballRange = range(1, 12).map(i => `0${i}`.slice(-2));

export default class LESI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0,
      maxBonus: 0,
      minBonus: 0,
      maxProfit: 0,
      minProfit: 0
    };

    this.betCal = new Bet('ElevenChoseFive'); // 11选5计算算法
  }

  ballChangeHandle(balls) {
    let result = this.betCal.calc({
      bets: balls,
      bravery: [],
      price: 10,
      option: 4,
      type: 0,
      bonus: [154, 19]
    });
    let bets = result.bets || [];
    let betNum = bets.length;
    let maxBonus = 0;
    let minBonus = 0;
    let maxProfit = 0;
    let minProfit = 0;
    if (betNum) {
      maxBonus = result.maxBonus;
      minBonus = result.minBonus;
      maxProfit = result.maxBonus - betNum * 10;
      minProfit = result.minBonus - betNum * 10;
    }
    this.setState({ betNum, balls, maxBonus, minBonus, maxProfit, minProfit });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      balls = this.panel.random(4, highlight);
    } while (!Common.checkLimit(balls, false, this.props.limitInfoList, 4));

    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true) {
    let result = this.betCal.calc({
      bets: balls,
      bravery: [],
      price: 10,
      option: 4,
      type: 0,
      bonus: [154, 19]
    });
    let bets = result.bets || [];
    let betNum = bets.length;
    return {
      betNum,
      manual,
      balls: Common.formatBall(balls),
      content: Common.formatContent(balls),
      label: `乐选四普通 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'lesi',
      price: 10
    };
  }

  editHandle(content) {
    let balls = content.split(',').map(b => b);
    this.ballChangeHandle(balls);
  }

  addNumber() {
    const { betNum, balls } = this.state;
    const ballNumber = this.state.balls.length;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>还差{4 - ballNumber}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat(
                  this.panel.random(4 - ballNumber)
                );
              } while (
                !Common.checkLimit(newBalls, false, this.props.limitInfoList, 4)
              );
              resolve({ balls: newBalls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        if (!Common.checkLimit(balls, false, this.props.limitInfoList, 4)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    let data = [];
    const datas = this.props.omitData.baseOmit[0];
    for (let item in datas) {
      if (item.charAt(0) === 'b') {
        data.push(datas[item]);
      }
    }
    const {
      betNum,
      balls,
      maxBonus,
      minBonus,
      maxProfit,
      minProfit
    } = this.state;
    const amount =
      maxBonus === minBonus ? maxBonus : minBonus + ' ~ ' + maxBonus;
    const ballNumber = balls.length;
    const profit =
      maxProfit === minProfit ? maxProfit : minProfit + ' ~ ' + maxProfit;
    return (
      <div className="rener-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ data }
          dataType={ this.props.omitFlag }
          name={ this.props.lotteryChildCode }
          betSize={ 4 }
          selected={ this.state.balls }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>
                任选4个号码，与开奖号码有4个相同的中<em>154</em>元，有3个相同的中<em
                >
                  19
                </em>元
              </span>
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{ballNumber}</em>个号码，共<em>{betNum}</em>注，共<em>
                {betNum * 10}
              </em>元
            </p>
            <p>
              若中奖，奖金<em style={ { color: '#FF7A0D' } }>
                {' '}
                {betNum ? amount : 0}{' '}
              </em>元， 盈利<em style={ { color: '#FF7A0D' } }> {profit} </em>元
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
