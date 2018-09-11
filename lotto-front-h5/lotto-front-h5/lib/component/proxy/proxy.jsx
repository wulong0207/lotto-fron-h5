/*
 * @Author: yubei 
 * @Date: 2017-09-15 16:27:46 
 * Desc: 代理
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '../../utils/request.js';
import ProxyPage from './proxy-page';

import '../../scss/component/proxy/proxy.scss';

export default class Proxy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  static propTypes = {};

  componentWillMount() {
    this.getAgent();
  }
  getAgent() {
    http
      .get('/sys/agent/adFlag')
      .then(res => {
        if (res.data == '1') {
          // 开
          this.setState({ visible: true });
        } else if (res.data == '0') {
          // 关
          this.setState({ visible: false });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 打开代理页面
  onOpenProxyPage() {
    this.refs.proxyPage.onOpen();
  }

  render() {
    if (!this.state.visible) return <span />;
    return (
      <div>
        <span onClick={ this.onOpenProxyPage.bind(this) }>
          {this.props.children}
        </span>
        <ProxyPage ref="proxyPage" />
      </div>
    );
  }
}
