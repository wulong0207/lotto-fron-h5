/*
 包号
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getCombinationBetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import RandomNumber from '../../../components/random-number';

function getContentType(betNum, fixedBalls = []) {
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}

function formatContent(balls, fixedBalls, middle) {
  if (!fixedBalls || !fixedBalls.length) {
    return balls.join(middle);
  }
  return `${fixedBalls.join(middle)}#${balls.join(middle)}`;
}

const ballRange = range(1, 31).map(i => `0${i}`.slice(-2));

export default class BH6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls = [], fixedBalls = []) {
    const betNum = getCombinationBetNum(balls, 7);
    this.setState({ betNum, balls, fixedBalls });
  }

  ballRandom(highlight = false, size = 7) {
    return this.panel.random(size, highlight);
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    const betNum = getCombinationBetNum(balls, 7);
    return {
      betNum,
      manual,
      balls: formatContent(balls, fixedBalls, ' '),
      content: formatContent(balls, fixedBalls, ','),
      label: `普通投注 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, fixedBalls),
      page: 'bh'
    };
  }

  editHandle(content) {
    const balls = content.split(',').map(b => `0${b}`.slice(-2));
    this.ballChangeHandle(balls);
  }

  addNumber() {
    const { betNum } = this.state;
    const ballNumber = this.state.balls.length;
    return new Promise((resolve, reject) => {
      /* if (!betNum) {
        console.log('fbshfdhs')
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false })
          })
        } else {
          console.log('njsddsb')
          confirm.confirm({
            children: (
              <div>
                <p>您已选择了{ ballNumber }个号码</p>
                <p>至少选择7个号码才能组成一注</p>
              </div>
            ),
            btnTxt: ['自己选', '帮我选'],
            btnFn: [
              () => false,
              () => {
                const balls = this.panel.random(7 - ballNumber);
                const newBalls = this.state.balls.concat(balls);
                this.clear();
                resolve({ balls: newBalls, open: true, manual: false });
              }
            ]
          })
        }
      } else {
        this.clear();
        resolve({ balls: this.state.balls, manual: true });
      } */
      if (!betNum) {
        if (!ballNumber) {
          this.emptyTip.open().then(balls => {
            resolve({ balls: balls.sort(), open: true, manual: false });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>您已选择了{ballNumber}个号码</p>
                <p>至少选择7个号码才能组成一注</p>
              </div>,
              '帮我选',
              '自己选'
            )
            .then(() => {
              const balls = this.panel.completion(7 - ballNumber);
              // const balls = balls.sort();
              const newBalls = this.state.balls.concat(balls).sort();
              resolve({ balls: newBalls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        resolve({ balls: this.state.balls.sort(), manual: true });
        this.clear();
      }
    });
  }

  render() {
    const data = this.props.omitData;
    const amount = 500;
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    return (
      <div className="bh-page">
        <div className="ball-panel">
          <BallPanel
            balls={ ballRange }
            ref={ panel => (this.panel = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data }
            dataType={ this.props.omitFlag }
            name={ 1010101 }
            betSize={ 7 }
            rowLength={ 7 }
            random={ false }
            selected={ this.state.balls }
          />
          <RandomNumber
            onRandom={ size => this.ballRandom(true, size) }
            range={ range(7, 16) }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选择7个号码组合成一注彩票，单注最高奖金<em>{amount}</em>万元!
            </p>
          }
        >
          <div className="profit-info">
            <p>
              <span>
                已选<em>{ballNumber}</em>个号码
              </span>
              <span>
                ，共<em>{betNum}</em>注，共<em>{betNum * 2}</em>元
              </span>
            </p>
            {/* <p>若中奖，奖金{ betNum ? amount : 0 }元，{ profit < 0 ? '亏损' : '盈利' }{ Math.abs(profit) }元</p> */}
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
