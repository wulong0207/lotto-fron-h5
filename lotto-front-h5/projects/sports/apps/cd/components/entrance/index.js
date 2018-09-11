import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import api from '../../services/api';
import './entrance.scss';

export default class CopyEntrance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      available: false
    };
  }

  static propTypes = {
    order: PropTypes.string.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
    available: PropTypes.bool
  };

  static defaultProps = {
    label: '发布抄单'
  };

  componentDidMount() {
    if (typeof this.props.available === 'boolean') {
      this.setState({ available: this.props.available });
      return undefined;
    }
    this.getAvailableStatus().then(available => {
      this.setState({ available });
    });
  }

  getAvailableStatus() {
    return api.getAvailableStatus();
  }

  goCreateOrderCopy() {
    window.location.href = '/cd/#/create?order=' + this.props.order;
  }

  render() {
    const { available } = this.state;
    const { className, label } = this.props;
    if (!available) return null;
    return (
      <button
        onClick={ this.goCreateOrderCopy.bind(this) }
        className={ cx('create-copy-order-button', className) }
      >
        {label}
      </button>
    );
  }
}
