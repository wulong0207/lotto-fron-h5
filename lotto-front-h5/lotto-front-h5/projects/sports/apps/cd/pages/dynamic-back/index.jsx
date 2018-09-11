import React, { Component } from 'react';
import TAB from '../../components/tab';
import Attention from './component/attention.jsx';
import Relevant from './component/relevant.jsx';
import http from '@/utils/request';
import Loading from '../../components/loading';
import './css/dynamicList.scss';

export default class DynamicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      menuListIndex: 0,
      listData: []
    };
  }

  componentDidMount() {
    this.getListData(0, 0, 0).then(res => {
      this.setState({ listData: res.data });
    });
  }
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.index !== nextState.index ||
      this.state.menuListIndex !== nextState.menuListIndex
    ) {
      this.getListData(nextState.menuListIndex, nextState.index, 0).then(
        res => {
          this.setState({ listData: res.data });
        }
      );
    }
  }

  tabChange(index) {
    this.setState({ index });
    let lotteryCode = index ? 301 : 300;

    this.getListData(0, lotteryCode, 0).then(res => {
      this.setState({ listData: res.data });
    });
  }

  menuLsitClick(index) {
    this.setState({ menuListIndex: index });
  }

  getMenuType(index) {
    switch (index) {
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 3;
    }
  }

  getListData(menuListIndex, tabIndex, pageIndex) {
    let url = tabIndex
      ? '/order-copy/listUserIssueInfo'
      : '/order-copy/listOrderIssues';
    let data = {
      pageIndex: pageIndex,
      pageSize: 10,
      queryType: 2,
      token: window.sessionStorage.getItem('token'),
      sortCondition: this.state.index ? this.getMenuType(menuListIndex) : 3
    };
    return new Promise((resolve, reject) => {
      http
        .post(url, data)
        .then(res => {
          resolve(res);
        })
        .catch(reject);
    });
  }

  onPageIndexChange(index) {
    this.getListData(this.state.menuListIndex, this.state.index, index).then(
      res => {
        this.setState({ listData: res.data });
      }
    );
  }

  render() {
    let tabData = ['与我相关', '我的关注'];
    return (
      <div>
        <TAB
          tabData={ tabData }
          isShow={ !!this.state.index }
          tabChange={ this.tabChange.bind(this) }
          menuLsitClick={ this.menuLsitClick.bind(this) }
        />
        <div className="dynamicList">
          {!this.state.index ? (
            <Relevant listData={ this.state.listData } />
          ) : (
            <Attention listData={ this.state.listData } />
          )}
        </div>
        {/* 点击加载更多 */}
        <Loading onPageIndexChange={ this.onPageIndexChange.bind(this) } />
      </div>
    );
  }
}
