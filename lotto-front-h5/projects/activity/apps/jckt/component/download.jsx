import React, { Component } from 'react';
import { browser } from '@/utils/utils';
import http from '@/utils/request.js';
import Message from '@/services/message.js';
import '../css/download.scss';

export default class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  download() {
    this.props.download();
  }

  render() {
    return (
      <div className="Download" onClick={ this.download.bind(this) }>
        <img className="txt" src={ require('../img/download.png') } />
        <div className="btn">立即下载</div>
      </div>
    );
  }
}

Download.defaultProps = {
  download: () => {
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
    }
  }
};
