import React, { PureComponent } from 'react';
import RecommendComponent from '../../components/recommend';
import PropTypes from 'prop-types';
import './recommend.scss';

export default class Recommend extends PureComponent {
  static propTypes = {
    lottery: PropTypes.number.isRequired,
    issueUserId: PropTypes.number.isRequired
  };
  render() {
    const { lottery, issueUserId } = this.props;
    return (
      <div className="recommends">
        <h2>最新推荐</h2>
        <div>
          <RecommendComponent lottery={ lottery } issueUserId={ issueUserId } />
        </div>
      </div>
    );
  }
}
