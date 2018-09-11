/*
 * @Author: yubei
 * @Date: 2017-05-18 10:25:49
 * @Desc: 红包组件
 */

import React, { Component } from 'react';
import { formatMoney } from '@/utils/utils';
import cx from 'classnames';
import analytics from '@/services/analytics';

export default class RedPackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  switchHbList(e) {
    this.setState({
      visible: !this.state.visible
    });
  }

  // 选择红包
  // 选择红包判断第三方支付需要支付的金额
  selRedPackage(e, params) {
    e.stopPropagation();
    analytics.send(2091);
    const data = this.props.data;
    let pay = this.props.pay;
    if (!pay.red) pay.red = {};
    if (!pay.way) pay.way = {};

    let selRed = {
      redCode: params.r_c,
      redBalance: params.r_b,
      redName: params.r_n,
      redType: params.r_t,
      redState: params.r_s,
      redValue: params.r_v
    };

    // 如果红包可用
    if (selRed.redState) {
      // 是否选择新红包
      let isSel = pay.red.redCode != selRed.redCode;
      if (isSel) {
        pay.red = {
          redCode: selRed.redCode, // 红包编号
          // redBalance: isSel? (selRed.redBalance - data.od.o_a) >= 0? data.od.o_a: selRed.redBalance: null, // 彩金红包实际剩余可用金额
          redName: selRed.redName, // 红包名称 满100减20
          redType: selRed.redType, // 红包类型 1：充值优惠；2：消费折扣；3：彩金红包；4：加奖红包；5：大礼包；6：随机红包
          redState: selRed.redState, // 是否可用
          redValue: selRed.redValue // 红包减免金额
        };
        switch (pay.red.redType) {
          case 2: // 折扣红包
            pay.red.redBalance = pay.red.redValue;
            break;
          case 3: // 彩金红包
            // pay.red.redBalance = (selRed.redBalance - data.od.o_a) >= 0? data.od.o_a: selRed.redBalance;
            // pay.red.redBalance = (selRed.redBalance - data.od.o_a) >= 0? selRed.redBalance - data.od.o_a: selRed.redBalance;
            pay.red.redBalance = selRed.redBalance;
            break;
          default:
            console.log(`当前红包类型是：${pay.red.redType}`);
            break;
        }
      } else {
        pay.red = {
          redCode: null, // 红包编号
          redBalance: null, // 彩金红包实际剩余可用金额
          redName: null, // 红包名称 满100减20
          redType: null, // 红包类型 1：充值优惠；2：消费折扣；3：彩金红包；4：加奖红包；5：大礼包；6：随机红包
          redState: null, // 是否可用
          redValue: null
        };
      }

      // 减去红包后支付的金额
      let minusRedBalance = data.od.o_a - (pay.red.redBalance || 0);

      if (minusRedBalance <= 0) {
        // 判断红包金额足够够支付订单
        // 清除余额和其他支付方式
        pay.way = null;
        pay.balance = null;
      } else {
        // 如果存在余额
        if (pay.balance) {
          pay.balance =
            minusRedBalance >= data.uw.tot_c_b
              ? data.uw.tot_c_b
              : minusRedBalance;
        }
        // 现金支付金额
        if (pay.way.payAmount) {
          if (minusRedBalance - (pay.balance || 0) > 0) {
            pay.way.payAmount = minusRedBalance - (pay.balance || 0);
          } else {
            pay.way = null;
          }
        }
      }
      this.props.setPayState(Object.assign({}, pay));
    }
  }

  // 红包类型统计
  redTypereq(itemType) {
    switch (itemType) {
      case 1:
        {
          itemType = '充值优惠';
        }
        break;
      case 2:
        {
          itemType = '消费折扣';
        }
        break;
      case 3:
        {
          itemType = '彩金红包';
        }
        break;
      case 4:
        {
          itemType = '加奖红包';
        }
        break;
      case 5:
        {
          itemType = '大礼包';
        }
        break;
      case 6:
        {
          itemType = '随机红包';
        }
        break;
    }
    return itemType;
  }

  render() {
    const data = this.props.data;
    const red = this.props.pay.red || {};
    // console.log(red)
    return (
      <div className="pay-list" onClick={ this.switchHbList.bind(this) }>
        <div className="pay-item">
          <div>红包</div>
          <div className={ cx('', { gray: !red.redName }) }>
            {red.redName
              ? red.redName
              : data.cn ? '当天订单共' + data.cn + '个红包可用' : ''}
            <span
              style={ { margin: '10px', fontSize: '11px', color: '#ff6600' } }
            >
              {red.redType ? '[' + this.redTypereq(red.redType) + ']' : ''}
            </span>
          </div>
          <div>
            {/* <p className={cx('', {'gray': !data.cn}, { 'gray-darkest': !red.redBalance })}>{!data.cn? '无可用红包': red.redBalance? formatMoney(red.redBalance): '不使用红包' }</p> */}
            <p
              className={ cx(
                '',
                { gray: !data.cn },
                { 'gray-darkest': !red.redBalance }
              ) }
            >
              {!data.cn
                ? '无可用红包'
                : red.redBalance ? formatMoney(red.redBalance) : '不使用红包'}
            </p>
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
        <div
          className={ cx('red-package', this.state.visible ? 'show' : 'hide') }
        >
          {data.cl ? (
            <ul>
              {data.cl.map((row, index) => {
                // console.log(row)
                return (
                  <li
                    className={ cx('', { 'package-disabled': !row.r_s }) }
                    onClick={ e => this.selRedPackage(e, row) }
                    key={ index }
                  >
                    <div>
                      {row.r_n}
                      {/* <em >{ row.r_t }</em> */}
                      <em
                        style={ {
                          margin: '10px',
                          fontSize: '11px',
                          color: '#ff6600'
                        } }
                      >
                        {'[' + this.redTypereq(row.r_t) + ']'}
                      </em>
                    </div>
                    <div>
                      {/* <p>有效期</p>
                                            <p>{ row.o_t_t? row.o_t_t: '无限制' }</p>
                                            <p>¥{formatMoney(row.r_v)}</p>
                                            <p>{row.r_r}</p> */}
                      <p>¥{formatMoney(row.r_b)}</p>
                    </div>
                    <div>
                      <span
                        className={ cx(
                          '',
                          red.redCode == row.r_c ? 'selected' : 'not-selected'
                        ) }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="not-usable-package">
              <img src={ require('@/img/pay/red-package-cry.png') } />
              <p>没有可用红包</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
