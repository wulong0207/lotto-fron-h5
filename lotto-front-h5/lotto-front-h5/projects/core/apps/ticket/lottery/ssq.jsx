/**
 * 彩种 双色球
 * Created by YLD on 2017/11/08.
 */
import React from 'react';
import { transContent } from '../util.js';
import LotteryCommon from './common.jsx';
import PropTypes from 'prop-types';

export default class SSQ extends LotteryCommon {
  /**
   * 生成开奖区域
   */
  openArea() {
    let { ticket } = this;

    // 双色球 100
    let balls = this.transContent(ticket.drawCode);

    return ticket.drawCode ? (
      <div className="draw flex">
        <em className="red">{balls.pre.join(' ')}</em>
        {balls.suf ? <em className="blue">{' ' + balls.suf.join(' ')}</em> : ''}
      </div>
    ) : (
      <div className="draw flex">
        <em className="gray">待开奖</em>
      </div>
    );
  }

  /**
   * 生成投注区域
   * item 单张票数据
   */
  planContent(item) {
    let { ticket } = this;
    let result = [];

    let touzhuArr = item.planContent.split(';');

    touzhuArr.map((vitem, index) => {
      let plans = this.transContent(vitem, '+');

      for (let i = 0; i < plans.pre.length; i++) {
        let label = plans.pre[i] + ' ';
        let key = index + 'pre' + i;
        // 暂时不做标红，保留标红代码
        // result.push(draws.pre.indexOf(plans.pre[i]) >=0 ?
        //     <em className="gray" key={key}>{label}</em>:
        //     <span key={key}>{label}</span>);
        result.push(<span key={ key }>{label}</span>);
      }
      if (plans.suf) {
        result.push(
          <span className="mr" key={ 'add' + index }>
            +
          </span>
        );
        for (let i = 0; i < plans.suf.length; i++) {
          let label = plans.suf[i] + ' ';
          let key = index + 'suf' + i;
          // 暂时不做标红，保留标红代码
          // result.push(drawSuf.indexOf(plans.suf[i]) >=0 ?
          //     <em className="gray" key={key}>{label}</em>:
          //     <span key={key}>{label}</span>);
          result.push(<span key={ key }>{label}</span>);
        }
      }

      if (index !== touzhuArr.length - 1) {
        result.push(<br key={ index + 'br' } />);
      }
    });

    return result;
  }

  // 解析投注信息
  // drawCode 号码
  // sepKind 分隔符
  // sepChild 子号码分隔符
  transContent(drawCode, sepKind = '|', sepChild = ',') {
    return transContent(drawCode, sepKind, sepChild);
  }
}

SSQ.propTypes = {
  ticket: PropTypes.object
};
