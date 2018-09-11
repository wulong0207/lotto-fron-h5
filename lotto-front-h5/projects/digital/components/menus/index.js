import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu.scss';
import cx from 'classnames';

const MENUS = [
  {
    label: '遗漏数据',
    value: 1,
    klass: 'missing-data'
  },
  {
    label: '冷热数据',
    value: 2,
    klass: 'hot-data'
  },
  {
    label: '概率数据',
    value: 3,
    klass: 'probability-data'
  }
];

export default class Menus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      value: props.menu[0].value
    };
    this.hideHandle = this.hide.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.hideHandle);
    this.icon.addEventListener('click', e => {
      e.stopPropagation();
      this.toggle();
    });
  }

  clickHandle(value) {
    // this.toggle();
    if (value === this.state.value) return undefined;
    this.setState({ value });
    this.props.onChangeType && this.props.onChangeType(value);
    this.props.onChange && this.props.onChange(value);
  }

  toggle() {
    this.setState({ show: !this.state.show });
  }

  hide() {
    if (!this.state.show) return undefined;
    this.setState({ show: false });
  }

  componentWillUnmount() {
    document.body.addEventListener('click', this.hideHandle);
  }
  playinfo(e) {
    let playid = this.props.lottery;
    // console.log(playid);
    window.location.href = 'playinfo.html?playid=' + playid;
  }
  render() {
    return (
      <div className="menu-component">
        <div className="menu-icon" ref={ icon => (this.icon = icon) } />
        <div
          className="menu-drop-down"
          style={ { display: this.state.show ? 'block' : 'none' } }
        >
          <ul>
            {this.props.menu.map(m => {
              return (
                <li
                  className={ cx(m.klass, {
                    active: this.state.value === m.value
                  }) }
                  onClick={ this.clickHandle.bind(this, m.value) }
                  key={ m.value }
                >
                  {m.label}
                </li>
              );
            })}
            <li className="play-info" onClick={ event => this.playinfo(event) }>
              中奖说明
            </li>
          </ul>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Menus.propTypes = {
  onChangeType: PropTypes.func,
  onChange: PropTypes.func,
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      klass: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    })
  ),
  children: PropTypes.node,
  getType: PropTypes.func
};

Menus.defaultProps = {
  menu: MENUS
};
