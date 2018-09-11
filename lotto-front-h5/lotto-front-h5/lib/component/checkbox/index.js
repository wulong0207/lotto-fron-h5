import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './checkbox.scss';

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.model || false
    };
  }

  toggle(value = this.props.value) {
    let newState;
    if (typeof this.state.checked === 'boolean') {
      newState = !this.state.checked;
    } else {
      if (this.state.checked.indexOf(value) < 0) {
        newState = this.state.checked.concat(value);
      } else {
        newState = this.state.checked.filter(c => c !== value);
      }
    }
    this.setState({ checked: newState });
    this.props.onChange && this.props.onChange(newState);
  }

  render() {
    let checked = this.state.checked;
    if (Array.isArray(this.state.checked)) {
      checked = this.state.checked.indexOf(this.props.value) > -1;
    }
    return (
      <div className="checkbox-component" onClick={ this.toggle.bind(this) }>
        <span className={ cx('checkbox-input', { 'checked': checked }) } ></span>
        <span className="checkbox-label">{ this.props.label }</span>
        <input type="checkbox" className="checkbox-input-origin" />
      </div>
    );
  }
}

Checkbox.propTypes = {
  model: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func
};

Checkbox.defaultProps = {
  label: ''
};
