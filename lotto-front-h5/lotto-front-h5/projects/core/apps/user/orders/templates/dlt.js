/*
 * @Author: nearxu
 * @Date: 2017-11-02 18:09:39
 */

import React from 'react';
import PropTypes from 'prop-types';
import NumHelper from '../util/num-helper';
import ChaseLottery from '../common/chase-lottery';
import OrderHelper from '../../components/order-helper';
import util from '../util/util';
import '../../css/lottoDetail/dlt.scss';

function handleCodeBlue(planArr, drawStr) {
  let classNames = '';
  return planArr.map((m, i) => {
    if (drawStr.indexOf(m) > -1) {
      classNames = 'blue';
    } else {
      classNames = 'grey';
    }
    return (
      <i key={ i } className={ classNames }>
        {m}
      </i>
    );
  });
}

function getPlanContent(planContent, drawCode) {
  planContent = planContent || '';
  drawCode = drawCode || '';
  let redCode = planContent.split('|')[0] || '';
  let blueCode = planContent.split('|')[1] || '';
  let drawArr = drawCode.split('|');
  if (drawCode === '') {
    if (planContent.indexOf('#') > -1) {
      return (
        <div>
          <span>({redCode.split('#')[0].replace(/,/g, ' ')})</span>
          <span>{redCode.split('#')[1].replace(/,/g, ' ')}</span>
          <span>+</span>
          {blueCode.indexOf('#') > -1 ? ( // 蓝球发现胆码
            <span>
              ({blueCode.split('#')[0].replace(/,/g, ' ')})
              {blueCode.split('#')[1].replace(/,/g, ' ')}
            </span>
          ) : (
            <span>{blueCode.replace(/,/g, ' ')}</span>
          )}
        </div>
      );
    }
    return `
            ${redCode.replace(/,/g, ' ')} + ${blueCode.replace(/,/g, ' ')}
        `;
  } else {
    return (
      <div>
        {redCode.indexOf('#') > -1 ? (
          <span>
            ({NumHelper.handleCodeRed(
              redCode.split('#')[0].split(','),
              drawArr[0]
            )})
            {NumHelper.handleCodeRed(
              redCode.split('#')[1].split(','),
              drawArr[0]
            )}
          </span>
        ) : (
          <span>{NumHelper.handleCodeRed(redCode.split(','), drawArr[0])}</span>
        )}
        {blueCode.indexOf('#') > -1 ? (
          <span>
            + ({handleCodeBlue(blueCode.split('#')[0].split(','), drawArr[1])})
            {handleCodeBlue(blueCode.split('#')[1].split(','), drawArr[1])}
          </span>
        ) : (
          <span>+ {handleCodeBlue(blueCode.split(','), drawArr[1])}</span>
        )}
      </div>
    );
  }
}

function DltTemplate({ order }) {
  const orderBaseInfoBO = order.orderBaseInfoBO || {};
  let userNumPage = [];
  let buyType = orderBaseInfoBO.buyType; // 2追号代购 4追号
  let hasMoreCount;
  let addDetailBOPagingBO;
  if (buyType != 4) {
    // 不是追号
    userNumPage = order.userNumPage.data;
  } else {
    // 追号
    userNumPage = order.pageContentData.data;
    addDetailBOPagingBO = order.addDetailBOPagingBO; // 追号详情列表
  }
  return (
    <div className="bet-content">
      <div className="num-bet">
        <p className="title">
          <span>方案内容</span>
        </p>
        <div className="plan-list">
          {userNumPage.map((m, i) => {
            console.log(m.contentType, 'contentype');
            return (
              <div className="bet-list" key={ i }>
                <div className="bet-top">
                  {getPlanContent(m.planContent, orderBaseInfoBO.drawCode)}
                </div>
                <div className="bet-bottom">
                  <span>
                    {m.childName.replace(/投注/gi, '')}
                    {util.getContentType(m.contentType)}
                  </span>
                  <span>{m.buyNumber}注</span>
                  <span>{m.amount}元</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 追号表格内容 */}
        {buyType == 4 ? (
          <ChaseLottery
            addStatus={ orderBaseInfoBO.addStatus }
            addDetailBOPagingBO={ addDetailBOPagingBO }
            orderCode={ orderBaseInfoBO.orderCode }
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

DltTemplate.propTypes = {
  order: PropTypes.object
};

export default DltTemplate;
