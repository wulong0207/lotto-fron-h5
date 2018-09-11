import React from 'react';
import { render } from 'react-dom';
import AlertComponent from '../component/alert';

class Alert {
  constructor() {
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.render();
  }

  alert(message, title, dismiss) {
    return this.instance.open(message, title, dismiss);
  }

  close() {
    return this.instance.close()
  }

  render() {
    render(<AlertComponent ref={ instance => this.instance = instance }/>, this.node);
  }
}

export default new Alert();
