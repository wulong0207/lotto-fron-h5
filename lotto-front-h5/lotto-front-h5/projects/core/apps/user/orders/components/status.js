import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Order from '../types/order';
import Header from '@/component/header.jsx';
import OrderState from '../../components/order-status.jsx';
import Const from '@/utils/const';
import { formatMoney } from '@/utils/utils';
import OrderHelper from '../../components/order-helper.jsx';
import cx from 'classnames';
import CopyEntrance from '../../../../../sports/apps/cd/components/entrance';
import Util from '../util/util';
import '../../css/lottoDetail/header.scss';

import IconOne from '../../img/order/heitao_min.png'; // 黑桃
import IconTwo from '../../img/order/hongtao_min.png'; // 红桃
import IconThr from '../../img/order/meihua_min.png'; // 梅花
import IconFor from '../../img/order/fangkuai_min.png'; // 方块

function payHandler(e, orderCode, buyType) {
  // 去支付
  if (e) {
    e.stopPropagation();
  }
  OrderHelper.goDirectPay(orderCode, buyType);
}

function getExports(e, userIssueId) {
  // 跳转 专家详情
  if (e) {
    e.stopPropagation();
  }
  window.location.href = '/cd/#/experts/' + userIssueId;
}

function CommissionPerson({ copyHeadUrl, userIssueId }) {
  // 发单人
  return (
    <div>
      <div className="publish" onClick={ e => getExports(e, userIssueId) }>
        <div>
          <span>发单人</span>
          {copyHeadUrl ? (
            <img className="publish-person" src={ copyHeadUrl } />
          ) : (
            <img
              className="publish-person"
              src={ require('../../img/head.png') }
            />
          )}
        </div>
        <div className="icon-arrow-r" />
      </div>
      <div />
    </div>
  );
}

// 抄单 奖金
class Commission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
  toggle() {
    let { show } = this.state;
    this.setState({ show: !show });
  }
  render() {
    const { orderBaseInfoBO } = this.props;
    const { show } = this.state;
    const bonus =
      orderBaseInfoBO.preBonus +
      orderBaseInfoBO.commissionRate * orderBaseInfoBO.commissionRate;
    return (
      <div className="copy-bonus">
        <div className="commission-top">
          <div className="commission-list">
            <div className="list">
              <span className="list-title">税后金额:</span>
              {orderBaseInfoBO.bonusAmount ? (
                <span className="red">¥{orderBaseInfoBO.bonusAmount}</span>
              ) : (
                <span className="red">--</span>
              )}
            </div>
            <div className="list">
              <span className="list-title">加奖金额:</span>
              <span className="red">--</span>
            </div>
            <div className="list">
              <span className="list-title">发单人:</span>
              {orderBaseInfoBO.copyNickName ? (
                <span className="red">{orderBaseInfoBO.copyNickName}</span>
              ) : (
                <span className="red">--</span>
              )}
            </div>
            <div className="list">
              <span className="list-title">提成比例:</span>
              {orderBaseInfoBO.commissionRateStr ? (
                <span className="red">{orderBaseInfoBO.commissionRateStr}</span>
              ) : (
                <span className="red">--</span>
              )}
            </div>
            <div className="list">
              <span className="list-title">提成佣金:</span>
              <div className="list-bonus">
                {orderBaseInfoBO.commissionAmount ? (
                  <span className="red">
                    ¥{formatMoney(orderBaseInfoBO.commissionAmount)}
                  </span>
                ) : (
                  <span className="red">--</span>
                )}
                <div onClick={ this.toggle.bind(this) }>
                  <img src={ require('../../img/order/greyinfor@2x.png') } />
                  <span className="grey">佣金说明</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={ cx('rule', show ? '' : 'hide') }>
          <div className="rule-title">
            <b />
            <span>奖金金额计算参考</span>
            <b />
          </div>
          <p className="bold">奖金金额=税后奖金-提成拥金+加奖奖金</p>
          <p className="bold bottom">提成拥金=(税后奖金-购彩金额)*提成比例</p>
          <p className="p-grey">
            例: 税后奖金5000元，购彩金额2000，提成5%， 加奖奖金1000
            提成拥金计算（5000-2000）*5%=150
          </p>
          <p className="p-grey">奖金计算（5000-150+1000）=5850</p>
        </div>
      </div>
    );
  }
}

