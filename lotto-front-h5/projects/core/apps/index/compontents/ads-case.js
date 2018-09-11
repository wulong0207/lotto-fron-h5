/*
 * @Author: nearxu
 * @Date: 2017-11-10 15:42:39
 * 首页广告
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@/services/message';
import http from '@/utils/request';
import storage from '@/services/storage';

import '../css/case.scss';
import cx from 'classnames';

class AdsCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adsObj: {},
      show: false // 广告弹窗是否显示
    };
  }
  componentDidMount() {
    this.getOperateAds();
  }

  handleRefresh(display, time) {
    // 根据 display 判断展示次数
    // console.log(display, 'display', time);
    if (!time) {
      // 第一次一定可见
      this.setState({ show: true });
      return;
    }
    switch (display) {
      case 1:
        // 每次都可见
        this.setState({ show: true });
        break;
      case 2:
        // 每小时
        if (parseInt(time / 1000) > 3600) {
          this.setState({ show: true });
        }
        break;
      case 3:
        // 每天
        if (parseInt(time / 1000) > 3600 * 24) {
          this.setState({ show: true });
        }
        break;
      case 4:
        // 三天
        if (parseInt(time / 1000) > 3600 * 24 * 3) {
          this.setState({ show: true });
        }
        break;
      case 5:
        // 每周
        if (parseInt(time / 1000) > 3600 * 24 * 7) {
          this.setState({ show: true });
        }
        break;
      case 6:
        // 仅一次, 并且已经有显示记录
        if (time > 0) {
          this.props.emptyHandle();
        } else {
          this.setState({ show: true });
        }
        break;
    }
  }
  getOperateAds() {
    // 首页广告
    http
      .get('/operate/ad', {
        params: {
          menu: 13,
          platform: 2
        }
      })
      .then(res => {
        const resData = res.data[0];
        if (!resData) {
          return this.props.emptyHandle();
        }
        this.setState({
          adsObj: resData
        });
        let time; // 时间差
        if (storage.get('adsServiceTime')) {
          time = parseInt(res.serviceTime - storage.get('adsServiceTime'));
        }
        storage.set('adsServiceTime', res.serviceTime);
        this.handleRefresh(resData.display, time);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  handleCloseMask() {
    // 关闭弹窗
    let { show } = this.state;
    this.setState({
      show: !show
    });
  }
  handlePageGo() {
    //  广告跳转
    let { adsObj } = this.state;
    window.location.href = adsObj.adUrl;
  }

  render() {
    let { adsObj, show } = this.state;
    // console.log(adsObj, 'adsObj');
    if (!adsObj.adImgUrl) return <div />;
    return (
      <div className={ cx('ads-case', show ? '' : 'hide') }>
        <div className="ads-mask" />
        <div className="case">
          <div className="ads-box" onClick={ this.handlePageGo.bind(this) }>
            <img src={ adsObj.adImgUrl } />
          </div>

          <div className="delete-box" onClick={ this.handleCloseMask.bind(this) }>
            <img src={ require('@/img/user/cha_tanchuang@2x.png') } />
          </div>
        </div>
      </div>
    );
  }
}

AdsCase.propTypes = {
  adsObj: PropTypes.object,
  emptyHandle: PropTypes.func.isRequired // 广告为空时候的处理
};
export default AdsCase;
