import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import Bet from '@/bet/bet.js';
import Common from './common.js';

function getContentType(betNum, fixedBalls = []) {
  if (fixedBalls.length) return 3;
  return betNum > 1 ? 2 : 1;
}

const ballRange = range(1, 12).map(i => `0${i}`.slice(-2));

export default class RENBA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      betNum: 0,
      fixedBalls: [],
      maxBonus: 0,
      minBonus: 0,
      maxProfit: 0,
      minProfit: 0
    };

    this.betCal = new Bet('ElevenChoseFive'); // 11选5计算算法
  }

  ballChangeHandle(balls, fixedBalls) {
    let result = this.betCal.calc({
      bets: balls.concat(fixedBalls),
      bravery: fixedBalls,
      price: 2,
      option: 8,
      type: 0,
      bonus: 9
    });
    let bets = result.bets || [];
    let betNum = bets.length;
    let maxBonus = 0;
    let minBonus = 0;
    let maxProfit = 0;
    let minProfit = 0;
    if (betNum) {
      maxBonus = result.maxBonus;
      minBonus = result.minBonus;
      maxProfit = result.maxProfit;
      minProfit = result.minProfit;
    }
    this.setState({
      betNum,
      fixedBalls,
      balls,
      maxBonus,
      minBonus,
      maxProfit,
      minProfit
    });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      balls = this.panel.random(8, highlight);
    } while (!Common.checkLimit(balls, false, this.props.limitInfoList, 8));

    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    let result = this.betCal.calc({
      bets: balls.concat(fixedBalls),
      bravery: fixedBalls,
      price: 2,
      option: 8,
      type: 0,
      bonus: 9
    });
    let bets = result.bets || [];
    let betNum = bets.length;
    return {
      betNum,
      manual,
      balls: Common.formatBall(balls, fixedBalls),
      content: Common.formatContent(balls, fixedBalls),
      label: `任八${fixedBalls.length ? '胆拖' : '普通'}投注 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, fixedBalls),
      page: 'renba'
    };
  }

  editHandle(content) {
    let balls = [];
    let fixedBalls = [];
    if (content.indexOf('#') > 0) {
      balls = content
        .split('#')[1]
        .split(',')
        .map(b => b);
      fixedBalls = content
        .split('#')[0]
        .split(',')
        .map(b => b);
    } else {
      balls = content.split(',').map(b => b);
    }
    this.ballChangeHandle(balls, fixedBalls);
  }

  addNumber() {
    const { betNum } = this.state;
    const ballNumber = this.state.balls.length;
    let balls = this.state.balls
      .concat(this.state.fixedBalls)
      .sort((a, b) => a - b);
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber && !this.state.fixedBalls.length) {
          this.emptyTip.open().then(balls => {
            resolve({
              balls,
              open: true,
              manual: false,
              fixedBalls: this.state.fixedBalls
            });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>还差{8 - ballNumber - this.state.fixedBalls.length}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat(
                  this.panel.completion(
                    8 - ballNumber - this.state.fixedBalls.length
                  )
                );
              } while (
                !Common.checkLimit(
                  newBalls.concat(this.state.fixedBalls).sort((a, b) => a - b),
                  false,
                  this.props.limitInfoList,
                  8
                )
              );
              resolve({
                balls: newBalls,
                open: true,
                manual: false,
                fixedBalls: this.state.fixedBalls
              });
              this.clear();
            });
        }
      } else {
        if (!Common.checkLimit(balls, false, this.props.limitInfoList, 8)) {
          return reject(new Error('限号限制'));
        }
        resolve({
          balls: this.state.balls,
          manual: true,
          fixedBalls: this.state.fixedBalls
        });
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
    const {
      betNum,
      balls,
      fixedBalls,
      maxBonus,
      minBonus,
      maxProfit,
      minProfit
    } = this.state;
    const amount =
      maxBonus === minBonus ? maxBonus : minBonus + ' ~ ' + maxBonus;
    const ballNumber = balls.length;
    const profit =
      maxProfit === minProfit ? maxProfit : minProfit + ' ~ ' + maxProfit;
    return (
      <div className="rener-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ data }
          dataType={ this.props.omitFlag }
          name={ this.props.lotteryChildCode }
          betSize={ 8 }
          selected={ this.state.balls }
          fixed={ true }
          fixedBalls={ this.state.fixedBalls }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 && fixedBalls.length === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>
                从11个号码中任选5个号码。1/8.25的中奖机会,奖金<em>9</em>元！
              </span>
              <span>点两次可设胆 [胆码至少选1个，最多7个]</span>
            </p>
          }
        >
          <div className="profit-info">
            {fixedBalls.length ? (
              <p>
                已选<em>{fixedBalls.length}</em>个胆码，<em>{ballNumber}</em>个拖码，共<em
                >
                  {betNum}
                </em>注，共<em>{betNum * 2}</em>元
              </p>
            ) : (
              <p>
                已选<em>{ballNumber}</em>个号码，共<em>{betNum}</em>注，共<em>
                  {betNum * 2}
                </em>元
              </p>
            )}
            <p>
              若中奖，奖金<em style={ { color: '#FF7A0D' } }>
                {' '}
                {betNum ? amount : 0}{' '}
              </em>元， {maxProfit < 0 ? '亏损' : '盈利'}
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
