import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { render } from 'react-dom';
import store from '../store';
import { Provider } from 'react-redux';

export default class PortalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.node = document.createElement('div');
    this.node.className = this.props.klass ? cx(this.props.klass) : '';
    document.body.appendChild(this.node);
    this.renderPortal();
  }

  componentWillUnmount() {
    this.removePortal();
  }

  componentDidUpdate() {
    this.renderPortal();
  }

  renderPortal() {
    render(<Provider store={ store }>{this.props.children}</Provider>, this.node);
  }

  removePortal() {
    document.body.removeChild(this.node);
  }

  render() {
    return null;
  }
}

PortalComponent.propTypes = {
  children: PropTypes.element.isRequired,
  klass: PropTypes.array
};
