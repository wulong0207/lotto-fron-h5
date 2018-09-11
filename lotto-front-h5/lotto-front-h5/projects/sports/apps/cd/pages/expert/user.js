import React, { Component } from 'react';
import UserCard from '../../components/user-card';
import api from '../../services/api';
import PropTypes from 'prop-types';
import './user.scss';

export default class UserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    api.getIssueUserData(this.props.id).then(res => {
      this.setState({ user: { ...res.data, userIssueId: res.data.id } });
    });
  }

  render() {
    const { user } = this.state;
    if (!user) return null;
    return (
      <UserCard user={ user } attention={ this.props.attention }>
        <div className="user-analytics-summary">
          {user.hitRate && (
            <h2>
              {user.hitRate}
              <span>命中率</span>
            </h2>
          )}
          <dl>
            <dd>
              <span>总推荐</span>
              <span className="number">{user.issueNum}</span>
            </dd>
            <dd>
              <span>推单总额(元)</span>
              <span className="number">
                {user.issueAmount > 0 ? user.issueAmount : 0}
              </span>
            </dd>
            <dd>
              <span>累计中奖(元)</span>
              <span className="number">
                {user.winAmount ? user.winAmount : 0}
              </span>
            </dd>
            <dd>
              <span>盈利率</span>
              <span className="number">{user.profitRate || '--'}</span>
            </dd>
          </dl>
        </div>
      </UserCard>
    );
  }
}

UserComponent.propTypes = {
  id: PropTypes.number.isRequired
};
