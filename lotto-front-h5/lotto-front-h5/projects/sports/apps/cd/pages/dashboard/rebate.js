import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { Rebate } from '../../types';
import list from '@/component/hoc/list';
import './rebate.scss';
import { Link } from 'react-router';

function RebateListComponent({ data }) {
  return (
    <div className="rebate-list">
      {data.map((rebate, index) => {
        return (
          <Link key={ index } to={ `/rebate/${rebate.orderCode}` }>
            <div className="rebate">
              <div className="amount">
                <h2>
                  {rebate.commissionAmount > 0 ? rebate.commissionAmount : '0'}
                </h2>
                <span>返佣(元)</span>
              </div>
              <div className="info">
                <div className="amount-info">
                  <span className="order-amount">
                    跟单总额<i>￥{rebate.followAmount}</i>
                  </span>
                  <span>
                    跟单数<i>{rebate.followNum}</i>
                  </span>
                </div>
                <div>订单编号{rebate.orderCode}</div>
              </div>
              <div className="arrow">
                <i />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

RebateListComponent.propTypes = {
  data: PropTypes.arrayOf(Rebate)
};

class RebatePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      days: props.days || 3
    };
  }

  static propTypes = {
    days: PropTypes.number
  };

  onChange(days) {
    this.setState({ days });
  }

  fetch(days) {
    return (page, size) => {
      return new Promise((resolve, reject) => {
        api
          .getRebateList(days, page, size)
          .then(res => {
            resolve(res.data);
          })
          .catch(reject);
      });
    };
  }

  render() {
    const RebateList = list(
      this.fetch(this.state.days).bind(this),
      1,
      10,
      true
    )(RebateListComponent);
    return <RebateList />;
  }
}

export default RebatePage;
