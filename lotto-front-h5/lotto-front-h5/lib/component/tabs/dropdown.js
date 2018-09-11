import React, { PureComponent } from 'react';
import Dropdown from '../dropdown';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class TabDropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.index || 0
    };
    this.timeout = null;
  }

  static propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    index: PropTypes.number
  };

  selectHandle(index) {
    if (this.state.selected === index) return undefined;
    this.setState({ selected: index });
    this.props.onChange && this.props.onChange(index);
  }

  clickHandle() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => this.props.onClick && this.props.onClick());
  }

  render() {
    const toggler = (
      <div
        className={ cx('tab-dropdown', {
          active: this.props.active
        }) }
      >
        {this.props.label}
      </div>
    );
    return (
      <Dropdown
        className={ cx('tab', { active: this.props.active }) }
        toggler={ toggler }
        onClick={ this.clickHandle.bind(this) }
        mask={ true }
        disabled={ !this.props.active }
      >
        <ul>
          {this.props.options.map((option, index) => {
            return (
              <li
                className={ cx({ selected: this.state.selected === index }) }
                key={ index }
                onClick={ this.selectHandle.bind(this, index) }
              >
                {option}
              </li>
            );
          })}
        </ul>
      </Dropdown>
    );
  }
}
