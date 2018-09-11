import React, { Component } from 'react';
import Dialog from '../dialog';
import './toast.scss';

export default class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.timeout = undefined;
  }

  open(message = '', timeout = 3000) {
    if (this.timeout) {
      this.close();
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.dialog.open();
    this.setState({ message });
    setTimeout(() => this.close(), timeout);
  }

  close() {
    this.dialog.close();
  }

  render() {
    return (
      <Dialog
        klass="toast-dialog-component"
        ref={ dialog => this.dialog = dialog }
        title={ null }
        showClose={ false }
        size="small"
        modal={ false }
      >
        { this.state.message }
      </Dialog>
    );
  }
}
