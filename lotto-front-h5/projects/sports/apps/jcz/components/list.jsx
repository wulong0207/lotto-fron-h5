import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { throttle } from 'lodash';
import analytics from '@/services/analytics';

export default class FootballPageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      position: 'static',
      ready: false
    };
    this.headerHeight = 0; // 顶部菜单的高度
    this.onScroll = throttle(this.scrollHandle.bind(this), 200);
    this.delay = undefined;
  }

  toggle() {
    analytics.send(21128);
    if (this.state.open && this.state.position === 'fixed') {
      this.setState({ open: !this.state.open, position: 'static' });
    } else {
      this.setState({ open: !this.state.open });
    }
  }

  scrollHandle(e) {
    if (!this.state.open) return undefined;
    if (!this.container) return undefined;
    const { top } = this.container.getBoundingClientRect(); // 元素顶部到视角(viewport) 顶部的距离
    const height = this.container.clientHeight;
    const HEADERHEIGHT = this.headerHeight;
    const inViewportTop = Boolean(
      top >= -height + HEADERHEIGHT && top < HEADERHEIGHT
    );
    if (inViewportTop && this.state.position === 'static') {
      this.setState({ position: 'fixed' });
    } else if (!inViewportTop && this.state.position === 'fixed') {
      this.setState({ position: 'static' });
    }
  }

  componentDidMount() {
    this.headerHeight =
      document.getElementById('football_global_menu').offsetHeight +
      document.getElementById('global_header_content').offsetHeight; // 顶部菜单的高度
    document.addEventListener('scroll', this.onScroll);
    // 延时渲染，避免页面切换卡顿
    if (this.delay) clearTimeout(this.delay);
    this.delay = setTimeout(() => this.setState({ ready: true }), 100);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
    clearTimeout(this.delay);
    this.delay = undefined;
  }

  render() {
    return (
      <section
        className={ cx('data-list', this.props.klass) }
        ref={ container => (this.container = container) }
      >
        <div ref={ header => (this.header = header) }>
          <div
            className={ cx({ open: this.state.open }, 'nav-date') }
            onClick={ this.toggle.bind(this) }
            style={ {
              position: this.state.position,
              top: this.headerHeight - 1 + 'px',
              left: 0,
              width: '100%',
              zIndex: 1
            } }
          >
            {this.props.header}
            <div className="toggle">
              <span className="arrows" />
            </div>
          </div>
        </div>
        <div
          style={ {
            display: this.state.open ? 'block' : 'none',
            paddingTop:
              this.state.position === 'fixed'
                ? this.header.offsetHeight - 1 + 'px'
                : 0
          } }
        >
          {!this.state.ready ? (
            <div className="loading">加载中...</div>
          ) : (
            this.props.children
          )}
        </div>
      </section>
    );
  }
}

FootballPageList.propTypes = {
  children: PropTypes.element.isRequired,
  header: PropTypes.element,
  klass: PropTypes.array
};
