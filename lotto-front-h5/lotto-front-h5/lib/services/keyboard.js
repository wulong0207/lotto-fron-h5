import React from 'react';
import { render } from 'react-dom';
import KeyBoardComponent from '../component/keyboard.jsx';

class Keyboard {
  constructor() {
    this.node = document.createElement('div');
    this.node.className = 'global-keyboard-component';
    document.body.appendChild(this.node);
    this.onValueChange = num => {
      return this.onChange(num);
    };
    this.onValueChanged = num => {
      return this.onChanged(num);
    };
    this.closeHandle = num => {
      return this.onClose(num);
    };
    this.render();
  }

  render(label = '', shortcuts = []) {
    render(
      <KeyBoardComponent
        ref={ keyboard => (this.keyboard = keyboard) }
        onChange={ this.onValueChange.bind(this) }
        onDone={ this.onValueChanged.bind(this) }
        onClose={ this.closeHandle.bind(this) }
        shortcuts={ shortcuts }
        label={ label }
      />,
      this.node
    );
  }

  open(num, label, shortcuts) {
    if (shortcuts && shortcuts.length) {
      this.render(label, shortcuts);
    }
    this.keyboard.open(num, label);
  }

  close() {
    this.keyboard.close();
  }

  onChange() {}

  onChanged() {}

  onClose() {}
}

export default new Keyboard();
