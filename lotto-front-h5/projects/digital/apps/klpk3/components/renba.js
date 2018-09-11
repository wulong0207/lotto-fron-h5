import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getCombinationBetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import Common from './common.js';
import queue from '../../../utils/update-queue';
import RandomNumber from '../../../components/random-number';
import '../css/renliu.scss';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

function RandomBallsTips({ balls }) {
  if (!balls.length) {
    balls = [[]];
  }
  let ball = Common.ballsSort(balls[0]);
  return <p className="balls"> {ball.map((b, index) => b + ' ')}</p>;
}

function formatBall(balls) {
  return Common.ballsSort(balls[0])
    .toString()
    .replace(/,/g, ' ');
}

function formatMain(balls, middle) {
  return balls.join(middle);
}

export default class RENBA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[]],
      betNum: 0
    };
    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      let betNum = getCombinationBetNum(balls[0], 3);
      this.setState({ balls, betNum });
    });
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [[]];
    do {
      let ball = this.panel0.random(3, highlight);
      balls[0] = ball;
    } while (!Common.checkLimit(balls, true, this.props.limitInfoList, 1));
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.setState({ balls: [[]] });
  }

  generateBet(balls, manual = true) {
    let betNum = getCombinationBetNum(balls[0], 3);
    return {
      betNum,
      manual,
      balls: formatBall(balls),
      content: formatMain(balls, ','),
      label: `任选三 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'renBa'
    };
  }

  editHandle(content) {
    let ball = content.split('|');
    let balls = [[]];
    balls[0] = ball[0].split(',');
    this.ballChangeHandle(balls[0], false, 0);
  }

  addNumber() {
    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length;
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
                <p>还差{3 - ballNumber}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              let checkLimit = [];
              do {
                checkLimit = this.state.balls[0].concat(
                  this.panel0.completion(
                    3 - ballNumber,
                    false,
                    this.state.balls[0]
                  )
                );
                newBalls.push(checkLimit);
              } while (
                !Common.checkLimit(
                  checkLimit,
                  false,
                  this.props.limitInfoList,
                  3
                )
              );
              resolve({ balls: newBalls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        if (!Common.checkLimit(balls, false, this.props.limitInfoList, 1)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    const datas = this.props.omitData.baseOmit[0];
    let omitData = datas.rx || [];

    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length;

    let amount = 116;
    let profit = amount - betNum * 2;
    if (betNum === 0) {
      amount = 0;
      profit = 0;
    } else if (betNum === 1) {
      amount = 116;
      profit = amount - betNum * 2;
    } else if (betNum === 4) {
      amount = 116 + '~' + 348;
      profit = 116 - betNum * 2 + '~' + (348 - betNum * 2);
    } else if (betNum === 10) {
      amount = 116 + '~' + 696;
      profit = 116 - betNum * 2 + '~' + (696 - betNum * 2);
    } else if (betNum === 20) {
      amount = 116 + '~' + 1160;
      profit = 116 - betNum * 2 + '~' + (1160 - betNum * 2);
    } else if (betNum === 35) {
      amount = 116 + '~' + 1740;
      profit = 116 - betNum * 2 + '~' + (1740 - betNum * 2);
    } else if (betNum === 56) {
      amount = 116 + '~' + 2436;
      profit = 116 - betNum * 2 + '~' + (2436 - betNum * 2);
    } else if (betNum === 84) {
      amount = 116 + '~' + 3248;
      profit = 116 - betNum * 2 + '~' + (3248 - betNum * 2);
    } else if (betNum === 120) {
      amount = 116 + '~' + 4176;
      profit = 116 - betNum * 2 + '~' + (4176 - betNum * 2);
    } else if (betNum === 165) {
      amount = 116 + '~' + 5220;
      profit = 116 - betNum * 2 + '~' + (5220 - betNum * 2);
    } else if (betNum === 220) {
      amount = 116 + '~' + 6380;
      profit = 116 - betNum * 2 + '~' + (6380 - betNum * 2);
    } else {
      amount = 116 + '~' + 7656;
      profit = 116 - betNum * 2 + '~' + (7656 - betNum * 2);
    }
    return (
      <div className="renliu-page">
        <div className="number-panel-box top">
          <BallPanel
            balls={ ballRange }
            ref={ panel0 => (this.panel0 = panel0) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ omitData }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '1' }
            betSize={ 2 }
            index={ 0 }
            selected={ balls[0] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
            rowLength={ 4 }
          />
          <RandomNumber
            onRandom={ size => this.ballRandom(true, size) }
            range={ range(6, 22) }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>
                至少选择3个号码，选号包含全部开奖号码即中<em
                  style={ { color: '#ff7a0d' } }
                >
                  116
                </em>元
              </span>
            </p>
          }
        >
          <div className="profit-info">
            {
              <p>
                已选<em>{ballNumber}</em>个号码，共<em>{betNum}</em>注，共<em>
                  {betNum * 2}
                </em>元
              </p>
            }
            <p>
              若中奖，奖金{amount}元， 盈利{profit}元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
          template={ RandomBallsTips }
        />
      </div>
    );
  }
}
