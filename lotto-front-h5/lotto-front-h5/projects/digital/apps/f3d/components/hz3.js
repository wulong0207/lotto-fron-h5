/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import { getS3BetNum } from '../../../utils/bet-number';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';

const ballRange = range(1, 27);

export default class HZ3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls) {
    const betNum = getS3BetNum(balls);
    this.setState({ betNum, balls: balls });
  }

  ballRandom(highlight = false) {
    return this.panel.random(1, highlight);
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true) {
    return balls.map(ball => {
      const betNum = getS3BetNum([ball]);
      return {
        betNum,
        manual,
        balls: ball,
        content: ball,
        label: `组三和值 ${betNum}注`,
        lotteryChildCode: this.props.lotteryChildCode,
        contentType: 6,
        page: 'hz3'
      };
    });
  }

  editHandle(content) {
    const balls = content.split(',').map(b => parseInt(b));
    this.ballChangeHandle(balls);
  }

  addNumber() {
    const { betNum } = this.state;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        this.emptyTip.open().then(balls => {
          resolve({ balls, open: true, manual: false });
        });
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
      <div className="hz3-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ data }
          dataType={ this.props.omitFlag }
          selected={ this.state.balls }
          name={ 1050220 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              选择一个和值，与开奖号和值相同且为组三即中<em>{amount}</em>元！
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
