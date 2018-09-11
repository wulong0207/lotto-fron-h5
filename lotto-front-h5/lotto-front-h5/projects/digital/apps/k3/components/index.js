import React, { Component } from 'react';
import HZ from './hz';
import TH3 from './th3';
import TH2 from './th2';
import BTH3 from './bth3';
import BTH2 from './bth2';
import { PAGES } from '../constants';
import session from '@/services/session';
import Pages from '../../../components/pages';
import child from '../../../components/hoc/high-frequency/child';
import LotteryHistory from '../../../components/history';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import DrawCode from '../../../components/draw-code';
import '../css/index.scss';

function mapLotteryTypeCodeToLabel(type) {
  switch (type) {
    case 1:
      return '豹子';
    case 2:
      return '对子';
    case 3:
      return '三不同';
  }
}

function DrawCodeTemplate({ drawCode }) {
  return <em>{drawCode.replace(/,/g, ' ')}</em>;
}

DrawCodeTemplate.propTypes = {
  drawCode: PropTypes.string
};

// anti-pattern 为了避免各子玩法页面在 render 的时候被重新实例化
// 所以先申明组件变量，在 constructor 中创建实例

let HZPage, TH3Page, TH2Page, BTH3Page, BTH2Page;

const TBA_SESSION_NAME = 'k3_tab_page';

export default class K3Index extends Component {
  constructor(props) {
    super(props);
    const lastPage = session.get(TBA_SESSION_NAME); // 获取上次最后打开的页面
    const page =
      lastPage && PAGES.map(m => m.page).indexOf(lastPage) > -1
        ? lastPage
        : PAGES[0].page;
    this.state = {
      page
    };
    const { lottery } = this.props;
    const { children } = lottery;
    const omitUrl = `/${lottery.name}/omit`;
    HZPage = child(children.hz, { ...props }, omitUrl, HZ);
    TH3Page = child(children.th3, { ...props }, omitUrl, TH3);
    TH2Page = child(children.th2, { ...props }, omitUrl, TH2);
    BTH3Page = child(children.bth3, { ...props }, omitUrl, BTH3);
    BTH2Page = child(children.bth2, { ...props }, omitUrl, BTH2);
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
      session.set(TBA_SESSION_NAME, page);
    });
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

  checkLimit(balls, fixedBalls) {
    return this.page.getInstance().checkLimit(balls, fixedBalls);
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
    const { omitType } = this.props;
    let qryCount = 50;
    if (omitType === 1) {
      qryCount = 80;
    } else if (omitType === 2) {
      qryCount = 10;
    }
    const omitQuery = {
      qryCount,
      qryFlag: 1,
      omitTypes: omitType
    };
    switch (this.state.page) {
      case 'hz':
        return (
          <HZPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'th3':
        return (
          <TH3Page
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'th2':
        return (
          <TH2Page
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'bth3':
        return (
          <BTH3Page
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'bth2':
        return (
          <BTH2Page
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
    }
  }

  render() {
    const { lottery } = this.props;
    return (
      <div className="yc-k3">
        <Pages
          onChange={ this.pageChangeHandle.bind(this) }
          page={ this.state.page }
          pages={ PAGES }
          showSwitch={ false }
        />
        <LotteryHistory
          latestIssue={ this.props.latestIssue }
          url={ `/${lottery.name}/issue/recent/` }
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
                    {row.drawCode ? row.drawCode.replace(/,/g, ' ') : ''}
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
              field: 's'
            }
          ] }
        >
          <div>
            <span style={ { paddingRight: '10px' } }>
              第<em>{this.props.latestIssue.issueCode}</em>期
            </span>
            <DrawCode
              drawCode={ this.props.latestIssue.drawCode }
              remaining={ this.props.drawRemaining }
              template={ DrawCodeTemplate }
            />
          </div>
          <div>
            <span style={ { paddingRight: '10px' } }>
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
        <div className="k3-content">{this.renderContent()}</div>
      </div>
    );
  }
}

K3Index.propTypes = {
  latestIssue: PropTypes.shape({
    issueCode: PropTypes.string.isRequired,
    drawCode: PropTypes.string
  }),
  omitType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  saleEndTime: PropTypes.number,
  drawRemaining: PropTypes.number,
  lottery: PropTypes.object.isRequired
};
