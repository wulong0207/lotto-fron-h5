/*
 * @Author: nearxu
 * @Date: 2017-11-15 20:29:12
 * 篮球 足球 的奖金优化
 * 根据返回的比赛结果判断 orderMatchLQBO
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import session from '@/services/session';
import { getParameter, subInner } from '@/utils/utils';
import Message from '@/services/message';
import { isEmpty } from 'lodash';
import LoadMore from '../common/load-more';
import JCZQHelper from '../util/jcz-help';
import JCLQHelper from '../util/jcl-help';
import JJCHelper from '../../components/jjc-helper';
import '../../css/lottoDetail/bonus.scss';

/*
1：未开奖；2：未中奖；3：已中奖；4：已派奖
*/

function getMatchStatus(index, orderBaseInfoBO, resultBoData) {
  let returnResult;
  let isResult = orderBaseInfoBO['winningStatus'] || {};
  let bonusList = resultBoData.data || [];
  let bonus = '';
  if (isResult == '1') {
    return (returnResult = <span>未开奖</span>);
  }
  if (isResult == '2') {
    return (returnResult = <span> 未中奖 </span>);
  }
  if (isResult == '3' || isResult == '4') {
    if (bonusList[index].preBonus) {
      bonus = <span className="red">{bonusList[index].preBonus}</span>;
    } else {
      bonus = '未中奖';
    }
  }
  return (returnResult = <span>{bonus}</span>);
}

// 是否中奖
function handleBetWin(kind, code, orderMatch) {
  let bet = subInner(code, '', '@');
  switch (kind) {
    case 'S': // 胜平负
      return bet == orderMatch.fullSpf;
      break;
    case 'Z': // 总进球
      return bet == orderMatch.goalNum;
      break;
    case 'Q': // 全场比分
      return bet == orderMatch.score;
      break;
    case 'B': // 半全场胜平负
      return bet == orderMatch.hfWdf;
      break;
    default:
      if (kind.indexOf('R') > -1) {
        return bet == orderMatch.letSpf;
      } else {
      }
      break;
  }
}

// orderMatchLQBO 竞彩篮球 各彩种 开奖信息
function handleBetWinLQ(code, item, orderMatchLQBO) {
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

// 单个彩种投注
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
  }
  return betGameContent;
}

function handleMixBet(val, lotteryChildCode) {
  let betGameContent = val.betGameContent;
  if (!betGameContent) {
    return <div />;
  } else {
    betGameContent = getBetGameContent(betGameContent, lotteryChildCode);
  }
  console.log(betGameContent, 'betgame');
  let classnames = '';
  let kind = subInner(betGameContent, '', '(');
  let result;
  if (!isEmpty(val.orderMatchLQBO)) {
    classnames = handleBetWinLQ(
      kind,
      subInner(betGameContent, '(', ')'),
      val.orderMatchLQBO
    )
      ? 'orange-fill'
      : '';
  } else if (!isEmpty(val.orderMatchZQBO)) {
    classnames = handleBetWin(
      kind,
      subInner(betGameContent, '(', ')'),
      val.orderMatchZQBO
    )
      ? 'orange-fill'
      : '';
  }
  switch (kind) { // jcz SRZQB srdc
    case 'S':
      {
        result = (
          <div className={ classnames }>
            <span>
              {JCZQHelper.getMatchDes(subInner(betGameContent, '(', '@'))}
            </span>
            <span>{subInner(betGameContent, '@', ')')}</span>
          </div>
        );
      }
      break;
    case 'Z':
      {
        result = (
          <div className={ classnames }>
            <span>
              {JCZQHelper.getGoalDes(subInner(betGameContent, '(', '@'))}球
            </span>
            <span>{subInner(betGameContent, '@', ')')}</span>
          </div>
        );
      }
      break;
    case 'Q':
      {
        result = (
          <div className={ classnames }>
            <span>
              {JCZQHelper.getScoreDes(subInner(betGameContent, '(', '@'))}
            </span>
            <span>{subInner(betGameContent, '@', ')')}</span>
          </div>
        );
      }
      break;
    case 'B':
      {
        result = (
          <div className={ classnames }>
            <span>
              {JCZQHelper.getHalfDes(subInner(betGameContent, '(', '@'))}
            </span>
            <span>{subInner(betGameContent, '@', ')')}</span>
          </div>
        );
      }
      break;
    case 'C':
      {
        // 胜分差
        result = (
          <div className={ classnames }>
            <span>
              {JCLQHelper.getSfcWF(subInner(betGameContent, '(', '@'))}
            </span>
            <span>{subInner(betGameContent, '@', ')')}</span>
          </div>
        );
      }
      break;
    default:
      {
        if (kind.indexOf('R') > -1) {
          let id = subInner(betGameContent, '(', '@');
          result = (
            <div className={ classnames }>
              <span>
                {`[${subInner(betGameContent, '[', ']')}]`}
                让{lotteryChildCode.toString().substring(0, 3) == '300'
                  ? '球'
                  : '分'}主{JCZQHelper.getMatchDes(id)}
              </span>
              <span>{subInner(betGameContent, '@', ')')}</span>
            </div>
          );
        } else if (kind.indexOf('D') > -1) {
          // 大小分
          result = (
            <div className={ classnames }>
              <span>
                {JCLQHelper.getDxDes(subInner(betGameContent, '(', '@'))}
              </span>
              <span>{subInner(betGameContent, '@', ')')}</span>
            </div>
          );
        }
      }
      break;
  }
  return result;
}

