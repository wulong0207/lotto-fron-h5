import React from 'react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
import BetCart from '../bet-cart';
import './bet-bar.scss';
import Shake from 'shake.js';
import session from '@/services/session';
import { generateOrderData, generateChaseOrderData } from '../../utils/order';
import CountDown from '@/component/countdown.jsx';
import alert from '@/services/alert';
import confirm from '@/services/confirm';
import { browser } from '@/utils/utils';

const unLoadEventName =
  browser.iPhone || browser.iPad ? 'pagehide' : 'beforeunload';

const SHAKE_SESSION_KEY = 'numberBettingEnableShake';

// 机选和摇一摇
class ShortCuts extends React.Component {
  constructor(props) {
    super(props);
    const enableShake = session.get(SHAKE_SESSION_KEY);
    this.state = {
      enableShake: typeof enableShake === 'boolean' ? enableShake : true,
      show: false
    };
    this.shake = new Shake({
      threshold: 5, // optional shake strength threshold
      timeout: 1000 // optional, determines the frequency of event generation
    });
    this.shakeHandle = this.props.onShake.bind(this);
  }

  componentDidMount() {
    window.addEventListener('shake', this.shakeHandle, false);
    if (this.state.enableShake) this.shake.start();
  }

  componentWillUnmount() {
    this.shake.stop();
    window.removeEventListener('shake', this.shakeHandle, false);
  }

  toggle() {
    this.setState({ show: !this.state.show });
  }

  toggleShake() {
    const enableShake = !this.state.enableShake;
    this.setState({ enableShake });
    session.set(SHAKE_SESSION_KEY, enableShake);
    if (enableShake) {
      this.shake.start();
    } else {
      this.shake.stop();
    }
  }

