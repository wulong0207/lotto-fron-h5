/*
 * @Author: nearxu
 * @Date: 2017-11-21 10:33:54
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { subInner } from '@/utils/utils';
import FourteenHelper from '../util/nine-help.js';
import '../../css/lottoDetail/nine.scss';
import cx from 'classnames';
import OrderHelper from '../../components/order-helper';
import util from '../util/util';
import { isEmpty } from 'lodash';

function Table({ orderMatchInfoBOs, orderBaseInfoBO, isDan }) {
  let codeArr = [];
  // drawCode = "3|1|0|0|0|1|1|3|3|3|0|1|0|3";
  if (orderBaseInfoBO.drawCode) {
    codeArr = orderBaseInfoBO.drawCode.split('|');
  }
  return (
    <div className="order-list">
      <table>
        <tbody>
          <tr>
            <td className="col10">场次</td>
            <td className="col20">主队 VS 客队</td>
            <td className="col20">比分</td>
            <td className={ cx(isDan ? 'col20' : 'col25') }>投注</td>
            <td className={ cx(isDan ? 'col20' : 'col25') }>彩果</td>
            {isDan && <td className="col10">胆</td>}
          </tr>
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
                <td className={ cx(isDan ? 'col20' : 'col25') }>
                  <span>
                    {FourteenHelper.getTouZhu(m.betGameContent, codeArr, i)}
                  </span>
                </td>
                <td className={ cx(isDan ? 'col20' : 'col25') }>
                  <span>{FourteenHelper.getGameReuslt(codeArr[i])}</span>
                </td>

                {isDan && (
                  <td className="col10 dan ">
                    {order.isDan === 1 && (
                      <img src={ require('../../img/icon_state_two@2x.png') } />
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Content({ orderMatchInfoBOs, orderBaseInfoBO }) {
  orderMatchInfoBOs = orderMatchInfoBOs.sort(
    (a, b) => a.systemCode - b.systemCode
  );
  const isDan = orderMatchInfoBOs.filter(order => order.isDan === 1).length > 0;
  return (
    <div className="plan-content">
      <div className="plan-header">
        <span>方案内容</span>
      </div>
      <div className="plan-list">
        <Table
          isDan={ isDan }
          orderMatchInfoBOs={ orderMatchInfoBOs }
          orderBaseInfoBO={ orderBaseInfoBO }
        />
      </div>
    </div>
  );
}

export default function FourGame({ order }) {
  let orderBaseInfoBO = order.orderBaseInfoBO || {}; //	订单基本信息
  let orderMatchInfoBOs = order.orderMatchInfoBOs || []; // 竞技彩方案详情结果集

  return (
    <div className="nine-bet">
      {/* <div className='lot-item zh-item'>
                <div className="jjc-pass">
                    <span>过关方式</span>
                    <em className="lot-item-m c333">{util.getPassStyle(orderBaseInfoBO.bunchStr)}</em>
                </div>
                <div className="jjc-pass">
                    { OrderHelper.getTicket(orderBaseInfoBO) }
                </div>
            </div> */}
      <section className="jjc-section">
        <Content
          orderMatchInfoBOs={ orderMatchInfoBOs }
          orderBaseInfoBO={ orderBaseInfoBO }
        />
      </section>
    </div>
  );
}

FourGame.propTypes = {
  order: PropTypes.object
};
