import React from 'react';
import { render } from 'react-dom';
import KeyBoardComponent from '../components/keyboard.jsx';

class Keyboard {
  constructor() {
    this.node = undefined;
    this.keyboard = undefined;
    this.onValueChange = num => {
      this.onChange(num);
    };
    this.onValueChanged = num => {
      this.onChanged(num);
    };
    this.render();
  }

  render() {
    this.node = document.createElement('div');
    this.node.className = 'global-keyboard-component';
    document.body.appendChild(this.node);
    render(
      <KeyBoardComponent
        ref={ keyboard => (this.keyboard = keyboard) }
        onChange={ this.onValueChange.bind(this) }
        onDone={ this.onValueChanged.bind(this) }
      />,
      this.node
    );
  }

  open(num, label) {
    this.keyboard.open(num, label);
  }

  close() {
    this.keyboard.close();
  }

  onChange() {}

  onChanged() {}
}

export default new Keyboard();
