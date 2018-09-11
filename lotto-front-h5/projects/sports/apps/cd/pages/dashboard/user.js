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

  static propTypes = {
    onGetUserId: PropTypes.func
  };

  componentDidMount() {
    api.getIssueUserData().then(res => {
      this.setState({ user: { ...res.data } });
      this.props.onGetUserId && this.props.onGetUserId(res.data.id);
    });
  }

  render() {
    const { user } = this.state;
    if (!user) return null;
    return (
      <UserCard user={ user } isCustom={ true }>
        <div className="user-info">
          <div className="user-avatar">
            <img
              src={
                user.headUrl ||
                require('../../../../../../lib/img/custom@2x.png')
              }
            />
          </div>
          <div className="user-summary">
            <h2 className="user-nickname">{user.nickName}</h2>
            <div className="user-data">
              <span>
                <i>{user.focusNum ? user.focusNum : 0}</i>粉丝
              </span>
              <span>
                {user.hitNum ? user.hitNum : 0}/{user.issueNum
                  ? user.issueNum
                  : 0}
              </span>
              <span>{user.hitRate ? user.hitRate : 0}命中率</span>
              <span>{user.followNum ? user.followNum : 0}抄单数</span>
            </div>
          </div>
        </div>
        <div className="user-analytics-summary dashboard-analytics-summary">
          <dl>
            <dd>
              <span>抄单总额(元)</span>
              <span className="number">
                {user.issueAmount > 0 ? user.issueAmount : 0}
              </span>
            </dd>
            <dd>
              <span>总返佣(元)</span>
              <span className="number">
                {user.commissionAmount > 0 ? user.commissionAmount : 0}
              </span>
            </dd>
            <dd>
              <span>自购中奖(元)</span>
              <span className="number">
                {user.winAmount > 0 ? user.winAmount : 0}
              </span>
            </dd>
          </dl>
        </div>
      </UserCard>
    );
  }
}
