import React, { Component } from 'react';
import Dialog from '../dialog';
import './alert.scss';

function nope () {}

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      title: '',
      dismiss: true
    };
    this.closeHandle = nope;
  }

  open(message, title = '', dismiss = true) {
    return new Promise((resolve, reject) => {
      this.dialog.open();
      this.setState({ message, title, dismiss });
      if (resolve && typeof resolve === 'function') this.closeHandle = resolve;
    });
  }

  close() {
    this.dialog.close();
    this.closeHandle();
  }

  render() {
    return (
      <Dialog
        klass="alert-dialog-component"
        ref={ dialog => this.dialog = dialog }
        title={ this.state.title }
        showClose={ false }
        dismiss={ this.state.dismiss }
      >
        <div className="alert-message">
          {
            this.state.message
          }
        </div>
        <div className="alert-footer">
          <button onClick={ this.close.bind(this) }>确定</button>
        </div>
      </Dialog>
    );
  }
}