//  中奖 奖金
function Bonus({ orderBaseInfoBO }) {
  return (
    <div>
      <div className="pa-item">
        <div className="item-left">税前奖金</div>
        <div className="item-right">
          &yen;{formatMoney(orderBaseInfoBO.preBonus)}
        </div>
      </div>
      <div className="pa-item">
        <div className="item-left">税后奖金</div>
        <div className="item-right red">
          &yen;{formatMoney(orderBaseInfoBO.aftBonus)}
        </div>
      </div>
      <div
        className={ cx(
          'pa-item last-item',
          orderBaseInfoBO.getRedAmount ? '' : 'hide'
        ) }
      >
        <div className="item-left">
          加奖奖金
          <div className="gray">
            {orderBaseInfoBO.redNameGet}
            {orderBaseInfoBO.redCodeGet ? orderBaseInfoBO.redCodeGet : ''}
          </div>
        </div>
        <div className="item-right">
          &yen;{formatMoney(orderBaseInfoBO.getRedAmount)}
        </div>
      </div>
    </div>
  );
}

function getBetCopy(e) {
  e.stopPropagation();
  window.location.href = '/cd/#';
}

function CopyBet({ orderBaseInfoBO }) {
  // 没中奖 来一注
  return (
    <div className="copy-bet">
      <img src={ require('../../img/order/sad.png') } />
      <span>姿势不对~跟着大神</span>
      <span className="bet-green" onClick={ e => getBetCopy(e) }>
        来一注
      </span>
    </div>
  );
}

// 预测奖金
function MayBonus({ maxBonus, minBonus }) {
  return (
    <div className="may-bonus">
      <img src={ require('../../img/order/happy.png') } />
      <div className="bonus-title">
        <div className="title">
          <span>预计奖金:</span>
          <span className="red">
            {formatMoney(minBonus)} ~ {formatMoney(maxBonus)}
          </span>
          元
        </div>
        <div className="warning">该奖金范围仅供参考</div>
      </div>
    </div>
  );
}

// 快乐扑克显示图片
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

function handleDrawCode(orderBaseInfoBO) {
  let result;
  switch (orderBaseInfoBO.lotteryCode) {
    case 100:
    case 101:
    case 102: // dlt ssq qlc
      result = (
        <span>
          <i className="red">
            {orderBaseInfoBO.drawCode.split('|')[0].replace(/,/g, ' ')}
          </i>
          <i className="blue">
            {' '}
            + {orderBaseInfoBO.drawCode.split('|')[1].replace(/,/g, ' ')}
          </i>
        </span>
      );
      break;
    case 225: // 快乐扑克3
      {
        let drawArr = orderBaseInfoBO.drawCode.split('|') || [];
        return drawArr.map((m, i) => {
          return (
            <div className="open-list" key={ i }>
              <img src={ handleNumToImg(m.substring(0, 1)) } />
              <span>{m.split('_')[1]}</span>
            </div>
          );
        });
      }
      break;
    default:
      result = orderBaseInfoBO.drawCode.replace(/,/g, ' ');
      break;
  }
  return result;
}

//  数字彩 开奖号码 追期
function OpenNumber({ orderBaseInfoBO }) {
  return (
    <div className="open-draw">
      {orderBaseInfoBO.buyType != 4 ? (
        <div className="lot-item">
          <div className="open-code">
            <span className="code">开奖号码</span>
            {orderBaseInfoBO.drawCode ? (
              <em className="red"> {handleDrawCode(orderBaseInfoBO)} </em>
            ) : (
              '等待开奖'
            )}
          </div>
          <span className="grey">{OrderHelper.getTicket(orderBaseInfoBO)}</span>
        </div>
      ) : (
        <div className="lot-item zh-item">
          <span>
            已追<em className="red">{orderBaseInfoBO.hadIssue}</em>/总期数<em className="red">
              {orderBaseInfoBO.totalIssue}
            </em>
          </span>
        </div>
      )}
    </div>
  );
}

