/*
 * @Author: nearxu
 * @Date: 2017-12-15 16:30:39 
 * 无状态球
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Number } from '@/utils/number';
import './ball.scss';

class Ball extends React.PureComponent {
  render() {
    let { BallArr } = this.props;
    if (!BallArr.length) return null;
    return (
      <div className="ball">
        {BallArr[0].map((rowred, indexred) => {
          return (
            <span key={ indexred }>
              <b className="red">{rowred}</b>
            </span>
          );
        })}
        {BallArr[1].map((rowblue, indexblue) => {
          return (
            <span key={ indexblue }>
              <b className="blue">{rowblue}</b>
            </span>
          );
        })}
      </div>
    );
  }
}

export default Ball;

Ball.PropTypes = {
  BallArr: PropTypes.array
};
