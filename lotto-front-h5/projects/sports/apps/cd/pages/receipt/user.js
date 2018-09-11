import React, { Component } from 'react';
import UserCard from '../../components/user-card';
import './user.scss';
import api from '../../services/api';
import PropTypes from 'prop-types';
import { Receipt } from '../../types';
import { Link } from 'react-router';
import { isLoginedUser } from '@/services/auth';

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
    const { receipt } = this.props;
    if (!user) return null;
    return (
      <UserCard
        user={ user }
        followed={ this.props.followed }
        onFollowChange={ this.props.onFollowChange.bind(this) }
        hasLink={ true }
      >
        <div className="user-analytics">
          <dl>
            <dd>
              <span>预计回报(倍)</span>
              <span className="number">{receipt.maxRoi}</span>
            </dd>
            <dd className="followers">
              <FollowerList
                number={ receipt.followNum || 0 }
                userId={ user.userId }
                orderCode={ receipt.orderCode }
              />
            </dd>
            <dd className="profit">
              <span>预测奖金(元)</span>
              <span className="number">
                {receipt.orderFullDetailInfoBO.orderBaseInfoBO.maxBonus || '--'}
              </span>
            </dd>
          </dl>
        </div>
      </UserCard>
    );
  }
}

UserComponent.propTypes = {
  id: PropTypes.number.isRequired,
  receipt: Receipt,
  followed: PropTypes.bool,
  onFollowChange: PropTypes.func
};

function FollowerList({ number, userId, orderCode }) {
  if (!isLoginedUser(userId)) {
    return (
      <div>
        <span>抄单人数</span>
        <span className="number">{number}</span>
      </div>
    );
  }
  return (
    <Link to={ `/follow/${orderCode}` }>
      <span className="follow-number">抄单人数</span>
      <span className="number">{number}</span>
    </Link>
  );
}

FollowerList.propTypes = {
  number: PropTypes.number,
  userId: PropTypes.number,
  orderCode: PropTypes.string.isRequired
};
