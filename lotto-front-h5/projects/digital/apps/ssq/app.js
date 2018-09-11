import React, { Component } from 'react';
import PT from './components/pt';
import DT from './components/dt';
import { PAGES } from './constants/pages';
import session from '@/services/session';
import Pages from './components/pages';
import child from '../../components/hoc/child';
import LotteryHistory from '../../components/history';
import Orders from '../..//components/order';
import Header from '@/component/header';
import Menus from '../..//components/menus';
import BetBar from '../..//components/bet-bar';
import Bet from '@/bet/bet.js';

import './css/index.scss';

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
            var content = d.betContent;
            var Balls = content.split('|');
            var blueBall = Balls[1].replace(/,/g, ' ');
            var redBall = Balls[0].replace(/,/g, ' ');

            return (
              <tr key={ idx }>
                <td>
                  <div>
                    <em>{redBall}</em>
                    <em style={ { color: '#1e88d2' } }> {blueBall}</em>
                  </div>
                </td>
                <br />
                <td>
                  <span style={ { margin: '0 10px 0 0' } }>
                    {d.lotteryChildName}
                  </span>{' '}
                  <span>{d.betNum + '注'}</span>
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

let PTPage, DTPage;

export default class SSQIndex extends Component {
  constructor(props) {
    super(props);
    const lastPage = session.get('pl3_tab_page'); // 获取上次最后打开的页面
    const page =
      lastPage && PAGES.map(m => m.page).indexOf(lastPage) > -1
        ? lastPage
        : PAGES[0].page;
    this.state = {
      page,
      omitFlag: 1
    };
    PTPage = child(10001, { ...props }, '/ssq/omit', 1, PT);
    DTPage = child(10002, { ...props }, '/ssq/omit', 1, DT);

    this.betCal = new Bet('DoubleBall'); // 双色球计算算法
  }

  componentDidMount() {
    this.isSelfContent();
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
      session.set('pl3_tab_page', page);
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

  isSelfContent() {
    let ball = session.get('ballOrder') ? session.get('ballOrder') : '{}';
    if (ball.red) {
      let blueArr = [];
      let redArr = [];

      blueArr.push(ball['blue']);
      let str = ball['red'] || '';
      str = str || [];
      redArr = redArr.concat(str.split(','));

      let betNum = this.betCal.calc({
        redBall: redArr,
        bravery: [],
        braveryBlue: [],
        blueBall: blueArr
      });

      let period = ball['period'] ? ball['period'] : 1;
      this.betBar.setChaseNumHandle(period);
      this.setState({ balls: [redArr, blueArr], betNum });

      let bet = {
        betNum: betNum,
        content: redArr.join(',') + '|' + blueArr.join(','),
        contentType: 1,
        label: '普通投注 1注',
        lotteryChildCode: 10001,
        manual: true,
        page: 'pt'
      };
      this.editHandle(bet);

      session.remove('ballOrder');
    }
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
          <PTPage
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
  }

  render() {
    console.log('this.props.latestIssue', this.props.latestIssue);
    let latestIssue = this.props.latestIssue || {};
    let money = latestIssue.jackpotAmount || 0;
    if (money / 100000000 >= 1) {
      money = (money / 100000000).toFixed(2) + '亿';
    } else if (money / 10000 >= 1) {
      money = (money / 10000).toFixed(2) + '万';
    } else {
      money = 0;
    }
    const { page } = this.state;
    return (
      <div className="yc-ssq">
        <Header
          title="双色球"
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
          url={ '/ssq/recent/drawissue' }
          table={ [
            {
              label: '期次',
              field: 'issueCode'
            },
            {
              label: '开奖号码',
              template: ({ row }) => {
                return (
                  <div style={ { color: 'red' } }>
                    {row.drawCode ? (
                      <span>
                        {
                          <span style={ { color: '#ED1C24' } }>
                            {row.drawCode.split('|')[0].replace(/,/g, ' ')}{' '}
                            <span style={ { color: '#1e88d2' } }>
                              {row.drawCode.split('|')[1].replace(/,/g, ' ')}
                            </span>
                          </span>
                        }
                      </span>
                    ) : (
                      <span style={ { color: '#ED1C24' } }> 号码获取中...</span>
                    )}
                  </div>
                );
              }
            },
            {
              label: '',
              template: ({ row }) => <span>{}</span>
            },
            {
              label: '',
              field: 'sum'
            },
            {
              label: '',
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
                  {
                    <span style={ { color: '#ED1C24' } }>
                      {this.props.latestIssue.drawCode
                        .split('|')[0]
                        .replace(/,/g, ' ')}{' '}
                      <span style={ { color: '#1e88d2' } }>
                        {this.props.latestIssue.drawCode.split('|')[1]}
                      </span>
                    </span>
                  }
                </span>
              ) : (
                <span style={ { color: '#ED1C24' } }> 号码获取中...</span>
              )}
            </span>
          </div>
          <div>
            <span>第{this.props.curIssue.issueCode}期</span>
            <span> 截止时间： {this.props.curIssue.saleEndTime}</span>
          </div>
          {this.props.latestIssue.jackpotAmount && (
            <div>
              <span>
                当前奖池金额<em>{money}</em>
              </span>
            </div>
          )}
        </LotteryHistory>
        <div className="ssq-content">{this.renderContent()}</div>
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
          ref={ betBar => (this.betBar = betBar) }
          disableShake={ page === 'dt' }
        />
      </div>
    );
  }
}
