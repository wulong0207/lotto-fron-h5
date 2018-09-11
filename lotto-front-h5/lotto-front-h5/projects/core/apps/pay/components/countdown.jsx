/*
 * @Author: yubei
 * @Date: 2017-05-17 17:21:24
 * @Desc: 倒计时组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CountDownComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remaining: 0
    };
    this.timer = null;
  }

  componentDidMount() {
    this.setState({ remaining: this.props.remaining });
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.remaining || newProps.remaining >= this.state.remaining) { return undefined; }
    if (this.timer) {
      clearInterval(this.timer);
      this.setState({ remaining: newProps.remaining });
    }
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  tick() {
    this.setState({ remaining: this.state.remaining - 1 });
    if (this.state.remaining <= 0) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {
    let totalSeconds = this.state.remaining;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      <div className="pay-endtime">
        订单<em>{hours > 0 ? ('0' + hours).slice(-2) : '00'}</em>小时<em>
          {hours > 0 || minutes > 0 ? ('0' + minutes).slice(-2) : '00'}
        </em>分<em>
          {(hours > 0 || minutes > 0 || seconds) > 0
            ? ('0' + seconds).slice(-2)
            : '00'}
        </em>秒后截止投注
      </div>
    );
  }
}

CountDownComponent.propTypes = {
  remaining: PropTypes.number.isRequired
};
