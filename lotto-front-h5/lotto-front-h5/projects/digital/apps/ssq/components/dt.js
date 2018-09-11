import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import message from '@/services/message';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import queue from '../../../utils/update-queue';
import RandomNumber from '../../../components/random-number';
import Bet from '@/bet/bet.js';

function getContentType(betNum, fixedBalls = []) {
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}
function formatContent(balls, fixedBalls, middle) {
  if (fixedBalls.length) {
    return (
      fixedBalls.sort().join(middle) +
      '#' +
      balls[0].sort().join(middle) +
      '|' +
      balls[1].sort().join(middle)
    );
  } else {
    return balls[0].sort().join(middle) + '|' + balls[1].sort().join(middle);
  }
}
function formatBall(balls, fixedBalls) {
  if (fixedBalls.length) {
    return [
      {
        ball: fixedBalls.sort().join(' ') + '#' + balls[0].sort().join(' '),
        color: '#ED1C24'
      },
      { ball: balls[1].sort().join(' '), color: '#1e88d2' }
    ];
  } else {
    return [
      { ball: balls[0].sort().join(' '), color: '#ED1C24' },
      { ball: balls[1].sort().join(' '), color: '#1e88d2' }
    ];
  }
}
function Balls({ balls }) {
  return (
    <div className="balls active">
      {balls.map((ball, ind) => {
        return ball.map((b, index) => {
          if (ind === 0) {
            return (
              <span className="ball" key={ index }>
                {b}
              </span>
            );
          } else {
            return (
              <span
                className="ball"
                key={ index }
                style={ { backgroundColor: '#1e88d2' } }
              >
                {b}
              </span>
            );
          }
        });
      })}
    </div>
  );
}

