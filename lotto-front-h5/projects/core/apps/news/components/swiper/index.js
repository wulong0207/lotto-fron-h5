/*
 * @Author: nearxu 
 * @Date: 2017-12-01 19:40:26 
 * 资讯轮播图
 */

import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Swiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dotIndex: 0
    };
  }
  render() {
    let { bannerList } = this.props;
    console.log(bannerList, 'bannerList');
    if (!bannerList) return <div className="renderBanner">banner加载中...</div>;
    if (!bannerList.length > 0) return <div />;
    return (
      <div className="banner">
        <ReactSwipe className="carousel" swipeOptions={ { continuous: true } }>
          {bannerList.map((row, index) => {
            return (
              <a href={ row.adUrl } key={ index }>
                <img src={ row.adImgUrl } />
              </a>
            );
          })}
        </ReactSwipe>
        {bannerList.map((m, i) => {
          return (
            <div className="banner-bottom" key={ i }>
              <span>{m.advTitle}</span>
              <span
                className={ cx('dot', this.state.dotIndex == i ? 'on' : '') }
                key={ i }
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Swiper;

Swiper.ProtoTypes = {
  bannerList: PropTypes.array.isRequired
};