function Column({ vsData, lotteryChildCode }) {
  console.log(vsData, 'vsdata');
  return (
    <div className="bet-col">
      {vsData.map((val, i) => {
        return (
          <div key={ i } className="list">
            <div className="list-vs">
              <span>{val.homeName}</span>
              <span>12:00</span>
              <span> {val.visitiName}</span>
            </div>
            <div className="list-vs column-div">
              {handleMixBet(val, lotteryChildCode)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Table({ listData, orderBaseInfoBO, resultBoData }) {
  return (
    <div className="bonus-plan">
      <div className="header">
        <span className="col15">过关方式</span>
        <span className="col30">主队VS客队</span>
        <span className="col30">投注</span>
        <span className="col10">倍数</span>
        <span className="col15">状态</span>
      </div>
      <div className="bonus-list">
        <table>
          <tbody>
            {listData.map((m, i) => {
              return (
                <tr key={ i }>
                  <td className="col15">
                    <span>{JJCHelper.getPassStyle(m.passway)}</span>
                  </td>
                  <td className="col60">
                    <Column
                      vsData={ m.orderMatchInfoBOList }
                      lotteryChildCode={ m.lotteryChildCode }
                    />
                  </td>
                  <td className="col10">
                    <span>{m.multiple}</span>
                  </td>
                  <td className="col15">
                    <span>
                      {getMatchStatus(i, orderBaseInfoBO, resultBoData)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

class Bonus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultBoData: {}
    };
    this.page = 0;
    this.pageIndex = 0;
  }
  componentDidMount() {
    this.getSportOrderList();
  }
  getSportOrderList(isMore) {
    let { orderCode } = this.props;
    http
      .post('/order/queryUserSportOrderList', {
        token: session.get('token'),
        pageIndex: this.page,
        pageSize: 3,
        orderCode: orderCode
      })
      .then(res => {
        let resultBoData = res.data || {};
        this.setState({ resultBoData });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  loadMore() {
    this.pageIndex++;
    let { orderCode } = this.props;
    http
      .post('/order/queryUserSportOrderList', {
        token: session.get('token'),
        pageIndex: this.pageIndex,
        pageSize: 3,
        orderCode: orderCode
      })
      .then(res => {
        let { resultBoData } = this.state;
        resultBoData.data = resultBoData.data.concat(res.data.data);
        console.log(resultBoData, 'resultBoData');
        this.setState({
          resultBoData
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  render() {
    let { resultBoData } = this.state;
    let listData = resultBoData.data || [];
    let { orderBaseInfoBO, orderCode } = this.props;
    let hasMoreCount = parseInt(resultBoData.total - listData.length); // 还有多少个方案
    return (
      <div className="bonus-content">
        <div className="bonus-header">
          <span>方案内容</span>
          <span>赔率以实际出票为准</span>
        </div>
        <Table
          listData={ listData }
          orderBaseInfoBO={ orderBaseInfoBO }
          resultBoData={ resultBoData }
        />
        {hasMoreCount > 0 ? (
          <LoadMore
            hasMoreCount={ hasMoreCount }
            loadMore={ this.loadMore.bind(this) }
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

Bonus.propTypes = {
  orderCode: PropTypes.string
};
export default Bonus;
