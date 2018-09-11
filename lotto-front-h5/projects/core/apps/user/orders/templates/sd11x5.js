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
  let drawArr = drawCode.split(',') || [];
  let planContent = dataDetail.planContent || '';
  let result;
  switch (dataDetail.childName) {
    case '前一':
      {
        let oneCode = drawCode.split(',')[0] || '';
        let planArr = planContent.split(',') || [];
        return (result = NumHelper.handleCodeRed(planArr, oneCode.split(',')));
      }
      break;
    case '前二直选':
      {
        // 号码且顺序相同 1 2| 1 2
        let oneCode = [drawCode.split(',')[0], drawCode.split(',')[1]] || [];
        let planArr =
          [planContent.split('|')[0], planContent.split('|')[1]] || [];
        return (result = NumHelper.handleZhiXuan(planArr, oneCode));
      }
      break;
    case '前二组选':
      {
        let planArr = planContent.split(',');
        let oneCode = [drawArr[0], drawArr[1]]; // 组选
        if (planContent.indexOf('#') > -1) {
          console.log(planContent, 'planContent');
          planArr[0] = planContent.split('#')[0].split(',');
          planArr[1] = planContent.split('#')[1].split(',');
          return (result = (
            <div>
              ({NumHelper.handleCodeRed(planArr[0], oneCode)})
              {NumHelper.handleCodeRed(planArr[1], oneCode)}
            </div>
          ));
        }
        return (result = NumHelper.handleCodeRed(planArr, oneCode));
      }
      break;
    case '前三直选':
      {
        // 号码且顺序相同 1 2| 1 2 |1 2
        let oneCode =
          [
            drawCode.split(',')[0],
            drawCode.split(',')[1],
            drawCode.split(',')[2]
          ] || [];
        let planArr =
          [
            planContent.split('|')[0],
            planContent.split('|')[1],
            planContent.split('|')[2]
          ] || [];
        return (result = NumHelper.handleZhiXuan(planArr, oneCode));
      }
      break;
    case '前三组选':
      {
        let planArr = planContent.split(',') || [];
        let oneCode = [drawArr[0], drawArr[1], drawArr[2]];
        if (planContent.indexOf('#') > -1) {
          console.log(planContent, 'planContent');
          planArr[0] = planContent.split('#')[0].split(',');
          planArr[1] = planContent.split('#')[1].split(',');
          return (result = (
            <div>
              ({NumHelper.handleCodeRed(planArr[0], oneCode)})
              {NumHelper.handleCodeRed(planArr[1], oneCode)}
            </div>
          ));
        }
        return (result = NumHelper.handleCodeRed(planArr, oneCode));
      }
      break;
    case '乐选三':
      {
        let planArr = planContent.replace(/,/g, '|').split('|') || [];
        return (result = NumHelper.handleCodeRed(planArr, drawArr));
      }
      break;
    case '乐选五':
    case '乐选四':
      {
        let planArr = planContent.split(',') || [];
        return (result = NumHelper.handleCodeRed(planArr, drawArr));
      }
      break;
    default:
      {
        let planArr = planContent.split(',') || [];
        return (result = NumHelper.handleCodeRed(planArr, drawArr));
      }
      break;
  }
}

function getPlanContent(dataDetail, drawCode) {
  drawCode = drawCode || '';
  const planContent = dataDetail.planContent;
  if (drawCode === '') {
    if (planContent.indexOf('#') > -1) {
      // 胆码
      console.log(planContent, 'plancontent');
      return (
        <div>
          ({planContent.split('#')[0].replace(/,/g, ' ')})
          {planContent.split('#')[1].replace(/,/g, ' ')}
        </div>
      );
    }
    return dataDetail.planContent.replace(/,/g, ' ');
  } else {
    return handleCodeWin(dataDetail, drawCode);
  }
}

class SD11x5Template extends Component {
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

SD11x5Template.propTypes = {
  order: PropTypes.object
};

export default SD11x5Template;
