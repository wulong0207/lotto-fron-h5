/*
 * @Author: yubei
 * @Date: 2017-05-18 10:25:42
 * @Desc: 支付方式组件
 */

import React, { Component } from 'react';
import deepAssign from '@/utils/deep-assign';
import Interaction from '@/utils/interaction';
import { getParameter, formatMoney, browser } from '@/utils/utils';
import analytics from '@/services/analytics';

import cx from 'classnames';

export default class PayWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  switchPayWayList() {
    this.setState({
      visible: !this.state.visible
    });
  }

  // 余额选择
  // 选择余额判断第三方支付需要支付的金额
  selBalance(e) {
    e.stopPropagation();
   
    const data = this.props.data;
    let pay = this.props.pay;
    if (!pay.way) pay.way = {};
    if (!pay.red) pay.red = {};

    // 减去红包后的支付金额
    let minusRedBalance = data.od.o_a - (pay.red.redBalance || 0);
    // 已选择就取消-------------取消余额支付
    if (pay.balance) {
      pay.balance = null;
      // 如果选择了第三方支付
      if (pay.way.payAmount) {
        console.log(pay.way.payAmount);
        pay.way.payAmount = minusRedBalance;
      }
    } else {
      analytics.send(2092);
      // --------------------选择余额支付
      // 如果红包足够支付，取消红包支付方式-----------------取消红包支付
      if (minusRedBalance <= 0) {
        pay.red = {};
        minusRedBalance = data.od.o_a - (pay.red.redBalance || 0);
      }

      // 如果余额足够支付，取消第三方支付方式
      if (data.uw.tot_c_b >= minusRedBalance) {
        pay.way = null;
        pay.balance = minusRedBalance;
      } else {
        // 如果选择了第三方支付
        if (pay.way.payAmount) {
          pay.way.payAmount = minusRedBalance - (data.uw.tot_c_b || 0);
        }
        pay.balance = data.uw.tot_c_b;
      }

      // 如果余额足够支付所有金额 取消红包和第三方支付
      if (data.uw.tot_c_b >= data.od.o_a) {
        // pay.red = null;
        pay.way = null;
        // pay.balance = data.od.o_a;
        pay.balance = data.od.o_a - (pay.red.redBalance || 0);
      }
    }
    this.props.setPayState(Object.assign({}, pay));
  }

  // 选择支付方式
  selPayWay(e, obj) {
    e.stopPropagation();
    if (obj.b_t === 3) {
      if (obj.b_n === '微信') {
        analytics.send(2093);
      } else if (obj.b_n === '支付宝') {
        analytics.send(2094);
      } else if (obj.b_n === 'QQ钱包') {
        analytics.send(2095);
      }
    } else if (obj.b_t === 1 || obj.b_t === 2) {
      analytics.send(2096);
    }
    const data = this.props.data;
    let pay = this.props.pay;
    if (!pay.way) pay.way = {};
    if (!pay.red) pay.red = {};
    // let addnewcard = getParameter().addnewcard;
    // 选择可用卡
    if (obj.flag == 1 && e.currentTarget.className != 'not-use') {
      // 减去红包后的余额
      let minusRedBalance = data.od.o_a - (pay.red.redBalance || 0);

      // 如果红包足够支付，取消红包支付方式
      if (minusRedBalance <= 0) {
        pay.red = {};
        minusRedBalance = data.od.o_a - (pay.red.redBalance || 0);
      }

      // 如果余额足以支付
      if (minusRedBalance <= (pay.balance || 0)) {
        pay.balance = null;
      }

      // 减去红包，余额后支付的金额
      let minusBalance = minusRedBalance - (pay.balance || 0);

      pay.way = {
        bankCardId: obj.b_c_i,
        bankId: obj.b_i,
        bankName: obj.b_n,
        cardCode: obj.c_c,
        bankType: obj.b_t,
        payAmount: minusBalance >= 0 ? minusBalance : data.od.o_a
      };
      this.props.setPayState(deepAssign({}, pay));
    }
  }

  // 选择新卡支付
  selNewCard(e) {
    if (browser.yicaiApp) {
      Interaction.goAddbankCard();
    } else {
      // debugger;
      // var back = getParameter('next');
      // console.log(back)
      var url = encodeURIComponent(window.document.referrer);
      // console.log(url)
      const next = encodeURIComponent(location.href);
      // console.log(next);
      location.href = '/sc.html?next=' + next + 'addnewcard=1#/add-bank';
      // location.href = '/sc.html#/add-bank';
    }
  }

  render() {
    const data = this.props.data;
    const pay = this.props.pay;
    const way = pay.way || {};
    const ptl = data.ptl || [];
    // if(!data.ptl) return <div></div>;
    let inserted = false;
    let methods = ptl.reduce((acc, item, index, array) => {
      if (!item.flag && !inserted) {
        inserted = true;
        return acc.concat([{ empty: true }, item]);
      }
      if (!inserted && index == array.length - 1) {
        return acc.concat([item, { empty: true }]);
      }
      return acc.concat(item);
    }, []);

    // 如果没任何支付方式，就添加新卡
    if (methods.length == 0) {
      methods = [{ empty: true }];
    }

    // 支付限额
    const quota =
      data &&
      data.od &&
      data.od.o_a - (pay.red.redBalance || 0) - (pay.balance || 0); // 实际第三方需要支付金额

    return (
      <div className="pay-list" onClick={ this.switchPayWayList.bind(this) }>
        <div className="pay-item">
          <div>支付方式</div>
          <div>
            {pay.balance ? <p>余额支付</p> : ''}
            {way.bankName ? (
              <p>
                {way.bankName}
                {/* {way.bankName} */}
                {way.cardCode ? (
                  <span className="gray">
                    {way.cardCode}
                    {way.bankType == 1 ? '储蓄卡' : '信用卡'}
                  </span>
                ) : (
                  ''
                )}
              </p>
            ) : (
              ''
            )}
          </div>
          <div>
            {pay.balance ? <p>{formatMoney(pay.balance)}</p> : ''}
            {way.payAmount ? <p>{formatMoney(way.payAmount)}</p> : ''}
          </div>
          <div>
            <span
              className={ cx(
                'arrows',
                this.state.visible ? 'arrows-d' : 'arrows-t'
              ) }
            />
          </div>
        </div>
        {/* 支付方式下拉 */}
        <div className={ cx('pay-way', this.state.visible ? 'show' : 'hide') }>
          <ul>
            {data.uw ? (
              <li onClick={ e => this.selBalance(e) }>
                <div>
                  <img src={ require('@/img/pay/icon_balance.png') } />
                </div>
                <div>
                  {data.uw.p_n} <span>{formatMoney(data.uw.tot_c_b)}</span>
                </div>
                <div>
                  <span
                    className={ cx(
                      '',
                      pay.balance ? 'bal-selected' : 'not-bal-selected'
                    ) }
                  />
                </div>
              </li>
            ) : (
              ''
            )}
            {methods.map((row, index) => {
              // console.log(row);
              if (row.empty) {
                return (
                  <li onClick={ e => this.selNewCard(e) } key={ index }>
                    <div>
                      <img src={ require('@/img/pay/icon_addCard.png') } />
                    </div>
                    <div>选择新卡支付</div>
                    <div>
                      <span className="not-selected" />
                    </div>
                  </li>
                );
              }
              // 新添加的银行卡列表（）
              return (
                <li
                  className={ cx('', {
                    'not-use':
                      row.flag != 1 || quota < row.m_l || quota > row.t_l
                  }) }
                  onClick={ e => this.selPayWay(e, row) }
                  key={ index }
                >
                  <div>
                    {/* <img src={require('@/img/pay/icon_balance.png')}/> */}
                    <img src={ row.s_lg || '' } />
                  </div>
                  <div>
                    {row.b_n}
                    {'  '}
                    {row.b_t != 3 ? (
                      <span className="gray">
                        {row.c_c} {row.b_t === 1 ? '储蓄卡' : '信用卡'}
                      </span>
                    ) : (
                      ''
                    )}
                    {/* 最大最小限额文字提示 */}
                    {/* 最小值 */}
                    {quota < row.m_l ? (
                      <span className="min">满{row.m_l}元以上订单可使用</span>
                    ) : (
                      ''
                    )}
                    {/* 最大值 */}
                    {quota > row.t_l ? (
                      <span className="min">
                        金额超{row.t_l}元建议使用银行卡支付
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <span
                      className={ cx(
                        '',
                        row.flag != 0
                          ? row.b_c_i
                            ? way.bankCardId == row.b_c_i
                              ? 'selected'
                              : 'not-selected'
                            : way.bankId == row.b_i
                              ? 'selected'
                              : 'not-selected'
                          : 'not-selected'
                      ) }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
