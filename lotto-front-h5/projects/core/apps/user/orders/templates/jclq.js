/*
 * @Author: nearxu
 * @Date: 2017-10-12 20:23:10
 * 竞彩足球
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import OrderHelper from '../../components/order-helper.jsx';
import { subInner } from '@/utils/utils';
import Bonus from './bonus.js';
import { isEmpty } from 'lodash';
import '../../css/lottoDetail/jjcz.scss';
import cx from 'classnames';
import util from '../util/util';
import JCLQHelper from '../util/jcl-help';
import CopyEntrance from '../../../../../sports/apps/cd/components/entrance';

// 中奖彩果标红
function handleCaiguoWin(val, spf) {
  console.log(val, 'val', spf, 'spf');
  if (val.indexOf('D') > -1) {
    // 大小分
    let drawVal = subInner(val, '[', ']').substring(0, 3);
    let spfVal = spf.split(',').filter(m => m.indexOf(drawVal) > -1);
    console.log(spfVal, spfVal);
  }
  let arr = subInner(val, '(', ')').split(',') || [];
  const isWin = arr.filter(m => subInner(m, '', '@') == spf).length > 0;
  return isWin;
}

function getCaiguo(orderMatchLQBO, val, matchStatus) {
  console.log(orderMatchLQBO, 'orderlq', val, 'val');
  let result;
  let caiGuo;
  let className = '';
  if (matchStatus == 15 || matchStatus == 16 || matchStatus == 17) {
    let kind = subInner(val, '', '(');
    switch (kind) {
      case 'S': // 胜平负
        className = handleCaiguoWin(val, orderMatchLQBO.fullWf)
          ? 'orange-red'
          : '';
        result = '主' + JCLQHelper.getMatchDes(orderMatchLQBO.fullWf);
        break;
      case 'C': // 胜分差
        className = handleCaiguoWin(val, orderMatchLQBO.sfcWF)
          ? 'orange-red'
          : '';
        result = JCLQHelper.getSfcWF(orderMatchLQBO.sfcWF);
        break;
      default:
        if (kind.indexOf('R') > -1) {
          className = handleCaiguoWin(val, orderMatchLQBO.fullWf)
            ? 'orange-red'
            : '';
          result = JCLQHelper.getLetWf(val, orderMatchLQBO.letWf);
        } else if (kind.indexOf('D') > -1) {
          className = handleCaiguoWin(val, orderMatchLQBO.dxfWF)
            ? 'orange-red'
            : '';
          result = JCLQHelper.getDxf(val, orderMatchLQBO.dxfWF);
        }
        break;
    }
  } else {
    return (caiGuo = '--');
  }
  return (caiGuo = <span className={ className }>{result}</span>);
}

/* 竞彩篮球 是否中奖
    D 大小分 99 大 00 小
    C 胜分差 主胜1-5(01)  6-10(02) 11-15(03) 16-20(04) 21-25(05) 26+(06)
                客胜 1-5(11)  6-10(12) 11-15(13) 16-20(14)  21-25(15) 26+(16)
    R 让分胜负 胜(3) 负(0)
    S 胜负 胜(3) 负(0)
    orderMatchLQBO:{
        dxfwf:"148.5|99,149.5|99,150.5|99,151.5|99"  	大小分
        fullScore:"100:120" 	全场比分
        fullWf:"3" 全场胜负 3：胜，0：负
        letWf:"-1.5|3,2.5|3,3.5|3" 	让分胜负 3：胜，0：负
        胜分差
        sfcWF:"04"
            主胜1-5(01)  6-10(02) 11-15(03) 16-20(04) 21-25(05) 26+(06)
            主负1-5(11)  6-10(12) 11-15(13) 16-20(14) 21-25(15) 26+(16)

    }
*/

