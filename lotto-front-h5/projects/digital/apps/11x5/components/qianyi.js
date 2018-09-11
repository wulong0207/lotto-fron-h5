import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import Common from './common.js';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = range(1, 12).map(i => `0${i}`.slice(-2));

export default class QIANYI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0
    };
  }

  ballChangeHandle(balls) {
    let betNum = balls.length;
    this.setState({ betNum, balls });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      balls = this.panel.random(1, highlight);
    } while (!Common.checkLimit(balls, false, this.props.limitInfoList, 1));

    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true) {
    let betNum = balls.length;
    return {
      betNum,
      manual,
      balls: Common.formatBall(balls),
      content: Common.formatContent(balls),
      label: `前一普通投注 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'qianyiSelect'
    };
  }

  editHandle(content) {
    let balls = content.split(',').map(b => b);
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
                <p>还差{1 - ballNumber}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat(
                  this.panel.random(1 - ballNumber)
                );
              } while (
                !Common.checkLimit(newBalls, false, this.props.limitInfoList, 1)
              );
              resolve({
                balls: this.state.balls.concat(newBalls),
                open: true,
                manual: false
              });
              this.clear();
            });
        }
      } else {
        if (
          !Common.checkLimit(
            this.state.balls,
            false,
            this.props.limitInfoList,
            1
          )
        ) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    let data = [];
    const datas = this.props.omitData.baseOmit[0];
    for (let item in datas) {
      if (item.charAt(0) === 'b') {
        data.push(datas[item]);
      }
    }
    const amount = 13;
    const { betNum, balls } = this.state;
    const ballNumber = balls.length;
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="rener-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ data }
          dataType={ this.props.omitFlag }
          name={ this.props.lotteryChildCode }
          betSize={ 1 }
          selected={ this.state.balls }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>
                11个号码中任选5个号码。1/11的中奖机会,奖金<em>13</em>元！
              </span>
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
              若中奖，奖金<em style={ { color: '#FF7A0D' } }>
                {' '}
                {betNum ? amount : 0}{' '}
              </em>元， {profit < 0 ? '亏损' : '盈利'}
              <em style={ { color: '#FF7A0D' } }> {profit} </em>元
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
