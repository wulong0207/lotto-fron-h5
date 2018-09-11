import React, { Component } from 'react';
import BallPanel from '../../../components/ball-panel';
import BetInfo from '../../../components/bet-info';
import confirm from '@/services/confirm';
import NumberEmptyTip from '../../../components/empty-tip';
import Common from './common.js';
import queue from '../../../utils/update-queue';
import '../css/rener.scss';

function getContentType(betNum) {
  return betNum > 1 ? 2 : 1;
}

const ballRange = ['1T', '2T', '3T', '4T'];
const ballRange2 = ['同花全包'];
const ballLable = [
  <span key="1">
    奖金<em>90</em>元
  </span>,
  <span key="2">
    奖金<em>90</em>元
  </span>,
  <span key="3">
    奖金<em>90</em>元
  </span>,
  <span key="4">
    奖金<em>90</em>元
  </span>
];
const ballLable2 = [
  <span key="1">
    奖金<em>22</em>元
  </span>
];

function RandomBallsTips({ balls }) {
  return (
    <p className="balls">
      {' '}
      {balls.map((b, index) => b.map((v, ind) => formatContent(v)))}
    </p>
  );
}
function formatContent(val) {
  let message = '';
  if (val === '1T') {
    message = (
      <div>
        <span>同花</span>{' '}
        <img src={ require('../../../../../lib/img/klpk3/heitao_min.png') } />
      </div>
    );
  } else if (val === '2T') {
    message = (
      <div>
        <span>同花</span>{' '}
        <img src={ require('../../../../../lib/img/klpk3/hongtao_min.png') } />
      </div>
    );
  } else if (val === '3T') {
    message = (
      <div>
        <span>同花</span>{' '}
        <img src={ require('../../../../../lib/img/klpk3/meihua_min.png') } />
      </div>
    );
  } else if (val === '4T') {
    message = (
      <div>
        <span>同花</span>{' '}
        <img src={ require('../../../../../lib/img/klpk3/fangkuai_min.png') } />
      </div>
    );
  } else {
    message = (
      <div>
        <span>{val}</span>
      </div>
    );
  }
  return message;
}
function formatBall(balls, middle) {
  return balls[0].sort().join(middle) + ' ' + balls[1].sort().join(middle);
}
function formatMain(balls, middle) {
  if (balls[1].length) {
    if (!balls[0].length) {
      return 'AT';
    }
    return (
      balls[0]
        .sort()
        .toString()
        .replace(/\s/g, '') +
      ',' +
      'AT'
    );
  }
  return balls[0]
    .sort()
    .toString()
    .replace(/\s/g, '');
}

