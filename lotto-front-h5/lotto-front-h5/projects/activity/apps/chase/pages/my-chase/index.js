import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { getParameter, formatMoney, browser } from '@/utils/utils';
import http from '@/utils/request';
import Header from '@/component/header';
import session from '@/services/session.js';
import { Link } from 'react-router';
import './my-chase.scss';
import cx from 'classnames';

function NoMessage({ goChase }) {
  return (
    <div className="no-message">
      <img className="img" src={ require('../../img/no-chase.png') } />
      <b className="no-chase">暂未购买过追号套餐</b>
      <p>现在购彩下一个大奖或许就是您哦~</p>

      <div className="buy" onClick={ () => goChase() }>
        立即购彩
      </div>
    </div>
  );
}

function List({ list, goDetail }) {
  return (
    <div className="chase">
      {list.map((val, index) => {
        return (
          <div className="list" key={ index }
            onClick={ () => goDetail(val) }>
            <div className="top">
              <div className="title">
                {val.lotteryCode === 100 ? (
                  <img src={ require('../../img/ssq.png') } />
                ) : (
                  <img src={ require('../../img/dlt.png') } />
                )}
                {val.lotteryCode === 100 ? (
                  <span>
                    <b>双色球-共追{val.totalIssue}期</b>
                    <b>{val.orderAmount}元</b>
                  </span>
                ) : (
                  <span>
                    <b>大乐透-共追{val.totalIssue}期</b>
                    <b>{val.orderAmount}元</b>
                  </span>
                )}
              </div>
              <div className="issue">
                {val.addStatus === 1 ? <span className="grey">追号中</span> : ''}
                <span className="">
                  已追<b className="issue-orange">{val.hadIssue}</b>期
                </span>
              </div>
            </div>
            <div className="bottom">
              <span className="date grey">{val.showDate}</span>
              <span
                className={ cx(
                  'status',
                  val.winningStatus !== 1 ? 'status-red' : ''
                ) }
              >
                {val.winningText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

class Chase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: null // 订单总数
    };
    this.pages = 0;
  }
  componentDidMount() {
    this.getQueryAddOrderList();
  }
  goChase() {
    window.location.href = 'chase.html#/';
  }
  getQueryAddOrderList(activityCode) {
    http
      .post('/order/queryAddOrderListInfo', {
        activityCode: `${getParameter('code')},${getParameter(
          'code1'
        )},${getParameter('code2')}`,
        addQueryType: 2,
        pageIndex: this.pages,
        pageSize: 10,
        token: session.get('token')
      })
      .then(res => {
        let { list, total } = this.state || [];
        total = res.data.total;
        list = list.concat(res.data.data);
        this.setState({ list, total });
      })
      .catch(err => {
        console.error(err);
      });
  }
  goDetail(val) {
    console.log(val, 'val');
    window.location.href = `/sc.html#/orders/${val.orderCode}`;
  }
  loadMore() {
    this.pages++;
    this.getQueryAddOrderList();
  }
  render() {
    let { list, total } = this.state;
    return (
      <div className="my-chase">
        <Header title="我的追号" bg="white" />
        {list.length > 0 ? (
          <List list={ list } goDetail={ this.goDetail.bind(this) } />
        ) : (
          <NoMessage goChase={ this.goChase.bind(this) } />
        )}
        {total && total > list.length ? (
          <div className="load-more">
            <span onClick={ this.loadMore.bind(this) }>加载更多</span>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Chase;
