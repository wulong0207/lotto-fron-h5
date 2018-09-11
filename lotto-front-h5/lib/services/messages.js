import React from 'react';
import { render } from 'react-dom';
import MessagesComponent from '../component/messages';

class Messages {
  constructor() {
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.render();
  }

  message(message, timeout) {
    return this.instance.open({ message, type: 'success' }, timeout);
  }

  success(message, timeout) {
    return this.instance.open({ message, type: 'success' }, timeout);
  }

  warn(message, timeout) {
    return this.instance.open({ message, type: 'warn' }, timeout);
  }

  error(message, timeout) {
    return this.instance.open({ message, type: 'error' }, timeout);
  }

  close() {
    return this.instance.close()
  }

  render() {
    render(<MessagesComponent ref={ instance => this.instance = instance } />, this.node);
  }
}

export default new Messages();
