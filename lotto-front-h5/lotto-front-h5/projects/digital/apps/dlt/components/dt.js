import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import message from '@/services/message';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import queue from '../../../utils/update-queue';
import Bet from '@/bet/bet.js';

function getContentType(betNum, fixedBalls = []) {
  if (fixedBalls[0].length || fixedBalls[1].length) return 3;
  return betNum > 1 ? 2 : 1;
}
function formatContent(balls, fixedBalls, middle) {
  if (fixedBalls[1].length) {
    return (
      fixedBalls[0].sort().join(middle) +
      '#' +
      balls[0].sort().join(middle) +
      '|' +
      fixedBalls[1].sort().join(middle) +
      '#' +
      balls[1].sort().join(middle)
    );
  } else if (fixedBalls[0].length) {
    return (
      fixedBalls[0].sort().join(middle) +
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
  if (fixedBalls[1].length) {
    return [
      {
        ball: fixedBalls[0].sort().join(' ') + '#' + balls[0].sort().join(' '),
        color: '#ED1C24'
      },
      {
        ball: fixedBalls[1].sort().join(' ') + '#' + balls[1].sort().join(' '),
        color: '#1e88d2'
      }
    ];
  } else if (fixedBalls[0].length) {
    return [
      {
        ball: fixedBalls[0].sort().join(' ') + '#' + balls[0].sort().join(' '),
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
      fixedBalls: [[], []]
    };
    this.betCal = new Bet('BigLotto'); // 计算算法

    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      let fixedBalls = this.state.fixedBalls.concat();
      const newBalls = balls.filter(b => balls.indexOf(b) < 0);
      data.forEach(d => {
        balls[d.index] = d.balls;
        if (d.index === 0) fixedBalls[0] = d.fixedBalls;
        if (d.index === 1) fixedBalls[1] = d.fixedBalls;
      });

      let betNum = this.betCal.calc({
        redBall: balls[0].concat(fixedBalls[0]),
        bravery: fixedBalls[0],
        braveryBlue: fixedBalls[1],
        blueBall: balls[1].concat(fixedBalls[1])
      });
      betNum = parseInt(betNum) ? parseInt(betNum) : 0;
      if (fixedBalls[0].length < 1) {
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

  redBallRandom(highlight = false, size = 5) {
    return this.panel0.random(size, highlight);
  }
  blueBallRandom(highlight = false, size = 2) {
    return this.panel1.random(size, highlight);
  }
  Random_yizhu() {
    let redBall = this.redBallRandom().sort();
    let blueBall = this.blueBallRandom();
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
    const redDan = balls[0].split('#')[0].split(',');
    let blueBall = [];
    let blueDan = [];
    if (balls[1].indexOf('#') > 0) {
      blueBall = balls[1].split('#')[1].split(',');
      blueDan = balls[1].split('#')[0].split(',');
    } else {
      blueBall = balls[1].split(',');
    }

    let betNum = this.betCal.calc({
      redBall: redBall.concat(redDan),
      bravery: redDan,
      braveryBlue: blueDan,
      blueBall: blueBall.concat(blueDan)
    });

    this.setState({
      balls: [redBall, blueBall],
      betNum,
      fixedBalls: [redDan, blueDan]
    });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    let ball = balls[0].concat(fixedBalls[0]);
    let betNum = this.betCal.calc({
      redBall: balls[0].concat(fixedBalls[0]),
      bravery: fixedBalls[0],
      braveryBlue: fixedBalls[1],
      blueBall: balls[1].concat(fixedBalls[1])
    });
    betNum = parseInt(betNum) ? parseInt(betNum) : 0;
    return {
      betNum,
      manual,
      balls: formatBall(balls, fixedBalls, ' '),
      content: formatContent(balls, fixedBalls, ','),
      label: `${
        fixedBalls[0].length || fixedBalls[1].length ? '胆拖' : '普通'
      }投注 ${betNum}注`,
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
        if (!fixedBalls[0].length) {
          message.alert({
            title: '提示',
            btnTxt: ['确认'], // 可不传，默认是确定
            children: <span>请至少选择一个红球胆码</span>
          });
        } else {
          let content = '';
          let redBallsCount = 5 - redNum - fixedBalls[0].length;
          let blueBallsCount = 2 - blueNum - fixedBalls[1].length;

          if (redBallsCount > 0 && blueBallsCount > 0) {
            content = `还差${redBallsCount}个红球和${blueBallsCount}个篮球`;
          } else if (redBallsCount > 0) {
            content = `还差${redBallsCount}个红球`;
          } else {
            content = `还差${blueBallsCount}个篮球`;
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
                  if (5 - balls[i].length - fixedBalls[0].length > 0) {
                    balls[i] = balls[i]
                      .concat(
                        this['panel' + i].completion(
                          5 - balls[i].length - fixedBalls[0].length
                        )
                      )
                      .sort();
                  }
                } else {
                  if (balls[i].length < 2) {
                    balls[i] = balls[i]
                      .concat(
                        this['panel' + i].completion(
                          2 - balls[i].length - fixedBalls[1].length
                        )
                      )
                      .sort();
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
    const numberRangeRed = range(1, 36).map(i => `0${i}`.slice(-2));
    const numberRangeBlue = range(1, 13).map(i => `0${i}`.slice(-2));
    const { betNum, balls, fixedBalls } = this.state;
    const redBallNumber = this.state.balls[0].length;
    const blueBallNumber = this.state.balls[1].length;
    const profit = betNum ? amount - betNum * 2 : 0;
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
            name={ 1000203 }
            selected={ this.state.balls[0] }
            rowLength={ 7 }
            betSize={ 5 }
            fixed={ true }
            index={ 0 }
            random={ false }
            fixedBalls={ this.state.fixedBalls[0] }
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
            name={ 1000204 }
            index={ 1 }
            betSize={ 2 }
            fixed={ true }
            random={ false }
            color="#1e88d2"
            fixedBalls={ this.state.fixedBalls[1] }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={
            redBallNumber === 0 &&
            blueBallNumber === 0 &&
            fixedBalls[0].length === 0 &&
            fixedBalls[1].length === 0
          }
          emptyNode={
            <p className="empty-tip">
              胆码_点两次可选择胆球 红胆选择1至4个,蓝胆至多选1个
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{fixedBalls[0].length}</em>个红胆码,<em>
                {redBallNumber}
              </em>个红拖码,<em style={ { color: '#1e88d2' } }>
                {fixedBalls[1].length}
              </em>个蓝胆码,<em style={ { color: '#1e88d2' } }>
                {blueBallNumber}
              </em>蓝拖码<br />共<em>{betNum}</em>注，共<em>{betNum * 2}</em>元
            </p>
          </div>
        </BetInfo>
      </div>
    );
  }
}
