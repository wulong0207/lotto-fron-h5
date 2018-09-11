import React, { Component } from 'react';
import ZX from './zx';
import ZXHZ from './zxhz';
import ZX3 from './zx3';
import HZ3 from './hz3';
import BH3 from './bh3';
import BH6 from './bh6';
import HZ6 from './hz6';
import DT6 from './dt6';
import { PAGES } from '../constants/pages';
import session from '@/services/session';
import Pages from './pages';
import '../css/index.scss';
import child from '../../../components/hoc/child';
import LotteryHistory from '../../../components/history';
import Orders from '../../../components/order';
import Header from '@/component/header.jsx';
import Menus from '../../../components/menus';
import BetBar from '../../../components/bet-bar';

function mapLotteryTypeCodeToLabel(type) {
  switch (type) {
    case 1:
      return '豹子';
    case 2:
      return '组三';
    case 3:
      return '组六';
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

function getLotteryChildCode(page) {
  const pageObj = PAGES.filter(i => i.page === page)[0];
  return pageObj.lotteryChildCode;
}

function DrawCodeTest({ row }) {
  const drawCode = row.drawCode ? row.drawCode.split('|') : [];
  const drawCodeTest = row.drawCodeTest ? row.drawCodeTest.split('|') : [];
  return (
    <div>
      {drawCodeTest.map((d, idx) => {
        return (
          <span
            style={ { color: drawCode.indexOf(d) > -1 ? 'red' : '' } }
            key={ idx }
          >
            {d}
          </span>
        );
      })}
    </div>
  );
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

let ZXPage, ZXHZPage, ZX3Page, HZ3Page, BH3Page, BH6Page, HZ6Page, DT6Page;

export default class F3dIndex extends Component {
  constructor(props) {
    super(props);
    const lastPage = session.get('f3d_tab_page'); // 获取上次最后打开的页面
    const page =
      lastPage && PAGES.map(m => m.page).indexOf(lastPage) > -1
        ? lastPage
        : PAGES[0].page;
    this.state = {
      page,
      omitFlag: 1
    };
    ZXPage = child(10501, { ...props }, '/f3d/omit', 1, ZX);
    ZXHZPage = child(10501, { ...props }, '/f3d/omit', 3, ZXHZ);
    ZX3Page = child(10502, { ...props }, '/f3d/omit', undefined, ZX3);
    HZ3Page = child(10502, { ...props }, '/f3d/omit', 4, HZ3);
    BH3Page = child(10502, { ...props }, '/f3d/omit', 2, BH3);
    BH6Page = child(10503, { ...props }, '/f3d/omit', 2, BH6);
    HZ6Page = child(10503, { ...props }, '/f3d/omit', 5, HZ6);
    DT6Page = child(10503, { ...props }, '/f3d/omit', 5, DT6);
  }

  pageChangeHandle(page) {
    return new Promise((resolve, reject) => {
      if (
        page === this.state.page ||
        PAGES.map(m => m.page).indexOf(page) < 0
      ) {
        return resolve(page);
      }
      this.setState({ page }, () => resolve(page));
      session.set('f3d_tab_page', page);
    });
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

  editHandle(bet) {
    const { page, content } = bet;
    this.pageChangeHandle(page).then(() => {
      const instance = this.page.getInstance();
      if (typeof instance.then === 'function') {
        setTimeout(
          () => instance.then(page => page.editHandle(content.toString())),
          100
        );
      } else {
        setTimeout(() => instance.editHandle(content.toString()), 100);
      }
    });
  }

  renderContent() {
    switch (this.state.page) {
      case 'zx':
        return (
          <ZXPage
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'zxhz':
        return (
          <ZXHZPage
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'zx3':
        return (
          <ZX3Page
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'bh3':
        return (
          <BH3Page
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'hz3':
        return (
          <HZ3Page
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'bh6':
        return (
          <BH6Page
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'hz6':
        return (
          <HZ6Page
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'dt6':
        return (
          <DT6Page
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
    }
  }

  render() {
    return (
      <div className="yc-f3d">
        <Header
          title="福彩3D"
          back={ () => {
            location.href = '/';
          } }
        >
          <Menus
            onChangeType={ this.setOmitFlag.bind(this) }
            lottery={ this.props.lotteryCode }
          />
        </Header>
        <Pages
          onPageChange={ this.pageChangeHandle.bind(this) }
          page={ this.state.page }
        />
        <LotteryHistory
          latestIssue={ this.props.latestIssue }
          url={ '/f3d/recent/drawissue' }
          table={ [
            {
              label: '期次',
              field: 'issue'
            },
            {
              label: '开奖号码',
              template: ({ row }) => {
                return (
                  <div style={ { color: 'red' } }>
                    {row.drawCode ? row.drawCode.replace(/\|/g, ' ') : ''}
                  </div>
                );
              }
            },
            {
              label: '形态',
              template: ({ row }) => (
                <span>{mapLotteryTypeCodeToLabel(row.type)}</span>
              )
            },
            {
              label: '和值',
              field: 'sum'
            },
            {
              label: '试机号',
              template: DrawCodeTest
            }
          ] }
        >
          <div>
            <span>
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
          lotteryChildCode={ getLotteryChildCode(this.state.page) }
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
