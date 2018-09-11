/*
 * @Author: nearxu
 * @Date: 2017-11-08 16:43:18
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
import '../../css/lottoDetail/poker.scss';

import IconOne from '../../img/order/heitao_min.png'; // 黑桃
import IconTwo from '../../img/order/hongtao_min.png'; // 红桃
import IconThr from '../../img/order/meihua_min.png'; // 梅花
import IconFor from '../../img/order/fangkuai_min.png'; // 方块

function handleCodeRed(planArr, drawArr) {
  let className = '';
  return planArr.map((m, i) => {
    if (drawArr.indexOf(m) > -1) {
      className = 'red';
    } else {
      className = 'grey';
    }
    if (m === 'YYY') {
      m = '豹子全包';
    }
    if (m === 'XX') {
      m = '对子全包';
    }
    if (m === 'XYZ') {
      m = '顺子全包';
      className = '';
    }
    return (
      <i key={ i } className={ className }>
        {m}
      </i>
    );
  });
}

function handleCodeWin(dataDetail, drawCode) {
  let drawArr = drawCode.split('|') || [];
  let planArr = dataDetail.planContent.split(',') || [];
  if (dataDetail.childName.indexOf('任选') > -1) {
    let draw = drawArr.map((m, i) => {
      return m.substring(m.length - 1);
    });
    return NumHelper.handleCodeRed(planArr, draw);
  } else {
    switch (dataDetail.childName) {
      case '豹子': //
        {
          if (
            drawArr[0].split('_')[1] == drawArr[1].split('_')[1] &&
            drawArr[1].split('_')[1] == drawArr[2].split('_')[1]
          ) {
            return handleCodeRed(planArr, drawArr[0].split('_')[1]);
          } else {
            return (
              <div className="grey">
                {dataDetail.planContent
                  .replace(/,/g, ' ')
                  .replace(/YYY/g, '豹子全包')}
              </div>
            );
          }
        }
        break;
      case '对子': //
        {
          let draw = [];
          if (drawArr[0] == drawArr[1] || drawArr[0] == drawArr[2]) {
            draw = drawArr[0].split('');
          } else {
            return (
              <div className="grey">
                {dataDetail.planContent
                  .replace(/,/g, ' ')
                  .replace(/XX/g, '对子全包')}
              </div>
            );
          }
          return handleCodeRed(planArr, draw);
        }
        break;
      case '同花':
        {
          return planArr.map((m, i) => {
            if (m == 'AT') {
              return <span key={ i }>同花全包</span>;
            } else {
              return (
                <div className="poker-img" key={ i }>
                  <img src={ handleNumToImg(m.slice(0, 1)) } />
                </div>
              );
            }
          });
        }
        break;
      case '顺子': {
        return planArr.map((m, i) => {
          if (m == 'XYZ') {
            return <span key={ i }>顺子全包</span>;
          } else {
            return (
              <div key={ i } className="grey">
                {' '}
                {m} &nbsp;&nbsp;
              </div>
            );
          }
        });
      }
    }
  }
}

function getPlanContent(dataDetail, drawCode) {
  drawCode = drawCode || '';
  if (drawCode === '') {
    if (dataDetail.planContent.indexOf('T') > -1) {
      let planArr = dataDetail.planContent.split(',') || [];
      return planArr.map((m, i) => {
        if (m == 'AT') {
          return <span>同花全包</span>;
        } else {
          return (
            <div className="poker-img">
              <img src={ handleNumToImg(m.slice(0, 1)) } />
            </div>
          );
        }
      });
    } else {
      return dataDetail.planContent.replace(/,/g, ' ');
    }
  } else {
    return handleCodeWin(dataDetail, drawCode);
  }
}

function handleNumToImg(m) {
  switch (m) {
    case '1': //
      return (m = IconOne);
      break;
    case '2': //
      return (m = IconTwo);
      break;
    case '3': //
      return (m = IconThr);
      break;
    case '4': //
      return (m = IconFor);
      break;
    default:
      return m;
  }
}

// 快乐扑克
class PokerTemplate extends Component {
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
  getOpenCode(drawCode) {
    let drawArr = drawCode.split('|') || [];
    return drawArr.map((m, i) => {
      return (
        <div className="open-list" key={ i }>
          <img src={ handleNumToImg(m.substring(0, 1)) } />
          <span>{m.split('_')[1]}</span>
        </div>
      );
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

PokerTemplate.propTypes = {
  order: PropTypes.object
};

export default PokerTemplate;
