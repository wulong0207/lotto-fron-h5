/*
 * @Author: yubei
 * @Date: 2017-06-27 16:31:26
 * @Desc: 数字彩tab切换组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './tab.scss';

export default class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      index: props.index
    };
  }

  // ready
  componentDidMount() {
    // 初始化默认选中
    // this.setState({ index: this.props.index });
    // this.tab.scrollLeft = 20;
    this.scrollTo(this.state.index);
  }

  // 标签滚动
  scrollTo(index) {
    const clientWidth = window.innerWidth;
    const middle = parseInt(clientWidth / 2);
    const tabs = this.tab.querySelectorAll('td');
    const tab = tabs[index];
    const left = tab.offsetLeft;
    const width = tab.offsetWidth;
    const halfWidth = parseInt(width / 2);
    if (left <= middle - halfWidth) {
      if (this.tab.scrollLeft > 0) {
        this.tab.scrollLeft = 0;
      }
    } else {
      this.tab.scrollLeft = left + halfWidth - middle;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.index !== this.props.index &&
      nextProps.index !== this.state.index
    ) {
      this.setState({ index: nextProps.index });
    }
  }

  changeTab(index, rePosition = true) {
    if (index === this.state.index) return undefined;
    this.setState({ index });
    if (rePosition) this.scrollTo(index);
    this.props.onChangeTab && this.props.onChangeTab(index);
  }

  // 切换
  // fromPad 是否为下拉面板选中
  switcher(e, index, fromPad = false) {
    this.changeTab(index, fromPad);
    this.setState({
      visible: false
    });
  }

  // 切换tab开关
  switchTabs() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const props = this.props;
    return (
      <section
        className={ 'header-tab' }
        style={ { backgroundColor: this.props.color } }
      >
        <div className="tabs" ref={ tab => (this.tab = tab) }>
          <table>
            <tbody>
              <tr>
                {props.tabs.map((row, index) => {
                  return (
                    <td
                      className={ cx({ cur: index === this.state.index }) }
                      key={ index }
                      onClick={ e => this.switcher(e, index) }
                    >
                      <div>{row.name}</div>
                      <span>{row.desc}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        {this.props.showSwitch ? (
          <div className="tab-switch">
            <span
              className="tab-switch-arrow"
              onClick={ this.switchTabs.bind(this) }
            />
            <section
              className={ cx(
                'tab-switch-con',
                this.state.visible ? 'show' : 'hide'
              ) }
            >
              <div className="tab-switch-bg">
                <ul>
                  {props.tabs.map((row, index) => {
                    return (
                      <li
                        className={ cx({ cur: index === this.state.index }) }
                        key={ index }
                        onClick={ e => this.switcher(e, index, true) }
                      >
                        <div>{row.name}</div>
                        <span>{row.desc}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </div>
        ) : (
          ''
        )}
      </section>
    );
  }
}

Tab.propTypes = {
  color: PropTypes.string,
  index: PropTypes.number,
  showSwitch: PropTypes.bool,
  tabs: PropTypes.array.isRequired,
  onChangeTab: PropTypes.func
};

Tab.defaultProps = {
  color: '#1e88d2'
};
