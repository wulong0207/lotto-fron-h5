/*
 * @Author: yubei 
 * @Date: 2017-09-14 15:53:56 
 * Desc: 第三方登录
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import http from '@/utils/request.js';
import { getParameter, getHashParameters } from '@/utils/utils.js';
import Message from '@/services/message.js';
import session from '@/services/session.js';
import storage from '@/services/storage';

const PLATFORM = 2;

export default class OAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.next = '';
  }

  componentWillMount() {
    let accessToken = getHashParameters('access_token');
    let code = getParameter('code');
    this.next = getParameter('next');

    // 请求接口地址
    let queryURI = '';
    let params = {};

    // 如果是QQ登录
    if (accessToken) {
      // access_token qqAccessToken
      // reqType 请求类型 1：登录，2：注册
      // URI /oauth/pc/passport/w/{access_token}/{reqType}/{platform}
      params = {
        accessToken,
        reqType: 1
      };

      queryURI = '/oauth/qq';
    }

    // 如果是微博
    if (code) {
      // code 编码
      // reqType 请求类型 1：登录，2：注册
      // URI /oauth/pc/passport/weibo/{code}/{reqType}/{platform}
      params = {
        code,
        reqType: 1
      };
      queryURI = '/oauth/weibo';
    }
    if (!queryURI) {
      Message.toast('第三方code返回失败，重新请返回登录');
      return;
    }

    // 第三方登录请求接口
    http
      .post(queryURI, params)
      .then(res => {
        let data = res.data;
        if (!data) {
          Message.toast('接口数据为空，请重试');
          return;
        }

        // 如果为首次第三方账号登录，跳转到个人中心
        session.set('token', data.tk);
        session.set('userInfo', res.data);
        if (data.fst_reg) {
          location.href = '/sc.html#/';
        } else {
          location.href = this.next ? this.next : '/sc.html#/';
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  render() {
    return <div />;
  }
}

ReactDOM.render(<OAuth />, document.getElementById('app'));
