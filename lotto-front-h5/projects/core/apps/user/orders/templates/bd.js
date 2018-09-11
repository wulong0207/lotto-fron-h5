/*
 * @Author: nearxu
 * @Date: 2017-11-26 13:27:09
 * 北京单场
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
// import CopyEntrance from '../../../../../sports/apps/cd/components/entrance';

// 中奖彩果标红
function handleCaiguoWin(code, betArr, orderMatchBJBO) {
  let value = '';
  switch (code) {
    case 30601:
      value = orderMatchBJBO.letWdf;
      break;
    case 30602:
      value = orderMatchBJBO.udSd;
      break;
    case 30603:
      value = orderMatchBJBO.goalNum;
      break;
    case 30604:
      value = orderMatchBJBO.score;
      break;
    case 30605:
      value = orderMatchBJBO.hfWdf;
      break;
    case 30701:
      value = orderMatchBJBO.letSf;
      break;

    default:
      break;
  }
  const isWin = betArr.filter(m => subInner(m, '', '@') == value).length > 0;
  return isWin;
}

function handleCaiguo(orderMatchBJBO, lotteryChildCode, betArr) {
  let result;
  let className = '';
  if (orderMatchBJBO) {
    className = handleCaiguoWin(lotteryChildCode, betArr, orderMatchBJBO)
      ? 'orange-red'
      : '';
  }
  switch (lotteryChildCode) {
    case 30605:
      orderMatchBJBO.hfWdf
        ? (result = (
          <div className={ className }>
            <span>{getHalfScore(orderMatchBJBO.hfWdf)}</span>
            <span>@{orderMatchBJBO.spHfWdf}</span>
          </div>
        ))
        : (result = <span>--</span>);

      break;
    case 30604:
      orderMatchBJBO.fullScore
        ? (result = (
          <div className={ className }>
            <span>{orderMatchBJBO.fullScore}</span>
            <span>@{orderMatchBJBO.spScore}</span>
          </div>
        ))
        : (result = <span>--</span>);

      break;
    case 30603:
      orderMatchBJBO.goalNum
        ? (result = (
          <div className={ className }>
            <span>{orderMatchBJBO.goalNum}球 </span>
            <span>@{orderMatchBJBO.spScore}</span>
          </div>
        ))
        : (result = <span>--</span>);

      break;
    case 30602:
      orderMatchBJBO.udSd
        ? (result = (
          <div className={ className }>
            <span>{getudSd(orderMatchBJBO.udSd)}</span>
            <span>@{orderMatchBJBO.spUdSd}</span>
          </div>
        ))
        : (result = <span>--</span>);

      break;
    case 30601:
      orderMatchBJBO.letWdf
        ? (result = (
          <div className={ className }>
            <span>{getLetWdf(orderMatchBJBO.letWdf)}</span>
            <span>@{orderMatchBJBO.spLetWdf}</span>
          </div>
        ))
        : (result = <span>--</span>);
      break;
    case 30701:
      orderMatchBJBO.letSf
        ? (result = (
          <div className={ className }>
            <span>{getLetSf(orderMatchBJBO.letSf)}</span>
            <span>@{orderMatchBJBO.spLetSf}</span>
          </div>
        ))
        : (result = <span>--</span>);
      break;

    default:
      break;
  }
  return result;
}

// 是否中奖 标红
function handleBetWin(code, orderMatchBJBO, m) {
  switch (code) {
    case 30605:
      return m == orderMatchBJBO.hfWdf;
      break;
    case 30604:
      return m == orderMatchBJBO.score;
      break;
    case 30603:
      return m == orderMatchBJBO.goalNum;
      break;
    case 30602:
      return m == orderMatchBJBO.udSd;
      break;
    case 30601:
      return m == orderMatchBJBO.letWdf;
      break;
    case 30701:
      return m == orderMatchBJBO.letSf;
      break;
    default:
      break;
  }
}

// 胜负过关
function getLetSf(val, code, orderMatchBJBO) {
  let result;
  let id = subInner(val, '(', '@');
  let classNames;
  if (orderMatchBJBO) {
    classNames = handleBetWin(code, orderMatchBJBO, id) ? 'orange-red' : '';
  } else {
    classNames = '';
  }
  switch (id) {
    case '3':
      result = <b className={ classNames }>主胜</b>;
      break;
    case '0':
      result = <b className={ classNames }>主负</b>;
      break;
    default:
      result = '';
      break;
  }
  return result;
}
// 胜平负
function getLetWdf(val, code, orderMatchBJBO) {
  console.log(val, 'val');
  let result;
  let id = subInner(val, '', '@');
  let classNames;
  if (orderMatchBJBO) {
    classNames = handleBetWin(code, orderMatchBJBO, id) ? 'orange-red' : '';
  } else {
    classNames = '';
  }
  switch (id) {
    case '3':
      result = <b className={ classNames }>胜</b>;
      break;
    case '1':
      result = <b className={ classNames }>平</b>;
      break;
    case '0':
      result = <b className={ classNames }>负</b>;
      break;
    default:
      result = '';
      break;
  }
  return result;
}
// 上下单双
function getudSd(val, code, orderMatchBJBO) {
  let result;
  let id = subInner(val, '', '@');
  let classNames;
  if (orderMatchBJBO) {
    classNames = handleBetWin(code, orderMatchBJBO, id) ? 'orange-red' : '';
  } else {
    classNames = '';
  }
  switch (id) {
    case '1':
      result = <b className={ classNames }>上单</b>;
      break;
    case '2':
      result = <b className={ classNames }>上双</b>;
      break;
    case '3':
      result = <b className={ classNames }>下单</b>;
      break;
    case '4':
      result = <b className={ classNames }>下双</b>;
      break;
    default:
      result = '';
      break;
  }
  return result;
}
// 总进球
function getSpGoalNum(val, code, orderMatchBJBO) {
  let result;
  let id = subInner(val, '', '@');
  let classNames;
  if (orderMatchBJBO) {
    classNames = handleBetWin(code, orderMatchBJBO, id) ? 'orange-red' : '';
  } else {
    classNames = '';
  }
  if (parseInt(id) >= 7) {
    return (result = <b className={ classNames }> 7+ </b>);
  }
  return (result = <b className={ classNames }> {id} 球</b>);
}
// 全场比分
function getSpScore(gameResult, code, orderMatchBJBO) {
  let qReulst = '';
  let result;
  gameResult = gameResult || '';
  let id = subInner(gameResult, '', '@');
  let classNames;
  if (orderMatchBJBO) {
    classNames = handleBetWin(code, orderMatchBJBO, id) ? 'orange-red' : '';
  } else {
    classNames = '';
  }
  if (gameResult.length >= 2) {
    if (gameResult[0] == gameResult[1] && gameResult[0] == '9') {
      qReulst = '平其他';
    } else if (gameResult[0] == '9') {
      qReulst = '胜其他';
    } else if (gameResult[1] == '9') {
      qReulst = '负其他';
    } else {
      qReulst = gameResult[0] + ':' + gameResult[1];
    }
  }
  return (result = <div className={ classNames }> {qReulst}</div>);
}
// 半全场胜负
function getHalfScore(val, code, orderMatchBJBO) {
  let result;
  let id = subInner(val, '', '@');
  let classNames;
  if (orderMatchBJBO) {
    classNames = handleBetWin(code, orderMatchBJBO, id) ? 'orange-red' : '';
  } else {
    classNames = '';
  }
  return (result = (
    <b className={ classNames }>
      {util.getMatchDes(id.substr(0, 1))}-{util.getMatchDes(id.substr(1, 1))}
    </b>
  ));
}

// 投注内容
function getMatchBet(val, code, orderMatchBJBO) {
  console.log(val, 'getMatchBet');
  let result;
  switch (code) {
    case 30605: // 半全场
      result = getHalfScore(val, code, orderMatchBJBO);
      break;
    case 30604: // 全场比分
      result = getSpScore(val, code, orderMatchBJBO);
      break;
    case 30603: // 总进球
      result = getSpGoalNum(val, code, orderMatchBJBO);
      break;
    case 30602: // 上下单双
      result = getudSd(val, code, orderMatchBJBO);
      break;
    case 30601: // 胜平负
      result = getLetWdf(val, code, orderMatchBJBO);
      break;
    case 30701: // 胜负过关
      result = getLetSf(val, code, orderMatchBJBO);
    default:
      break;
  }

  return result;
}

// 玩法
function getlotteryChildCode(lotteryChildCode, val, spf) {
  let result = '';
  switch (lotteryChildCode) {
    case 30601:
      result = parseInt(spf) != 0 ? `胜平负 [${spf}]` : '胜平负';
      break;
    case 30602:
      result = '上下单双';
      break;
    case 30603:
      result = '总进球';
      break;
    case 30604:
      result = '全场比分';
      break;
    case 30605:
      result = '半全场';
      break;
    case 30701:
      {
        let str = subInner(val, '[', ']');
        result = '胜负过关' + '[' + str + ']';
      }
      break;
    default:
      result = '';
      break;
  }
  return result;
}

function OrderContent({ order, isDan, lotteryChildCode }) {
  const betGameContent = order.betGameContent;
  const orderBetArr = betGameContent.split('_') || [];
  return (
    <table className="order-content">
      <tbody>
        {orderBetArr.map((bet, index) => {
          let spf;
          if (lotteryChildCode == 30601) {
            spf = subInner(bet, '[', ']');
          }
          if (lotteryChildCode != 30701) {
            bet = subInner(bet, '(', ')');
          }
          let betArr = bet.split(',') || [];
          if (betArr.length > 1) {
            // 胜平负投注内容排序
            if (
              lotteryChildCode == 30601 ||
              lotteryChildCode == 30701 ||
              lotteryChildCode == 30605
            ) {
              // 降序
              betArr = betArr.sort(function(a, b) {
                return parseInt(b.split('@')[0]) - parseInt(a.split('@')[0]);
              });
            } else if (
              lotteryChildCode == 30602 ||
              lotteryChildCode == 30603 ||
              lotteryChildCode == 30604
            ) {
              // 升序
              betArr = betArr.sort(function(a, b) {
                return parseInt(a.split('@')[0]) - parseInt(b.split('@')[0]);
              });
            }
          }
          return (
            <tr key={ index }>
              {index === 0 && (
                <td className="col10" rowSpan={ orderBetArr.length }>
                  <div>
                    {order.systemCode
                      ? order.systemCode.substr(order.systemCode.length - 2, 2)
                      : ''}
                  </div>
                  <div>{order.matchShortName}</div>
                </td>
              )}

              {index === 0 && (
                <td className="col20" rowSpan={ orderBetArr.length }>
                  <div>{order.homeName}</div>
                  <div>{util.getMathInfo(order)}</div>
                  <div>{order.visitiName}</div>
                </td>
              )}
              <td className="col20">
                <span> {getlotteryChildCode(lotteryChildCode, bet, spf)}</span>
              </td>
              <td className={ cx(isDan ? 'col20' : 'col25') }>
                {betArr.map((val, id) => (
                  <div key={ id }>
                    {getMatchBet(val, lotteryChildCode, order.orderMatchBJBO)}
                  </div>
                ))}
              </td>
              <td className={ cx(isDan ? 'col20' : 'col25') }>
                {handleCaiguo(order.orderMatchBJBO, lotteryChildCode, betArr)}
              </td>
              {isDan && (
                <td className="col10 dan ">
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
              <td colSpan={ orderMatchInfoBOs.length }>
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
    return (
      <div>
        <div className="lot-item zh-item">
          <div className="jjc-pass">
            <span>过关方式</span>
            <span className="lot-item-m">
              {util.getPassStyle(orderBaseInfoBO.bunchStr)}
            </span>
          </div>
          <div className="jjc-pass">
            {OrderHelper.getTicket(orderBaseInfoBO)}
          </div>
        </div>
        <section className="jjc-section">
          <div className="plan-content">
            <div className="plan-header">
              <span>方案内容</span>
            </div>
            <See
              orderMatchInfoBOs={ orderMatchInfoBOs }
              lotteryChildCode={ orderBaseInfoBO.lotteryChildCode }
            />
          </div>
        </section>
      </div>
    );
  }
}

export default JCZTemplate;

JCZTemplate.propTypes = {
  order: PropTypes.object
};
