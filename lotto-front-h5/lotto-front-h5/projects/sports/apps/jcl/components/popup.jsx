import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { render } from 'react-dom';
import store from '../store';
import { Provider } from 'react-redux';
import '@/scss/component/popup.scss';
// import { CSSTransitionGroup } from 'react-transition-group'

class PopUpComponentPortal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      show: false
    }
    this.onClose = this.closeHandler.bind(this);
    this.scrollTop = 0;
  }

  closeHandler() {
    const html = document.getElementsByTagName('html')[0];
    html.classList.remove('pop-open');
    html.style.height = 'auto';
    window.scrollTo(0, this.scrollTop);
    this.page.style.display = 'none';
  }

  open () {
    this.page.style.display = 'block';
    this.scrollTop = window.scrollY;
    const html = document.getElementsByTagName('html')[0];
    html.classList.add('pop-open');
    html.style.height = window.innerHeight + 'px';
    this.setState({ show: true });
  }

  close () {
    this.setState({ show: false });
    setTimeout(this.onClose, 300);
  }

  toggle () {
    if (this.state.show) return this.close();
    this.open();
  }

  render () {
    return (
        <div
          className={cx('popup-component', this.props.klass)}
          ref={ page => this.page = page }
        >
          {
            this.props.modal ?
            <div className="popup-modal"></div>
            :
            ''
          }
          <
            div
          >
            {
              this.state.show ?
              <div className="popup-wrap" ref={ wrap => this.wrap = wrap }>
                { this.props.children }
              </div>
              :
              ''
            }
          </div>
        </div>
    );
  }
}

export default class PopUpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
  }

  componentDidMount () {
    this.node = document.createElement('div');
    this.node.className = this.props.klass ? cx(this.props.klass) : '';
    document.body.appendChild(this.node);
    this.renderPortal(this.props);
  }

  componentWillUnmount () {
    this.removePortal();
  }

  componentWillReceiveProps (newProps) {
    this.renderPortal(newProps);
  }

  open () {
    this.page.open();
    this.setState({ show: true });
    this.props.onOpen && this.props.onOpen();
  }

  close () {
    this.page.close();
    this.setState({ show: false });
    this.props.onClose && this.props.onClose();
  }

  toggle () {
    if (this.state.show) {
      return this.close()
    }
    this.open();
  }

  renderPortal (props) {
    render(
      <Provider store={ store }>
        <PopUpComponentPortal { ...props } ref={ page => this.page = page } />
      </Provider>
      , this.node);
  }

  removePortal () {
    document.body.removeChild(this.node);
  }

  render () {
    return null;
  }
}

PopUpComponent.propTypes = {
  klass: PropTypes.array,
  children: PropTypes.element.isRequired,
  modal: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
}