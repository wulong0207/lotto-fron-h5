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

/*
    对子 数字 且 顺序一样 planArr 必须是二维数组
    planArr [[11,22,33],[1,2]] drawArr [[11,22,33],[1,2]]
*/
function handleDuiZi(planArr, drawArr, type) {
  return planArr.map((m, k) => {
    return m.map((val, i) => {
      if (drawArr[k].indexOf(val) > -1) {
        return (
          <i key={ i }>
            {' '}
            {val}
            {type && k == 0 && i == 0 ? <b> {'('}</b> : ''}
            {// 添加 |
              type && k != planArr.length - 1 ? (
                i == m.length - 1 ? (
                  <b className="grey"> {')'}</b>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
          </i>
        );
      } else {
        return (
          <i key={ i } className="grey">
            {type && k == 0 && i == 0 ? <b> {'('}</b> : ''}
            {val}

            {// 添加 |
              type && k != planArr.length - 1 ? (
                i == m.length - 1 ? (
                  <b className="grey"> {')'}</b>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
          </i>
        );
      }
    });
  });
}

function handleCodeWin(dataDetail, drawCode) {
  let drawArr = drawCode.split(',') || [];
  let planContent = dataDetail.planContent;
  let planArr = [];
  let result;
  if (dataDetail.childName == '和值') {
    // 和值
    let sum = 0;
    drawArr.map(m => {
      return (sum += parseInt(m));
    });
    return (result = NumHelper.handleSumRed(dataDetail.planContent, sum));
  } else {
    switch (dataDetail.childName) {
      case '二不同号':
      case '三不同号':
        {
          planArr = planContent.split(',') || [];
          return (result = NumHelper.handleCodeRed(planArr, drawArr));
        }
        break;
      case '二同号单选':
        {
          // plan "11,22#2,3"
          planArr = planContent.split('#') || [];
          let planContentArr = [planArr[0].split(','), planArr[1].split(',')]; // [[11,22],[1,2,3]]
          let drawContentArr = [
            [drawCode.replace(/,/g, '').substring(0, 2)],
            [drawArr[2]]
          ]; // [['11'],['2']]
          return (result = handleDuiZi(planContentArr, drawContentArr, true));
        }
        break;
      case '二同号复选':
        {
          // 开奖两个号码相同 就中奖
          // let planArr = planContent.split(',') ||[];
          drawArr = drawArr.sort() || [];
          let drawContentArr = [];
          for (var i = 0; i < drawArr.length; i++) {
            if (drawArr[i] == drawArr[i + 1]) {
              drawContentArr = drawArr[i].split(',');
            }
          }
          return (result = NumHelper.handleCodeRed(planArr, drawContentArr));
        }
        break;
      case '三连号通选':
        {
          // 1 2 3
          drawArr = drawArr.sort() || [];
          if (
            parseInt(drawArr[0]) + 1 == parseInt(drawArr[1]) &&
            parseInt(drawArr[0]) + 2 == parseInt(drawArr[2])
          ) {
            return <i>{'三连号通选'}</i>;
          } else {
            return <i className="grey">{'三连号通选'}</i>;
          }
        }
        break;
      case '三同号单选':
        {
          planArr = planContent.split(',') || [];
          return (result = NumHelper.handleCodeRed(planArr, drawArr));
        }
        break;
      case '三同号通选':
        {
          drawArr = drawArr.sort() || [];
          if (drawArr[0] == drawArr[1] && drawArr[0] == drawArr[2]) {
            return <i>{'三同号通选'}</i>;
          } else {
            return <i className="grey">{'三同号通选'}</i>;
          }
        }
        break;

      default:
        break;
    }
    if (dataDetail.planContent == '3L') {
      return planContent.replace('3L', '三连号通选');
    } else if (dataDetail.planContent == '3T') {
      return planContent.replace('3T', '三同号通选');
    }
    return planContent.replace(/,/g, ' ');
  }
}

function getPlanContent(dataDetail, drawCode) {
  drawCode = drawCode || '';
  if (drawCode === '') {
    if (dataDetail.planContent == '3L') {
      return dataDetail.planContent.replace('3L', '三连号通选');
    } else if (dataDetail.planContent == '3T') {
      return dataDetail.planContent.replace('3T', '三同号通选');
    } else if (dataDetail.planContent.indexOf('#') > -1) {
      // 胆拖
      return (
        <div>
          <span>
            ({dataDetail.planContent.split('#')[0].replace(/,/g, ' ')})
          </span>
          <span>{dataDetail.planContent.split('#')[1].replace(/,/g, ' ')}</span>
        </div>
      );
    } else {
      return dataDetail.planContent.replace(/,/g, ' ');
    }
  } else {
    return handleCodeWin(dataDetail, drawCode);
  }
}

// 时时彩
class K3Template extends Component {
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

K3Template.propTypes = {
  order: PropTypes.object
};

export default K3Template;
