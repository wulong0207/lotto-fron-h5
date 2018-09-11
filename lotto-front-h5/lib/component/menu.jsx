/*
 * @Author: yubei
 * @Date: 2017-08-27 13:26:28
 * Desc: 底部菜单
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Path } from '../const/path.js';
import session from '../services/session.js';

import '../scss/component/menu.scss';

export default class MenuBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.token = '';
  }

  static defaultProps = {
    index: 0
  };

  static propTypes = {
    index: PropTypes.number.isRequired
  };

  // 去个人中心
  toUser() {
    if (session.get('token')) {
      window.location.href = '/sc.html#/';
    } else {
      window.location.href = '/account.html#/login';
    }
  }

  render() {
    return (
      <menu className="menu">
        <a
          className={ cx('menu-index', { current: this.props.index == 0 }) }
          href="/index.html"
        >
          <i className="menu-icon" />
          <span>购彩</span>
        </a>
        <a
          className={ cx('menu-live', { current: this.props.index == 1 }) }
          href={ Path.getYbfLive() }
        >
          <i className="menu-icon" />
          <span>直播</span>
        </a>
        <a
          className={ cx('menu-open', { current: this.props.index == 2 }) }
          href="/kj/"
        >
          <i className="menu-icon" />
          <span>开奖公告</span>
        </a>
        <a
          className={ cx('menu-news', { current: this.props.index == 3 }) }
          href="/news.html#/"
        >
          <i className="menu-icon" />
          <span>资讯</span>
        </a>
        <a
          className={ cx('menu-user', { current: this.props.index == 4 }) }
          onClick={ this.toUser.bind(this) }
        >
          <i className="menu-icon" />
          <span>我的</span>
        </a>
      </menu>
    );
  }
}
