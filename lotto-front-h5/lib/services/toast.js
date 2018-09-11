import React from 'react';
import { render } from 'react-dom';
import ToastComponent from '../component/toast';

class Toast {
  constructor() {
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.render();
  }

  toast(message, timeout) {
    return this.instance.open(message, timeout);
  }

  close() {
    return this.instance.close()
  }

  render() {
    render(<ToastComponent ref={ instance => this.instance = instance } />, this.node);
  }
}

export default new Toast();
