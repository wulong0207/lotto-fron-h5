import React, { Component } from 'react';
import http from '@/utils/request';
import api from '../../services/api';
import list from '@/component/hoc/list';
import withRouterTab from '@/component/hoc/with-router-tab';
import { Link } from 'react-router';
import { Tabs, TabPanel } from '@/component/tabs';
import DropDown from '@/component/dropdown';
import Message from '@/services/message';
import Session from '@/services/session.js';
import './dynamic.scss';

function getListStatus(status, id, serviceTime, endLocalTime) {
  if (serviceTime < endLocalTime) {
    return (
      <Link to={ `/receipts/${id}` } key={ id }>
        <button className="btn">立即抄单</button>
      </Link>
    );
  }

  switch (status) {
    case 1:
      return;
    case 2:
      return <div className="openIssue weizhong" />;
    case 3:
    case 4:
      return <div className="openIssue" />;
  }
}

let FootballList;
let BasketballList;
let TabsComponent;

export default class Specialist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuListIndex: 0,
      sortIndex: 1,
      tabIndex: 0,
      attentionData: [],
      followData: [],
      serviceTime: new Date().getTime()
    };
    TabsComponent = withRouterTab(undefined, this.tabChangeHandle.bind(this))(
      QueryList
    );
  }

  tabChangeHandle(index) {
    this.setState({ tabIndex: index });
  }

  FollowDataChange(data) {
    this.setState({ followData: data });
  }

  fetch(tabIndex) {
    let location = 'getRelevant';
    let token = Session.get('token');
    let queryType = 5;
    if (tabIndex === 1) {
      location = 'getAttention';
      queryType = 2;
    }
    return (page, size, params) => {
      return new Promise((resolve, reject) => {
        api[location](page, 20, queryType, token, params['sortIndex'])
          .then(res => {
            this.setState({ serviceTime: res.serviceTime });
            resolve(res.data);
          })
          .catch(err => {
            console.log(err);
          });
      });
    };
  }
  setTabIndex() {
    if (this.state.tabIndex) {
      Session.set('index20171121', 1);
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.setTabIndex.bind(this));
  }

  componentWillMount() {
    const index = Session.get('index20171121');
    this.setState({ tabIndex: index });
    Session.remove('index20171121');
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.setTabIndex.bind(this));
  }

  onmenuListClick(index) {
    this.setState({ menuListIndex: index });
    this.state.sortIndex = index + 1;
  }

  attentionClick(index) {
    let url = '/order-copy/updateFocus';
    let data = {
      flag: index,
      token: window.sessionStorage.getItem('token'),
      userIssueId: this.state.followData[index].id
    };
    return new Promise((resolve, reject) => {
      http
        .post(url, data)
        .then(res => {
          if (res.errorCode === '10001') {
            let followData = this.state.followData.concat();
            followData.splice(index, 1);
            this.setState({ followData });
            Message.toast('取消关注成功', 2000);
          }

          resolve(res);
        })
        .catch(err => {
          Message.toast(err.message);
          reject(err);
        });
    });
  }
  DetailList({ data }) {
    return (
      <div className="list">
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
                  <div className="attentionBtn">
                    <span className="icon_gou" />
                    <span
                      className="txt"
                      onClick={ this.attentionClick.bind(this, index) }
                    >
                      已关注
                    </span>
                  </div>
                  <div className="contentBox">
                    <div className="nameBox">
                      <span className="name">{row.nickName}</span>
                      {row.level ? <span className="icon-zhuan">专</span> : ''}
                      {row.isRecommend ? (
                        <span className="icon-jian">荐</span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="message">
                      {/* <span className="predict"> */}
                      总推荐<em>{row.issueNum ? row.issueNum : 0}</em>
                      {/* </span> */}
                      <i className="icon_dot" />
                      {/* <span className="transcribe_num"> */}
                      命中率{row.hitRate ? row.hitRate : 0}
                      {/* </span> */}
                      <i className="icon_dot" />
                      {/* <span className="money"> */}
                      粉丝数{row.focusNumStr ? row.focusNumStr : 0}
                      {/* </span> */}
                    </div>
                    <div className="item-data">
                      <span className="probability">
                        {row.recentRecord ? row.recentRecord : ''}
                      </span>
                      <span className="continuous">
                        {row.continueHit ? row.continueHit : ''}
                      </span>
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

  gettranscribe({ data, serviceTime }) {
    // data = [
    //   {
    //     id: 435,
    //     orderCode: 'D17120912051317300068',
    //     orderAmount: 11111111111111111111,
    //     maxRoi: '151654656545645',
    //     followNumStr: '22222',
    //     isTop: 0,
    //     isRecommend: 89878998798,
    //     recentRecord: '近1场中1场',
    //     hitRate: '100%',
    //     level: 1,
    //     headUrl:
    //       'http://tvax1.sinaimg.cn/default/images/default_avatar_male_50.gif',
    //     endTime: '已截止',
    //     continueHitDb: 1,
    //     continueHit: '1连红',
    //     orderVisibleType: 1,
    //     createTimeStr: '2017-12-09',
    //     passway: '',
    //     nickName: '一品莲心',
    //     winStatus: 4,
    //     userIssueId: 82,
    //     endLocalTime: 1512808800000
    //   }
    // ];
    return (
      <div className="list">
        {data.map((row, index) => {
          return (
            <div className="relevantMes" key={ index }>
              <div className="relevantBox">
                <div className="box">
                  <Link to={ `/experts/${row.userIssueId}` }>
                    <img
                      src={
                        row.headUrl
                          ? row.headUrl
                          : require('../../img/default.png')
                      }
                    />
                  </Link>
                  <Link to={ `/receipts/${row.id}` } key={ row.id }>
                    <div className="contentBox">
                      <div className="nameBox">
                        <span className="name">{row.nickName}</span>
                        {row.level ? (
                          <span className="icon-zhuan">专</span>
                        ) : (
                          ''
                        )}
                        {row.isRecommend ? (
                          <span className="icon-jian">荐</span>
                        ) : (
                          ''
                        )}
                      </div>
                      <div
                        className="message"
                        style={ {
                          color: row.winStatus === 2 ? '#999' : '#666'
                        } }
                      >
                        预计回报<em
                          style={ {
                            color: row.winStatus === 2 ? '#999' : '#ED1C24'
                          } }
                        >
                          {row.maxRoi ? row.maxRoi : 0}倍
                        </em>
                        <i className="icon_dot" />
                        {row.followNumStr ? '抄单数' + row.followNumStr : ''}
                        {row.followNumStr ? <i className="icon_dot" /> : ''}
                        金额￥{row.orderAmount ? row.orderAmount : 0}
                      </div>
                      <div className="item-data">
                        <span className="probability">
                          {row.recentRecord ? row.recentRecord : ''}
                        </span>
                        <span className="continuous">
                          {row.continueHit ? row.continueHit : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="buttonBox">
                <span className="icon_clock" />
                <span className="time">{row.endTime ? row.endTime : ''}</span>
                {getListStatus(
                  row.winStatus,
                  row.id,
                  serviceTime,
                  row.endLocalTime
                )}
              </div>
              <div className="issueTime">
                {row.createTimeStr ? row.createTimeStr + '发布' : ''}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderTabs() {
    const tabs = [{ label: '与我相关' }, { label: '我的关注' }];
    return (
      <Tabs className="specialistTab" tabs={ tabs }>
        <TabPanel>
          <FootballList serviceTime={ this.state.serviceTime } />
        </TabPanel>
        <TabPanel>
          <BasketballList data={ this.state.followData } />
        </TabPanel>
      </Tabs>
    );
  }

  back() {
    // 返回回调方法
    window.history.go('-1');
  }

  render() {
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
        <TabsComponent
          ref={ tab => (this.tab = tab) }
          fetch={ this.fetch.bind(this) }
          onDataChange={ this.FollowDataChange.bind(this) }
          DetailList={ this.DetailList.bind(this) }
          gettranscribe={ this.gettranscribe.bind(this) }
          followData={ this.state.followData }
          serviceTime={ this.state.serviceTime }
          menuListIndex={ this.state.menuListIndex }
        />

        {this.state.tabIndex ? (
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
        ) : (
          ''
        )}
      </div>
    );
  }
}

class QueryList extends Component {
  constructor(props) {
    super(props);
    FootballList = list(props.fetch(0).bind(props), 1, 20, true)(
      props.gettranscribe.bind(props)
    );
    BasketballList = list(props.fetch(1).bind(props), 1, 20, true)(
      props.DetailList.bind(props)
    );
    this.followList = null;
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.menuListIndex !== 'undefined' &&
      nextProps.menuListIndex !== this.props.menuListIndex
    ) {
      console.log(this.followList);
      this.followList
        .getWrappedInstance()
        .refresh({ sortIndex: nextProps.menuListIndex + 1 });
    }
  }

  render() {
    const tabs = [{ label: '与我相关' }, { label: '我的关注' }];
    return (
      <Tabs className="specialistTab" tabs={ tabs }
        { ...this.props }>
        <TabPanel>
          <FootballList serviceTime={ this.props.serviceTime } />
        </TabPanel>
        <TabPanel>
          <BasketballList
            onChange={ this.props.onDataChange.bind(this) }
            data={ this.props.followData }
            ref={ list => (this.followList = list) }
          />
        </TabPanel>
      </Tabs>
    );
  }
}
