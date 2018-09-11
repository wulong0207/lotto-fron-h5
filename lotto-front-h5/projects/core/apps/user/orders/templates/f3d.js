/*
 * @Author: nearxu
 * @Date: 2017-11-03 10:22:28
 */

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
import '../../css/lottoDetail/dlt.scss';

function handleCodeWin(dataDetail, drawCode) {
  // 直选1|2|3  其他 1,2,3 drawCode 1|2|3
  console.log(dataDetail, 'detail', drawCode);
  let result;
  let drawArr = drawCode.split('|') || [];
  if (dataDetail.contentType === 6) {
    let sum = 0;
    drawArr.map(m => {
      return (sum += parseInt(m));
    });
    return (result = NumHelper.handleSumRed(dataDetail.planContent, sum));
  } else {
    if (dataDetail.planContent.indexOf('|') > -1) {
      // 直选 组三 组二
      let planContentArr = dataDetail.planContent.split('|') || [];
      let planArr = [];
      if (dataDetail.childName === '组三') {
        // 1,2,3|1,2,3
        planArr = [planContentArr[0], planContentArr[1]];
      } else {
        // 1,2,3|1,2,3
        planArr = [planContentArr[0], planContentArr[1], planContentArr[2]];
      }
      return (result = NumHelper.handleZhiXuan(planArr, drawArr, true));
    } else if (dataDetail.planContent.indexOf('#') > -1) {
      // 胆码
      let planContentArr = dataDetail.planContent.split('#') || [];
      return (result = NumHelper.handleCodeRed(planContentArr, drawArr));
    } else {
      let planArr = dataDetail.planContent.split(',') || [];
      return (result = NumHelper.handleCodeRed(planArr, drawArr));
    }
  }
}
function getPlanContent(dataDetail, drawCode) {
  drawCode = drawCode || '';
  if (drawCode === '') {
    if (dataDetail.planContent.indexOf('#') < 0) {
      return dataDetail.planContent.replace(/,/g, ' ');
    } else {
      // 胆码（）
      return (
        <div>
          <span>
            ({dataDetail.planContent.split('#')[0].replace(/,/g, ' ')})
          </span>
          <span>{dataDetail.planContent.split('#')[1].replace(/,/g, ' ')}</span>
        </div>
      );
    }
  } else {
    return handleCodeWin(dataDetail, drawCode);
  }
}

class F3dTemplate extends Component {
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
  loadMore() {
    this.pageIndex++;
    let { orderCode } = this.props.order.orderBaseInfoBO;
    http
      .post('/order/queryUserNumOrderList', {
        token: session.get('token'),
        source: 1,
        pageIndex: this.pageIndex,
        pageSize: 5,
        orderCode: orderCode
      })
      .then(res => {
        let { userNumPageData } = this.state;
        userNumPageData = userNumPageData.concat(res.data.data);
        this.setState({
          userNumPageData: userNumPageData
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let { userNumPageData } = this.state;
    let orderBaseInfoBO = this.props.order.orderBaseInfoBO || {};
    let buyType = orderBaseInfoBO.buyType; // 2追号代购 4追号
    let addDetailBOPagingBO;
    if (buyType === 4) {
      // 追号
      addDetailBOPagingBO = this.props.order.addDetailBOPagingBO; // 追号详情列表
    }
    let hasMoreCount; // 追期 还有多少方案
    let total;
    if (this.props.order.orderBaseInfoBO.buyType != 4) {
      // 追号参数 pageContentData
      total = this.props.order.userNumPage.total;
    } else {
      total = this.props.order.pageContentData.total;
    }
    hasMoreCount = parseInt(total - userNumPageData.length);
    console.log(hasMoreCount, 'hascount');
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
          {hasMoreCount > 0 ? (
            <LoadMore
              hasMoreCount={ hasMoreCount }
              loadMore={ this.loadMore.bind(this) }
            />
          ) : (
            ''
          )}

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

F3dTemplate.propTypes = {
  order: PropTypes.object
};

export default F3dTemplate;
