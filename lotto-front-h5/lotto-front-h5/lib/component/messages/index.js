import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './messages.scss';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    this.timeout = undefined;
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.remove();
    }, this.props.timeout)
  }

  remove() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.setState({ show: false });
    this.props.onRemove(this.props.id);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {
    if (!this.state.show) return null;
    return (
      <div className={ cx('message-component', this.props.type) }>
        <div className="message-wrap">
          <div className="message-content">
            <div className="message">{ this.props.message }</div>
            <button className="message-close-button" onClick={ this.remove.bind(this) }></button>
          </div>
        </div>
      </div>
    )
  }
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  type: PropTypes.oneOf([
    'normal',
    'warn',
    'error',
    'success'
  ]).isRequired,
  timeout: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.timeout = [];
  }

  open(message, timeout = 3000) {
    const id = `message-${Math.random() * new Date().getTime() * this.state.messages.length}`;
    const messages = this.state.messages.concat({ ...message, id, timeout });
    this.setState({ messages });
  }

  closeHandle(id) {
    this.setState({ messages: this.state.messages.filter(m => m.id !== id) });
  }

  render() {
    return (
      <div className="messages-component">
        {
          this.state.messages.map(message => {
            return (
              <Message
                { ...message }
                key={ message.id }
                onRemove={ this.closeHandle.bind(this) }
              />
            );
          })
        }
      </div>
    )
  }
}
