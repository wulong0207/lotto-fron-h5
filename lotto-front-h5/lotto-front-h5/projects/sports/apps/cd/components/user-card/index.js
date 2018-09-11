import React from 'react';
import PropTypes from 'prop-types';
import './user-card.scss';
import UserInfo from '../user-info';
import { User } from '../../types';

export default function UserCard({
  children,
  user,
  isCustom,
  followed,
  onFollowChange,
  hasLink,
  attention
}) {
  return (
    <div className="user-card">
      <div className="card">
        {!isCustom && (
          <UserInfo
            user={ user }
            followed={ followed }
            onFollowChange={ onFollowChange }
            hasLink={ hasLink }
            attention={attention}
          />
        )}
        {children}
      </div>
    </div>
  );
}

UserCard.propTypes = {
  children: PropTypes.node,
  user: User.isRequired,
  isCustom: PropTypes.bool,
  followed: PropTypes.bool,
  onFollowChange: PropTypes.func,
  hasLink: PropTypes.bool
};
