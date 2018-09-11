import React from 'react';
import { render } from 'react-dom';
import PromptComponent from '../component/prompt';

class Prompt {
  constructor() {
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.render();
  }

  prompt(message, okText, cancelText, reverse) {
    return this.instance.open(message, okText, cancelText, reverse);
  }

  close() {
    return this.instance.close()
  }

  render() {
    render(<PromptComponent ref={ instance => this.instance = instance }/>, this.node);
  }
}

export default new Prompt();