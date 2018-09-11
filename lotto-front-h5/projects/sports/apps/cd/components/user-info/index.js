import React from 'react';
import './user-info.scss';
import FollowComponent from '../../components/follow';
import { User } from '../../types';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default function UserInfo({
  user,
  followed,
  onFollowChange,
  hasLink,
  attention = true
}) {
  if (!user) return <div className="user" />;
  return (
    <div className="user">
      <div className="user-avatar">
        {hasLink ? (
          <Link to={ `/experts/${user.userIssueId}` }>
            <img
              src={
                user.headUrl ||
                require('../../../../../../lib/img/custom@2x.png')
              }
            />
          </Link>
        ) : (
          <img
            src={
              user.headUrl || require('../../../../../../lib/img/custom@2x.png')
            }
          />
        )}
      </div>
      <div className="user-content">
        <div className="top-user-info">
          <div className="top-user-top">
            <h2 className="user-nickname">{user.nickName}</h2>
            <div className="follow">
              <FollowComponent
                userIssueId={ user.userIssueId }
                userId={ user.userId }
                isFollowed={ followed }
                onChange={ onFollowChange }
              />
            </div>
          </div>
          <div className="top-user-bottom">
            {user.recentRecord && <span>{user.recentRecord}</span>}
            {user.hitRate && attention ? <span>{user.hitRate}命中率</span> : ''}
            {user.continueHit && (
              <span className="hit">{user.continueHit}</span>
            )}
            {user.level === 1 && <span className="expert">专</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  user: User.isRequired,
  followed: PropTypes.bool,
  onFollowChange: PropTypes.func,
  hasLink: PropTypes.bool
};
