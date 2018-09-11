import React, { Component } from 'react';
import '../css/index.scss';
import http from '../../utils/request';
import alert from '../../services/alert';

export default class AppDownload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadUrl: null,
      clicked: false
    };
    this.retryTimes = 0;
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    http
      .get('/android/home/version')
      .then(res => {
        this.setState({ downloadUrl: res.data.downloadUrl });
        if (this.state.clicked) window.location.href = this.state.downloadUrl;
      })
      .catch(e => {
        this.retryTimes++;
        if (this.retryTimes > 5) {
          return alert.alert('服务器错误').then(() => (window.location.href = '/'));
        }
        alert.alert('服务器繁忙，请重试').then(this.fetch.bind(this));
      });
  }

  clickHandle() {
    this.setState({ clicked: true });
    if (!this.state.downloadUrl) {
      return this.fetch();
    }
    window.location.href = this.state.downloadUrl;
  }

  render() {
    return (
      <div
        className="app-download-page"
        style={ { height: window.innerHeight + 'px' } }
      >
        <div className="app-download">
          <div className="download-btn" onClick={ this.clickHandle.bind(this) } />
        </div>
      </div>
    );
  }
}
