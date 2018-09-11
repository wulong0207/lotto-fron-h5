import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './dialog.scss';
import cx from 'classnames';

export default class Dialog extends Component {
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
    return (
      <div
        className={ cx('dialog-component', this.props.klass) }
        style={ { display: !this.state.visible ? 'none' : '' } }
      >
        {this.props.modal && <div className="dialog-mask" />}
        <div className="dialog-wrap" onClick={ this.dismissHandle.bind(this) }>
          <div
            className="dialog-box"
            style={ { width: this.props.size === 'small' ? '60%' : '80%' } }
            onClick={ e => e.stopPropagation() }
          >
            <div className="dialog-header">
              {this.props.title && <h4>{this.props.title}</h4>}
              {this.props.showClose && (
                <button
                  className="dialog-close-button"
                  onClick={ this.close.bind(this) }
                />
              )}
            </div>
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
  children: PropTypes.node
};

Dialog.defaultProps = {
  modal: true,
  title: '温馨提示',
  showClose: true,
  size: 'large',
  dismiss: true
};
