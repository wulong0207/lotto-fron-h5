import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import Common from './common.js';
import queue from '../../../utils/update-queue';
import RandomNumber from '../../../components/random-number';
import '../css/renliu.scss';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
];

function RandomBallsTips({ balls }) {
  return (
    <p className="balls"> {balls.map((b, index) => b.map((v, ind) => v))}</p>
  );
}

function formatBall(balls) {
  return Common.ballsSort(balls[0])
    .toString()
    .replace(/,/g, ' ');
}

function formatMain(balls, middle) {
  return balls.join(middle);
}

export default class RENLIU extends Component {
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
      let betNum = balls[0].length;
      this.setState({ balls, betNum });
    });
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [[]];
    do {
      let ball = this.panel0.random(1, highlight);
      balls[0] = ball;
    } while (!Common.checkLimit(balls, true, this.props.limitInfoList, 1));
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.setState({ balls: [[]] });
  }

  generateBet(balls, manual = true) {
    let betNum = balls[0].length;
    return {
      betNum,
      manual,
      balls: formatBall(balls),
      content: formatMain(balls, ','),
      label: `任选一 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'renLiu'
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
        this.emptyTip.open().then(balls => {
          resolve({ balls, open: true, manual: false });
        });
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

    let amount = 5;
    let profit = amount - betNum * 2;
    if (ballNumber === 1) {
      amount = 5;
      profit = amount - betNum * 2;
    } else if (ballNumber === 2) {
      amount = 5 + '~' + 10;
      profit = 1 - betNum * 2 + '~' + (10 - betNum * 2);
    } else {
      amount = 5 + '~' + 15;
      profit = 5 - betNum * 2 + '~' + (15 - betNum * 2);
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
            betSize={ 1 }
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
                至少选择1个号码，选号与开奖任意1个号码相同即中<em
                  style={ { color: '#ff7a0d' } }
                >
                  5
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
