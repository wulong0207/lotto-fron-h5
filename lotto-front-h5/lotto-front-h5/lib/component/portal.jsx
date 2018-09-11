import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { render } from 'react-dom';

export default class PortalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount () {
    this.node = document.createElement('div');
    this.node.className = this.props.klass ? cx(this.props.klass) : '';
    document.body.appendChild(this.node);
    this.renderPortal();
  }

  componentWillUnmount () {
    this.removePortal();
  }

  componentDidUpdate () {
    this.renderPortal();
  }
  

  renderPortal () {
    render(
      <div>
        { this.props.children }
      </div>
      , this.node);
  }

  removePortal () {
    document.body.removeChild(this.node);
  }

  render () {
    return null;
  }
}

PortalComponent.propTypes = {
  children: PropTypes.element.isRequired,
  klass: PropTypes.array
}