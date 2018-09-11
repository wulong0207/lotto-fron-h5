import React from 'react';
import { render } from 'react-dom';
import ConfirmComponent from '../component/confirm';

class Confirm {
  constructor() {
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.render();
  }

  confirm(message, okText, cancelText, reverse, dismiss) {
    return this.instance.open(message, okText, cancelText, reverse, dismiss);
  }

  close() {
    return this.instance.close()
  }

  render() {
    render(<ConfirmComponent ref={ instance => this.instance = instance }/>, this.node);
  }
}

export default new Confirm();
