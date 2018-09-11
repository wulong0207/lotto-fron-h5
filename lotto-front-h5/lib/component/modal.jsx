import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUpComponent from './popup';
import cx from 'classnames';
import '../scss/component/modal.scss';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  toggle () {
    this.pop.toggle();
  }

  open () {
    this.pop.open();
  }

  close () {
    this.pop.close();
  }

  render () {
    return (
      <PopUpComponent
        modal={ true }
        klass={ ['modal', cx(this.props.klass)] }
        onOpen={ this.props.onOpen }
        onClose={ this.props.onClose }
        ref={ pop => this.pop = pop }
      >
        <div className="modal-wrap">
          { this.props.headerTipText && <div className="header-tip-text">{ this.props.headerTipText }</div> }
          <div className="modal-close" onClick={ this.close.bind(this) }><img src={require("../img/jcz/icon_shut_down2@2x.png")} /></div>
          <div className="modal-content">
            { this.props.children }
          </div>
        </div>
      </PopUpComponent>
    )
  }
}

Modal.propTypes = {
  klass: PropTypes.array,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  headerTipText: PropTypes.string
};