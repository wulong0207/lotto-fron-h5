/*
 * @Author: nearxu
 * @Date: 2017-10-12 20:23:10
 * 竞彩足球
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import OrderHelper from '../../components/order-helper';
import { subInner } from '@/utils/utils';
import Bonus from './bonus.js';
import { isEmpty } from 'lodash';
import '../../css/lottoDetail/jjcz.scss';
import cx from 'classnames';
import util from '../util/util';
import JCZQHelper from '../util/jcz-help';
import CopyEntrance from '../../../../../sports/apps/cd/components/entrance';

// 中奖彩果标红
function handleCaiguoWin(val, spf) {
  // console.log(val,'val',spf,'spf')
  let arr = subInner(val, '(', ')').split(',') || [];
  const isWin = arr.filter(m => subInner(m, '', '@') == spf).length > 0;
  return isWin;
}

function getCaiguo(orderMatchZQBO, val, matchStatus) {
  // console.log(val,'val',orderMatchZQBO,'orderZQ')
  let result;
  let caiGuo;
  let className = '';
  if (matchStatus == 15 || matchStatus == 16 || matchStatus == 17) {
    let kind = subInner(val, '', '(');
    switch (kind) {
      case 'S': // 胜平负
        className = handleCaiguoWin(val, orderMatchZQBO.fullSpf)
          ? 'orange-red'
          : '';
        result = JCZQHelper.getMatchDes(orderMatchZQBO.fullSpf);
        break;
      case 'Z': // 总进球
        className = handleCaiguoWin(val, orderMatchZQBO.goalNum)
          ? 'orange-red'
          : '';
        result = JCZQHelper.getGoalDes(orderMatchZQBO.goalNum);
        break;
      case 'Q': // 全场比分
        className = handleCaiguoWin(val, orderMatchZQBO.score)
          ? 'orange-red'
          : '';
        result = JCZQHelper.getScoreDes(orderMatchZQBO.score);
        break;
      case 'B': // 半全场胜平负
        className = handleCaiguoWin(val, orderMatchZQBO.hfWdf)
          ? 'orange-red'
          : '';
        result = JCZQHelper.getHalfDes(orderMatchZQBO.hfWdf);
        break;
      default:
        if (kind.indexOf('R') > -1) {
          className = handleCaiguoWin(val, orderMatchZQBO.letSpf)
            ? 'orange-red'
            : '';
          result = JCZQHelper.getMatchDes(orderMatchZQBO.letSpf);
        } else {
          return;
        }
        break;
    }
  } else {
    return (caiGuo = '--');
  }
  return (caiGuo = <span className={ className }>{result}</span>);
}

function handleBetWin(kind, code, orderMatchZQBO) {
  let bet = subInner(code, '', '@');
  switch (kind) {
    case 'S': // 胜平负
      return bet == orderMatchZQBO.fullSpf;
      break;
    case 'Z': // 总进球
      return bet == orderMatchZQBO.goalNum;
      break;
    case 'Q': // 全场比分
      return bet == orderMatchZQBO.score;
      break;
    case 'B': // 半全场胜平负
      return bet == orderMatchZQBO.hfWdf;
      break;
    default:
      if (kind.indexOf('R') > -1) {
        return bet == orderMatchZQBO.letSpf;
      } else {
      }
      break;
  }
}

function getMatchBet(kind, code, orderMatchZQBO, matchStatus) {
  // console.log(code,'getBet-code')
  let result;
  let className = ''; // 中奖标红处理
  if (matchStatus == 15 || matchStatus === 16 || matchStatus == 17) {
    className = handleBetWin(kind, code, orderMatchZQBO) ? 'orange-red' : '';
  } else {
    className = '';
  }
  if (kind.indexOf('S') >= 0) {
    result = (
      <div className={ className }>
        <span>{JCZQHelper.getMatchDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('R') >= 0) {
    result = (
      <div className={ className }>
        <span>让{JCZQHelper.getMatchDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('Q') >= 0) {
    // kind: 2:0@5.00
    result = (
      <div className={ className }>
        <span>{JCZQHelper.getScoreDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('B') >= 0) {
    // 平平@8.7
    result = (
      <div className={ className }>
        <span>{JCZQHelper.getHalfDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('Z') >= 0) {
    result = (
      <div className={ className }>
        <span>{JCZQHelper.getGoalDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  }
  return result;
}

function OpenSee({ orderVisibleType }) {
  // 抄单跟单开奖后可见
  let result = '';
  switch (orderVisibleType) {
    case 1:
      result = '开奖后可见';
      break;
    case 2:
      result = '全部可见';
      break;
    case 3:
      result = '仅对抄单人可见';
      break;
    case 4:
      result = '仅对关注人可见';
      break;
    default:
      break;
  }
  return (
    <div className="open-see">
      <img src={ require('../../img/order/ic_key@3x.png') } />
      <span>{result}</span>
    </div>
  );
}

function See({ orderMatchInfoBOs, lotteryChildCode }) {
  orderMatchInfoBOs = orderMatchInfoBOs.sort(
    (a, b) => a.systemCode - b.systemCode
  );
  const isDan = orderMatchInfoBOs.filter(order => order.isDan === 1).length > 0;
  return (
    <div className="plan-list">
      <table>
        <tbody>
          <tr>
            <td colSpan={ isDan ? 6 : 5 }>
              <table className="table-header">
                <tbody>
                  <tr>
                    <td className="col10">场次</td>
                    <td className="col20">主队VS客队</td>
                    <td className="col20">子玩法</td>
                    <td className={ cx(isDan ? 'col20' : 'col25') }>投注</td>
                    <td className={ cx(isDan ? 'col20' : 'col25') }>赛果</td>
                    {isDan && <td className="col10">胆</td>}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {orderMatchInfoBOs.map((order, index) => (
            <tr key={ index }>
              <td>
                <OrderContent
                  order={ order }
                  isDan={ isDan }
                  lotteryChildCode={ lotteryChildCode }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getBetGameContent(betGameContent, lotteryChildCode) {
  switch (lotteryChildCode) { // 单选玩法
    case 30002: // 胜平负
      betGameContent = 'S' + betGameContent;
      break;
    case 30003: // 让球胜平负
      betGameContent = 'R' + betGameContent;
      break;
    case 30004: // 比分
      betGameContent = 'Q' + betGameContent;
      break;
    case 30005: // 总进球
      betGameContent = 'Z' + betGameContent;
      break;
    case 30006: // 半全场
      betGameContent = 'B' + betGameContent;
      break;
    default:
      return betGameContent;
      break;
  }
  return betGameContent;
}

function OrderContent({ order, isDan, lotteryChildCode }) {
  const betGameContent = getBetGameContent(
    order.betGameContent,
    lotteryChildCode
  );
  const bets = betGameContent.split('_') || [];
  return (
    <table className="order-content">
      <tbody>
        {bets.map((bet, index) => {
          let betArr = subInner(bet, '(', ')').split(',') || [];
          if (betArr.length > 1) {
            // 出票内容排序
            if (
              bet.indexOf('R') > -1 ||
              bet.indexOf('S') > -1 ||
              bet.indexOf('B') > -1
            ) {
              // 降序
              betArr = betArr.sort(function(a, b) {
                return b.split('@')[0] - a.split('@')[0];
              });
            } else if (bet.indexOf('Z') > -1 || bet.indexOf('Q') > -1) {
              // 升序
              betArr = betArr.sort(function(a, b) {
                return a.split('@')[0] - b.split('@')[0];
              });
            }
          }
          const kind = subInner(bet, '', '(');
          return (
            <tr key={ index }>
              {index === 0 && (
                <td className="col10" rowSpan={ bets.length }>
                  <div>
                    {order.officalMatchCode
                      ? order.officalMatchCode.substr(0, 2)
                      : ''}
                  </div>
                  <div>
                    {order.officalMatchCode
                      ? order.officalMatchCode.slice(2)
                      : ''}
                  </div>
                  <div>{order.matchShortName}</div>
                </td>
              )}

              {index === 0 && (
                <td className="col20" rowSpan={ bets.length }>
                  <div>{order.homeName}</div>
                  <div>{util.getMathInfo(order)}</div>
                  <div>{order.visitiName}</div>
                </td>
              )}
              <td className="col20">
                <span>{util.getMatchKind(subInner(bet, '', '('))}</span>
                {bet.indexOf('R') > -1 ? (
                  <span>[{subInner(bet, '[', ']')}]</span>
                ) : (
                  ''
                )}
              </td>
              <td className={ cx(isDan ? 'col20' : 'col25') }>
                {betArr.map((val, id) => (
                  <div key={ id }>
                    {getMatchBet(
                      kind,
                      val,
                      order.orderMatchZQBO,
                      order.matchStatus
                    )}
                  </div>
                ))}
              </td>
              <td className={ cx(isDan ? 'col20' : 'col25') }>
                {getCaiguo(order.orderMatchZQBO, bet, order.matchStatus)}
              </td>
              {isDan &&
                index == 0 && (
                  <td className="col10 dan " rowSpan={ bets.length }>
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
  );
}

function Content({ orderMatchInfoBOs, orderBaseInfoBO }) {
  return (
    <div className="plan-content">
      <div className="plan-header">
        <span>方案内容</span>
        <span>赔率以实际出票为准</span>
      </div>
      {// 抄单- 4可见状态
        orderBaseInfoBO.orderVisibleType ? (
          <OpenSee orderVisibleType={ orderBaseInfoBO.orderVisibleType } />
        ) : (
          <See
            orderMatchInfoBOs={ orderMatchInfoBOs }
            lotteryChildCode={ orderBaseInfoBO.lotteryChildCode }
          />
        )}
    </div>
  );
}

class JCZTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: props.order,
      show: true // 发布抄单 关闭按钮
    };
  }
  toggle() {
    let { show } = this.state;
    this.setState({ show: !show });
  }
  render() {
    const { order } = this.state;
    let orderBaseInfoBO = order.orderBaseInfoBO || {}; //	订单基本信息
    let orderMatchInfoBOs = order.orderMatchInfoBOs || []; // 竞技彩方案详情结果集
    let bonusOptimal = false; // 默认不是奖金优化
    // 投注类型  2:单场制胜; 3:奖金优化
    let orderCode = orderBaseInfoBO.orderCode;
    if (orderBaseInfoBO.categoryId == 2 || orderBaseInfoBO.categoryId == 3) {
      bonusOptimal = true;
    }
    return (
      <div>
        <div className="lot-item zh-item">
          {bonusOptimal ? ( // 搏冷优化
            <div className="jjc-pass">
              <span className="bonus-green">
                {orderBaseInfoBO.categoryId == 3 ? '奖金优化' : ''}
                {orderBaseInfoBO.categoryId == 2 ? '单场致胜' : ''}
              </span>
            </div>
          ) : (
            <div className="jjc-pass">
              <span>过关方式</span>
              <span className="lot-item-m">
                {util.getPassStyle(orderBaseInfoBO.bunchStr)}
              </span>
            </div>
          )}
          {orderBaseInfoBO.orderType === 3 ? ( // 跟单没有出票明细
            ''
          ) : (
            <div className="jjc-pass">
              {OrderHelper.getTicket(orderBaseInfoBO)}
            </div>
          )}
        </div>
        <section className="jjc-section">
          {bonusOptimal ? (
            <Bonus orderCode={ orderCode } orderBaseInfoBO={ orderBaseInfoBO } />
          ) : (
            <Content
              orderBaseInfoBO={ orderBaseInfoBO }
              orderMatchInfoBOs={ orderMatchInfoBOs }
            />
          )}
        </section>
        {// 支付成功 未发布抄单
          orderBaseInfoBO.orderType === 1 && orderBaseInfoBO.payStatus === 2 ? (
            <div className={ cx('publish-copy', this.state.show ? '' : 'hide') }>
              <img
                src={ require('../../img/order/chaodan_guanbi@2x.png') }
                onClick={ this.toggle.bind(this) }
              />
              <CopyEntrance available={ true } order={ orderBaseInfoBO.orderCode } />
            </div>
          ) : (
            ''
          )}
      </div>
    );
  }
}

export default JCZTemplate;

JCZTemplate.propTypes = {
  order: PropTypes.object
};
