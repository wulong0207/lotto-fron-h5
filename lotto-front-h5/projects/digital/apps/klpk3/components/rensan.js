import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import Common from './common.js';
import queue from '../../../utils/update-queue';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = [
  'A 2 3',
  '2 3 4',
  '3 4 5',
  '4 5 6',
  '5 6 7',
  '6 7 8',
  '7 8 9',
  '8 9 10',
  '9 10 J',
  '10 J Q',
  'J Q K',
  'Q K A'
];
const ballRange2 = ['顺子全包'];

function RandomBallsTips({ balls }) {
  return (
    <p className="balls">
      {' '}
      {balls.map((b, index) => b.map((v, ind) => formatContent(v)))}
    </p>
  );
}
function formatContent(val) {
  let message = '';
  if (val !== '顺子全包') {
    message = (
      <div>
        <span>顺子 {val.replace(/\s/g, '')}</span>
      </div>
    );
  } else {
    message = (
      <div>
        <span>{val}</span>
      </div>
    );
  }
  return message;
}
function formatBall(balls) {
  return (
    Common.ballsSort(balls[0])
      .toString()
      .replace(/,/g, ' ') +
    ' ' +
    balls[1]
      .sort()
      .toString()
      .replace(/\s/g, '')
      .replace(/,/g, ' ')
  );
}
function formatMain(balls, middle) {
  if (balls[1].length) {
    if (!balls[0].length) {
      return 'XYZ';
    }
    return (
      balls[0]
        .sort()
        .toString()
        .replace(/\s/g, '') +
      ',' +
      'XYZ'
    );
  }
  return balls[0]
    .sort()
    .toString()
    .replace(/\s/g, '');
}

export default class RENSAN extends Component {
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
      let betNum = balls[0].length + balls[1].length;
      this.setState({ balls, betNum });
    });
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [[], []];
    do {
      let random = parseInt(Math.random() * 14 + 1);
      let num = 0;
      if (random === 5) {
        num = 1;
      }
      let ball = this['panel' + num].random(1, highlight);
      balls[num] = ball;
    } while (!Common.checkLimit(balls, true, this.props.limitInfoList, 2));
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], []] });
  }

  generateBet(balls, manual = true) {
    let betNum = balls[0].length + balls[1].length;
    return {
      betNum,
      manual,
      balls: formatBall(balls),
      content: formatMain(balls),
      label: `顺子 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'rensan'
    };
  }

  editHandle(content) {
    let ball;
    let balls = [[], []];
    let num = [];
    let str = [];
    let c;
    if (content.indexOf('XYZ') > 0 || content === 'XYZ') {
      ball = content.split(',');
      ball.pop();
      balls[1].push('顺子全包');
      for (let i = 0; i < ball.length; i++) {
        c = ball[i];
        str = [];
        for (let j = 0; j < c.length; j++) {
          if (c[j] === '1') {
            str.push(c[j] + c[j + 1]);
            j++;
          } else {
            str.push(c[j]);
          }
        }
        balls[0].push(str.toString().replace(/,/g, ' '));
      }
      this.ballChangeHandle(balls[0], false, 0);
      this.ballChangeHandle(balls[1], false, 1);
    } else {
      ball = content.split(',');
      for (let i = 0; i < ball.length; i++) {
        c = ball[i];
        str = [];
        for (let j = 0; j < c.length; j++) {
          if (c[j] === '1') {
            str.push(c[j] + c[j + 1]);
            j++;
          } else {
            str.push(c[j]);
          }
        }
        balls[0].push(str.toString().replace(/,/g, ' '));
      }
      this.ballChangeHandle(balls[0], false, 0);
    }
  }

  addNumber() {
    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length + balls[1].length;
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
                <p>还差{2 - ballNumber}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat(
                  this.panel.completion(2 - ballNumber)
                );
              } while (
                !Common.checkLimit(newBalls, false, this.props.limitInfoList, 2)
              );
              resolve({ balls: newBalls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        if (!Common.checkLimit(balls, false, this.props.limitInfoList, 2)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    const datas = this.props.omitData.baseOmit[0];
    let omitData = datas.sz || [];
    let maxOmit = omitData.concat().sort(function(a, b) {
      return b - a;
    })[0];
    let omit,
      data = [];
    omitData.map((o, ind) => {
      if (o === maxOmit) {
        omit = {
          label: o,
          color: '#ed1c24'
        };
      } else {
        omit = {
          label: o,
          color: '#999'
        };
      }
      data.push(omit);
    });
    let data2 = [data.pop()] || [];

    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length + balls[1].length;

    let amount = 400;
    let profit = amount - betNum * 2;
    if (ballNumber === 13) {
      amount = 433;
      profit = amount - betNum * 2;
    } else if (
      balls[0].length > 0 &&
      balls[0].length < 12 &&
      balls[1].length > 0
    ) {
      amount = 33 + '~' + 433;
      profit = 33 - betNum * 2 + '~' + (433 - betNum * 2);
    } else if (balls[0].length === 0 && balls[1].length > 0) {
      amount = 33;
      profit = amount - betNum * 2;
    } else {
      amount = 400;
      profit = amount - betNum * 2;
    }
    return (
      <div className="rensan-page">
        <div className="number-panel-box top">
          <BallPanel
            title="单选"
            balls={ ballRange }
            ref={ panel0 => (this.panel0 = panel0) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '1' }
            betSize={ 1 }
            index={ 0 }
            selected={ balls[0] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
            rowLength={ 4 }
          />
        </div>
        <div className="number-panel-box top">
          <BallPanel
            title="包选"
            balls={ ballRange2 }
            ref={ panel1 => (this.panel1 = panel1) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data2 }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '2' }
            betSize={ 1 }
            index={ 1 }
            selected={ balls[1] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
            rowLength={ 4 }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>
                单选:对单个三连号投注，开奖号与选号相同即中<em
                  style={ { color: '#ff7a0d' } }
                >
                  400
                </em>元
              </span>
              <br />
              <span>
                包选:全包所有三连号投注，开奖号为三连号即中<em
                  style={ { color: '#ff7a0d' } }
                >
                  33
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
