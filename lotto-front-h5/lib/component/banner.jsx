import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import cx from 'classnames';
import '../scss/component/banner.scss';

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dotIndex: 0
    };
  }

  render() {
    let _ = this;
    let { bannerList, loopPlayTime } = this.props;
    return (
      <div className="banner">
        <ReactSwipe
          ref={ reactSwipe => (this.reactSwipe = reactSwipe) }
          className="carousel"
          swipeOptions={ {
            continuous: true,
            auto: loopPlayTime,
            disableScroll: false,
            callback: function(index) {
              if (bannerList.length === 2 && index === 2) {
                index = 0;
              } else if (bannerList.length === 2 && index === 3) {
                index = 1;
              }
              _.setState({ dotIndex: index });
            }
          } }
        >
          {bannerList.map((row, index) => {
            return (
              <a href={ row.adUrl } key={ index }
                className="item">
                <img src={ row.adImgUrl } className="tupian" />
              </a>
            );
          })}
        </ReactSwipe>
        <div className="dotted">
          {bannerList.map((e, i) => {
            return (
              <span
                className={ cx('dot', _.state.dotIndex === i ? 'on' : '') }
                key={ i }
              />
            );
          })}
        </div>
      </div>
    );
  }
}

Banner.defaultProps = {
  bannerList: [
    {
      adImgUrl: '../img/banner1.png',
      adUrl: 'javascript:void(0)'
    }
  ],
  loopPlayTime: 3000
};
