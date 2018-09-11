/*
 * @Author: nearxu 
 * @Date: 2017-11-17 16:59:18 
 * 十四场
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { subInner } from '@/utils/utils';
import FourteenHelper from '../util/nine-help.js';
import '../../css/lottoDetail/nine.scss';
import cx from 'classnames';
import OrderHelper from '../../order-helper';
import util from '../util/util';

function Table({ orderMatchInfoBOs }) {
  let codeArr = [];
  return (
    <div className="order-list">
      <table>
        <tbody>
          {orderMatchInfoBOs.map((m, i) => {
            return (
              <tr key={ i }>
                <td className="col10">
                  <span>{i}</span>
                </td>
                <td className="col20 home-game">
                  <span>{m.homeName}</span>
                  <span>VS</span>
                  <span>{m.visitiName}</span>
                </td>
                <td className="col20">
                  <span>{FourteenHelper.getGameStatus(m)}</span>
                </td>
                <td className="col20">
                  <span>
                    {FourteenHelper.getTouZhu(m.betGameContent, codeArr, i)}
                  </span>
                </td>
                <td className="col20">
                  <span>{FourteenHelper.getGameReuslt(codeArr[i])}</span>
                </td>

                <td className="col10" />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Content({ orderMatchInfoBOs, lotteryChildCode }) {
  return (
    <div className="plan-content">
      <div className="plan-header">
        <span>方案内容</span>
        <span>赔率以实际出票为准</span>
      </div>
      <div className="plan-col">
        <span className="col10">场次</span>
        <span className="col20">主队 VS 客队</span>
        <span className="col20">比分</span>
        <span className="col20">投注</span>
        <span className="col20">彩果</span>
        <span className="col10">胆</span>
      </div>
      <div className="plan-list">
        <Table orderMatchInfoBOs={ orderMatchInfoBOs } />
      </div>
    </div>
  );
}

export default function ForteenTemplate({ order }) {
  let orderBaseInfoBO = order.orderBaseInfoBO || {}; //	订单基本信息
  let orderMatchInfoBOs = order.orderMatchInfoBOs || []; // 竞技彩方案详情结果集
  let bonusOptimal = false; // 默认不是奖金优化
  // 投注类型  2:单场制胜; 3:奖金优化
  let orderCode = orderBaseInfoBO.orderCode;

  return (
    <div className="nine-bet">
      <div
        className={ cx(
          'lot-item zh-item',
          orderBaseInfoBO.categoryId == 2 || orderBaseInfoBO.categoryId == 3
            ? 'cxHide'
            : ''
        ) }
      >
        <div className="jjc-pass">
          <span>过关方式</span>
          <em className="lot-item-m c333">
            {util.getPassStyle(orderBaseInfoBO.bunchStr)}
          </em>
        </div>
        <div className="jjc-pass">{OrderHelper.getTicket(orderBaseInfoBO)}</div>
      </div>
      <section className="jjc-section">
        <Content
          orderMatchInfoBOs={ orderMatchInfoBOs }
          lotteryChildCode={ orderBaseInfoBO.lotteryChildCode }
        />
      </section>
    </div>
  );
}

ForteenTemplate.propTypes = {
  order: PropTypes.object
};
