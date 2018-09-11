import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import './dialog-v2.scss';

const documentBody = document.body;

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  open() {
    this.setState({ visible: true });
    this.props.onOpen && this.props.onOpen();
  }

  close() {
    this.setState({ visible: false });
    this.props.onClose && this.props.onClose();
  }

  toggle() {
    if (!this.state.visible) {
      return this.open();
    }
    this.close();
  }

  dismissHandle() {
    if (!this.props.dismiss) return undefined;
    return this.close();
  }

  render() {
    const height = document.body.scrollHeight;
    return (
      <div
        className={ cx('dialog-component-v2', this.props.klass) }
        style={ {
          display: !this.state.visible ? 'none' : '',
          height: height + 'px'
        } }
      >
        {this.props.modal && <div className="dialog-mask" />}
        <div
          className="dialog-wrap"
          style={ { height: window.innerHeight } }
          onClick={ this.dismissHandle.bind(this) }
        >
          <div
            className="dialog-box"
            style={ { width: this.props.size === 'small' ? '60%' : '80%' } }
            onClick={ e => e.stopPropagation() }
          >
            {this.props.showHeader && (
              <div className="dialog-header">
                {this.props.title && <h4>{this.props.title}</h4>}
                {this.props.showClose && (
                  <button
                    className="dialog-close-button"
                    onClick={ this.close.bind(this) }
                  />
                )}
              </div>
            )}
            <div className="dialog-content">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  modal: PropTypes.bool,
  title: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  showClose: PropTypes.bool,
  klass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  size: PropTypes.oneOf(['small', 'large']),
  dismiss: PropTypes.bool,
  children: PropTypes.node,
  showHeader: PropTypes.bool
};

Dialog.defaultProps = {
  modal: true,
  title: '温馨提示',
  showClose: true,
  size: 'large',
  dismiss: true,
  showHeader: true
};

export default class DialogWrapper extends Component {
  constructor(props) {
    super(props);
    this.dialog = undefined;
    // this.el = document.createElement('div');
  }

  componentDidMount() {}

  // componentWillUnmount() {
  //   documentBody.removeChild(this.el);
  // }

  // componentWillReceiveProps(nextProps) {
  //   this.renderPortal();
  // }

  open() {
    this.dialog.open();
    // documentBody.style.position = 'fixed';
    window.scroll(0, 0);
  }

  close() {
    this.dialog.close();
    // documentBody.style.position = 'static';
  }

  closeHandle() {
    this.props.onClose && this.props.onClose();
    documentBody.style.position = 'static';
  }

  toggle() {
    if (!this.state.show) {
      return this.open();
    }
    this.close();
  }

  renderPortal() {
    ReactDOM.render(
      <Dialog
        { ...this.props }
        onClose={ this.closeHandle.bind(this) }
        ref={ dialog => (this.dialog = dialog) }
      />,
      this.el
    );
  }

  render() {
    return (
      <Dialog
        { ...this.props }
        onClose={ this.closeHandle.bind(this) }
        ref={ dialog => (this.dialog = dialog) }
      />
    );
  }
}
