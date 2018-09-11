import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/box-view.scss';
import { throttle } from 'lodash';

export default class BoxView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 'static',
      open: true
    };

    this.headerHeight = 0; // 顶部菜单的高度
    this.onScroll = throttle(this.onScrollHandler.bind(this), 200);
    this.delay = undefined;
  }

  componentDidMount() {
    this.headerHeight = this.container.parentNode.getBoundingClientRect().top; // 顶部菜单的高度
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

  onScrollHandler() {
    let { open } = this.state;
    if (!open) return undefined;
    if (!this.container) return undefined;
    const { top } = this.container.getBoundingClientRect(); // 元素顶部到视角(viewport) 顶部的距离
    const height = this.container.clientHeight;
    const HEADERHEIGHT = this.headerHeight;
    const BVHeadHeight = this.refs.header.clientHeight;
    const inViewportTop = Boolean(
      top + height - BVHeadHeight >= HEADERHEIGHT && top < HEADERHEIGHT
    );
    if (inViewportTop && this.state.position === 'static') {
      this.setState({ position: 'fixed' });
    } else if (!inViewportTop && this.state.position === 'fixed') {
      this.setState({ position: 'static' });
    }
  }

  show(shouldShow) {
    this.refs.childArea.style.transition = 'all 0.5s';
    let open = this.state.open;
    let position = this.state.position;

    if (shouldShow != null) {
      open = shouldShow;
    } else {
      open = !open;
      if (!open) {
        if (this.state.position === 'fixed') {
          this.setState({ position: 'static' });
          position = 'static';
        }
      }
    }

    this.setState({ open, position });
  }

  render() {
    let { title } = this.props;
    let { open, position } = this.state;
    let ca = open ? '' : 'hide';

    return (
      <div
        ref={ container => (this.container = container) }
        className={ 'box-view ' + position }
      >
        <div
          ref="header"
          className="bv-header "
          onClick={ this.show.bind(this, null) }
        >
          <h3 className="flex tl">客队</h3>
          <h3 className="title">
            {title}
            <span className={ 'toggle ' + (open ? '' : 'noshow') }>
              <span className="arrows" />
            </span>
          </h3>
          <h3 className="flex tr">主队</h3>
        </div>
        <div ref="childArea" className={ 'child-area ' + ca }>
          {this.props.children}
        </div>
      </div>
    );
  }
}
