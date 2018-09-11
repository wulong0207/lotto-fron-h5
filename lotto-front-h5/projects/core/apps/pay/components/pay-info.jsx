/*
 * @Author: yubei
 * @Date: 2017-05-17 21:50:00
 * @Desc: 支付信息组件
 */
import React, { Component } from 'react';
import { formatMoney } from '@/utils/utils';

export default class PayInfoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.props.od) return <div />;
    const od = this.props.od;
    return (
      <div className="pay-list">
        <div className="pay-item">
          <div className="pay-name">{od.l_n}</div>
          <div className="gray">
            {od.l_i}期-{od.b_t_n}
          </div>
          <div>
            <p>{formatMoney(od.o_a)}</p>
          </div>
          <div />
        </div>
        <div />
      </div>
    );
  }
}
