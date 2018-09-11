import React, { Component } from 'react';
import RenEr from './components/wxzx.js';
import RenSan from './components/wxtx.js';
import RenSi from './components/sxzx.js';
import RenWu from './components/sxzxSum.js';
import RenLiu from './components/sxzs.js';
import RenQi from './components/sxzsDan.js';
import RenBa from './components/sxzl.js';
import QianYi from './components/sxzlDan.js';
import QEGroup from './components/exSelect.js';
import QESelect from './components/exSelectSum.js';
import QSgroup from './components/exGroup.js';
import QSSelect from './components/exGroupDan.js';
import ExGroupSum from './components/exGroupSum.js';
import SelectOne from './components/selectOne.js';
import MaxMin from './components/maxmin.js';
import PageConfig from './constants/pages';
import session from '@/services/session';
import Pages from '../../components/pages';
import child from '../../components/hoc/high-frequency/child';
import LotteryHistory from '../../components/history';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import DrawCode from '../../components/draw-code';
import './css/index.scss';

function DrawCodeTemplate({ drawCode }) {
  return (
    <span style={ { color: '#ed1c24' } } key={ new Date() }>
      {drawCode ? drawCode.replace(/\|/g, ' ') : '号码获取中...'}
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
  ExGroupSumPage,
  SelectOnePage,
  MaxMinPage;

const TBA_SESSION_NAME = 'cqssc_tab_page';

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
    ExGroupSumPage = child(
      this.state.PAGES[12].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      ExGroupSum
    );
    SelectOnePage = child(
      this.state.PAGES[13].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      SelectOne
    );
    MaxMinPage = child(
      this.state.PAGES[14].lotteryChildCode,
      { ...props },
      this.state.ConfigOmit,
      MaxMin
    );
  }

  componentDidMount() {
    let config = this.state.PAGES;
    const lastPage = session.get(TBA_SESSION_NAME); // 获取上次最后打开的页面
    const page =
      lastPage && config.map(m => m.page).indexOf(lastPage) > -1
        ? lastPage
        : config[0].page;
    this.setState({ page });
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
    let omitQuery = {
      qryCount,
      qryFlag: 1,
      omitTypes: omitType
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
        omitQuery.qryFlag = 4;
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
        omitQuery.qryFlag = 3;
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
        omitQuery.qryFlag = 3;
        return (
          <QianYiPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qianerGroup':
        return (
          <QEGroupPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qianerSelect':
        omitQuery.qryFlag = 4;
        return (
          <QESelectPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qiansanGroup':
        return (
          <QSgroupPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'qiansanSelect':
        omitQuery.qryFlag = 3;
        return (
          <QSSelectPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'exzxhz':
        omitQuery.qryFlag = 4;
        return (
          <ExGroupSumPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'selectOne':
        return (
          <SelectOnePage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
      case 'MaxMin':
        return (
          <MaxMinPage
            ref={ page => (this.page = page) }
            omitQuery={ omitQuery }
            omitKey="omitTypes"
          />
        );
    }
  }

  render() {
    let { PAGES } = this.state;
    return (
      <div className="yc-k3">
        <Pages
          onChange={ this.pageChangeHandle.bind(this) }
          page={ this.state.page }
          pages={ PAGES }
          showSwitch={ true }
        />
        <LotteryHistory
          latestIssue={ this.props.latestIssue }
          url={ PageConfig.page().LotteryHistory }
          table={ [
            {
              label: '期次',
              field: 'issue'
            },
            {
              label: '开奖号码',
              template: ({ row }) => {
                return (
                  <div style={ { color: '#ed1c24' } }>
                    {row.drawCode
                      ? row.drawCode.replace(/\|/g, ' ')
                      : '号码获取中...'}
                  </div>
                );
              }
            },
            {
              label: '十位',
              template: ({ row }) => {
                return <div>{row.stype ? row.stype : ''}</div>;
              }
            },
            {
              label: '个位',
              template: ({ row }) => {
                return <div>{row.gtype ? row.gtype : ''}</div>;
              }
            },
            {
              label: '后三位',
              template: ({ row }) => {
                return <div>{row.h3type ? row.h3type : ''}</div>;
              }
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
  drawRemaining: PropTypes.number
};
