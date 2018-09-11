import React, { Component } from 'react';
import list from '@/component/hoc/list';
import api from '../../services/api';
import page from '@/component/hoc/page';
import PropTypes from 'prop-types';
import DetailList from '../../components/detail-list';
import './follow.scss';

let FollowList;

class FollowPage extends Component {
  constructor(props) {
    super(props);
    FollowList = list(this.fetch.bind(this), 1, 10, true)(DetailList);
    this.state = {
      amount: 0
    };
  }

  fetch(page) {
    const { code } = this.props.params;
    if (!code) throw new Error('invalid url');
    return new Promise((resolve, reject) => {
      api
        .getFollowList(code, page)
        .then(res => {
          resolve(res.data);
        })
        .catch(reject);
    });
  }

  componentDidMount() {
    this.getTotalAmount();
  }

  getTotalAmount() {
    const { code } = this.props.params;
    api.getOrderTotalCommissionAmount(code).then(data => {
      this.setState({ amount: data.data });
    });
  }

  static propTypes = {
    params: PropTypes.shape({
      code: PropTypes.string.isRequired
    })
  };
  render() {
    return (
      <div className="follow-page">
        <div className="follow-summary">
          <p>订单编号{this.props.params.code}</p>
          <div className="total-commission">
            共提成 <em className={this.state.amount === '(未开奖)'? 'commiss' : ''}> {this.state.amount}</em>
          </div>
        </div>
        {<FollowList />}
      </div>
    );
  }
}

export default page('抄单明细')(FollowPage);
