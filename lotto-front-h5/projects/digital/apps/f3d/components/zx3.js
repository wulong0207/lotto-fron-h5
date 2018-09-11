/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getD3BetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import alert from '@/services/alert';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import queue from '../../../utils/update-queue';

function randomHandle(random) {
  let betNum;
  let balls = [];
  do {
    balls = random();
    betNum = getD3BetNum(balls);
  } while (betNum === 0);
  return balls;
}

function getContentType(betNum, balls) {
  const ballLength = getBallsLength(balls);
  if (betNum === 1 && ballLength > 3) return 2;
  return betNum > 1 ? 2 : 1;
}

function formatContent(balls, middle) {
  return balls
    .map(
      ball =>
        typeof ball === 'string' && ball.length === 2 ? ball.slice(1) : ball
    )
    .join(middle);
}

function recoveryFromContent(content) {
  return content.split('|').map((c, index) => {
    if (index === 0) return c.split(',').map(i => `${i}${i}`);
    return c.split(',').map(i => parseInt(i));
  });
}

const ballRange0 = range(0, 10).map(i => `${i}${i}`);
const ballRange1 = range(0, 10);

function getBallsLength(balls) {
  return balls.reduce((acc, n) => acc + getBallLength(n), 0);
}

function getBallLength(ball) {
  return ball.reduce((acc, b) => {
    if (typeof b === 'string') return acc + b.length;
    return acc + 1;
  }, 0);
}

function Balls({ balls }) {
  return (
    <div className="balls active">
      {balls.map(ball => {
        return ball.map((b, index) => {
          if (typeof b === 'string' && b.length === 2) {
            return b.split('').map((i, idx) => (
              <span className="ball" key={ idx }>
                {i}
              </span>
            ));
          } else {
            return (
              <span className="ball" key={ index }>
                {b}
              </span>
            );
          }
        });
      })}
    </div>
  );
}

export default class ZX3 extends Component {
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
      const betNum = getD3BetNum(balls);
      this.setState({ balls, betNum });
    });
  }

  componentWillUnmount() {
    queue.unsubscribe();
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
    // let newBalls = this.state.balls.concat();
    // newBalls[index] = balls;
    // const betNum = getD3BetNum(newBalls);
    // this.setState({betNum, balls: newBalls});
  }

  ballRandom(highlight = false) {
    const balls = [];
    const first = this.panel0.random(1, highlight);
    const firstBallNumber = parseInt(first[0].split('')[0]);
    let second;
    do {
      second = this.panel1.random(1, highlight);
    } while (second[0] === firstBallNumber);
    return balls.concat([first, second]);
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], []] });
  }

  generateBet(balls, manual = true) {
    const betNum = getD3BetNum(balls);
    return {
      betNum,
      manual,
      balls: balls
        .map(ball =>
          formatContent(ball.sort((a, b) => parseInt(a) - parseInt(b)), ' ')
        )
        .join(' | '),
      content: balls.map(b => formatContent(b, ',')).join('|'),
      label: `组三直选 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, balls),
      page: 'zx3'
    };
  }

  editHandle(content) {
    const balls = recoveryFromContent(content);
    for (let i = 0; i < balls.length; i++) {
      setTimeout(() => this.ballChangeHandle(balls[i], [], i), i * 50);
    }
  }

  addNumber() {
    const { balls, betNum } = this.state;
    const ballNumber = getBallsLength(balls);
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (ballNumber === 3) {
          alert.alert('组三直选需要满足一注才能购买');
          return reject();
        }
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm('各位至少选择一个号码才能组成一注', '帮我补足', '自己选')
            .then(() => {
              const balls = randomHandle(() => {
                let newBalls = this.state.balls.concat();
                for (let i = 0; i < newBalls.length; i++) {
                  if (!newBalls[i].length) {
                    newBalls[i] = this['panel' + i].random();
                  }
                }
                return newBalls;
              });
              resolve({ balls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    const amount = 346;
    const { betNum, balls } = this.state;
    const ballNumber = balls.reduce((acc, ball) => acc + ball.length, 0);
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="zx3-page">
        <div className="number-panel-box">
          <BallPanel
            balls={ ballRange0 }
            title="对子"
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            name={ 1050210 }
            index={ 0 }
            randomLabel="一位"
            selected={ this.state.balls[0] }
          />
        </div>
        <div className="number-panel-box">
          <BallPanel
            balls={ ballRange1 }
            onChange={ this.ballChangeHandle.bind(this) }
            title="单号"
            ref={ panel => (this.panel1 = panel) }
            name={ 1050211 }
            index={ 1 }
            randomLabel="一位"
            selected={ this.state.balls[1] }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选择1个对子，1个单号，猜对开奖号即中<em>{amount}</em>元！
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
              若中奖，奖金{betNum ? amount : 0}元，{profit < 0
                ? '亏损'
                : '盈利'}
              {Math.abs(profit)}元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
          template={ Balls }
        />
      </div>
    );
  }
}
