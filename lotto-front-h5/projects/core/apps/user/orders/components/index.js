import React from 'react';
import http from '@/utils/request';
import { getToken } from '@/services/auth';
import OrderStatus from './status';
import OrderSummary from './summary';
import OrderContent from './content';

export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null
    };
    this.content = null;
  }

  componentDidMount() {
    this.getQuerOrderDetailInfo();
  }

  getQuerOrderDetailInfo() {
    return new Promise((resolve, reject) => {
      const { order } = this.props.params;
      // 订单详情接口
      http
        .post('/order/queryOrderDetailInfo', {
          orderCode: order,
          token: getToken(),
          source: 0
        })
        .then(res => {
          this.setState({ order: res.data });
          resolve(res.data);
        });
    });
  }
  onChaseChange() {
    // 追号 停追
    console.log('哈哈哈，子组件的事件传过来啦！');
    this.getQuerOrderDetailInfo().then(order => {
      this.content.refresh(order);
    });
  }
  render() {
    const { order } = this.state;
    if (!order) return null;
    return (
      <div>
        <OrderStatus order={ order } />
        <OrderContent order={ order } ref={ content => (this.content = content) } />
        <OrderSummary
          order={ order }
          onChaseChange={ this.onChaseChange.bind(this) }
        />
      </div>
    );
  }
}
