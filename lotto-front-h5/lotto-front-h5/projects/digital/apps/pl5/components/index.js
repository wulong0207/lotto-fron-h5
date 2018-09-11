import React, { Component } from 'react';
import ZX from './zx';
import child from '../../../components/hoc/child';
import LotteryHistory from '../../../components/history';
import Orders from '../../../components/order';
import Header from '@/component/header.jsx';
import Menus from '../../../components/menus';
import BetBar from '../../../components/bet-bar';
import dateFormat from 'dateformat';

import '../css/index.scss';

function mapToLabel(type) {
  switch (type) {
    case 1:
      return '5:0';
    case 2:
      return '4:1';
    case 3:
      return '3:2';
    case 4:
      return '2:3';
    case 5:
      return '1:4';
    case 6:
      return '0:5';
  }
}

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
                  <span style={ { margin: '0' } }>
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

// anti-pattern 为了避免各子玩法页面在 render 的时候被重新实例化
// 所以先申明组件变量，在 constructor 中创建实例

let ZXPage;

export default class PL5Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      omitFlag: 1
    };
    ZXPage = child(10301, { ...props }, '/pl5/omit', 1, ZX);
  }

  setOmitFlag(type) {
    if (type === this.state.omitFlag) return undefined;
    this.setState({ omitFlag: type });
  }

  newOrder(data) {
    return this.order.newOrder(data);
  }

  generateBet(balls, manual, fixedBalls) {
    return this.page.getInstance().generateBet(balls, manual, fixedBalls);
  }

  ballRandom(highlight) {
    return this.page.getInstance().ballRandom(highlight);
  }

  addNumber() {
    return this.page.getInstance().addNumber();
  }

  editHandle({ page, content }) {
    const instance = this.page.getInstance();
    if (typeof instance.then === 'function') {
      setTimeout(
        () => instance.then(page => page.editHandle(content.toString())),
        100
      );
    } else {
      setTimeout(() => instance.editHandle(content.toString()), 100);
    }
  }

  renderContent() {
    return (
      <ZXPage
        onNewOrder={ this.newOrder.bind(this) }
        ref={ page => (this.page = page) }
        omitFlag={ this.state.omitFlag }
      />
    );
  }

  render() {
    return (
      <div className="yc-pl5">
        <Header
          title="排列5"
          back={ () => {
            window.location.href = '/';
          } }
        >
          <Menus
            onChangeType={ this.setOmitFlag.bind(this) }
            lottery={ this.props.lotteryCode }
          />
        </Header>
        <LotteryHistory
          latestIssue={ this.props.latestIssue }
          url={ '/pl5/recent/drawissue' }
          table={ [
            {
              label: '期次',
              field: 'issue'
            },
            {
              label: '开奖号码',
              template: ({ row }) =>
                row.drawCode ? (
                  <div style={ { color: 'red' } }>
                    {row.drawCode.split('|').map((d, idx) => (
                      <span key={ idx } style={ { padding: '0 2px' } }>
                        {d}
                      </span>
                    ))}
                  </div>
                ) : null
            },
            {
              label: '大小比',
              template: ({ row }) => <span>{mapToLabel(row.bs)}</span>
            },
            {
              label: '奇偶比',
              template: ({ row }) => <span>{mapToLabel(row.oe)}</span>
            },
            {
              label: '和值',
              field: 'sum'
            }
          ] }
        >
          <div>
            <span style={ { paddingRight: '5px' } }>
              第<em>{this.props.latestIssue.issueCode}</em>期
            </span>
            <span>
              {this.props.latestIssue.drawCode ? (
                <span>
                  开奖号码:{' '}
                  {this.props.latestIssue.drawCode.replace(/\|/g, ' ')}
                </span>
              ) : (
                <span>等待开奖</span>
              )}
            </span>
          </div>
          <div>
            <span style={ { paddingRight: '5px' } }>
              第<em>{this.props.latestIssue.issueCode}</em>期
            </span>
            <span>
              截至时间：{dateFormat(
                new Date(this.props.saleEndTime),
                'yyyy-mm-dd HH:MM:ss'
              )}
            </span>
          </div>
        </LotteryHistory>
        <div className="f3d-content">
          {this.renderContent()}
          {/* { React.createElement(child(10501, { ...this.props }, '/h5/f3d/omit', 1, ZX), { onNewOrder: this.newOrder.bind(this), omitFlag: this.state.omitFlag }) } */}
        </div>
        <Orders
          lotteryCode={ this.props.curLottery.lotteryCode }
          ref={ order => (this.order = order) }
          endSaleTime={ new Date(this.props.saleEndTime) }
          detail={ OrderDetail }
        />
        <BetBar
          name={ this.props.lotteryCode }
          remaining={ this.props.remaining }
          saleEndTime={ this.props.saleEndTime }
          generateBet={ this.generateBet.bind(this) }
          ballRandom={ this.ballRandom.bind(this) }
          lotteryCode={ this.props.lotteryCode }
          lotteryChildCode={ 10301 }
          lotteryIssue={ this.props.lotteryIssue }
          getBetMulRule={ this.props.getBetMulRule.bind(this) }
          onNewOrder={ this.newOrder.bind(this) }
          onAddNumber={ this.addNumber.bind(this) }
          onBettingEdit={ this.editHandle.bind(this) }
        />
      </div>
    );
  }
}
