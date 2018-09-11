import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PortalComponent from './portal';
import Alert from '../services/message';

import '../scss/component/keyboard.scss';

class Blink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    this.blinker = null;
  }

  componentDidMount() {
    // this.start();
  }

  stop() {
    clearInterval(this.blinker);
    this.blinker = null;
    this.setState({ show: false });
  }

  start() {
    this.blinker = setInterval(() => this.blink(), 800);
  }

  blink() {
    this.setState({ show: !this.state.show });
  }

  componentWillUnmount() {
    this.stop();
  }

  render() {
    return (
      <div
        className="blink"
        style={ {
          'display': 'inline',
          'opacity': this.state.show ? 1 : 0,
          'color': 'blue',
          'transition': 'opacity .2s',
          'padding': '0 2px',
          'fontWeight': 'normal'
        } }
      >|</div>
    )
  }
}

export default class Keyboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: props.value || 0,
      show: false,
      textWidth: 80,
      label: props.label,
      inputWidth: 80
    };
    // this.inputWidth = 80;
    this.onClose = this.close.bind(this);
  }

  onDelete () {
    this.change(-1);
  }

  minus() {
    const number = this.state.number - 1;
    if (typeof this.props.min === 'number' && number < this.props.min) return undefined;
    this.onChange(number);
  }

  plus() {
    const number = this.state.number + 1;
    if (typeof this.props.max === 'number' && number > this.props.max) return undefined;
    this.onChange(number);
  }

  onChange (number) {
    const num = parseInt(number);
    const newNumber = isNaN(num) || num < 0 ? 0 : parseInt(num);
    this.setState({ number: newNumber }, () => {
      this.setState({ textWidth: this.text.offsetWidth });
    });
    if (this.props.onChange) this.props.onChange(newNumber);
    return newNumber;
  }

  change (number) {
    let prevNumber = this.state.number;
    const min = 0;
    let newNumber = 0;
    if (number === -1) {
      if (prevNumber.toString().length > 1) {
        newNumber = prevNumber.toString().slice(0, -1);
      } else {
        newNumber = min;
      }
    } else if (prevNumber === min) {
      newNumber = number;
    } else if (number.toString().length > 1) {
      newNumber = number;
    } else {
      newNumber = `${prevNumber}${number}`;
    }
    this.onChange(newNumber);
  }

  done () {
    const number = this.close();
    if (this.props.onDone) this.props.onDone(number);
    if (this.props.onChange) this.props.onChange(number);
  }

  toggle (num = 0) {
    if (this.state.show) {
      this.close();
    } else {
      this.open(num);
    }
  }

  close() {
    this.blink.stop();
    let newNumber = this.state.number;
    if (typeof this.props.min === 'number' && newNumber < this.props.min) {
      if (this.props.messages && this.props.messages.min) {
        Alert.toast(this.props.messages.min);
      }
      newNumber = this.props.min;
    }
    if (typeof this.props.max === 'number' && newNumber > this.props.max) {
      if (this.props.messages && this.props.messages.min) {
        Alert.toast(this.props.messages.max);
      }
      newNumber = this.props.max;
    }
    if (newNumber !== this.state.number) {
      this.onChange(newNumber);
    }
    this.setState({ show: false }, () => {
      if (this.props.onClose) this.props.onClose(newNumber);
    });
    return newNumber;
  }

  open(num = 0, label) {
    if (typeof num === 'number') {
      this.setState({ number: num });
    }
    this.setState({ show: true, label }, () => {
      if (this.props.onOpen) this.props.onOpen(this.container.offsetHeight);
      setTimeout(() => {
        this.setState({ inputWidth: this.input.clientWidth });
        // this.inputWidth = this.input.clientWidth;
        this.blink.start();
      }, 50);
    });
  }

  set(number) {
    if (!/^\d+$/.test(number)) return undefined;
    this.setState({ number });
  }

  render() {
    return (
      <PortalComponent
        show={ this.state.show }
        klass={ ['keyboard-simulator'] }
      >
        <div
          className="keyboard-layer"
          style={ { 'display': this.state.show ? 'block' : 'none' } }
        >
          <div className="keyboard-mask" onClick={ this.close.bind(this) }></div>
          <section
            className="keyboard"
            ref={ container => this.container = container }
          >
            <div className="keyboard-wrap">
              <div className="keyboard-header">
                <div className="keyboard-label">{ this.state.label || '' }</div>
                <div className="keyboard-input-controller">
                  <div className="minus" onClick={ this.minus.bind(this) }>-</div>
                  <div className="keyboard-input" ref={ input => this.input = input }>
                    <div
                      className="input-text"
                      ref={ text => this.text = text }
                      style={ { 'transform': `translateX(${this.state.textWidth > this.inputWidth ? (this.inputWidth - this.state.textWidth + 'px') : 0})` } }
                    >
                      <span>{ this.state.number }</span>
                      <Blink ref={ blink => this.blink = blink } />
                    </div>
                  </div>
                  <div className="plus" onClick={ this.plus.bind(this) }>+</div>
                </div>
              </div>
              { this.props.shortcuts
                ? <div className="shortcuts">
                  {
                    this.props.shortcuts.map(s => {
                      return (
                        <span
                          key={ s.value }
                          onClick={ this.onChange.bind(this, s.value) }
                        >{ s.label }</span>
                      )
                    })
                  }
                </div>
                : ''
              }
              <div className="number">
                {
                  [1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => {
                    return (
                      <span
                        key={ number }
                        onClick={ this.change.bind(this, number) }
                      >{ number }</span>
                    )
                  })
                }
                <span onClick={ this.onDelete.bind(this) }><img
                  src={ require('../img/public/keyboard_delete@2x.png') } className="delete-key"/></span>
                <span onClick={ this.change.bind(this, 0) }>0</span>
                <span className="done-btn" onClick={ this.done.bind(this) }>确定</span>
              </div>
            </div>
          </section>
        </div>
      </PortalComponent>
    )
  }
}

Keyboard.propTypes = {
  onChange: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onDone: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  value: PropTypes.number,
  shortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
      ]),
      value: PropTypes.number.isRequired
    })
  ),
  messages: PropTypes.shape({
    min: PropTypes.string,
    max: PropTypes.string
  })
};