export default class RENER extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [[], []],
      betNum: 0
    };
    queue.subscribe(data => {
      let balls = this.state.balls.concat();
      data.forEach(d => {
        balls[d.index] = d.balls;
      });
      let betNum = balls[0].length + balls[1].length;
      this.setState({ balls, betNum });
    });
  }

  ballChangeHandle(balls, _, index) {
    queue.dispatch({ index, balls });
  }

  ballRandom(highlight = false) {
    let balls = [[], []];
    do {
      let random = parseInt(Math.random() * 5 + 1);
      let num = 0;
      if (random === 5) {
        num = 1;
      }
      let ball = this['panel' + num].random(1, highlight);
      balls[num] = ball;
    } while (!Common.checkLimit(balls, true, this.props.limitInfoList, 2));
    return balls;
  }

  clear() {
    this.panel0.clear();
    this.panel1.clear();
    this.setState({ balls: [[], []] });
  }

  generateBet(balls, manual = true) {
    let betNum = balls[0].length + balls[1].length;
    return {
      betNum,
      manual,
      balls: formatBall(balls, ' '),
      content: formatMain(balls),
      label: `同花 ${betNum}注`,
      lotteryChildCode: this.props.lotteryChildCode,
      contentType: getContentType(betNum),
      page: 'rener'
    };
  }

  editHandle(content) {
    let ball;
    let balls = [[], []];
    if (content.indexOf('AT') > 0 || content === 'AT') {
      ball = content.split(',');
      ball.pop();
      balls[1].push('同花全包');
      balls[0] = ball;
      this.ballChangeHandle(balls[0], false, 0);
      this.ballChangeHandle(balls[1], false, 1);
    } else {
      balls[0] = content.split(',');
      this.ballChangeHandle(balls[0], false, 0);
    }
  }

  addNumber() {
    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length + balls[1].length;
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
                <p>还差{2 - ballNumber}个号码</p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = this.state.balls.concat(
                  this.panel.completion(2 - ballNumber)
                );
              } while (
                !Common.checkLimit(newBalls, false, this.props.limitInfoList, 2)
              );
              resolve({ balls: newBalls, open: true, manual: false });
              this.clear();
            });
        }
      } else {
        if (!Common.checkLimit(balls, false, this.props.limitInfoList, 2)) {
          return reject(new Error('限号限制'));
        }
        resolve({ balls: this.state.balls, manual: true });
        this.clear();
      }
    });
  }

  render() {
    const datas = this.props.omitData.baseOmit[0];
    let omitData = datas.th || [];
    let maxOmit = omitData.concat().sort(function(a, b) {
      return b - a;
    })[0];
    let omit;
    let data = [];
    omitData.map((o, ind) => {
      if (o === maxOmit) {
        omit = {
          label: o,
          color: '#ed1c24'
        };
      } else {
        omit = {
          label: o,
          color: '#999'
        };
      }
      data.push(omit);
    });
    let data2 = [data.pop()] || [];

    const { betNum, balls } = this.state;
    const ballNumber = balls[0].length + balls[1].length;

    let amount = 90;
    let profit = amount - betNum * 2;
    if (ballNumber === 5) {
      amount = 112;
      profit = amount - betNum * 2;
    } else if (
      balls[0].length > 0 &&
      balls[0].length < 4 &&
      balls[1].length > 0
    ) {
      amount = 22 + '~' + 112;
      profit = 22 - betNum * 2 + '~' + (112 - betNum * 2);
    } else if (balls[0].length === 0 && balls[1].length > 0) {
      amount = 22;
      profit = amount - betNum * 2;
    } else {
      amount = 90;
      profit = amount - betNum * 2;
    }
    return (
      <div className="rener-page">
        <div className="number-panel-box top">
          <BallPanel
            title="单选"
            balls={ ballRange }
            ref={ panel0 => (this.panel0 = panel0) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '1' }
            betSize={ 1 }
            index={ 0 }
            selected={ balls[0] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
            labels={ ballLable }
          />
        </div>
        <div className="number-panel-box top">
          <BallPanel
            title="包选"
            balls={ ballRange2 }
            ref={ panel1 => (this.panel1 = panel1) }
            onChange={ this.ballChangeHandle.bind(this) }
            data={ data2 }
            dataType={ this.props.omitFlag }
            name={ this.props.lotteryChildCode + '2' }
            betSize={ 1 }
            index={ 1 }
            selected={ balls[1] }
            highlightMin={ this.props.omitQuery.omitTypes === 1 }
            random={ false }
            labels={ ballLable2 }
          />
        </div>
        <BetInfo
          onDelete={ this.clear.bind(this) }
          isEmpty={ ballNumber === 0 }
          emptyNode={
            <p className="empty-tip">
              <span>
                [单选] 对某单一花色投注，开奖结果为同一花色即中奖<em
                  style={ { color: '#ff7a0d' } }
                >
                  90
                </em>元
              </span>
              <br />
              <span>
                [包选] 全包所有花色投注，开奖结果为同一花色即中奖<em
                  style={ { color: '#ff7a0d' } }
                >
                  22
                </em>元
              </span>
            </p>
          }
        >
          <div className="profit-info">
            {
              <p>
                已选<em>{ballNumber}</em>个号码，共<em>{betNum}</em>注，共<em>
                  {betNum * 2}
                </em>元
              </p>
            }
            <p>
              若中奖，奖金{amount}元， 盈利{profit}元
            </p>
          </div>
        </BetInfo>
        <NumberEmptyTip
          ref={ tip => (this.emptyTip = tip) }
          random={ this.ballRandom.bind(this) }
          template={ RandomBallsTips }
        />
      </div>
    );
  }
}
