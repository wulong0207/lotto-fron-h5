import React, { Component } from 'react';
import RenEr from './rener.js';
import RenSan from './rensan.js';
import RenSi from './rensi.js';
import RenWu from './renwu.js';
import RenLiu from './renliu.js';
import RenQi from './renqi.js';
import RenBa from './renba.js';
import QianYi from './qianyi.js';
import QEGroup from './qianerzux.js';
import QESelect from './qianerzhix.js';
import PageConfig from '../constants/pages';
import session from '@/services/session';
import Pages from '../../../components/pages';
import child from '../../../components/hoc/high-frequency/child';
import LotteryHistory from '../../../components/history';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import DrawCode from '../../../components/draw-code';
import '../css/index.scss';

function DrawCodeTemplate({ drawCode }) {
  return <span style={ { color: '#ed1c24' } }>{openIssue(drawCode)}</span>;
}

function pkType(p) {
  let pk = '-';
  switch (p) {
    case 0:
      pk = '散牌';
      break;
    case 1:
      pk = '同花顺';
      break;
    case 2:
      pk = '同花';
      break;
    case 3:
      pk = '顺子';
      break;
    case 4:
      pk = '对子';
      break;
    case 5:
      pk = '豹子';
      break;
  }
  return pk;
}

function openIssue(balls) {
  balls = balls || '';
  let ball = balls.split('|') || [];
  let ballArr = [];
  let htmlstr = [];

  ball.map((item, index) => {
    ballArr.push(item.split('_'));
  });

  ballArr.map((row, index) => {
    row.map((b, ind) => {
      let key = index + '' + ind;
      if (ind === 0) {
        switch (b) {
          case '1':
            htmlstr.push(
              <img
                key={ key }
                src={ require('../../../../../lib/img/klpk3/heitao_min.png') }
              />
            );
            break;
          case '2':
            htmlstr.push(
              <img
                key={ key }
                src={ require('../../../../../lib/img/klpk3/hongtao_min.png') }
              />
            );
            break;
          case '3':
            htmlstr.push(
              <img
                key={ key }
                src={ require('../../../../../lib/img/klpk3/meihua_min.png') }
              />
            );
            break;
          case '4':
            htmlstr.push(
              <img
                key={ key }
                src={ require('../../../../../lib/img/klpk3/fangkuai_min.png') }
              />
            );
            break;
        }
      } else {
        htmlstr.push(<span key={ key }>{b}</span>);
      }
    });
  });

  return htmlstr;
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
  QESelectPage;

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
    }
  }

  render() {
    let { PAGES } = this.state;
    return (
      <div className="yc-11x5">
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
                  <div style={ { color: '#ed1c24' } } key={ row }>
                    {openIssue(row.drawCode)}
                  </div>
                );
              }
            },
            {
              label: '形态',
              template: ({ row }) => {
                return <div key={ row }>{pkType(row.type)}</div>;
              }
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
