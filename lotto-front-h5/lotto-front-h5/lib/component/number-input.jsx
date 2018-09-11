import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../scss/component/number-input.scss';
import keyboard from '../services/keyboard';
import Alert from '../services/message';

export default class NumberInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number || 1
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.number !== this.state.number;
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.number === 'number' &&
      nextProps.number !== this.state.number
    ) {
      this.setState({ number: nextProps.number });
    }
  }

  change(number) {
    if (isNaN(parseInt(number))) return undefined;
    if (number === this.state.number) {
      if (this.props.onChange) this.props.onChange(parseInt(number));
      return undefined;
    }
    const { max, min } = this.props;
    if (typeof max === 'number' && parseInt(number) > max) {
      if (this.props.messages && this.props.messages.max) {
        Alert.toast(this.props.messages.max);
      }
      this.setState({ number: parseInt(max) });
      if (this.props.onChange) this.props.onChange(parseInt(max));
      return undefined;
    } else if (typeof min === 'number' && parseInt(number) < min) {
      if (this.props.messages && this.props.messages.min) {
        Alert.toast(this.props.messages.min);
      }
      this.setState({ number: parseInt(min) });
      if (this.props.onChange) this.props.onChange(parseInt(min));
      return undefined;
    }
    const newNumber = parseInt(number);
    this.setState({ number: newNumber });
    if (this.props.onChange) this.props.onChange(newNumber);
  }

  minus() {
    const { step } = this.props;
    const number = this.state.number - step;
    this.change(number);
  }

  plus() {
    const { step } = this.props;
    const number = this.state.number + step;
    this.change(number);
  }

  focus() {
    const { onFocus } = this.props;
    if (onFocus) onFocus();
    keyboard.open(this.state.number, this.props.label, this.props.shortcuts);
    keyboard.onChanged = number => {
      return this.change(number);
    };
    keyboard.onClose = number => {
      return this.props.onClose && this.props.onClose(number);
    };
  }

  openKeyboard() {
    this.focus();
  }

  render() {
    return (
      <div className="number-input-component">
        <div className="number-input-container">
          <div className="minus" onClick={ this.minus.bind(this) }>
            -
          </div>
          <div className="number-input" onClick={ this.focus.bind(this) }>
            {this.state.number}
          </div>
          <div className="plus" onClick={ this.plus.bind(this) }>
            +
          </div>
        </div>
      </div>
    );
  }
}

NumberInput.propTypes = {
  number: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  messages: PropTypes.shape({
    max: PropTypes.string,
    min: PropTypes.string
  }),
  shortcuts: PropTypes.array,
  onClose: PropTypes.func
};

NumberInput.defaultProps = {
  step: 1
};
