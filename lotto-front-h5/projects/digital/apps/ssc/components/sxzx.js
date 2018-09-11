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
  return (
    balls[0].sort().join(middle) +
    '|' +
    balls[1].sort().join(middle) +
    '|' +
    balls[2].sort().join(middle)
  );
}

export default class QIANSANSELECT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], [], []],
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
      let bet = this.CALC({ betArr: balls, ind: 2, money: 1000 });
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
      let one = this.panel0.random(1, highlight);
      let two = this.panel1.random(1, highlight);
      let three = this.panel2.random(1, highlight);

      balls = [one, two, three];
    } while (!this.checkLimit(balls, this.props.limitInfoList, false));

    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.panel2.clear();
    this.setState({ balls: [[], [], []] });
  }

  generateBet(balls, manual = true) {
    let betNum = this.CALC({ betArr: balls, ind: 2, money: 1000 }).num;
    return {
      betNum,
      manual,
      balls: formatBall(balls, ' '),
      content: formatBall(balls, ','),
      label: `三星直选 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'rensi'
    };
  }

  editHandle(content) {
    let lists = content.split('|');
    let one = lists[0].split(',');
    let two = lists[1].split(',');
    let three = lists[2].split(',');
    let balls = [one, two, three];

    let bet = this.CALC({ betArr: balls, ind: 2, money: 1000 });
    let betNum = bet.num;
    let profit = bet.profit;
    let bonus = bet.bonus;
    this.setState({ balls, betNum, profit, bonus });
  }

  checkLimit(balls, limits, isAlert = true) {
    let flag = true;
    let limit = limits[0] || {};
    let limitContent = limit.limitContent || '';
    var limitArr = limitContent.split('|') || [];
    for (var i = 0; i < balls.length; i++) {
      flag = NumberHelper.isContained(balls[i], [limitArr[i]]);
      if (!flag) break;
    }

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
    const one = balls[0].length;
    const two = balls[1].length;
    const three = balls[2].length;

    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (one === 0 && two === 0 && three === 0) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>每位至少选择一个号码</p>
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
                  if (item.length < 1) {
                    newBalls[index] = this['panel' + index].random(1);
                  }
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
    let bw = omit.bw || [];
    let sw = omit.sw || [];
    let gw = omit.gw || [];
    const { betNum, balls, profit, bonus } = this.state;
    return (
      <div className="rener-page">
        <div className="number-panel-box top">
          <BallPanel
            title="百位"
            randomLabel="一位"
            balls={ ballRange }
            ref={ panel0 => (this.panel0 = panel0) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ bw }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '1' }
            betSize={ 1 }
            index={ 0 }
            selected={ this.state.balls[0] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
          />
        </div>
        <div
          className="number-panel-box top"
          style={ { borderTop: '1px solid #E6E6E6' } }
        >
          <BallPanel
            title="十位"
            randomLabel="一位"
            balls={ ballRange }
            ref={ panel1 => (this.panel1 = panel1) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ sw }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '2' }
            betSize={ 1 }
            index={ 1 }
            selected={ this.state.balls[1] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
          />
        </div>
        <div
          className="number-panel-box top"
          style={ { borderTop: '1px solid #E6E6E6' } }
        >
          <BallPanel
            title="个位"
            randomLabel="一位"
            balls={ ballRange }
            ref={ panel2 => (this.panel2 = panel2) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ gw }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '5' }
            betSize={ 1 }
            index={ 2 }
            selected={ this.state.balls[2] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={
            balls[0].length === 0 &&
            balls[1].length === 0 &&
            balls[2].length === 0
          }
          emptyNode={
            <p className="empty-tip">
              <span>每位至少选1个号码，与开奖号码一一对应即中奖一千元</span>
            </p>
          }
        >
          <div className="profit-info">
            <p>
              已选<em>{balls[0].length + balls[1].length + balls[2].length}</em>个红球，共<em
              >
                {betNum}
              </em>注，共<em>{betNum * 2}</em>元
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