// orderMatchLQBO 竞彩篮球 各彩种 开奖信息
function handleBetWin(code, item, orderMatchLQBO) {
  let id = code.substring(0, 1);
  switch (id) {
    case 'D': // 大小分
      {
        let val = item.substring(0, 2) || '';
        let dxfArr = orderMatchLQBO.dxfWF.split(',') || []; // ["148.5|99","149.5|99"]
        let drawVal = subInner(code, '[', ']');
        drawVal = drawVal.match(/\d+(\.\d)?/); // '150.23' => 150.2
        if (drawVal) {
          drawVal = drawVal[0];
        }
        for (var i = 0; i < dxfArr.length; i++) {
          if (dxfArr[i].split('|')[0].indexOf(drawVal) > -1) {
            return dxfArr[i].split('|')[1] == val;
          }
        }
      }
      break;
    case 'R': // 让分胜负
      {
        let val = item.substring(0, 1) || '';
        let letWfArr = orderMatchLQBO.letWf.split(',') || []; // ["1.5|3","2.5|0"]
        let drawVal = subInner(code, '[', ']');
        drawVal = drawVal.match(/\d+(\.\d)?/);
        if (drawVal) {
          drawVal = drawVal[0];
        }
        for (var i = 0; i < letWfArr.length; i++) {
          if (letWfArr[i].split('|')[0].indexOf(drawVal) > -1) {
            return letWfArr[i].split('|')[1] == val;
          }
        }
      }
      break;
    case 'S': // 胜负
    case 'C': // 胜分差
      {
        let cId = parseInt(item.split('@')[0]); // 数字 item == 04@2.3
        let val = 0;
        if (id == 'S') {
          val = parseInt(orderMatchLQBO.fullWf);
        } else {
          val = parseInt(orderMatchLQBO.sfcWF);
        }
        if (val == cId) {
          return val == cId;
        }
      }
      break;
    default:
      break;
  }
}

function getMatchBet(val, code, orderMatchLQBO, matchStatus) {
  let result;
  let className = ''; // 中奖标红处理
  let kind = subInner(val, '', '(');
  if (matchStatus == 15 || matchStatus == 16 || matchStatus == 17) {
    className = handleBetWin(val, code, orderMatchLQBO) ? 'orange-red' : '';
  } else {
    className = '';
  }
  if (kind.indexOf('S') >= 0) {
    result = (
      <div className={ className }>
        <span>{JCLQHelper.getMatchDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('R') >= 0) {
    result = (
      <div className={ className }>
        <span>让{JCLQHelper.getMatchDes(subInner(code, '', '@'))}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('D') >= 0) {
    // 大小分
    //  小分@1.50  ==>  小分[126.00]1.55
    result = (
      <div className={ className }>
        <span>{JCLQHelper.getDxDes(code)}</span>
        <span>[{subInner(code, '@', '')}]</span>
      </div>
    );
  } else if (kind.indexOf('C') >= 0) {
    // 胜分差
    result = (
      <div className={ className }>
        <span>{JCLQHelper.getSfcWF(subInner(code, '', '@'))}</span>
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

function getBetGameContent(betGameContent, lotteryChildCode) {
  switch (lotteryChildCode) { // 单选玩法
    case 30101:
      betGameContent = 'S' + betGameContent;
      break;
    case 30102:
      betGameContent = 'R' + betGameContent;
      break;
    case 30103:
      betGameContent = 'D' + betGameContent;
      break;
    case 30104:
      betGameContent = 'C' + betGameContent;
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
              bet.indexOf('D') > -1
            ) {
              // 降序
              betArr = betArr.sort(function(a, b) {
                return b.split('@')[0] - a.split('@')[0];
              });
            } else if (bet.indexOf('C') > -1) {
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
                  <div>{order.officalMatchCode.substring(0, 2)}</div>
                  <div>{order.officalMatchCode.slice(2)}</div>
                  <div>{order.matchShortName}</div>
                </td>
              )}

              {index === 0 && (
                <td className="col20" rowSpan={ bets.length }>
                  <div>{order.visitiName}</div>
                  <div>{util.getMathInfo(order)}</div>
                  <div>{order.homeName}</div>
                </td>
              )}
              <td className="col20">
                <span>{JCLQHelper.getMatchKind(subInner(bet, '', '('))}</span>
              </td>
              <td className={ cx(isDan ? 'col20' : 'col25') }>
                {betArr.map((val, id) => (
                  <div key={ id }>
                    {getMatchBet(
                      kind,
                      val,
                      order.orderMatchLQBO,
                      order.matchStatus
                    )}
                  </div>
                ))}
              </td>
              <td className={ cx(isDan ? 'col20' : 'col25') }>
                {getCaiguo(order.orderMatchLQBO, bet, order.matchStatus)}
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
                    <td className="col20">客队VS主队</td>
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
              <td colSpan={ isDan ? 6 : 5 }>
                <OrderContent
                  isDan={ isDan }
                  order={ order }
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
                {orderBaseInfoBO.orderType === 3 // 跟单没有出票明细
                  ? ''
                  : util.getPassStyle(orderBaseInfoBO.bunchStr)}
              </span>
            </div>
          )}
          <div className="jjc-pass">
            {OrderHelper.getTicket(orderBaseInfoBO)}
          </div>
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
                src={ require('../../img/chaodan_guanbi@2x.png') }
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
