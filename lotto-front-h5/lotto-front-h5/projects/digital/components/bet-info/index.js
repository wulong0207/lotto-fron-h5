import React from 'react';
import PropTypes from 'prop-types';
import './bet-info.scss';

export default function BetInfo({ onDelete, children, isEmpty, emptyNode }) {
  return (
    <div className="betting-tips">
      {!isEmpty ? (
        <div className="betting-info">
          <button className="betting-delete-icon" onClick={ onDelete } />
          {children}
        </div>
      ) : (
        emptyNode && <div className="empty-node">{emptyNode}</div>
      )}
    </div>
  );
}

BetInfo.propTypes = {
  onDelete: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  emptyNode: PropTypes.element,
  children: PropTypes.node
};
