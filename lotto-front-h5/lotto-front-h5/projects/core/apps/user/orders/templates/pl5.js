import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import BetContent from '../../bet-content.jsx';
import ChaseContent from '../../components/chase-content.jsx';
import util from '../util/util';
import NumHelper from '../util/num-helper';
import ChaseLottery from '../common/chase-lottery';
import OrderHelper from '../../components/order-helper';
import '../../css/lottoDetail/ssq.scss';

function handleCodeWin(planContent, drawCode) {
  let drawArr = drawCode.split('|') || [];
  let planContentArr = planContent.split('|') || [];
  let planArr =
    [
      planContentArr[0],
      planContentArr[1],
      planContentArr[2],
      planContentArr[3],
      planContentArr[4]
    ] || [];
  return NumHelper.handleZhiXuan(planArr, drawArr, true);
}

function getPlanContent(dataDetail, drawCode) {
  drawCode = drawCode || '';
  if (drawCode === '') {
    return dataDetail.planContent.replace(/,/g, ' ');
  } else {
    return handleCodeWin(dataDetail.planContent, drawCode);
  }
}

// pl5
class PL5Template extends Component {
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
    let addDetailBOPagingBO;
    if (buyType === 4) {
      // 追号
      addDetailBOPagingBO = this.props.order.addDetailBOPagingBO; // 追号详情列表
    }
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

PL5Template.propTypes = {
  order: PropTypes.object
};

export default PL5Template;