export default class DT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], []],
      betNum: 0,
      fixedBalls: []
    };
    this.betCal = new Bet('DoubleBall'); // 计算算法

    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      let fixedBalls = this.state.fixedBalls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
        if (d.index === 0) fixedBalls = d.fixedBalls;
      });
      let betNum = this.betCal.calc({
        redBall: balls[0].concat(fixedBalls),
        bravery: fixedBalls,
        braveryBlue: [],
        blueBall: balls[1]
      });
      betNum = parseInt(betNum) ? parseInt(betNum) : 0;
      if (fixedBalls.length < 1) {
        betNum = 0;
      }
      this.setState({ balls, betNum, fixedBalls });
    });
  }

  componentWillUnmount() {
    queue.unsubscribe();
  }

  ballChangeHandle(balls, fixedBalls, index) {
    queue.dispatch({ index, balls, fixedBalls });
  }

  redBallRandom(highlight = false, size = 6) {
    return this.panel0.random(size, highlight);
  }
  blueBallRandom(highlight = false, size = 1) {
    return this.panel1.random(size, highlight);
  }
  ballRandom(highlight = false) {
    let redBall = this.redBallRandom(highlight).sort();
    let blueBall = this.blueBallRandom(highlight);
    let balls = [];
    balls.push(redBall);
    balls.push(blueBall);
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], []] });
  }

  editHandle(content) {
    const balls = content.split('|');
    const redBall = balls[0].split('#')[1].split(',');
    const blueBall = balls[1].split(',');
    const dan = balls[0].split('#')[0].split(',');
    const calcArr = redBall.concat(dan);

    let betNum = this.betCal.calc({
      redBall: calcArr,
      bravery: dan,
      braveryBlue: [],
      blueBall: blueBall
    });

    this.setState({ balls: [redBall, blueBall], betNum, fixedBalls: dan });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    let ball = balls[0].concat(fixedBalls);
    let betNum = this.betCal.calc({
      redBall: ball,
      bravery: fixedBalls,
      braveryBlue: [],
      blueBall: balls[1]
    });
    betNum = parseInt(betNum) ? parseInt(betNum) : 0;
    return {
      betNum,
      manual,
      balls: formatBall(balls, fixedBalls, ' '),
      content: formatContent(balls, fixedBalls, ','),
      label: `${fixedBalls.length ? '胆拖' : '普通'}投注 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, fixedBalls),
      page: 'dt'
    };
  }

  addNumber() {
    const { balls, betNum, fixedBalls } = this.state;
    const redNum = this.state.balls[0].length;
    const blueNum = this.state.balls[1].length;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!fixedBalls.length) {
          message.alert({
            title: '提示',
            btnTxt: ['确认'], // 可不传，默认是确定
            children: <span>请至少选择一个红球胆码</span>
          });
        } else {
          let content = '';
          if (6 - redNum - fixedBalls.length > 0 && !blueNum) {
            content = `还差${6 - redNum - fixedBalls.length}个红球和${1 -
              blueNum}个篮球`;
          } else if (6 - redNum - fixedBalls.length > 0) {
            content = `还差${6 - redNum - fixedBalls.length}个红球`;
          } else {
            content = `还差${1 - blueNum}个篮球`;
          }
          confirm
            .confirm(
              <div>
                <p>{content}</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              const balls = this.state.balls.concat();
              for (let i = 0; i < balls.length; i++) {
                if (i === 0) {
                  if (6 - balls[i].length - fixedBalls.length > 0) {
                    balls[i] = balls[i]
                      .concat(
                        this['panel' + i].completion(
                          6 - balls[i].length - fixedBalls.length
                        )
                      )
                      .sort();
                  }
                } else {
                  if (!balls[i].length) {
                    balls[i] = this['panel' + i].random();
                  }
                }
              }
              resolve({
                balls,
                open: true,
                manual: false,
                fixedBalls: fixedBalls
              });
              this.clear();
            });
        }
      } else {
        resolve({
          balls: this.state.balls,
          manual: true,
          fixedBalls: fixedBalls
        });
        this.clear();
      }
    });
  }

  render() {
    const data = this.props.omitData;
    const omitFlag = this.props.omitFlag;
    const amount = 100010;
    const numberRangeRed = range(1, 34).map(i => `0${i}`.slice(-2));
    const numberRangeBlue = range(1, 17).map(i => `0${i}`.slice(-2));
    const { betNum, balls, fixedBalls } = this.state;
    const redBallNumber = balls[0].length;
    const blueBallNumber = balls[1].length;

    let redOmit = [];
    let blueOmit = [];
    let redOmits = [];
    let blueOmits = [];
    let omit;
    for (let item in data) {
      if (item.charAt(0) === 'b') {
        omit = data[item];
        if (omitFlag === 3) {
          omit = (omit / 100).toFixed(2);
        }
        blueOmit.push(omit);
      } else if (item.charAt(0) === 'r') {
        omit = data[item];
        if (omitFlag === 3) {
          omit = (omit / 100).toFixed(2);
        }
        redOmit.push(omit);
      }
    }
    let redOmitArr = redOmit.concat().sort((a, b) => {
      return b - a;
    });
    let blueOmitArr = blueOmit.concat().sort((a, b) => {
      return b - a;
    });
    let redMaxOmit = redOmitArr[7];
    let blueMaxOmit = blueOmitArr[2];
    let redMinOmit = redOmit.concat().sort((a, b) => {
      return a - b;
    })[7];
    let blueMinOmit = blueOmit.concat().sort((a, b) => {
      return a - b;
    })[0];
    redOmit.map((key, index) => {
      if (key >= redMaxOmit) {
        key = { label: key, color: '#ed1c24' };
      }

      if (omitFlag === 2) {
        if (key <= redMinOmit) {
          key = { label: key, color: '#1e88d2' };
        }
      }
      redOmits.push(key);
    });
    blueOmit.map((k, index) => {
      if (k >= blueMaxOmit) {
        k = { label: k, color: '#ed1c24' };
      }
      if (omitFlag === 2) {
        if (k <= blueMinOmit) {
          k = { label: k, color: '#1e88d2' };
        }
      }
      blueOmits.push(k);
    });
    return (
      <div className="dt-page">
        <div className="number-panel-box">
          <BallPanel
            balls={ numberRangeRed }
            ref={ panel => (this.panel0 = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ redOmits }
            dataType={ this.props.omitFlag }
            name={ 1000103 }
            selected={ this.state.balls[0] }
            rowLength={ 7 }
            betSize={ 6 }
            fixed={ true }
            index={ 0 }
            random={ false }
            fixedBalls={ this.state.fixedBalls }
          />
          <RandomNumber
            onRandom={ size => this.redBallRandom(true, size) }
            range={ range(6, 22) }
          />
        </div>
        <div className="number-panel-box" style={ { borderBottom: 'none' } }>
          <BallPanel
            balls={ numberRangeBlue }
            onChange={ this.ballChangeHandle.bind(this) }
            ref={ panel => (this.panel1 = panel) }
            data={ blueOmits }
            dataType={ this.props.omitFlag }
            selected={ this.state.balls[1] }
            name={ 1000104 }
            index={ 1 }
            random={ false }
            color="#1e88d2"
          />
          <RandomNumber
            onRandom={ size => this.blueBallRandom(true, size) }
            range={ range(1, 17) }
            color="#1e88d2"
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ redBallNumber === 0 && blueBallNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              胆码_点两次可选择胆球 至少选择<em>1</em>个最多选<em>5</em>个篮球
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{fixedBalls.length}</em>个胆码，<em>{redBallNumber}</em>个拖码，<em style={ { color: '#1e88d2' } }>{blueBallNumber}</em>个蓝球，共<em>{betNum}</em>注，共<em>{betNum * 2}</em>元
            </p>
          </div>
        </BetInfo>
      </div>
    );
  }
}
