/**
 * 彩种通用处理 默认为双色球形式
 * Created by YLD on 2017/11/02.
 */
import React from 'react';
import { PLAY_TYPE, TICKET_STATUS, WINNING_STATUS } from '../const.js';
import TicketItem from '../component/ticket-item.jsx';
import TicketDraw from '../component/ticket-draw.jsx';
import { toMoney } from '../util';
import PropTypes from 'prop-types';

export default class LotteryCommon {
  // 出票信息
  constructor(ticket) {
    this.ticket = ticket;
    this.config = ['play', 'plan flex-wrap', 'mul', 'mul', 'money'];
    this.header = ['玩法', '投注号码', '注数', '倍数', '投注金额'];
    this.mulBetSep = ';';
  }

  /**
   * 生成开奖区域
   */
  openArea() {
    let { ticket } = this;

    return (
      <div className="draw flex">
        {ticket.drawCode ? (
          <em className="red">{ticket.drawCode}</em>
        ) : (
          <em className="gray">待开奖</em>
        )}
      </div>
    );
  }

  /**
   * 生成投注区域
   * item 单张票数据
   */
  planContent(item) {
    return item.planContent.split(this.mulBetSep).map((v, i) => {
      return <div key={ i }>{v}</div>;
    });
  }

  // 获取数据配置
  // lotteryData 单张票数据
  getTicketProps(item, index) {
    let { ticket } = this;
    let props = {};

    if (item) {
      props = {
        config: this.config,
        header: this.header,
        items: [
          this.getPlayType(item),
          this.planContent(item),
          item.betNum,
          item.multiple,
          '￥' + item.money
        ], // 各项数据
        ticketStatus: '第' + index + '张 ' + this.getTicketStatus(item),
        openStatus: this.getOpenStatus(item)
      };
    }

    return props;
  }

  // 获取玩法，或者过关方式
  getPlayType(item) {
    return (item.childName || '') + PLAY_TYPE[item.playType];
  }

  // 获取出票状态
  getTicketStatus(item) {
    return TICKET_STATUS[item.ticketStatus];
  }

  // 获取开奖状态
  getOpenStatus(item) {
    if (item.winningStatus == 3 || item.winningStatus == 4) {
      return (
        <span>
          税前奖金 <em>{toMoney(item.preBonus || 0, 2)}</em> 元
        </span>
      );
    } else if (item.winningStatus == 1) {
      return <em>待开奖</em>;
    }

    return WINNING_STATUS[item.winningStatus];
  }

  // 生成票信息展示区域
  ticketStage() {
    let result = [];
    let { ticket } = this;
    result.push(<TicketDraw key="draw" ticket={ ticket } />);

    for (let i = 0; i < ticket.numList.length; i++) {
      let item = ticket.numList[i];
      let props = this.getTicketProps(item, i + 1);
      result.push(<TicketItem key={ i } { ...props } />);
    }

    return result;
  }
}

LotteryCommon.propTypes = {
  ticket: PropTypes.object
};
