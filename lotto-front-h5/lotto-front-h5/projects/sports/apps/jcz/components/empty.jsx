import React from 'react';

const EmptyComponent = props => {
  const message = props.message || '还木有比赛信息噢';
  return (
    <div className="football-empty-component">
      <img src={ require('@/img/jcz/ball_gate@2x.png') } />
      <p className="message">{message}</p>
    </div>
  );
};

export default EmptyComponent;
