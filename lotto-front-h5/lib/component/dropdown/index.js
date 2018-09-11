import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.closeHandle = this.close.bind(this);
    this.toggler = null;
  }

  static propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    toggler: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    mask: PropTypes.bool,
    disabled: PropTypes.bool
  };

  componentDidMount() {
    this.toggler.addEventListener('click', this.toggleHandle.bind(this));
    document.body.addEventListener('click', this.closeHandle);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.closeHandle);
  }

  toggleHandle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClick && this.props.onClick();
    if (!this.props.disabled) this.toggle();
  }

  open() {
    this.setState({ show: true });
    this.props.onOpen && this.props.onOpen();
  }

  close() {
    this.setState({ show: false });
    this.props.onClose && this.props.onClose();
  }

  toggle() {
    if (this.state.show) return this.close();
    this.open();
  }

  render() {
    return (
      <div
        className={ cx('dropdown', this.props.className, {
          open: this.state.show
        }) }
      >
        <div className="dropdown-toggler" ref={ node => (this.toggler = node) }>
          {this.props.toggler}
        </div>
        {this.props.mask && (
          <div
            className="dropdown-mask"
            style={ { display: !this.state.show ? 'none' : '' } }
          />
        )}
        <div
          className="dropdown-list"
          style={ { display: !this.state.show ? 'none' : '' } }
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
