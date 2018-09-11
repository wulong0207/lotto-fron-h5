/*
* @Author: liaozhityuan
* @Date:   2017-09-21 10:00:49
* @Last Modified by:   liaozhityuan
* @Last Modified time: 2017-10-22 18:12:01
*/
import React from 'react';
import Combinatorics from 'js-combinatorics';
import alert from '@/services/alert';
import confirm from '@/component/confirm';

const Common = {
  getLimitCombinations(balls, limitBets, count) {
    const allCombinations = Combinatorics.combination(balls, count)
      .toArray()
      .map(i => i.join(','));
    return limitBets.filter(bet => allCombinations.indexOf(bet) > -1);
  },

  /** 检查当前的选号是否包含在限号中
   *
   * [checkLimit description]
   * @param  {[type]}  balls [当前选中的球]
   * @param  {Boolean} muted [是否弹出限号提示，在随机一注的时候，如果包含限号，需要重新生成，这时，不需要提示]
   * @return {[type]}        [description]
   */
  checkLimit(balls, muted = true, limitLists, count) {
    const limitList = limitLists || [];
    const limitBalls = limitList.map(i => i.limitContent);
    const limitSelectedBalls = this.getLimitCombinations(
      balls,
      limitBalls,
      count
    );
    if (limitSelectedBalls.length) {
      if (!muted) {
        alert.alert(
          <div>
            <p>您购买的号码中包含了限制的号码</p>
            <p>
              <em>
                {limitSelectedBalls
                  .sort((a, b) => a - b)
                  .toString()
                  .replace(/,/g, ' ')}
              </em>
            </p>
          </div>
        );
      }
      return false;
    }
    return true;
  },

  /**
   * [ballsSort description] 快乐扑克3的任选号码排序
   * @param  {[type]} balls [description] 当前的选择的球
   * @return {[type]}       [description]
   */
  ballsSort(balls) {
    let ball = [];

    if (!balls.length) return ball;
    balls = balls.map((b, ind) => {
      switch (String(b).charAt(0)) {
        case 'A':
          ball[0] = b;
          break;
        case '2':
          ball[1] = b;
          break;
        case '3':
          ball[2] = b;
          break;
        case '4':
          ball[3] = b;
          break;
        case '5':
          ball[4] = b;
          break;
        case '6':
          ball[5] = b;
          break;
        case '7':
          ball[6] = b;
          break;
        case '8':
          ball[7] = b;
          break;
        case '9':
          ball[8] = b;
          break;
        case '1':
          ball[9] = b;
          break;
        case 'J':
          ball[10] = b;
          break;
        case 'Q':
          ball[11] = b;
          break;
        case 'K':
          ball[12] = b;
          break;
      }
    });
    let result = ball
      .toString()
      .replace(/\s/g, '')
      .replace(/,+/g, ',')
      .split(',');
    if (!result[0]) {
      result.shift();
    }
    return result;
  },

  addNumber(count, self) {
    const { betNum } = self.state;
    const ballNumber = self.state.balls.length;
    let balls = self.state.balls
      .concat(self.state.fixedBalls)
      .sort((a, b) => a - b);
    return new Promise((resolve, reject) => {
      if (!betNum) {
        if (!ballNumber && !self.state.fixedBalls.length) {
          self.emptyTip.open().then(balls => {
            resolve({
              balls,
              open: true,
              manual: false,
              fixedBalls: self.state.fixedBalls
            });
          });
        } else {
          confirm
            .confirm(
              <div>
                <p>
                  还差{count - ballNumber - self.state.fixedBalls.length}个号码
                </p>
                <p>才能组成一注彩票</p>
              </div>,
              '帮我补足',
              '自己选'
            )
            .then(() => {
              let newBalls = [];
              do {
                newBalls = self.state.balls.concat(
                  self.panel.random(
                    count - ballNumber - self.state.fixedBalls.length
                  )
                );
              } while (
                !Common.checkLimit(
                  newBalls.concat(self.state.fixedBalls).sort((a, b) => a - b),
                  false,
                  self.props.limitInfoList,
                  count
                )
              );
              resolve({
                balls: newBalls,
                open: true,
                manual: false,
                fixedBalls: self.state.fixedBalls
              });
              self.clear();
            });
        }
      } else {
        if (!Common.checkLimit(balls, false, self.props.limitInfoList, count)) {
          return reject(new Error('限号限制'));
        }
        resolve({
          balls: self.state.balls,
          manual: true,
          fixedBalls: self.state.fixedBalls
        });
        self.clear();
      }
    });
  },

  formatContent(balls, fixedBalls = []) {
    if (fixedBalls.length) {
      return fixedBalls.sort().join(',') + '#' + balls.sort().join(',');
    } else {
      return balls.sort().join(',');
    }
  },

  formatBall(balls, fixedBalls = []) {
    if (fixedBalls.length) {
      return fixedBalls.sort().join(' ') + '#' + balls.sort().join(' ');
    } else {
      return balls.sort().join(' ');
    }
  },

  Balls(balls) {
    let ball = balls.split(',');
    let message = [];

    if (ball.toString().indexOf('T') < 0) {
      ball = Common.ballsSort(ball);
    }

    ball.map((item, index) => {
      if (item === '1T') {
        message.push(
          <span className="ballImg">
            <img src={ require('../../../../../lib/img/klpk3/heitao_min.png') } />
          </span>
        );
      } else if (item === '2T') {
        message.push(
          <span className="ballImg">
            <img
              src={ require('../../../../../lib/img/klpk3/hongtao_min.png') }
            />
          </span>
        );
      } else if (item === '3T') {
        message.push(
          <span className="ballImg">
            <img src={ require('../../../../../lib/img/klpk3/meihua_min.png') } />
          </span>
        );
      } else if (item === '4T') {
        message.push(
          <span className="ballImg">
            <img
              src={ require('../../../../../lib/img/klpk3/fangkuai_min.png') }
            />
          </span>
        );
      } else if (item === 'AT') {
        message.push(<span>同花全包</span>);
      } else if (item === 'XYZ') {
        message.push(<span>顺子全包</span>);
      } else if (item === 'XX') {
        message.push(<span>对子全包</span>);
      } else if (item === 'YYY') {
        message.push(<span>豹子全包</span>);
      } else {
        message.push(<span>{item}</span>);
      }
    });
    return (
      <div className="balls" style={ { marginBottom: '10px' } }>
        {message}
      </div>
    );
  },

  OrderDetail({ order }) {
    return (
      <div style={ { color: '#999', fontSize: '12px' } }>
        <table>
          <tbody>
            {order.orderInfoDetailLimitBO.map((d, idx) => {
              return (
                <tr key={ idx }>
                  <td>{Common.Balls(d.betContent)}</td>
                  <td>
                    <span>
                      {d.lotteryChildName}
                      {d.betContent.indexOf('#') > 0 ? '胆拖' : '普通'}
                    </span>
                  </td>
                  <td>
                    <span style={ { margin: '0 10px' } }>{d.betNum + '注'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Common;
