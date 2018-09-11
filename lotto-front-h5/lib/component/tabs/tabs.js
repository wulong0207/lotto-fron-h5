import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Dropdown from './dropdown';
import { ReactComponent } from '@/types/common';

const Tab = PropTypes.shape({
  label: PropTypes.string.isRequired,
  dropdown: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
});

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const activeIndex = props.active || 0;
    this.state = {
      activeIndex,
      inactive: [activeIndex]
    };
  }

  static propTypes = {
    active: PropTypes.number,
    tabs: PropTypes.arrayOf(Tab).isRequired,
    children: PropTypes.node,
    onChange: PropTypes.func,
    beforeChange: PropTypes.func,
    link: ReactComponent,
    className: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {
    const { active } = nextProps;
    if (active && active !== this.state.activeIndex) {
      this.activePanel(active);
    }
  }

  renderPanel() {
    return React.Children.map(this.props.children, (child, index) => {
      if (this.state.inactive.indexOf(index) < 0) return <div />;
      return React.cloneElement(child, {
        index,
        active: index === this.state.activeIndex
      });
    });
  }

  activePanel(index) {
    if (index >= this.props.tabs.length) throw new Error('invalid index');
    if (index === this.state.activeIndex) return undefined;
    this.props.beforeChange && this.props.beforeChange(this.state.activeIndex);
    this.setState({ activeIndex: index });
    if (this.state.inactive.indexOf(index) < 0) {
      this.setState({ inactive: this.state.inactive.concat(index) });
    }
    this.props.onChange && this.props.onChange(index);
  }

  selectHandle(index) {
    this.activePanel(index);
  }

  render() {
    return (
      <div className={ cx('tabs', this.props.className) }>
        <div className="tab-list">
          <div className="tab-list-items">
            {this.props.tabs.map((tab, index) => {
              if (tab.dropdown) {
                return (
                  <Dropdown
                    { ...tab }
                    key={ index }
                    options={ tab.dropdown }
                    active={ index === this.state.activeIndex }
                    onClick={ this.selectHandle.bind(this, index) }
                  />
                );
              }
              return (
                <div
                  key={ index }
                  className={ cx('tab', {
                    active: index === this.state.activeIndex,
                    'tab-dropdown': tab.dropdown
                  }) }
                  onClick={ () => this.selectHandle(index) }
                >
                  {tab.label}
                </div>
              );
            })}
          </div>
          {this.props.link && (
            <div className="tab-link">
              {React.createElement(this.props.link, {
                index: this.state.activeIndex
              })}
            </div>
          )}
        </div>
        <div className="panel-list">{this.renderPanel()}</div>
      </div>
    );
  }
}
