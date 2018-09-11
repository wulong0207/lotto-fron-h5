/*
 * @Author: yubei
 * @Date: 2017-08-19 15:51:02
 * Desc: 首页彩票数据
 */

import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import cx from 'classnames';
import ALink from '@/component/analytics/link';

export default class OperLottList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dotIndex: 0
    };
  }

  componentDidMount() {}

  // 渲染 banner
  renderBanner() {
    let _ = this;
    let dot = this.state.dotIndex;
    let bannerList = this.props.operAdList;
    if (!bannerList) return <div className="renderBanner">banner加载中...</div>;
    if (!bannerList.length > 0) return <div />;
    return (
      <div className="banner">
        <ReactSwipe
          ref={ reactSwipe => (this.reactSwipe = reactSwipe) }
          className="carousel"
          swipeOptions={ {
            continuous: true,
            auto: 3000,
            disableScroll: false,
            callback: function(index) {
              // console.log(index);
              _.setState({ dotIndex: index });
            }
          } }
        >
          {bannerList.map((row, index) => {
            return (
              <div key={ index }>
                <ALink href={ row.adUrl } id={ 20111 + index }>
                  <img src={ row.adImgUrl } />
                </ALink>
              </div>
            );
          })}
        </ReactSwipe>
        <div className="dotted">
          {bannerList.map((e, i) => {
            return <span className={ cx('dot', dot == i ? 'on' : '') } key={ i } />;
          })}
        </div>
      </div>
    );
  }

  onOpenAllLottPage() {
    this.props.onOpenAllLottPage();
  }

  render() {
    // if(!this.state.operLottList) return <div></div>;
    return (
      <div>
        {this.renderBanner()}
        {/* { this.renderLott() } */}
      </div>
    );
  }
}
