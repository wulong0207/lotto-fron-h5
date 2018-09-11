/**
 * 彩种竞技彩通用处理
 * Created by YLD on 2017/11/07.
 */
import React from 'react';
import LotteryCommon from './common.jsx';
import TicketItem from '../component/ticket-item.jsx';
import TicketHeader from '../component/ticket-header.jsx';

export default class Sport extends LotteryCommon {
  // 出票信息
  constructor(ticket) {
    super(ticket);

    this.config = ['gg', 'plan', 'mul', 'mul', 'money'];
    this.mainHeader = ['过关方式', '场次', '注数', '倍数', '投注金额'];
  }

  // 获取数据配置
  // lotteryData 单张票数据
  getTicketProps(item, index) {
    let props = super.getTicketProps(item, index);

    props.header = null;

    return props;
  }

  // 获取玩法，或者过关方式
  getPlayType(item) {
    return item.passway.replace(/1串1/g, '单关');
  }

  // 生成票信息展示区域
  ticketStage() {
    let { ticket } = this;

    return (
      <div className="ticket-content" key="tc">
        <TicketHeader
          alone={ true }
          className="deep header-fixed"
          config={ this.config }
          header={ this.mainHeader }
        />
        {ticket.sportList.map((item, i) => {
          let props = this.getTicketProps(item, i + 1);
          return <TicketItem key={ i } { ...props } />;
        })}
      </div>
    );
  }

  /**
   * 生成投注区域
   * item 单张票数据
   */
  planContent(item) {
    return item.listMatchs.map((mv, mi) => {
      let bet = mv.listBetContent.map((v, vi) => {
        let spb = `${v.planContent}@${v.sp}`;
        if (v.sp == null) {
          spb = `${v.planContent}`;
        }
        return (
          <span key={ vi }>
            {v.flag ? <em>{spb}</em> : spb}
            {vi !== mv.listBetContent.length - 1 ? '、' : ''}
          </span>
        );
      });
      let mulChar = mi !== item.listMatchs.length - 1 ? ' x ' : '';
      let info = mv.info ? `${mv.info}` : '';

      return (
        <span key={ mi }>
          {mv.week}
          {mv.num}
          {info}({bet}){mulChar}
        </span>
      );
    });
  }
}
