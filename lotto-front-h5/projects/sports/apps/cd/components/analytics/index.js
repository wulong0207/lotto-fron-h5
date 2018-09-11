import React, { Component } from 'react';
import Chart from '../chart';
import PropTypes from 'prop-types';
import api from '../../services/api';
import './analytics.scss';

export default class BetAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: null
    };
  }

  componentDidMount() {
    const { id, lotteryCode } = this.props;
    api.getAnalytics(id, lotteryCode).then(res => {
      this.setState({ records: res.data });
    });
  }

  render() {
    const { records } = this.state;
    if (Array.isArray(records) && !records.length) {
      return <div className="empty-records">近7天无战绩</div>;
    }
    return (
      <div className="analytic-chart">
        <div className="chart-header">
          <span className="chart-title">历史推荐</span>
          <div className="chart-legend">
            <span className="green-dot dot">未中</span>
            <span className="red-dot dot">推中</span>
          </div>
        </div>
        <div className="chart">{records && <Chart records={ records } />}</div>
      </div>
    );
  }
}

BetAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  lotteryCode: PropTypes.number.isRequired
};
