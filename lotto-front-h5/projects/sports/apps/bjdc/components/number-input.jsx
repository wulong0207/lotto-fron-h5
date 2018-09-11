import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '@/scss/component/number-input.scss';
import keyboard from '../services/keyboard';
import Alert from '@/services/message';

export default class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.number !== this.state.number;
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.number !== this.state.number &&
      nextProps.number !== this.props.number
    ) {
      this.setState({ number: nextProps.number });
    }
  }

  change(number) {
    if (isNaN(parseInt(number))) return undefined;
    if (number === this.state.number) return undefined;
    const { max, min } = this.props;
    if (typeof max === 'number' && number > max) {
      if (this.props.messages && this.props.messages.max) {
        Alert.toast(this.props.messages.max);
      }
      return undefined;
    } else if (typeof min === 'number' && number < min) {
      if (this.props.messages && this.props.messages.min) {
        Alert.toast(this.props.messages.min);
      }
      return undefined;
    }
    this.setState({ number: parseInt(number) });
    if (this.props.onChange) this.props.onChange(parseInt(number));
  }

  minus() {
    const { step } = this.props;
    const number = this.state.number - step;
    // if (typeof min === 'number' && number < min) return undefined;
    this.change(number);
  }

  plus() {
    const { step } = this.props;
    const number = this.state.number + step;
    // if (typeof min === 'number' && number > max) return undefined;
    this.change(number);
  }

  foucs() {
    const { onFocus } = this.props;
    if (onFocus) onFocus();
    keyboard.open(this.state.number);
    keyboard.onChanged = number => {
      this.change(number);
    };
  }

  openKeyboard() {
    this.foucs();
  }

  render() {
    return (
      <div className="number-input-component">
        <div className="number-input-container">
          <div className="minus" onClick={ this.minus.bind(this) }>
            -
          </div>
          <div className="number-input" onClick={ this.foucs.bind(this) }>
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
  messages: PropTypes.shape({
    max: PropTypes.string,
    min: PropTypes.string
  })
};

NumberInput.defaultProps = {
  number: 1,
  step: 1
};
