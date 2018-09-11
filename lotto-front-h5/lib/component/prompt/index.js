import React, { Component } from 'react';
import Dialog from '../dialog';
import './prompt.scss';

function nope () {}

export default class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      okText: '确定',
      cancelText: '取消',
      reverse: false
    };
    this.onOk = nope;
    this.onCancel = nope;
  }

  open(message, okText = '确定', cancelText = '取消', reverse = false) {
    return new Promise((resolve, reject) => {
      this.dialog.open();
      if (message === this.state.message) return undefined;
      this.setState({ message, okText, cancelText, reverse });
      if (resolve && typeof resolve === 'function') this.onOk = resolve;
      if (reject && typeof reject === 'function') this.onCancel = reject;
    });
  }

  okHandle() {
    const value = this.input.value;
    this.onOk(value);
    this.dialog.close();
  }

  cancelHandle() {
    this.input.value = '';
    this.onCancel();
    this.dialog.close();
  }

  render() {
    const { reverse, okText, cancelText, message } = this.state;
    return (
      <Dialog
        klass="prompt-dialog-component"
        ref={ dialog => this.dialog = dialog }
        title={ null }
        showClose={ false }
      >
        <div className="prompt-message">
          {
            message
          }
          <div className="prompt-input">
            <input ref={ input => this.input = input } />
          </div>
        </div>
        <div className="prompt-footer">
          <button onClick={ reverse ? this.okHandle.bind(this) : this.cancelHandle.bind(this) }>{ reverse ? okText : cancelText }</button>
          <button onClick={ reverse ? this.cancelHandle.bind(this) : this.okHandle.bind(this) }>{ reverse ? cancelText : okText }</button>
        </div>
      </Dialog>
    )
  }
}
