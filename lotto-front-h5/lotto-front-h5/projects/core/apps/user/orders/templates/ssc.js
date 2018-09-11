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

// 大小单双
function handleDouble(planArr, drawArr) {
  let daXiao = ['', '小', '大', '单', '双'];
  return planArr.map((m, i) => {
    return m.split(',').map((val, index) => {
      if (i == 0) {
        // 十位
        if (drawArr[3].indexOf(val) > -1) {
          return (
            <i key={ index }>
              {daXiao[val]}
              <b className="grey"> {'|'}</b>
            </i>
          );
        } else {
          return (
            <i key={ index } className="grey">
              {daXiao[val]}
              <b className="grey"> {'|'}</b>
            </i>
          );
        }
      }
      if (i == 1) {
        // 个位
        if (drawArr[4].indexOf(val) > -1) {
          return <i key={ index }>{daXiao[val]}</i>;
        } else {
          return (
            <i key={ index } className="grey">
              {daXiao[val]}
            </i>
          );
        }
      }
    });
  });
}

// 时时彩 子玩法 标红
function handleCodeWin(dataDetail, orderBaseInfoBO) {
  let drawArr = orderBaseInfoBO.drawCode.split('|') || [];
  let planContent = dataDetail.planContent || '';
  let result;
  if (dataDetail.contentType != 6) {
    switch (dataDetail.childName) {
      case '五星直选':
      case '五星通选':
        {
          let planContentArr = planContent.split('|') || [];
          let planArr =
            [
              planContentArr[0],
              planContentArr[1],
              planContentArr[2],
              planContentArr[3],
              planContentArr[4]
            ] || [];
          return (result = NumHelper.handleZhiXuan(planArr, drawArr, true));
        }
        break;
      case '三星直选':
        {
          // 取开奖号码后三位
          let drawCodeArr = [drawArr[2], drawArr[3], drawArr[4]] || [];
          let planContentArr = planContent.split('|') || [];
          let planArr =
            [planContentArr[0], planContentArr[1], planContentArr[2]] || [];
          return (result = NumHelper.handleZhiXuan(planArr, drawCodeArr, true));
        }
        break;
      case '三星组三':
      case '三星组六':
        {
          // drawCodeType 1 组三   2 组六
          if (
            orderBaseInfoBO.drawCodeType == 1 ||
            orderBaseInfoBO.drawCodeType == 2
          ) {
            let drawCodeArr = [drawArr[2], drawArr[3], drawArr[4]] || [];
            let planContentArr;
            if (planContent.indexOf('#') > -1) {
              // 组三胆拖
              return (result = (
                <div>
                  <span>
                    ({NumHelper.handleCodeRed(
                      planContent.split('#')[0].split(','),
                      drawCodeArr
                    )})
                  </span>
                  <span>
                    {NumHelper.handleCodeRed(
                      planContent.split('#')[1].split(','),
                      drawCodeArr
                    )}
                  </span>
                </div>
              ));
            } else {
              planContentArr = planContent.split(',');
              return (result = NumHelper.handleCodeRed(
                planContentArr,
                drawCodeArr
              ));
            }
          } else {
            if (planContent.indexOf('#') > -1) {
              // 组三胆拖
              return (result = (
                <div>
                  <span>({planContent.split('#')[0].replace(/,/g, ' ')})</span>
                  <span>{planContent.split('#')[1].replace(/,/g, ' ')}</span>
                </div>
              ));
            } else {
              return (result = (
                <span className="grey">planContent.replace(/,/g,' ')</span>
              ));
            }
          }
        }
        break;
      case '二星直选':
        {
          // 取开奖号码后两位 十 个 位
          let drawCodeArr = [drawArr[3], drawArr[4]] || [];
          let planContentArr = planContent.split('|') || [];
          let planArr = [planContentArr[0], planContentArr[1]] || [];
          return (result = NumHelper.handleZhiXuan(planArr, drawCodeArr, true));
        }
        break;
      case '二星组选':
        {
          // 取开奖号码后两位 十 个 位
          let drawCodeArr = [drawArr[3], drawArr[4]] || [];
          let planContentArr;
          if (planContent.indexOf('#') > -1) {
            // 组2胆拖
            return (result = (
              <div>
                <span>
                  ({NumHelper.handleCodeRed(
                    planContent.split('#')[0].split(','),
                    drawCodeArr
                  )})
                </span>
                <span>
                  {NumHelper.handleCodeRed(
                    planContent.split('#')[1].split(','),
                    drawCodeArr
                  )}
                </span>
              </div>
            ));
          } else {
            planContentArr = planContent.split(',');
            return (result = NumHelper.handleCodeRed(
              planContentArr,
              drawCodeArr
            ));
          }
        }
        break;
      case '一星':
        {
          let oneCode = drawArr[drawArr.length - 1] || [];
          let planArr = planContent.split(',');
          return (result = NumHelper.handleCodeRed(
            planArr,
            oneCode.split(',')
          ));
        }
        break;
      case '大小单双':
        {
          let planContentArr = planContent.split('|') || [];
          //  个位drawArr[3]  十位drawArr[4]
          let planArr = [planContentArr[0], planContentArr[1]] || [];
          return handleDouble(planArr, drawArr);
        }
        break;
      default:
        return (result = dataDetail.planContent.replace(/,/g, ' '));
        break;
    }
  } else {
    // 和值
    let sum = 0;
    drawArr.map(m => {
      return (sum += parseInt(m));
    });
    return (result = NumHelper.handleSumRed(dataDetail.planContent, sum));
  }
}

function getPlanContent(dataDetail, orderBaseInfoBO) {
  let drawCode = orderBaseInfoBO.drawCode || '';
  if (drawCode === '') {
    if (dataDetail.childName == '大小单双') {
      let daXiao = ['', '小', '大', '单', '双'];
      let planContentArr = dataDetail.planContent.split('|') || [];
      return (
        <span>
          {daXiao[planContentArr[0]]}
          {' | '}
          {daXiao[planContentArr[1]]}
        </span>
      );
    }
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
    return handleCodeWin(dataDetail, orderBaseInfoBO);
  }
}

// 时时彩
class SscTemplate extends Component {
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
                    {getPlanContent(m, orderBaseInfoBO)}
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

SscTemplate.propTypes = {
  order: PropTypes.object
};

export default SscTemplate;
