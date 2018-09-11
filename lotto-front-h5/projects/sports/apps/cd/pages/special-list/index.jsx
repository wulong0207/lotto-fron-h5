import React, { Component } from 'react';
import api from '../../services/api';
import list from '@/component/hoc/list';
import withRouterTab from '@/component/hoc/with-router-tab';
import { Link } from 'react-router';
import { Tabs, TabPanel } from '@/component/tabs';
import DropDown from '@/component/dropdown';
import './css/specialist.scss';

function DetailList({ data }) {
  // data = [
  //   {
  //     id: 81,
  //     recentRecord: '近1场中1场',
  //     hitRate: '100%',
  //     issueNum: 1,
  //     focusNumStr: '2',
  //     headUrl:
  //       'http://q.qlogo.cn/qqapp/101380144/9DCAF221C0FA2D1887684E4E96DC23B7/100',
  //     nickName: '花落无声',
  //     level: 1,
  //     continueHit: '1连红',
  //     bonusRate: '1282%',
  //     updateNum: 100
  //   }
  // ];
  return (
    <div className="transcribeBox_index">
      {data.map((row, index) => {
        return (
          <div className="listMes" key={ index }>
            <div className="listBox">
              <div className="box">
                <Link to={ `/experts/${row.id}` }>
                  <img
                    src={
                      row.headUrl
                        ? row.headUrl
                        : require('../../img/default.png')
                    }
                  />
                </Link>
                {row.updateNum ? (
                  <Link to={ `/experts/${row.id}` }>
                    <div className="jian">
                      最新推荐{' '}
                      <div className="num">
                        <span>{row.updateNum}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  ''
                )}
                <div className="contentBox">
                  <div className="nameBox">
                    <span className="name">{row.nickName}</span>
                  </div>
                  <div className="message">
                    <span className="predict">
                      总推荐{row.issueNum ? row.issueNum : 0}
                    </span>
                    <i className="icon_dot" />
                    <span className="transcribe_num">
                      命中率<em>{row.hitRate ? row.hitRate : '0'}</em>
                    </span>
                    <i className="icon_dot" />
                    <span className="fans">
                      粉丝数{row.focusNumStr ? row.focusNumStr : 0}
                    </span>
                  </div>
                  <div className="item-data">
                    <span className="probability">
                      {row.recentRecord ? row.recentRecord : ''}
                    </span>
                    {row.continueHit ? (
                      <span className="continuous">
                        {row.continueHit ? row.continueHit : ''}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

let FootballList;
let BasketballList;
let TabsComponent;

export default class Specialist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuListIndex: 0,
      sortIndex: 1
    };

    FootballList = list(this.fetch(300).bind(this), 1, 20, true)(DetailList);
    BasketballList = list(this.fetch(301).bind(this), 1, 20, true)(DetailList);
    TabsComponent = withRouterTab()(QueryList);
  }

  fetch(lotteryCode) {
    let location = 'getSpeciaList';
    if (this.tab === 1) {
    }
    return page => {
      return new Promise((resolve, reject) => {
        api[location](lotteryCode, 1, 20, page, this.state.sortIndex)
          .then(res => {
            resolve(res.data);
          })
          .catch(reject);
      });
    };
  }

  componentDidMount() {}

  onmenuListClick(index) {
    this.setState({ menuListIndex: index });
    this.state.sortIndex = index + 1;

    FootballList = list(this.fetch(300).bind(this), 1, 20, true)(DetailList);
    BasketballList = list(this.fetch(301).bind(this), 1, 20, true)(DetailList);
  }

  renderTabs() {
    const tabs = [{ label: '足球专家' }, { label: '篮球专家' }];
    return (
      <Tabs ref={ tab => (this.tab = tab) } className="specialistTab"
        tabs={ tabs }>
        <TabPanel>
          <FootballList />
        </TabPanel>
        <TabPanel>
          <BasketballList />
        </TabPanel>
      </Tabs>
    );
  }

  back() {
    window.history.go('-1');
  }

  render() {
    const DropDownData = (
      <div>
        <span>命中率最大</span>
        <span>推荐最多</span>
        <span>最大连红</span>
      </div>
    );
    const toggler = (
      <div>
        <i />
        <i />
        <i />
      </div>
    );
    let data = ['命中率最大', '推荐最多', '最大连红'];
    return (
      <div>
        <a
          href="javascript: void(0);"
          className="backPage"
          onClick={ this.back.bind(this) }
        >
          <span />
        </a>
        <TabsComponent fetch={ this.fetch.bind(this) } />
        <DropDown className="specialistMenu" toggler={ toggler }>
          <div>
            {data.map((row, ind) => {
              return (
                <span
                  className={
                    ind === this.state.menuListIndex ? 'item active' : 'item'
                  }
                  key={ ind }
                  onClick={ this.onmenuListClick.bind(this, ind) }
                >
                  {row}
                </span>
              );
            })}
          </div>
        </DropDown>
      </div>
    );
  }
}

class QueryList extends Component {
  constructor(props) {
    super(props);
    FootballList = list(props.fetch(300).bind(props), 1, 20, true)(DetailList);
    BasketballList = list(props.fetch(301).bind(props), 1, 20, true)(
      DetailList
    );
  }

  render() {
    const tabs = [{ label: '足球专家' }, { label: '篮球专家' }];
    return (
      <Tabs className="specialistTab" tabs={ tabs }
        { ...this.props }>
        <TabPanel>
          <FootballList />
        </TabPanel>
        <TabPanel>
          <BasketballList />
        </TabPanel>
      </Tabs>
    );
  }
}
