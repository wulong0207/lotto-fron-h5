import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import '../css/banner.scss';

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染 banner
  renderBanner() {
    let bannerList = this.props.bannerList;

    if (!bannerList) return <div className="renderBanner">banner加载中...</div>;
    if (!bannerList.length > 0) return <div />;
    return (
      <div className="banner">
        <ReactSwipe
          className="carousel"
          swipeOptions={ { continuous: true, auto: 3000 } }
        >
          {bannerList.map((row, index) => {
            return (
              <a href={ row.adUrl } key={ index }>
                <img src={ row.adImgUrl } />
              </a>
            );
          })}
        </ReactSwipe>
      </div>
    );
  }

  render() {
    return <div>{this.renderBanner()}</div>;
  }
}

Banner.defaultProps = {
  bannerList: [
    {
      adImgUrl: require('../../../img/banner1 .png'),
      adUrl: 'javascript:void(0)'
    }
  ]
};
