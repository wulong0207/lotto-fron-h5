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

export default class QIANYI extends Component {
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
      let betNum = getCombinationBetNum(balls[0], 4);
      this.setState({ balls, betNum });
    });
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [[]];
    do {
      let ball = this.panel0.random(4, highlight);
      balls[0] = ball;
    } while (!Common.checkLimit(balls, true, this.props.limitInfoList, 1));
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.setState({ balls: [[]] });
  }

  generateBet(balls, manual = true) {
    let betNum = getCombinationBetNum(balls[0], 4);
    return {
      betNum,
      manual,
      balls: formatBall(balls),
      content: formatMain(balls, ','),
      label: `任选四 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'qianyi'
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
                <p>还差{4 - ballNumber}个号码</p>
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
                    4 - ballNumber,
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
                  4
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

    let amount = 446;
    let profit = amount - betNum * 2;
    if (betNum === 0) {
      amount = 0;
      profit = 0;
    } else if (betNum === 1) {
      amount = 46;
      profit = amount - betNum * 2;
    } else if (betNum === 5) {
      amount = 92 + '~' + 184;
      profit = 92 - betNum * 2 + '~' + (184 - betNum * 2);
    } else if (betNum === 15) {
      amount = 138 + '~' + 460;
      profit = 138 - betNum * 2 + '~' + (460 - betNum * 2);
    } else if (betNum === 35) {
      amount = 184 + '~' + 920;
      profit = 184 - betNum * 2 + '~' + (920 - betNum * 2);
    } else if (betNum === 70) {
      amount = 230 + '~' + 1610;
      profit = 230 - betNum * 2 + '~' + (1610 - betNum * 2);
    } else if (betNum === 126) {
      amount = 276 + '~' + 2576;
      profit = 276 - betNum * 2 + '~' + (2576 - betNum * 2);
    } else if (betNum === 210) {
      amount = 322 + '~' + 3864;
      profit = 322 - betNum * 2 + '~' + (3864 - betNum * 2);
    } else if (betNum === 330) {
      amount = 368 + '~' + 5520;
      profit = 368 - betNum * 2 + '~' + (5520 - betNum * 2);
    } else if (betNum === 495) {
      amount = 414 + '~' + 7590;
      profit = 414 - betNum * 2 + '~' + (7590 - betNum * 2);
    } else {
      amount = 460 + '~' + 10120;
      profit = 460 - betNum * 2 + '~' + (10120 - betNum * 2);
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
            name={ this.props.lotteryChildCode }
            betSize={ 4 }
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
                至少选择4个号码，选号包含全部开奖号码即中<em
                  style={ { color: '#ff7a0d' } }
                >
                  46
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
