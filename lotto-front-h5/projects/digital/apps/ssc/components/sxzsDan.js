/*
 直选
 */
import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import alert from '@/services/alert';
import CALC from './bet.jsx';

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
      betNum: 0,
      profit: 0,
      bonus: 0
    };
    CALC(this);
  }

  ballChangeHandle(balls, _, index) {
    balls = balls.map(b => b + '');
    if (index === 0) {
      if (balls.length > 1) {
        alert.alert('最多可选1个胆码');
        throw new Error('最多可选1个胆码');
      }
      let selectedBalls = this.state.balls.concat();
      let newBalls = selectedBalls.filter(b => balls.indexOf(b) < 0);
      let bet = this.CALC({ betArr: [balls, newBalls], ind: 5, money: 320 });
      let betNum = bet.num;
      let profit = bet.profit;
      let bonus = bet.bonus;
      this.setState({
        betNum,
        fixedBalls: balls,
        balls: newBalls,
        profit,
        bonus
      });
    } else if (index === 1) {
      setTimeout(() => {
        const fixedBalls = this.state.fixedBalls.concat();
        const newFixedBalls = fixedBalls.filter(b => balls.indexOf(b) < 0);
        let bet = this.CALC({
          betArr: [newFixedBalls, balls],
          ind: 5,
          money: 320
        });
        let betNum = bet.num;
        let profit = bet.profit;
        let bonus = bet.bonus;
        this.setState({
          betNum,
          balls,
          fixedBalls: newFixedBalls,
          profit,
          bonus
        });
      }, 50);
    }
  }

  ballRandom(highlight = false) {
    return this.panel.random(2, highlight);
  }

  clear() {
    this.panel.clear();
    this.setState({ balls: [], fixedBalls: [] });
  }

  generateBet(balls, manual = true, fixedBalls = []) {
    let betNum = this.CALC({ betArr: [fixedBalls, balls], ind: 5, money: 320 })
      .num;
    if (!fixedBalls.length) {
      betNum = this.CALC({ betArr: [balls], ind: 4, money: 320 }).num;
    }
    return {
      betNum,
      manual,
      balls: formatContent(
        balls.sort((a, b) => parseInt(a) - parseInt(b)),
        fixedBalls.sort((a, b) => parseInt(a) - parseInt(b)),
        ' '
      ),
      content: formatContent(balls, fixedBalls, ','),
      label: `三星组三${fixedBalls.length ? '胆拖' : ''} ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum, fixedBalls),
      page: fixedBalls.length ? 'renqi' : 'renliu'
    };
  }

  editHandle(content) {
    const balls = content
      .split('#')
      .map(b => b.split(',').map(i => parseInt(i)));
    this.ballChangeHandle(balls[0], [], 0);
    this.ballChangeHandle(balls[1], [], 1);
  }

  addNumber() {
    const { betNum } = this.state;
    return new Promise((resolve, reject) => {
      if (!betNum) {
        return alert.alert('必须选择一个胆码，胆码+拖码个数必须大于等于2!');
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
    let omit = this.props.omitData.baseOmit[0];
    let zx3 = omit.zx3 || [];
    const { betNum, balls, fixedBalls, profit, bonus } = this.state;
    return (
      <div className="rener-page">
        <div className="number-panel-box top">
          <BallPanel
            title="胆码"
            balls={ ballRange }
            ref={ panel => (this.panel = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ zx3 }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '1' }
            betSize={ 1 }
            index={ 0 }
            selected={ this.state.fixedBalls }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
          />
        </div>
        <div
          className="number-panel-box top"
          style={ { borderTop: '1px solid #E6E6E6' } }
        >
          <BallPanel
            title="拖码"
            balls={ ballRange }
            ref={ panel => (this.panel = panel) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ zx3 }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '2' }
            betSize={ 1 }
            index={ 1 }
            selected={ this.state.balls }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ balls.length === 0 && fixedBalls.length === 0 }
          emptyNode={
            <p className="empty-tip">
              选2个号码，开奖号码后三位为组三号且包含选中即中320元
            </p>
          }
        >
          <div className="profit-info">
            <p>
              <span>
                已选<em>{this.state.fixedBalls.length}</em>个胆码，{' '}
                <em>{balls.length}</em>个拖码
              </span>
              <span>
                ，共<em>{betNum}</em>注，共<em>{betNum * 2}</em>元
              </span>
            </p>
            <p>
              若中奖，奖金<em style={ { color: '#FF7A0D' } }> {bonus} </em>元，盈利<em
                style={ { color: '#FF7A0D' } }
              >
                {' '}
                {profit}
              </em>元
            </p>
          </div>
        </BetInfo>
      </div>
    );
  }
}
