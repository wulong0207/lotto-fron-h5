import React from 'react';
import PropTypes from 'prop-types';
import '../css/component/empty.scss';

const EmptyComponent = props => {
  const message = props.message || '暂无赛事';
  return (
    <div className="empty-component">
      <img src={ require('../img/no-game@2x.png') } />
      <p className="message">{message}</p>
    </div>
  );
};

EmptyComponent.propTypes = {
  message: PropTypes.string
};

export default EmptyComponent;
