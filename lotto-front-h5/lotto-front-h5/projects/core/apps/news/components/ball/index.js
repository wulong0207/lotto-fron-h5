/*
 * @Author: nearxu
 * @Date: 2017-12-15 16:30:39 
 * 无状态球
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class Ball extends PureComponent {
  render() {
    let { BallArr } = this.props;
    if (BallArr.length < 1) return null;
    return (
      <div className="ball">
        {BallArr[0].map((rowred, indexred) => {
          return (
            <span key={ indexred } className="red">
              {rowred}
            </span>
          );
        })}
        {BallArr[1].map((rowblue, indexblue) => {
          return (
            <span key={ indexblue } className="blue">
              {rowblue}
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
