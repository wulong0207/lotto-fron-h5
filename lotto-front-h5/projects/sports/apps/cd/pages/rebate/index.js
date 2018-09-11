import React, { PureComponent } from 'react';
import DetailListComponent from '../../components/detail-list';
import list from '@/component/hoc/list';
import api from '../../services/api';
import PropTypes from 'prop-types';
import page from '@/component/hoc/page';

let DetailList;

class RebatePage extends PureComponent {
  constructor(props) {
    super(props);
    DetailList = list(this.fetch.bind(this), 1, 10, true)(DetailListComponent);
    this.state = {
      amount: 0
    };
  }

  static propTypes = {
    params: PropTypes.shape({
      code: PropTypes.string.isRequired
    }).isRequired
  };

  componentDidMount() {
    this.getTotalAmount();
  }

  getTotalAmount() {
    const { code } = this.props.params;
    api.getOrderTotalCommissionAmount(code).then(data => {
      this.setState({ amount: data.data });
    });
  }

  fetch(page) {
    const { code } = this.props.params;
    return new Promise((resolve, reject) => {
      api
        .getRebateDetailList(code, page)
        .then(res => {
          resolve(res.data);
        })
        .catch(reject);
    });
  }

  render() {
    return (
      <div className="follow-page">
        <div className="follow-summary">
          <p>订单编号{this.props.params.code}</p>
          <div className="total-commission">
            共提成 <em className={this.state.amount === '(未开奖)'? 'commiss' : ''}> {this.state.amount}</em>
          </div>
        </div>
        {<DetailList />}
      </div>
    );
  }
}

export default page('返佣明细', undefined, undefined, true)(RebatePage);
