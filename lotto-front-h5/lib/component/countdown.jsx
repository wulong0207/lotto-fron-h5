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

  componentDidMount () {
    if (this.props.remaining <= 0) return undefined;
    this.setState({ remaining: this.props.remaining });
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillReceiveProps(newProps) {
    // console.log('props', newProps.remaining);
    // console.log('state', this.state.remaining);
    if (newProps.remaining === this.state.remaining || newProps.remaining === 0 || newProps.remaining === this.props.remaining) return undefined;
    this.setState({ remaining: newProps.remaining });
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount () {
    if (this.timer) clearInterval(this.timer);
  }

  tick() {
    this.setState({ remaining: this.state.remaining - 1 }, () => {
      if (this.state.remaining <= 0) {
        clearInterval(this.timer);
        this.timer = null;
        if (this.props.timeout) this.props.timeout();
      }
    });
  }

  render () {
    let totalSeconds = this.state.remaining;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formats = this.props.formats ? this.props.formats.split(',') : [':', ':', ''];
    return (
      <time>
        { hours > 0 ? <span>{ hours > 0 ? ('0' + hours).slice(-2) : '00' }{ formats[0] }</span> : '' }
        <span>{ (hours > 0 || minutes > 0) ? ('0' + minutes).slice(-2) : '00' }{ formats[1] }</span>
        <span>{ (hours > 0 || minutes > 0 || seconds) > 0 ? ('0' + seconds).slice(-2) : '00' }{ formats[2] }</span>
      </time>
    )
  }
}

CountDownComponent.propTypes = {
  remaining: PropTypes.number.isRequired,
  timeout: PropTypes.func,
  formats: PropTypes.string
};
