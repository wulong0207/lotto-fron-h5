import React, { Component } from 'react';
import Dialog from '../dialog';
import './confirm.scss';

function nope () {}

export default class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      okText: '确定',
      cancelText: '取消',
      reverse: false,
      dismiss: true
    };
    this.onOk = nope;
    this.onCancel = nope;
  }

  open(message, okText = '确定', cancelText = '取消', reverse = false, dismiss = true) {
    return new Promise((resolve, reject) => {
      this.dialog.open();
      this.setState({ message, okText, cancelText, reverse, dismiss });
      if (resolve && typeof resolve === 'function') this.onOk = resolve;
      if (reject && typeof reject === 'function') this.onCancel = reject;
    });
  }

  okHandle() {
    this.onOk();
    this.dialog.close();
  }

  cancelHandle() {
    this.onCancel();
    this.dialog.close();
  }

  render() {
    const { reverse, okText, cancelText, message, dismiss } = this.state;
    return (
      <Dialog
        klass="confirm-dialog-component"
        ref={ dialog => this.dialog = dialog }
        title={ null }
        dismiss={ dismiss }
        showClose={ false }
      >
        <div className="confirm-message">
          {
            message
          }
        </div>
        <div className="confirm-footer">
          <button onClick={ reverse ? this.okHandle.bind(this) : this.cancelHandle.bind(this) }>{ reverse ? okText : cancelText }</button>
          <button onClick={ reverse ? this.cancelHandle.bind(this) : this.okHandle.bind(this) }>{ reverse ? cancelText : okText }</button>
        </div>
      </Dialog>
    );
  }
}
