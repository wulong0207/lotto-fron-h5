import React, { Component } from 'react';
import session from '@/services/session.js';
import Message from '@/services/message'; // 弹窗
import confirm from '@/services/confirm';
import http from '@/utils/request';
import cx from 'classnames';
import '../css/bet_calc.scss';
import { DialogType } from '../const.js';
import { browser } from '@/utils/utils'; // 判断浏览器内核
import Interaction from '@/utils/interaction';

export default class BetCalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beiIndex: 0,
      bonus: 0,
      money: 0,
      percentage: 0,
      betNum: 0,
      footData: [],
      minBonus: 0,
      times: 0
    };
  }

  componentDidMount() {
    let {
      getBetNumAndMaxProfit,
      bettings,
      matchs,
      times,
      betData
    } = this.props;
    let { betNum, max, min } = getBetNumAndMaxProfit(matchs, bettings, times);

    let bonus = max;
    let minBonus = min;
    times = betData[this.state.beiIndex];
    let money = betNum * times * 2;
    let percentage = parseInt((bonus - money) / money * 100) || 0;
    this.setState({ bonus, money, percentage, betNum, minBonus });
  }
  componentWillReceiveProps(nextProps) {
    let { getBetNumAndMaxProfit, bettings, matchs, times } = nextProps;

    if (bettings !== this.props.bettings) {
      let { betNum, max, min } = getBetNumAndMaxProfit(matchs, bettings, times);
      let bonus = max;
      let minBonus = min;
      let money = betNum * times * 2;
      let percentage = parseInt((bonus - money) / money * 100) || 0;
      this.setState({ bonus, money, percentage, betNum, minBonus });
    }
  }

  // 切换倍数
  changeTimes(index) {
    let {
      changeTimes,
      getBetNumAndMaxProfit,
      bettings,
      matchs,
      betData
    } = this.props;
    let times = betData[index] || 0;
    this.setState({ beiIndex: index });

    if (changeTimes) {
      changeTimes(times);
    }
    if (getBetNumAndMaxProfit) {
      let { betNum, max, min } = getBetNumAndMaxProfit(matchs, bettings, times);
      let bonus = max;
      let minBonus = min;
      let money = betNum * times * 2;
      let percentage = parseInt((bonus - money) / money * 100) || 0;
      this.setState({ bonus, money, percentage, betNum, minBonus });
    }
  }

  // 跳到支付页支付
  handleOrder(code) {
    let token = session.get('token');
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toPay', [
        JSON.stringify([{ oc: code, bt: 1, token: token }])
      ]);
    } else {
      return (location.href = `/pay.html?orderCode=${code}&buyType=1&token=${
        token
      }`);
    }
  }

  addOrder(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.props.showMatchs) {
      Message.toast('没有赛事可以投注！');
      return;
    }
    if (this.state.betNum === 0) {
      Message.toast('2串1 最少选择两场比赛');
      return;
    }
    this.state.footData = this.props.getOrderData();
    this.checkOrder(this.state.footData, '');
  }

  // 下单
  checkOrder(data, type) {
    let activityCode;
    let url = '/order/addOrder';
    let token = session.get('token');
    let { bonus, minBonus } = this.state;

    if (!token) {
      if (browser.yicaiApp) {
        // 调APP登录
        Interaction.sendInteraction('toLogin', []);
      } else {
        // 注册登录
        this.props.changeShowDialog(DialogType.Login);
      }
    } else {
      let params = {
        // "categoryId":1,
        activityCode: activityCode,
        buyScreen: data.buyScreen,
        buyType: data.buyType,
        isDltAdd: data.isDltAdd,
        lotteryCode: data.lotteryCode,
        platform: data.platform,
        lotteryIssue: data.lotteryIssue,
        multipleNum: this.props.times, // data.multipleNum,
        orderAmount: data.orderAmount,
        orderDetailList: data.orderDetailList,
        tabType: data.tabType,
        maxBonus: minBonus + '-' + bonus,
        token: token
      };
      if (type === 'activity') {
        let activityCode = 'JZHD20170801001'; // 活动这个编号写死
        params.activityCode = activityCode;
        url = '/order/addJzsdOrder';
      }
      http
        .post(url, params, { muted: true })
        .then(res => {
          let orderCode;
          if (type === 'activity') {
            orderCode = res.data.orderCode;
            let { betNum, timer } = this.state;
            // 原价 活动价 奖金
            let price = timer * betNum * 2 || '';
            let activePrice = (price - this.state.discount).toFixed(2) || '';

            confirm
              .confirm(
                <div className="message-alert">
                  <div className="title">活动优惠</div>
                  <div>
                    <span>订单名称：</span> <span>竞彩足球 代购</span>
                  </div>
                  <div>
                    <span>实收金额：</span>{' '}
                    <span>
                      <b className="red">{activePrice}元</b>
                      <b className="line">原价{price} 元</b>
                    </span>
                  </div>
                </div>,
                '确认购买',
                '关闭'
              )
              .then(() => {});
          } else {
            orderCode = res.data.oc;
            this.handleOrder(orderCode);
          }
          this.setState({ orderCode });
        })
        .catch(err => {
          if (err.code === '40133') {
            // 实名认证
            this.props.changeShowDialog(DialogType.Ident);
          } else if (err.code === '40118') {
            // 重新登录
            this.props.changeShowDialog(DialogType.Login);
          }

          Message.toast(err.message);
        });
    }
  }

  checkNumber(times) {
    let num = Number(times);
    if (!num && num !== 0) {
      this.times.value = this.state.times;
      Message.toast('倍数只能输入纯数字');
      return;
    }
    this.state.times = times;
  }
  timesFocus() {
    this.setState({ beiIndex: 3 });
  }
  TimesInput() {
    let times = this.times.value;
    let MaxTimes = this.props.max || 50000;
    if (times > MaxTimes) {
      this.times.value = MaxTimes;
      times = MaxTimes;
    }
    this.checkNumber(times);

    let {
      changeTimes,
      getBetNumAndMaxProfit,
      bettings,
      matchs,
      betData
    } = this.props;
    if (changeTimes) {
      changeTimes(times);
    }
    if (getBetNumAndMaxProfit) {
      let { betNum, max, min } = getBetNumAndMaxProfit(matchs, bettings, times);
      let bonus = max;
      let minBonus = min;
      let money = betNum * times * 2;
      let percentage = parseInt(bonus / money * 100) || 0;
      this.setState({ bonus, money, percentage, betNum, minBonus });
    }
  }

  render() {
    let betData = this.props.betData;
    let { bonus, money, percentage } = this.state;
    return (
      <div className="bet_calc">
        <div className="selectBox">
          {betData.map((b, i) => {
            let style = i === this.state.beiIndex ? 'bei selected' : 'bei';
            return (
              <div
                key={ i }
                className={ style }
                onClick={ this.changeTimes.bind(this, i) }
              >
                {b}
              </div>
            );
          })}
          <input
            type="text"
            ref={ times => (this.times = times) }
            className={ cx('bookWirte', { selected: this.state.beiIndex === 3 }) }
            onChange={ this.TimesInput.bind(this) }
            onFocus={ this.timesFocus.bind(this) }
          />
          <span className="txt">倍</span>
        </div>
        <div className="calc_Bouns">
          <div className="calc_content">
            <div className="maxBonus item">
              <div className="txt">最大奖金</div>
              <div className="message">
                <span className="bonus num"> {bonus} </span>
                <span className="txt">元</span>
              </div>
            </div>
            <div className="projectMoney item">
              <div className="txt">方案金额</div>
              <div className="message">
                <span className="money num"> {money} </span>
                <span className="txt">元</span>
              </div>
            </div>
            <div className="predicted item">
              <div className="txt">预计回报</div>
              <div className="message">
                <span className="percentage"> {percentage}</span>
                <span className="txt">%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nowBuyBox">
          <img
            className="nowBuy"
            onClick={ e => {
              this.addOrder(e);
            } }
            src={ require('../img/touzhu.png') }
          />
        </div>
      </div>
    );
  }
}

BetCalc.defaultProps = {
  betData: [5, 20, 50],
  maxTimes: 50000
};
