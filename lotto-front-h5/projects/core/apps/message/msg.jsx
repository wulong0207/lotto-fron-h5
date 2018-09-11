import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '@/component/header';
import session from '@/services/session.js';
import http from '@/utils/request';
import Message from '@/services/message';
import { getParameter } from '@/utils/utils';
import NoMsg from '@/component/no-msg';

import './css/msg.scss';

export function Index({ children }) {
  return <div className="msg">{children}</div>;
}

// 消息中心
export class MsgCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgLine: []
    };
  }
  componentWillMount() {
    let token = session.get('token');
    let params = {
      sendType: 1,
      token: token
    };
    http
      .post('/message/menu', params)
      .then(res => {
        // console.log(res.data);
        let msgLine = res.data;
        msgLine = msgLine.slice(1, msgLine.length);
        msgLine = msgLine.map((a, index) => {
          return {
            ...a,
            img: this.icon(a.msgType)
          };
        });
        // console.log(msgLine)
        this.setState({ msgLine });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  read(e, type) {
    let token = session.get('token');
    let params = {
      msgType: parseInt(type),
      sendType: '1',
      token: token
    };
    http
      .post('/message/read', params)
      .then(res => {
        // console.log(res.data);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  icon(type) {
    switch (type) {
      case 1:
        type = require('./img/prizeinfo.png');
        break;
      case 2:
        type = require('./img/sale.png');
        break;
      case 3:
        type = require('./img/suggest.png');
        break;
      case 4:
        type = require('./img/remind.png');
        break;
      case 5:
        type = require('./img/system.png');
        break;
      case 6:
        type = require('./img/remind.png');
        break;
      case 7:
        type = require('./img/prizeinfo.png');
        break;
    }
    return type;
  }
  render() {
    let msgList = this.state.msgLine || [];
    return (
      <div className="msg-center">
        <Header title="消息中心" />
        <div className="mainlist">
          <ul className="msglist-cont">
            {msgList.map((e, i) => {
              return (
                <Link
                  to={ '/msgdetail?type=' + e.msgType + '&name=' + e.msgName }
                  key={ i }
                >
                  <li
                    className="list-cont"
                    onClick={ event => this.read(event, e.msgType) }
                  >
                    <img className="icon" src={ e.img }
                      alt="" />
                    <p className="txt">{e.msgName}</p>
                    {e.msgCount > 0 ? (
                      <span className="num">{e.msgCount}</span>
                    ) : (
                      ''
                    )}
                    <img
                      className="right"
                      src={ require('@/img/right@2x.png') }
                      alt=""
                    />
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

// 消息内容
export class MsgDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msglist: [],
      totalpage: 0
    };
    this.page = 0;
  }
  componentWillMount() {
    let msgtype = getParameter('type');
    let tk = session.get('token');
    let params = {
      msgType: parseInt(msgtype),
      pageSize: 10,
      sendType: '1',
      pageIndex: this.page,
      token: tk
    };
    http
      .post('/message/list', params)
      .then(res => {
        console.log(res.data.data);
        this.setState({
          msglist: res.data.data,
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
  clear(e) {
    let tk = session.get('token');
    let msgtype = getParameter('type');
    let msg = this.state.msglist;
    if (msg.length >= 1) {
      Message.confirm({
        title: '温馨提示',
        btnTxt: ['再看看', '立即清空'],
        btnFn: [
          () => {},
          () => {
            let params = {
              msgType: parseInt(msgtype),
              sendType: 1,
              token: tk
            };
            http
              .post('/message/empty', params)
              .then(res => {
                this.setState({ msglist: [] });
              })
              .catch(err => {
                Message.toast(err.message);
              });
          }
        ],
        children: (
          <div>
            <p>您确认要清空消息列表吗?</p>
          </div>
        )
      });
    } else {
      Message.toast('您的消息列表已为空');
    }
  }
  // 加载更多
  loadMore() {
    this.page++;
    let msgtype = getParameter('type');
    let tk = session.get('token');
    let params = {
      msgType: parseInt(msgtype),
      pageSize: 10,
      sendType: '1',
      pageIndex: this.page,
      token: tk
    };
    http
      .post('/message/list', params)
      .then(res => {
        let msglist = res.data.data;
        msglist = this.state.msglist.concat(msglist);
        this.setState({ msglist });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let msgList = this.state.msglist || [];
    let totalPage = this.state.totalpage;
    return (
      <div className="msg-detail">
        <Header title={ getParameter('name') }>
          <span onClick={ event => this.clear(event) }>清空</span>
        </Header>
        {msgList.length < 1 ? (
          <NoMsg msg={ '没有相关内容' } />
        ) : (
          msgList.map((e, i) => {
            let html = { __html: e.msgContent };
            return (
              <div className="msg-details" key={ i }>
                <p className="time">
                  <span>{e.sendTime}</span>
                </p>
                <div className="cont">
                  <p className="title">{e.msgTitle}</p>
                  <div className="content" dangerouslySetInnerHTML={ html } />
                </div>
              </div>
            );
          })
        )}
        {msgList.length > 0 ? (
          totalPage > this.page ? (
            <div
              className="load-more"
              key={ 'li' }
              onClick={ event => this.loadMore(event) }
            >
              <p>点击加载更多</p>
            </div>
          ) : (
            <div className="load-more" key={ 'li' }>
              <p>没有更多了</p>
            </div>
          )
        ) : (
          ''
        )}
      </div>
    );
  }
}
