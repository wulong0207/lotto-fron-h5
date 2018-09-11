import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import { range } from 'lodash';
import BetInfo from '../../../components/bet-info';
import NumberEmptyTip from '../../../components/empty-tip';
import queue from '../../../utils/update-queue';
import Bet from '@/bet/bet.js';
import NumberHelper from '@/utils/number-helper.js';
import alert from '@/services/alert';

function getContentType(balls) {
  let num = balls[0].length + balls[1].length + balls[2].length;
  return num > 2 ? 2 : 1;
}

const ballRange = range(1, 12).map(i => `0${i}`.slice(-2));

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
function formatBall(balls) {
  return (
    balls[0].sort().join(' ') +
    '|' +
    balls[1].sort().join(' ') +
    '|' +
    balls[2].sort().join(' ')
  );
}
function formatContent(balls) {
  return (
    balls[0].sort().join(',') +
    '|' +
    balls[1].sort().join(',') +
    '|' +
    balls[2].sort().join(',')
  );
}

export default class QIANSANSELECT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], [], []],
      betNum: 0
    };
    this.betCal = new Bet('ElevenChoseFive'); // 11选5计算算法

    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      let result = this.betCal.calc({
        bets: balls,
        bravery: [],
        price: 2,
        option: 3,
        type: 2,
        bonus: 1170
      });
      let bets = result.bets || [];
      let betNum = bets.length;
      this.setState({ balls, betNum });
    });
  }

  componentWillUnmount() {
    queue.unsubscribe();
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [];
    do {
      let one = this.panel1.random(1, highlight);
      let two = this.panel2.random(1, highlight, one);
      let ball = one.concat(two);
      let three = this.panel3.random(1, highlight, ball);
      balls = [one, two, three];
    } while (!this.checkLimit(balls, this.props.limitInfoList, false));

    return balls;
  }

  clear() {
    this.panel1.clear();
    this.panel2.clear();
    this.panel3.clear();
    this.setState({ balls: [[], [], []] });
  }

  generateBet(balls, manual = true) {
    let result = this.betCal.calc({
      bets: balls,
      bravery: [],
      price: 2,
      option: 3,
      type: 2,
      bonus: 1170
    });
    let bets = result.bets || [];
    let betNum = bets.length;
    return {
      betNum,
      manual,
      balls: formatBall(balls),
      content: formatContent(balls),
      label: `前三直选 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(balls),
      page: 'qiansanSelect'
    };
  }

  editHandle(content) {
    let one = content.split('|')[0].split(',');
    let two = content.split('|')[1].split(',');
    let three = content.split('|')[2].split(',');
    let balls = [one, two, three];

    let result = this.betCal.calc({
      bets: balls,
      bravery: [],
      price: 2,
      option: 3,
      type: 2,
      bonus: 130
    });
    let bets = result.bets || [];
    let betNum = bets.length;
    this.setState({ balls, betNum });
  }

  checkLimit(balls, limits) {
    let flag = true;
    let limit = limits[0] || {};
    let limitContent = limit.limitContent || '';
    let limitArr = limitContent.split('|') || [];

    for (var i = 0; i < balls.length; i++) {
      flag = NumberHelper.isContained(balls[i], [limitArr[i]]);
      if (!flag) break;
    }

    if (flag) {
      alert.alert(
        <div>
          <p>您购买的号码中包含了限制的号码</p>
          <p>
            <em>
              {limitArr
                .sort((a, b) => a - b)
                .toString()
                .replace(/,/g, ' ')}
            </em>
          </p>
        </div>
      );
      return false;
    } else {
      return true;
    }
  }

  addNumber() {
    const { betNum } = this.state;
    const one = this.state.balls[0].length;
    const two = this.state.balls[1].length;
    const three = this.state.balls[2].length;

    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (one === 0 && two === 0 && three === 0) {
          this.emptyTip.open().then(balls => {
            resolve({ balls, open: true, manual: false });
          });
        } else {
          alert.alert(
            <div>
              <p>第一位,第二位,第三位至少选择</p>
              <p>一个号码 且不相同才能组成一注彩票</p>
            </div>
          );
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
    let data = [[], [], []];
    let datas = this.props.omitData.baseOmit;
    for (let i = 0; i < datas.length; i++) {
      for (let item in datas[i]) {
        if (item.charAt(0) === 'b') {
          data[i].push(datas[i][item]);
        }
      }
    }
    const amount = 1170;
    const { betNum, balls } = this.state;
    const profit = betNum ? amount - betNum * 2 : 0;
    return (
      <div className="rener-page">
        <div className="number-panel-box top">
          <BallPanel
            randomLabel="一位"
            balls={ ballRange }
            ref={ panel1 => (this.panel1 = panel1) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data[0] }
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
            randomLabel="一位"
            balls={ ballRange }
            ref={ panel2 => (this.panel2 = panel2) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data[1] }
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
            randomLabel="一位"
            balls={ ballRange }
            ref={ panel3 => (this.panel3 = panel3) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data[2] }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '3' }
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
              <span>
                每位各选一个号码。1/990的中奖机会,奖金<em>1170</em>元！
              </span>
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
              若中奖，奖金<em style={ { color: '#FF7A0D' } }>
                {' '}
                {betNum ? amount : 0}{' '}
              </em>元， {profit < 0 ? '亏损' : '盈利'}
              <em style={ { color: '#FF7A0D' } }> {profit} </em>元
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
