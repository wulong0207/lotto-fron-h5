import React, { Component } from 'react';
import RenEr from './components/rener.js';
import RenSan from './components/rensan.js';
import RenSi from './components/rensi.js';
import RenWu from './components/renwu.js';
import RenLiu from './components/renliu.js';
import RenQi from './components/renqi.js';
import RenBa from './components/renba.js';
import QianYi from './components/qianyi.js';
import QEGroup from './components/qianerzux.js';
import QESelect from './components/qianerzhix.js';
import QSgroup from './components/qiansanzux.js';
import QSSelect from './components/qiansanzhix.js';
import LESAN from './components/lesan.js';
import LESI from './components/lesi.js';
import LEWU from './components/lewu.js';
import PageConfig from './constants/pages';
import session from '@/services/session';
import Pages from './components/pages';
import child from '../../components/hoc/high-frequency/child';
import LotteryHistory from '../../components/history';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import DrawCode from '../../components/draw-code';
import './css/index.scss';

function DrawCodeTemplate({ drawCode }) {
  return (
    <span style={ { color: '#ed1c24' } }>
      {drawCode ? drawCode.replace(/,/g, ' ') : '号码获取中...'}
    </span>
  );
}

DrawCodeTemplate.propTypes = {
  drawCode: PropTypes.string
};

// anti-pattern 为了避免各子玩法页面在 render 的时候被重新实例化
// 所以先申明组件变量，在 constructor 中创建实例

let RenErPage,
  RenSanPage,
  RenSiPage,
  RenWuPage,
  RenLiuPage,
  RenQiPage,
  RenBaPage,
  QianYiPage,
  QEGroupPage,
  QESelectPage,
  QSgroupPage,
  QSSelectPage,
  LesanPage,
  LesiPage,
  LewuPage;

const TBA_SESSION_NAME = PageConfig.page().tabPages;

export default class K3Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: '',
      PAGES: PageConfig.page().tab,
      ConfigOmit: PageConfig.page().omit
    };
    RenErPage = child(
      this.state.PAGES[0].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenEr
    );
    RenSanPage = child(
      this.state.PAGES[1].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenSan
    );
    RenSiPage = child(
      this.state.PAGES[2].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenSi
    );
    RenWuPage = child(
      this.state.PAGES[3].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenWu
    );
    RenLiuPage = child(
      this.state.PAGES[4].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenLiu
    );
    RenQiPage = child(
      this.state.PAGES[5].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenQi
    );
    RenBaPage = child(
      this.state.PAGES[6].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      RenBa
    );
    QianYiPage = child(
      this.state.PAGES[7].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      QianYi
    );
    QEGroupPage = child(
      this.state.PAGES[8].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      QEGroup
    );
    QESelectPage = child(
      this.state.PAGES[9].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      QESelect
    );
    QSgroupPage = child(
      this.state.PAGES[10].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      QSgroup
    );
    QSSelectPage = child(
      this.state.PAGES[11].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      QSSelect
    );
    this.state.PAGES[12] &&
      (LesanPage = child(
        this.state.PAGES[12].lotteryChildCode,
        { ...props },
        this.state.ConfigOmit,
        LESAN
      ));
    this.state.PAGES[13] &&
      (LesiPage = child(
        this.state.PAGES[13].lotteryChildCode,
        { ...props },
        this.state.ConfigOmit,
        LESI
      ));
    this.state.PAGES[14] &&
      (LewuPage = child(
        this.state.PAGES[14].lotteryChildCode,
        { ...props },
        this.state.ConfigOmit,
        LEWU
      ));
  }

  componentDidMount() {
    const lastPage = session.get(TBA_SESSION_NAME); // 获取上次最后打开的页面
    const page =
      lastPage && this.state.PAGES.map(m => m.page).indexOf(lastPage) > -1
        ? lastPage
        : this.state.PAGES[0].page;
    if (this.isSelfContent()) {
    } else {
      this.setState({ page });
    }
  }

  isSelfContent() {
    let ballsData = session.get('sd11x5');
    if (ballsData) {
      let content = ballsData.balls;
      let PAGES = this.state.PAGES;
      let page;
      for (let i = 0; i < PAGES.length; i++) {
        if (PAGES[i].lotteryChildCode === ballsData.lotteryChildCode) {
          page = PAGES[i].page;
          break;
        }
      }
      if (!page) return false;
      this.editHandle({ page, content });
      session.remove('sd11x5');
      return true;
    }
    return false;
  }

  pageChangeHandle(page) {
    return new Promise((resolve, reject) => {
      if (
        page === this.state.page ||
        this.state.PAGES.map(m => m.page).indexOf(page) < 0
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
      omitTypes: omitType,
      subPlays: 1
    };
    switch (this.state.page) {
      case 'rener':
        return (
          <RenErPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'rensan':
        return (
          <RenSanPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'rensi':
        return (
          <RenSiPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'renwu':
        return (
          <RenWuPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'renliu':
        return (
          <RenLiuPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'renqi':
        return (
          <RenQiPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'renba':
        return (
          <RenBaPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qianyi':
        omitQuery.subPlays = 2;
        return (
          <QianYiPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qianerGroup':
        omitQuery.subPlays = 5;
        return (
          <QEGroupPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qianerSelect':
        omitQuery.subPlays = '2,3';
        return (
          <QESelectPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qiansanGroup':
        omitQuery.subPlays = 6;
        return (
          <QSgroupPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qiansanSelect':
        omitQuery.subPlays = '2,3,4';
        return (
          <QSSelectPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'lesan':
        omitQuery.subPlays = '2,3,4';
        return (
          <LesanPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'lesi':
        return (
          <LesiPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'lewu':
        return (
          <LewuPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
    }
  }

  render() {
    let { PAGES, page } = this.state;
    console.log('page', page, PAGES);
    return (
      <div className="yc-11x5">
        <Pages
          onChange={ this.pageChangeHandle.bind(this) }
          page={ page }
          pages={ PAGES }
          showSwitch={ true }
        />
        <LotteryHistory
          latestIssue={ this.props.latestIssue }
          url={ PageConfig.page().LotteryHistory }
          table={ [
            {
              label: '期次',
              field: 'issueCode'
            },
            {
              label: '开奖号码',
              template: ({ row }) => {
                return (
                  <div style={ { color: '#ed1c24' } }>
                    {row.drawCode
                      ? row.drawCode.replace(/,/g, ' ')
                      : '号码获取中...'}
                  </div>
                );
              }
            },
            {
              label: '  '
            },
            {
              label: '  ',
              field: 'sum'
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
        <div className="Eleven-content">{this.renderContent()}</div>
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
  drawRemaining: PropTypes.number
};
