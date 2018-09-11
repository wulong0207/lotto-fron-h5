import React from 'react';
import PropTypes from 'prop-types';
import Orders from '../../order';
import Header from '@/component/header.jsx';
import Menus from '../../menus';
import BetBar from '../../bet-bar';
import cx from 'classnames';
import information from '../information';
import emitter from '../../../helpers/event-emitter';
import { NUMBER_CHILD_LOTTERY_CHANGE } from '../../../helpers/event-types';
import { isEqual } from 'lodash';

const MENUS = [
  {
    label: '遗漏数据',
    value: 2,
    klass: 'missing-data'
  },
  {
    label: '80期冷热',
    value: 1,
    klass: 'hot-data'
  },
  {
    label: '最大遗漏',
    value: 3,
    klass: 'max-missing-data'
  },
  {
    label: '上次遗漏',
    value: 4,
    klass: 'last-missing-data'
  }
];

function mapContentTypeToLabel(type) {
  switch (type) {
    case 1:
      return '单式';
    case 2:
      return '复式';
    case 3:
      return '胆拖';
    case 6:
      return '和值';
  }
}

function OrderDetail({ order }) {
  return (
    <div style={ { color: '#999', fontSize: '12px' } }>
      <table>
        <tbody>
          {order.orderInfoDetailLimitBO.map((d, idx) => {
            return (
              <tr key={ idx }>
                <td>
                  <em>{d.betContent}</em>
                </td>
                <td>
                  <span style={ { margin: '0 10px' } }>
                    {d.lotteryChildName}
                    {mapContentTypeToLabel(d.contentType)}
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

OrderDetail.propTypes = {
  order: PropTypes.object
};

/**
 * 高频彩的通用高阶组件
 *
 * @export
 * @param {string} 彩种信息 url
 * @param {string} 彩种名称
 * @param {string} socket 事件名
 * @param {React.Component} 彩种组件
 * @param {string} [klass=''] 自定义类名
 * @param {object} [betOption={}] 传给投注组件的 props, 具体请查看 bet-bar 组件的 propTypes
 * @param {object} [orderOption={}] 传给订单组件的 props, 具体请查看 order 组件的 propTypes
 * @param {function} setBetOption 根据不同的子彩种传递不同 betOption 的方法, 此方法会回传 lotteryChildCode
 * @returns
 */
export default function lottery(
  url,
  title,
  socketEventName,
  WrapperComponent,
  klass = '',
  betOption = {},
  orderOption = {},
  setBetOption,
  lotteryConfig = {}
) {
  class HighFrequencyLotteryPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        omitType: 2,
        betOption: {}
      };
      this.subscription = null;
    }

    componentDidMount() {
      // 监听彩种切换，不同的彩种可能会传入不同的投注篮设置
      this.subscription = emitter.addListener(
        NUMBER_CHILD_LOTTERY_CHANGE,
        lotteryChildCode => {
          const betOption =
            typeof setBetOption === 'function'
              ? setBetOption(lotteryChildCode)
              : {};
          if (!isEqual(betOption, this.state.betOption)) {
            this.setState({ betOption });
          }
        }
      );
    }

    componentWillUnmount() {
      if (this.subscription) this.subscription.remove();
    }

    setOmitType(value) {
      if (this.value === this.state.omitType) return undefined;
      this.setState({ omitType: value });
    }

    newOrder(data) {
      return this.order.newOrder(data);
    }

    generateBet(balls, manual, fixedBalls) {
      return this.component.generateBet(balls, manual, fixedBalls);
    }

    ballRandom(highlight) {
      return this.component.ballRandom(highlight);
    }

    addNumber() {
      return this.component.addNumber();
    }

    editHandle(bet) {
      return this.component.editHandle(bet);
    }

    checkLimit(balls, fixedBalls) {
      if (typeof this.component.checkLimit === 'function') {
        return this.component.checkLimit(balls, fixedBalls);
      }
      return true;
    }

    render() {
      // console.log(lotteryConfig);
      return (
        <div className={ cx('high-frequency-lottery-page', klass) }>
          <Header title={ title }>
            <Menus
              onChange={ this.setOmitType.bind(this) }
              menu={ MENUS }
              lottery={ this.props.lotteryCode }
            />
          </Header>
          <div className="lottery-page-content">
            <WrapperComponent
              ref={ component => (this.component = component) }
              { ...this.props }
              lottery={ lotteryConfig }
              omitType={ this.state.omitType }
            />
          </div>
          <Orders
            lotteryCode={ this.props.lotteryCode }
            ref={ order => (this.order = order) }
            endSaleTime={ new Date(this.props.saleEndTime) }
            detail={ OrderDetail }
            { ...orderOption }
          />
          <BetBar
            name={ this.props.lotteryCode }
            remaining={ this.props.remaining }
            saleEndTime={ this.props.saleEndTime }
            generateBet={ this.generateBet.bind(this) }
            ballRandom={ this.ballRandom.bind(this) }
            lotteryCode={ this.props.lotteryCode }
            lotteryIssue={ this.props.lotteryIssue }
            getBetMulRule={ this.props.getBetMulRule.bind(this) }
            onNewOrder={ this.newOrder.bind(this) }
            onAddNumber={ this.addNumber.bind(this) }
            onBettingEdit={ this.editHandle.bind(this) }
            onCheckLimit={ this.checkLimit.bind(this) }
            getLotteryIssue={ this.props.getLotteryIssue.bind(this) }
            { ...betOption }
            { ...this.state.betOption }
          />
        </div>
      );
    }
  }

  HighFrequencyLotteryPage.propTypes = {
    lotteryCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    remaining: PropTypes.number.isRequired,
    lotteryIssue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    getBetMulRule: PropTypes.func.isRequired,
    saleEndTime: PropTypes.number.isRequired,
    getLotteryIssue: PropTypes.func.isRequired
  };

  return information(url, HighFrequencyLotteryPage, socketEventName);
}
