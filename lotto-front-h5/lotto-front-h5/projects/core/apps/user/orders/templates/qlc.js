import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import session from '@/services/session';
import Message from '@/services/message';
import util from '../util/util.js';
import NumHelper from '../util/num-helper';
import LoadMore from '../common/load-more';
import ChaseLottery from '../common/chase-lottery';
import OrderHelper from '../../components/order-helper';
// import { open } from 'inspector';

function getPlanContent(dataDetail, drawCode) {
  drawCode = drawCode || '';
  let planContent = dataDetail.planContent;
  if (drawCode === '') {
    if (planContent.indexOf('#') > -1) {
      return (
        <div>
          <span>({planContent.split('#')[0].replace(/,/g, ' ')})</span>
          <span>{planContent.split('#')[1].replace(/,/g, ' ')}</span>
        </div>
      );
    } else {
      return planContent.replace(/,/g, ' ');
    }
  } else {
    let drawArr = drawCode.split(',') || [];
    let planArr;
    if (planContent.indexOf('#') > -1) {
      planArr = [planContent.split('#')[0], planContent.split('#')[1]];
      return NumHelper.handleDanTuo(planArr, drawArr);
    } else {
      return NumHelper.handleCodeRed(planContent.split(','), drawArr);
    }
  }
}

// 时时彩
class QLCTemplate extends Component {
  constructor(props) {
    super(props);
    let userNumPageData;
    if (props.order.orderBaseInfoBO.buyType != 4) {
      // 追号参数 pageContentData
      userNumPageData = props.order.userNumPage.data;
    } else {
      userNumPageData = props.order.pageContentData.data;
    }
    this.state = {
      userNumPageData: userNumPageData
    };
    this.pageIndex = 0; // 页数 加载更多
  }
  render() {
    let { userNumPageData } = this.state;
    let orderBaseInfoBO = this.props.order.orderBaseInfoBO || {};
    let buyType = orderBaseInfoBO.buyType; // 2追号代购 4追号
    let openWin =
      orderBaseInfoBO.winningStatus == 1
        ? { display: 'none' }
        : { display: '' };
    let addDetailBOPagingBO;
    let openCode;
    if (buyType === 4) {
      // 追号
      addDetailBOPagingBO = this.props.order.addDetailBOPagingBO; // 追号详情列表
    }
    if (orderBaseInfoBO.drawCode) {
      openCode = (
        <span>
          <i className="red">
            {orderBaseInfoBO.drawCode
              .substring(0, orderBaseInfoBO.drawCode.length - 2)
              .replace(/,/g, ' ')}
          </i>
          <i className="blue">
            {' '}
            +{' '}
            {orderBaseInfoBO.drawCode
              .substr(orderBaseInfoBO.drawCode.length - 2)
              .replace(/,/g, ' ')}
          </i>
        </span>
      );
    }
    let hasMoreCount;
    let total;
    if (this.props.order.orderBaseInfoBO.buyType != 4) {
      // 追号参数 pageContentData
      total = this.props.order.userNumPage.total;
    } else {
      total = this.props.order.pageContentData.total;
    }
    hasMoreCount = parseInt(total - userNumPageData.length);
    return (
      <div className="bet-content">
        <div className="num-bet">
          <p className="title">
            <span>方案内容</span>
          </p>
          <div className="plan-list">
            {userNumPageData.map((m, i) => {
              return (
                <div className="bet-list" key={ i }>
                  <div className="bet-top">
                    {getPlanContent(m, orderBaseInfoBO.drawCode)}
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
}

QLCTemplate.propTypes = {
  order: PropTypes.object
};

export default QLCTemplate;
