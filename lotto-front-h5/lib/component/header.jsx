/*
 * @Author: yubei
 * @Date: 2017-05-08 17:09:25
 * @Desc: Header 头部组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browser, getParameter } from '../utils/utils';

import '../scss/component/header.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 默认 props
  static defaultProps = {
    bg: 'blue', // 主题
    title: '2N彩票', // 标题
    back: () => {
      // 返回回调方法
      // debugger;
      // 解决Safari缓存问题导致页面不加载JS或不执行js
      // -- YLD
      // 取参数 next,如果有，就返回next参数地址
      // 如果没有这个参数，直接返回上一级。history.go -1;
      var nextUrl = getParameter('next');
      if (nextUrl) {
        window.location = decodeURIComponent(nextUrl);
      } else {
        /* else if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
                window.location.href = window.document.referrer;
            } */ window.history.go(
          '-1'
        );
      }
    },
    isback: true, // 是否显示返回按钮
    className: 'header'
  };

  // 设置参数类型
  static propTypes = {
    bg: PropTypes.string.isRequired,
    isback: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    back: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        {browser.yicaiApp ? (
          ''
        ) : (
          <header className={ this.props.className }>
            {/* bg-blue bg-green */}
            <div
              className={ 'header-fix theme-' + this.props.bg }
              id="global_header_content"
            >
              <div className="header-con">
                <div className="back">
                  {this.props.isback ? (
                    <a
                      href="javascript: void(0);"
                      onClick={ this.props.back.bind(this) }
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className="title">{this.props.title}</div>
                <div className="handle">{this.props.children}</div>
              </div>
            </div>
          </header>
        )}
      </div>
    );
  }
}
