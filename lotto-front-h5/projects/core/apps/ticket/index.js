/**
 * Created by YLD on 2017/11/02.
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import './css/index.scss';
import Header from '@/component/header.jsx';
import http from '@/utils/request';
import { getParameter } from '@/utils/utils';
import Message from '@/services/message';
import session from '@/services/session.js';
import Lottery from './lottery';

export default class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketInfo: {
        total: 0,
        moreNum: 0
      } // 出票信息
    };
    this.pageIndex = 0;
    // 彩种处理
    this.lottery = null;
  }

  componentDidMount() {
    this.orderCode = getParameter('orderCode') || '';
    this.token = getParameter('token') || session.get('token');
    this.callService(this.pageIndex);
  }

  // 请求出票数据
  callService(add) {
    if (add) this.pageIndex++;
    http
      .post('/ticket/ticketlist', {
        orderCode: this.orderCode,
        pageIndex: this.pageIndex,
        pageSize: 10,
        token: this.token
      })
      .then(res => {
        if (!res.success) {
          Message.alert({
            msg: res.message,
            btnFn: [
              () => {
                window.history.go(-1);
              }
            ]
          });
          return;
        }

        let result = res.data;
        if (result) {
          this.lottery = Lottery(result);
          // 数字彩
          if (result.numList) {
            let numList = this.state.ticketInfo.numList || [];
            for (let i = 0; i < result.numList.length; i++) {
              numList.push(result.numList[i]);
            }
            result.numList = numList;
            // 是否还有更多的票
            result.moreNum = result.total - numList.length;
          } else if (result.sportList) {
            // 竞技彩
            let sportList = this.state.ticketInfo.sportList || [];
            for (let i = 0; i < result.sportList.length; i++) {
              sportList.push(result.sportList[i]);
            }
            result.sportList = sportList;
            // 是否还有更多的票
            result.moreNum = result.total - sportList.length;
          }
          // TODO: 测试的开奖号码
          // result.drawCode="03,07,08,11,33|02,08";
          this.setState({ ticketInfo: result });
        }
      })
      .catch(err => {
        Message.alert({
          msg: err.message,
          btnFn: [
            () => {
              window.history.go(-1);
            }
          ]
        });
      });
  }

  // 根据彩种显示出票信息
  getTicketStage() {
    if (!this.lottery) return '';

    return this.lottery.ticketStage();
  }

  render() {
    let { ticketInfo } = this.state;

    return (
      <div className="yc yc-ticket">
        <section>
          <Header
            title="出票明细"
            back={ () => {
              window.history.go('-1');
            } }
          />
        </section>
        <div>{this.getTicketStage()}</div>

        {ticketInfo.moreNum > 0 ? (
          <div
            className="more-ticket"
            onClick={ this.callService.bind(this, true) }
          >
            还有{ticketInfo.moreNum}张票
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

render(<Ticket />, document.getElementById('app'));
