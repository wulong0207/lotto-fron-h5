import React, { Component } from 'react';
import { Link } from 'react-router';

import '../css/problem.scss';
import Header from '@/component/header';
import http from '@/utils/request';
import Message from '@/services/message';
import { getParameter } from '@/utils/utils';
import NoMsg from '@/component/no-msg';

export class ProblemIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      problemlist: [],
      totalpage: 0
    };
    this.page = 0;
  }
  componentWillMount() {
    this.getProblemList();
  }
  getProblemList() {
    let code = getParameter('typecode');
    let params = {
      outHelpId: '',
      pageIndex: this.page,
      pageSize: 10,
      typeCode: code
    };
    http
      .get('/help/list', { params })
      .then(res => {
        this.setState({
          problemlist: res.data.data,
          totalpage: Math.ceil(
            res.data.total / params.pageSize <= 1
              ? undefined
              : res.data.total / params.pageSize
          )
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 加载更多
  loadMore() {
    this.page++;
    let code = getParameter('typecode');
    let params = {
      outHelpId: '',
      pageIndex: this.page,
      pageSize: 10,
      typeCode: code
    };
    http
      .get('/help/list', { params })
      .then(res => {
        let problemlist = res.data.data;
        problemlist = this.state.problemlist.concat(problemlist);
        // console.log(problemlist);
        this.setState({ problemlist });
      })
      .catch(err => {
        Message.toast(err.message);
      });
    // console.log(this.page);
    // console.log(this.state.totalpage);
  }
  render() {
    let problemList = this.state.problemlist || [];
    let totalPage = this.state.totalpage;
    return (
      <div className="problem">
        <Header title="问题列表" />
        <div className="problemlist">
          <ul className="proli">
            {problemList.length < 1 ? (
              <NoMsg msg={ '没有相关内容' } />
            ) : (
              problemList.map((e, i) => {
                return (
                  <Link to={ '/answer?helpId=' + e.id } key={ i }>
                    <li className="pro-cont">
                      <p>{e.title}</p>
                      {e.containsAudio ? (
                        <img src={ require('../img/laba.png') } alt="" />
                      ) : (
                        ''
                      )}
                    </li>
                  </Link>
                );
              })
            )}
          </ul>
          {problemList.length > 0 ? (
            totalPage > this.page ? (
              <div
                className="load-more"
                key={ 'li' }
                onClick={ event => this.loadMore(event) }
              >
                点击加载更多
              </div>
            ) : (
              <div className="load-more" key={ 'li' }>
                没有更多了
              </div>
            )
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
