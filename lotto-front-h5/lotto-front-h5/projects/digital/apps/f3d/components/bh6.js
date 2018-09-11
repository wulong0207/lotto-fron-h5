/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getC6BetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';

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

const ballRange = range(0, 10);

export default class BH6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      fixedBalls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls = [], fixedBalls = []) {
    const betNum = getC6BetNum(balls, fixedBalls);
    this.setState({ betNum, balls, fixedBalls });
  }

  ballRandom(highlight = false) {
    return this.panel.random(3, highlight);
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    const betNum = getC6BetNum(balls, fixedBalls);
    return {
      betNum,
      manual,
      balls: formatContent(
        balls.sort((a, b) => parseInt(a) - parseInt(b)),
        fixedBalls.sort((a, b) => parseInt(a) - parseInt(b)),
        ' '
      ),
      content: formatContent(balls, fixedBalls, ','),
      label: `组六包号 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, fixedBalls),
      page: 'bh6'
    };
  }

  editHandle(content) {
    const balls = content.split(',').map(b => parseInt(b));
    this.ballChangeHandle(balls);
  }

  addNumber() {
    const { betNum } = this.state;
    const ballNumber = this.state.balls.length + this.state.fixedBalls.length;
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
                <p>您已选择了{ballNumber}个号码</p>
                <p>至少选择3个号码才能组成一注</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              const balls = this.panel.completion(3 - ballNumber);
              resolve({
                balls: this.state.balls.concat(balls),
                open: true,
                manual: false,
                fixedBalls: this.state.fixedBalls
              });
              this.clear();
            });
        }
      } else {
        resolve({
          balls: this.state.balls,
          fixedBalls: this.state.fixedBalls,
          manual: true
        });
        this.clear();
      }
    });
  }

  render() {
    const data = this.props.omitData;
    const amount = 173;
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="bh6-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ data }
          dataType={ this.props.omitFlag }
          name={ 1050330 }
          betSize={ 3 }
          selected={ this.state.balls }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选择3个号码，开奖号码为组六且相同即中<em>{amount}</em>元！
            </p>
          }
        >
          <div className="profit-info">
            <p>
              {this.state.fixedBalls.length ? (
                <span>
                  已选<em>{this.state.fixedBalls.length}</em>个胆码，{' '}
                  <em>{ballNumber}</em>个拖码
                </span>
              ) : (
                <span>
                  已选<em>{ballNumber}</em>个号码
                </span>
              )}
              <span>
                ，共<em>{betNum}</em>注，共<em>{betNum * 2}</em>元
              </span>
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
        />
      </div>
    );
  }
}