// 数字彩判别
function numLottery(num) {
  switch (num) {
    case 300:
    case 301:
    case 306:
    case 307: // 竞技彩 返回空
      break;
    default:
      return num;
  }
}
// 中奖说明
function playInfo(e, lotteryCode) {
  window.location.href = '/playinfo.html?playid=' + lotteryCode;
}
class OrderStatus extends PureComponent {
  render() {
    const { order } = this.props;
    const orderBaseInfoBO = order.orderBaseInfoBO || {};
    const description = OrderState.handleOrderDetail(orderBaseInfoBO) || {};
    let btnPay;
    console.log(
      Util.getLotteryIssue(
        orderBaseInfoBO.lotteryCode,
        orderBaseInfoBO.lotteryIssue
      ),
      ' console.log(Util.getLotteryIssue)'
    );
    if (orderBaseInfoBO.payStatus == '1' || orderBaseInfoBO.payStatus == '7') {
      btnPay = (
        <div
          className="btn-pay"
          onClick={ e =>
            payHandler(e, orderBaseInfoBO.orderCode, orderBaseInfoBO.buyType)
          }
        >
          去支付
        </div>
      );
    } else if (orderBaseInfoBO.payStatus == '4') {
      btnPay = (
        <div
          className="btn-pay"
          onClick={ e =>
            payHandler(orderBaseInfoBO.orderCode, orderBaseInfoBO.buyType)
          }
        >
          重新支付
        </div>
      );
    }
    return (
      <div>
        <Header title="方案详情">
          {// 支付成功 未发布抄单
            orderBaseInfoBO.orderType === 1 && orderBaseInfoBO.payStatus === 2 ? (
              <div className="copy-header">
                <span className="copy-title">发布抄单</span>
                <CopyEntrance
                  available={ true }
                  order={ orderBaseInfoBO.orderCode }
                />
              </div>
            ) : (
              ''
            )}
          {
            // 中奖说明
            <span
              className="play-info"
              onClick={ event => playInfo(event, orderBaseInfoBO.lotteryCode) }
            >
              {numLottery(orderBaseInfoBO.lotteryCode) ? '中奖说明' : null}
            </span>
          }
        </Header>
        <div className="xq-header menu-item">
          <img className="icon-ten" src={ description.img } />
          <div className={ 'lot-status-m ' + description.color }>
            <span className="status">
              {orderBaseInfoBO.orderFlowUnionStatusText
                ? orderBaseInfoBO.orderFlowUnionStatusText
                : orderBaseInfoBO.addOrderFlowUnionStatusText}
              {btnPay}
            </span>
            <em>{description.openMessage}</em>
          </div>
          {/* <div className="icon-arrow-r"></div> */}
        </div>

        <div className="pay-area">
          {orderBaseInfoBO.aftBonus ? (
            <Bonus // 税金
              orderBaseInfoBO={ orderBaseInfoBO }
            />
          ) : (
            ''
          )}

          {orderBaseInfoBO.orderFlowUnionStatus === 10 &&
          (orderBaseInfoBO.lotteryCode == 300 ||
            orderBaseInfoBO.lotteryCode == 301) ? ( // 跟单
              <CopyBet // 来一注  =>未中奖
                orderBaseInfoBO={ orderBaseInfoBO }
              />
            ) : (
              ''
            )}
          {// 出票 未开奖
            orderBaseInfoBO.orderStatus === 6 &&
          orderBaseInfoBO.winningStatus === 1 &&
          orderBaseInfoBO.maxBonus > 0 ? (
                <MayBonus
                  maxBonus={ orderBaseInfoBO.maxBonus }
                  minBonus={ orderBaseInfoBO.minBonus }
                />
              ) : (
                ''
              )}
        </div>
        {//  跟单 发单人 有提成比例
          orderBaseInfoBO.orderType === 3 &&
        orderBaseInfoBO.copyNickName &&
        orderBaseInfoBO.commissionRateStr ? (
              <Commission orderBaseInfoBO={ orderBaseInfoBO } />
            ) : (
              ''
            )}
        {orderBaseInfoBO.userIssueId ? ( // 发单人
          <CommissionPerson
            copyHeadUrl={ orderBaseInfoBO.copyHeadUrl }
            userIssueId={ orderBaseInfoBO.userIssueId }
          />
        ) : (
          ''
        )}
        {/* 彩种 投注类型  */}
        <div className="menu-item margin-t10 lottery-buyType">
          <span>{orderBaseInfoBO.lotteryName} </span>
          <span className="grey">
            {Util.getLotteryIssue(
              orderBaseInfoBO.lotteryCode,
              orderBaseInfoBO.lotteryIssue
            )}
            {Util.getLotteryChild(orderBaseInfoBO.lotteryChildCode)}-
            {Const.getBuyType(orderBaseInfoBO.buyType)}
          </span>
        </div>
        {/*
                    *开奖号码  出票明细
                    *区分竞技彩 数字彩 竞技彩 没有开奖号码
                    *区分追号 追号显示 追了多少期
                */}

        {Util.getLotteryIssue(
          orderBaseInfoBO.lotteryCode,
          orderBaseInfoBO.lotteryIssue
        ) == '' ? (
            ''
          ) : (
            <OpenNumber orderBaseInfoBO={ orderBaseInfoBO } />
          )}
      </div>
    );
  }
}

export default OrderStatus;

OrderStatus.propTypes = {
  order: PropTypes.shape(Order).isRequired
};
