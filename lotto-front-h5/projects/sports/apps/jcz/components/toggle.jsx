import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class ToggleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div
        className={ cx('toggle-component', this.props.klass, {
          open: this.state.open
        }) }
      >
        <div
          className="toggle-component-header"
          onClick={ this.toggle.bind(this) }
        >
          {this.props.header}
        </div>
        <div className="toggle-component-content">{this.props.children}</div>
      </div>
    );
  }
}

ToggleComponent.propTypes = {
  header: PropTypes.element,
  children: PropTypes.element.isRequired,
  klass: PropTypes.array
};
