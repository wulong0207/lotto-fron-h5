/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getC3BetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = range(0, 10);

export default class BH3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls) {
    const betNum = getC3BetNum(balls);
    this.setState({ betNum, balls: balls });
  }

  ballRandom(highlight = false) {
    return this.panel.random(2, highlight);
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true) {
    const betNum = getC3BetNum(balls);
    return {
      betNum,
      manual,
      balls: balls.sort((a, b) => parseInt(a) - parseInt(b)).join(' '),
      content: balls.join(','),
      label: `组三包号 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'bh3'
    };
  }

  editHandle(content) {
    const balls = content.split(',').map(b => parseInt(b));
    this.ballChangeHandle(balls);
  }

  addNumber() {
    const { betNum } = this.state;
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
                <p>您已选择了{ballNumber}个号码</p>
                <p>至少选择2个号码才能组成一注</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              const balls = this.panel.completion(2 - ballNumber);
              resolve({
                balls: this.state.balls.concat(balls),
                open: true,
                manual: false
              });
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
    const data = this.props.omitData;
    const amount = 346;
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="bh3-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ data }
          highlightMin={ this.props.omitFlag !== 1 }
          name={ 1040230 }
          betSize={ 2 }
          selected={ this.state.balls }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选择2个号码，开奖号码为组三号且相同即中<em>{amount}</em>元！
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
        />
      </div>
    );
  }
}
