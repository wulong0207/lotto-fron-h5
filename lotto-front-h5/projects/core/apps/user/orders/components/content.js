import React from 'react';
import PropTypes from 'prop-types';
import { templates } from '../constants';
import Order from '../types/order';
import { isEqual } from 'lodash';

// 未实现模板的提示
function UnimplementedTemplate({ lotteryCode, lotteryName }) {
  return (
    <div>
      <p>
        彩种ID为 <em>{lotteryCode}</em> 的 <em>{lotteryName}</em>{' '}
        还未实现方案详情，或者未正确配置组件，请联系对应的前端开发同事
      </p>
    </div>
  );
}

UnimplementedTemplate.propTypes = {
  lotteryCode: PropTypes.number.isRequired,
  lotteryName: PropTypes.string.isRequired
};

export default class OrderContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      component: null
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   const { order } = nextProps;
  //   if (typeof order !== 'undefined' && !isEqual(order, this.props.order)) {
  //     this.loadComponent(order);
  //   }
  // }

  refresh(order) {
    this.loadComponent(order);
  }

  loadComponent(order){
    const { lotteryCode } = order.orderBaseInfoBO;
    const template = templates.filter(t => t.lotteryCode === lotteryCode)[0];
    if (!template) {
      const lotteryName = order.orderBaseInfoBO.lotteryName;
      this.setState({
        component: React.createElement(UnimplementedTemplate, {
          lotteryCode,
          lotteryName
        })
      });
    } else {
      template.getComponent().then(({ default: component }) => {
        const contentComponent = React.createElement(component, { order });
        this.setState({ component: contentComponent });
      });
    }
  }

  componentWillMount() {
    this.loadComponent(this.props.order);
  }

  render() {
    const { component } = this.state;
    return (
      <div className="order-content">
        {component}
      </div>
    )
  }
}

OrderContent.propTypes = {
  order: PropTypes.shape(Order).isRequired
};
