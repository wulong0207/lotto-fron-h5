import React, { Component } from 'react';
import BH from './pt';
import DT from './dt';
import { PAGES } from '../constants';
import session from '@/services/session';
import Pages from './pages';
import child from '../../../components/hoc/child';
import LotteryHistory from '../../../components/history';
import Orders from '../../../components/order';
import Header from '@/component/header.jsx';
import Menus from '../../../components/menus';
import BetBar from '../../../components/bet-bar';
import dateFormat from 'dateformat';

import '../css/index.scss';

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
  console.log(page);
  console.log(pageObj.lotteryChildCode);
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
            console.log(d, idx);
            return (
              <tr key={ idx }>
                <td>
                  <em>{d.betContent}</em>
                </td>
                <td>
                  <span style={ { margin: '0' } }>
                    {d.lotteryChildName}
                    {d.contentType == '3'
                      ? ''
                      : mapContentTypeToLabel(d.contentType)}
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
let BHPage, DTPage;
export default class QLCIndex extends Component {
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
    BHPage = child(10101, { ...props }, '/qlc/omit', 1, BH);
    DTPage = child(10102, { ...props }, '/qlc/omit', 1, DT);
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
    return this.page
      .getInstance()
      .generateBet(balls.sort(), manual, fixedBalls);
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
      case 'pt':
        return (
          <BHPage
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
      case 'dt':
        return (
          <DTPage
            onNewOrder={ this.newOrder.bind(this) }
            ref={ page => (this.page = page) }
            omitFlag={ this.state.omitFlag }
          />
        );
    }
    // return (
    //   <BHPage
    //     onNewOrder={ this.newOrder.bind(this) }
    //     ref={ page => this.page = page }
    //     omitFlag={ this.state.omitFlag }
    //   />
    // );
  }

  render() {
    return (
      <div className="yc-qlc">
        <Header
          title="七乐彩"
          back={ () => {
            window.location.href = '/';
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
          url={ '/qlc/recent/drawissue' }
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
                    {row.drawCode
                      ? row.drawCode.replace(/\,/g, ' ').slice(0, length - 2)
                      : ''}
                    <span style={ { color: '#1E88D2' } }>
                      {row.drawCode
                        ? row.drawCode.replace(/\,/g, ' ').slice(length - 2)
                        : ''}
                    </span>
                  </div>
                );
              }
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
                  <span style={ { color: 'red' } }>
                    {this.props.latestIssue.drawCode
                      .replace(/\,/g, ' ')
                      .slice(0, length - 2)}
                  </span>
                  <span style={ { color: '#1E88D2' } }>
                    {this.props.latestIssue.drawCode
                      .replace(/\,/g, ' ')
                      .slice(length - 2)}
                  </span>
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
