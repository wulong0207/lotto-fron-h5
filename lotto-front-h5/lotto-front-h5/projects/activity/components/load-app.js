/*
 * @Author: nearxu
 * @Date: 2017-11-22 11:48:54
 * h5 下载APP
 */

import React, { Component } from 'react';
import { browser } from '@/utils/utils';
import http from '@/utils/request.js';
import Message from '@/services/message.js';

function download() {
  if (browser.android) {
    http
      .get('/home/channelVersion', {})
      .then(res => {
        var url = res.data.wapAppUrl;
        window.location = url;
      })
      .catch(err => {
        Message.toast(err.message);
      });
    // window.location =
    // 'http://sit.cp.2ncai.com/_upload_file/app/Android_V1.0.5_6_activities_20170814_1101.apk';
  } else {
  }
}

class LoadApp extends Component {
  render() {
    return (
      <div>
        {browser.yicaiApp || browser.ios || browser.iPhone ? (
          ''
        ) : (
          <div className="down-wrap">
            <div className="left">
              <img src={ require('../img/erweicode.png') } alt="" />
            </div>
            <div className="right" onClick={ () => download() }>
              <p className="right-text">下载客户端 随时查看中奖</p>
              <p className="right-btn" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LoadApp;