  render() {
    return (
      <div className="border-right" onClick={ this.toggle.bind(this) }>
        <div className="icon">
          <img
            src={
              this.state.enableShake
                ? require('@/img/component/icon_shake@2x.png')
                : require('@/img/component/shake_close@2x.png')
            }
          />
          <div className="icon-title">摇一注</div>
        </div>
        <div
          className="shortcuts"
          style={ { display: !this.state.show && 'none' } }
        >
          <ul>
            {'DeviceMotionEvent' in window && (
              <li onClick={ this.toggleShake.bind(this) }>
                {this.state.enableShake ? '关闭摇一摇' : '开启摇一摇'}
              </li>
            )}
            {[20, 10, 5].map(i => {
              return (
                <li onClick={ this.props.onRandom.bind(this, i, true) } key={ i }>
                  机选{i}注
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

ShortCuts.propTypes = {
  onRandom: PropTypes.func.isRequired,
  onShake: PropTypes.func.isRequired
};

export default class BetBar extends React.Component {
  constructor(props) {
    super(props);
    let times = 1;
    let chaseNum = 1;
    let bettings = [];
    const prevData = session.get(`number-betting-${this.props.name}`);
    if (prevData) {
      times = prevData.times;
      chaseNum = prevData.chaseNum;
      bettings = prevData.bettings;
      session.remove(`number-betting-${this.props.name}`);
    }
    this.state = {
      times,
      chaseNum,
      bettings,
      payStatus: 'ide',
      isDltAdd: false
    };
    this.saveDataHandle = this.saveData.bind(this);
    this.subscription = null;
  }

  componentDidMount() {
    window.addEventListener(unLoadEventName, this.saveDataHandle);
  }

  componentWillUnmount() {
    // 保存未提交的号码
    this.saveDataHandle();
    window.removeEventListener(unLoadEventName, this.saveDataHandle);
  }

  // 向 SessionStorage 中存储未提交的投注信息
  saveData() {
    if (this.state.bettings.length) {
      session.set(`number-betting-${this.props.name}`, this.state);
    }
    return null;
  }

  // 检查投注的注数是否超过限制，如果超过的话, 将超过的注数标红
  checkoutBetNum(bettings) {
    const rule = this.props.getBetMulRule();
    const betNum = rule.bettindNum;
    const newBettings = bettings.map(i => {
      if (i.betNum <= betNum) return i;
      return {
        ...i,
        overflow: true
      };
    });
    return newBettings;
  }

  // 封装 setState({ bettings }) 方法，因为每次更新都需要检查是否超过了投注注数
  setBettings(bettings) {
    const newBettings = this.checkoutBetNum(bettings);
    this.setState({ bettings: newBettings });
  }

  openCart(check = false, bettings = this.state.bettings) {
    if (check) this.setBettings(bettings);
    this.cart.open();
  }

  // 添加号码
  addNumberHandle(openCart = true) {
    this.addNumber().then(() => {
      if (openCart) this.openCart();
    });
  }

  // 删除某条投注内容
  bettingsRemoveHandle(index) {
    const bettings = this.state.bettings
      .concat()
      .filter((_, idx) => idx !== index);
    this.setBettings(bettings);
    if (!bettings.length) {
      this.bettingsClearHandle();
    }
  }

  // 清除投注列表
  bettingsClearHandle() {
    this.setState({ bettings: [], times: 1, chaseNum: 1, isDltAdd: false });
    this.cart.close();
  }

  /* 机选投注
    params length: int 投注数
    params openCart: boolean 是否显示 cart
  */
  bettingsRandomHandle(length = 1, openCart = false) {
    const ballsArr = range(0, length).map(_ => this.props.ballRandom());
    const bets = ballsArr.reduce(
      (acc, balls) => acc.concat(this.props.generateBet(balls, false)),
      []
    );
    const bettings = [...bets, ...this.state.bettings];
    this.setBettings(bettings);
    if (openCart) this.openCart();
  }

  // 将选中的球转换为投注内容
  addBetHandle(balls, manual, fixedBalls) {
    const bet = this.props.generateBet(balls, manual, fixedBalls);
    const bettings = Array.isArray(bet)
      ? [...bet, ...this.state.bettings]
      : [bet, ...this.state.bettings];
    this.setBettings(bettings);
  }

  // 把(号码面板选中或机选的)号码加入到号码栏
  addNumber() {
    return new Promise((resolve, reject) => {
      this.props
        .onAddNumber()
        .then(({ balls, manual, fixedBalls }) => {
          this.addBetHandle(balls, manual, fixedBalls);
          resolve();
        })
        .catch(reject);
    });
  }

  // 倍数点击处理
  timeHandle() {
    const focus = () => {
      this.openCart(true);
      setTimeout(this.cart.timesFocus.bind(this.cart), 50);
    };
    if (!this.state.bettings.length) {
      this.addNumber().then(focus);
    } else {
      focus();
    }
  }

  // 追号点击处理
  chaseNumHandle() {
    const focus = () => {
      this.openCart(true);
      setTimeout(this.cart.chaseFocus.bind(this.cart), 50);
    };
    if (!this.state.bettings.length) {
      this.addNumber().then(focus);
    } else {
      focus();
    }
  }

  // 更改投注倍数
  setTimesHandle(times) {
    if (!/^\d+$/.test(times)) return undefined;
    this.checkTimes(times).then(newTimes => {
      if (this.state.times === newTimes) return undefined;
      this.setState({ times: parseInt(newTimes) });
    });
  }

  // 更改追加数
  setChaseNumHandle(number) {
    if (this.state.chaseNum === number || !/^\d+$/.test(number)) {
      return undefined;
    }
    if (parseInt(number) > this.props.maxChaseNum) {
      return alert
        .alert(`追号最大期数为${this.props.maxChaseNum}期！`, '', false)
        .then(() => {
          this.setState({ chaseNum: this.props.maxChaseNum });
        });
    }
    this.setState({ chaseNum: parseInt(number) });
  }

  // 摇一摇
  shakeHandle() {
    this.props.ballRandom(true);
    if ('vibrate' in window.navigator) {
      window.navigator.vibrate(200);
    }
  }

  // 注数图标点击处理
  betNumberClickHandle(e) {
    e.stopPropagation();
    this.openCart(true);
  }

  // 是否为大乐透追加投注
  toggleIsDltAdd() {
    this.setState({ isDltAdd: !this.state.isDltAdd });
  }

  // 检查倍数是否大于当前限制的时间
  checkTimes(times = this.state.times) {
    return new Promise((resolve, reject) => {
      const rule = this.props.getBetMulRule();
      if (times && times > rule.multipleNum) {
        confirm
          .confirm(
            <div style={ { marginBottom: '10px' } }>
              <h4
                style={ {
                  fontSize: '18px',
                  margin: '10px 0',
                  fontWeight: 'normal'
                } }
              >
                哇，土豪！
              </h4>
              <p className="bet-bar-times-tip">
                对不起，当前最大投注倍数为<em>{rule.multipleNum}</em>倍！
              </p>
            </div>,
            `${rule.multipleNum}倍投注`,
            '返回修改',
            false,
            false
          )
          .then(() => {
            this.setState({ times: rule.multipleNum });
            resolve(rule.multipleNum);
          })
          .catch(() => {
            this.openCart();
            this.setState({ times });
            setTimeout(this.cart.timesFocus.bind(this.cart), 50);
            reject(new Error('cancel'));
          });
        return undefined;
      }
      return resolve(times);
    });
  }

  // 检查倍数和注数是否大于当前限制的时间
  checkTimesAndBetNum(times, bettings = this.state.bettings) {
    return new Promise((resolve, reject) => {
      const rule = this.props.getBetMulRule();
      this.checkTimes(times)
        .then(newTimes => {
          const betNum = rule.bettindNum;
          const overflowBets = bettings.filter(b => b.betNum > betNum);
          if (!overflowBets.length) return resolve({bettings, times: newTimes});
          if (overflowBets.length === bettings.length) {
            return alert
              .alert(
                <div style={ { marginBottom: '10px' } }>
                  <h4
                    style={ {
                      fontSize: '18px',
                      margin: '10px 0',
                      fontWeight: 'normal'
                    } }
                  >
                    哇，土豪！
                  </h4>
                  <p style={ { fontSize: '12px' } }>
                    对不起，单注最大注数为<em>{rule.bettindNum}</em>注！
                  </p>
                </div>
              )
              .then(reject);
          }
          return confirm
            .confirm(
              <div style={ { marginBottom: '10px' } }>
                <h4
                  style={ {
                    fontSize: '18px',
                    margin: '10px 0',
                    fontWeight: 'normal'
                  } }
                >
                  哇，土豪！
                </h4>
                <p style={ { fontSize: '14px' } }>
                  对不起，单注最大注数为<em>{rule.bettindNum}</em>注
                </p>
              </div>,
              '返回修改',
              '去掉超限注数投注'
            )
            .then(reject)
            .catch(() => {
              const newBettings = bettings.filter(i => i.betNum <= betNum);
              resolve({ bettings: newBettings, times: newTimes });
            });
        })
        .catch(reject);
    });
  }

  // 下单方法
  newOrder() {
    if (this.state.payStatus === 'padding') return undefined;
    if (!this.state.bettings.length) {
      return this.addNumber().then(this.newOrder.bind(this));
    }
    const { chaseNum, isDltAdd } = this.state;
    this.checkTimesAndBetNum(this.state.times, this.state.bettings).then(({ bettings, times }) => {
      const { lotteryCode, lotteryIssue, getLotteryIssue } = this.props;
      // debugger;
      const curLotteryIssue =
        typeof getLotteryIssue === 'function'
          ? getLotteryIssue()
          : lotteryIssue;
      let data;
      if (this.state.chaseNum > 1) {
        data = generateChaseOrderData(
          bettings,
          lotteryCode,
          times,
          curLotteryIssue,
          chaseNum,
          isDltAdd
        );
      } else {
        data = generateOrderData(
          bettings,
          lotteryCode,
          times,
          curLotteryIssue,
          isDltAdd
        );
      }
      this.setState({ payStatus: 'pending' });
      this.props
        .onNewOrder(data)
        .then(() => {
          this.setState({ payStatus: 'ide' });
          this.bettingsClearHandle();
        })
        .catch(() => {
          this.setState({ payStatus: 'ide' });
        });
    });
  }

  render() {
    const isPending = this.state.payStatus === 'pending';
    const betNum = this.state.bettings.reduce((acc, b) => b.betNum + acc, 0);
    const betPrice = this.state.bettings.reduce((acc, b) => {
      let price = b.price;
      if (!price) price = this.state.isDltAdd ? 3 : 2;
      return acc + b.betNum * price;
    }, 0);
    return (
      <div className="bottom-bar">
        <div className="yc-bet-bar">
          {!this.props.disableShake && (
            <ShortCuts
              onRandom={ this.bettingsRandomHandle.bind(this) }
              ref={ shortcuts => (this.shortcuts = shortcuts) }
              onShake={ this.shakeHandle.bind(this) }
            />
          )}
          <div
            className="border-right"
            onClick={ this.chaseNumHandle.bind(this) }
          >
            <div className="icon">
              <img src={ require('@/img/component/icon_period@2x.png') } />
              <div className="icon-title">
                <span>
                  追<em>{this.state.chaseNum}</em>期
                </span>
              </div>
            </div>
          </div>
          <div className="border-right" onClick={ this.timeHandle.bind(this) }>
            <div className="icon">
              <img src={ require('@/img/component/icon_double@2x.png') } />
              <div className="icon-title">
                <span>
                  投<em>{this.state.times}</em>倍
                </span>
              </div>
            </div>
          </div>
          <div className="flex orange">
            <div
              className="btn-txt"
              onClick={ this.addNumberHandle.bind(this, false) }
            >
              <span className="title">加入号码篮</span>
              {betNum ? (
                <span
                  className={ betNum > 99 ? 'num-nine' : 'num-mark' }
                  onClick={ this.betNumberClickHandle.bind(this) }
                >
                  {betNum > 99 ? (
                    <span>
                      <img src={ require('@/img/more.png') } />
                    </span>
                  ) : (
                    betNum
                  )}
                </span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div
            className="flex red"
            onClick={ this.newOrder.bind(this) }
            style={ {
              color: isPending && '#fff',
              background: isPending && '#ccc'
            } }
          >
            <div className="btn-txt">
              <span className="title" disabled={ isPending }>
                {isPending ? '正在投注' : '立即投注'}
              </span>
              <div className="subtitle">
                <CountDown remaining={ this.props.remaining } /> 后截止
              </div>
            </div>
          </div>
        </div>
        <BetCart
          bettings={ this.state.bettings }
          onRandom={ this.bettingsRandomHandle.bind(this, 1) }
          onRemove={ this.bettingsRemoveHandle.bind(this) }
          onClear={ this.bettingsClearHandle.bind(this) }
          times={ this.state.times }
          chaseNum={ this.state.chaseNum }
          onTimesChange={ this.setTimesHandle.bind(this) }
          onChaseNumChange={ this.setChaseNumHandle.bind(this) }
          saleEndTime={ this.props.saleEndTime }
          onPlaceOrder={ this.newOrder.bind(this) }
          payStatus={ this.state.payStatus }
          onBettingEdit={ this.props.onBettingEdit }
          chaseShortcuts={ this.props.chaseShortcuts }
          timesShortcuts={ this.props.timesShortcuts }
          maxChaseNum={ this.props.maxChaseNum }
          checkTimes={ this.checkTimes.bind(this) }
          showDltAdd={ this.props.showDltAdd }
          isDltAdd={ this.state.isDltAdd }
          onToggleDltAdd={ this.toggleIsDltAdd.bind(this) }
          ballFormat={ this.props.ballFormat }
          betPrice={ betPrice }
          ref={ cart => (this.cart = cart) }
        />
      </div>
    );
  }
}

BetBar.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // 独立的名称，用于将数据存在 sessionStorage 里， 一般使用子彩种 id 例如 10501
  onAddNumber: PropTypes.func.isRequired, // 机选
  remaining: PropTypes.number.isRequired, // 投注剩余的秒数，information 高阶组件会自动提供
  saleEndTime: PropTypes.number.isRequired, // 投注截至时间，information 高阶组件会自动提供
  generateBet: PropTypes.func.isRequired, // 生成投注内容的方法
  ballRandom: PropTypes.func.isRequired, // 随机选球的方法
  lotteryCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired, // 彩种 id
  lotteryIssue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired, // 彩期
  getBetMulRule: PropTypes.func.isRequired, // 获取当前时间投注倍数和注数的限制，information 高阶组件会自动提供
  onNewOrder: PropTypes.func.isRequired, // 下单请求方法，orders 通用组件中有提供
  onBettingEdit: PropTypes.func.isRequired, // 编辑注数的方法，会传回编辑的投注数据
  chaseShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      value: PropTypes.number.isRequired
    })
  ), // 追期键盘上的快捷投注
  timesShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      value: PropTypes.number.isRequired
    })
  ), // 倍数键盘上的快捷投注
  maxChaseNum: PropTypes.number, // 最大的追期数
  showDltAdd: PropTypes.bool, // 是否显示大乐透的追期选项(仅用于大乐透)
  ballFormat: PropTypes.func, // 投注栏上的球格式化的方法
  disableShake: PropTypes.bool, // 是否禁止摇一摇
  getLotteryIssue: PropTypes.func // 获取当前彩期
};

BetBar.defaultProps = {
  maxChaseNum: 100,
  betPrice: 2
};
