import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import queue from '../../../utils/update-queue';
import CALC from './bet.jsx';
import NumberHelper from '@/utils/number-helper.js';
import alert from '@/services/alert';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = range(0, 10);

function RandomBallsTips({ balls }) {
  return (
    <p className="balls">
      {balls.map((b, index) =>
        b.map((a, index) => (
          <span className="ball" key={ index }>
            {a}
          </span>
        ))
      )}
    </p>
  );
}
function formatBall(balls, middle) {
  return balls[0].sort().join(middle);
}

export default class QIANSANSELECT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[]],
      betNum: 0,
      profit: 0,
      bonus: 0
    };
    CALC(this);

    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      let bet = this.CALC({ betArr: balls, ind: 4, money: 320 });
      let betNum = bet.num;
      let profit = bet.profit;
      let bonus = bet.bonus;
      this.setState({ balls, betNum, profit, bonus });
    });
  }

  componentWillUnmount() {
    queue.unsubscribe();
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls;
    do {
      balls = [this.panel.random(2, highlight)];
    } while (!this.checkLimit(balls, this.props.limitInfoList, false));

    return balls;
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [[]] });
  }

  generateBet(balls, manual = true) {
    let betNum = this.CALC({ betArr: balls, ind: 4, money: 320 }).num;
    return {
      betNum,
      manual,
      balls: formatBall(balls, ' '),
      content: formatBall(balls, ','),
      label: `三星组三 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'renliu'
    };
  }

  editHandle(content) {
    let lists = content.split(',');
    let balls = [lists];

    let bet = this.CALC({ betArr: balls, ind: 4, money: 320 });
    let betNum = bet.num;
    let profit = bet.profit;
    let bonus = bet.bonus;
    this.setState({ balls, betNum, profit, bonus });
  }

  checkLimit(balls, limits, isAlert = true) {
    let flag = true;
    let limit = limits[0] || {};
    let limitContent = limit.limitContent || '';
    let limitArr = limitContent.split(',') || [];
    flag = NumberHelper.isContained(balls[0], limitArr);

    if (flag && isAlert) {
      alert.alert(
        <div>
          <p>您购买的号码中包含了限制的号码</p>
          <p>
            <em>{limitArr.toString().replace(/,/g, ' ')}</em>
          </p>
        </div>
      );
      return false;
    } else {
      return true;
    }
  }

  addNumber() {
    const { betNum, balls } = this.state;

    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (balls[0].length === 0) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>还差{2 - balls[0].length}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat();
                newBalls.map((item, index) => {
                  item.push(this.panel.random(1, false, item));
                });
              } while (!this.checkLimit(newBalls, this.props.limitInfoList));
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
        if (!this.checkLimit(this.state.balls, this.props.limitInfoList)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    let omit = this.props.omitData.baseOmit[0];
    let zx3 = omit.zx3 || [];
    const { betNum, balls, profit, bonus } = this.state;
    return (
      <div className="rener-page">
        <BallPanel
          balls={ ballRange }
          ref={ panel => (this.panel = panel) }
          onChange={ this.ballChangeHandle.bind(this) }
          data={ zx3 }
          dataType={ this.props.omitFlag }
          name={ this.props.lotteryChildCode }
          betSize={ 2 }
          index={ 0 }
          selected={ balls[0] }
          highlightMin={ this.props.omitQuery.omitTypes === 1 }
        />
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ balls[0].length === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>选2个号码，开奖号码后三位为组三号且包含选中即中320元</span>
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{balls[0].length}</em>个红球，共<em>{betNum}</em>注，共<em
              >
                {betNum * 2}
              </em>元
            </p>
            <p>
              若中奖，奖金<em style={ { color: '#FF7A0D' } }> {bonus} </em>元，
              盈利<em style={ { color: '#FF7A0D' } }> {profit} </em>元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          template={ RandomBallsTips }
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
        />
      </div>
    );
  }
}
