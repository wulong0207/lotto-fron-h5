import React, { Component } from 'react';
import storage from '@/services/storage';
import '../css/save-to-homescreen.scss';
import { browser } from '@/utils/utils';
import dateFormat from 'dateformat';

const STORAGE_KEY = 'IS_SAVE_TO_HOME_SCREEN_TIP_SHOWED';

export default class SaveToHomeScreenTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    // this.show();
  }

  show() {
    // 如果不是 iOS 设备，或者是从桌面的图标打开(window.navigator.standalone)则不做处理
    if ((!browser.iPhone && !browser.iPad) || window.navigator.standalone) {
      return undefined;
    }
    const now = new Date();
    const nowDate = dateFormat(now, 'yyyy-mm-dd');
    const isShowed = storage.get(STORAGE_KEY);
    if (!isShowed || isShowed !== nowDate) {
      this.setState({ show: true });
      storage.set(STORAGE_KEY, nowDate);
    }
  }

  toggle() {
    this.setState({ show: !this.state.show });
  }

  render() {
    if (!this.state.show) return null;
    return (
      <div>
        <div
          className="save-to-home-screen-tip-mask"
          onClick={ this.toggle.bind(this) }
        />
        <div className="save-to-home-screen-tip">
          <img
            src={ require('../images/save-to-homescreen.png') }
            className="save-tip-image"
          />
          <img
            src={ require('../images/x.png') }
            className="close-home-screen-tip"
            onClick={ this.toggle.bind(this) }
          />
        </div>
      </div>
    );
  }
}
