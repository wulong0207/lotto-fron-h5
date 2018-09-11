/*
 * @Author: nearxu
 * @Date: 2017-11-22 12:06:13
 * 向上滚动
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import cx from 'classnames';
import { formatMoney } from '@/utils/utils';
import '../scss/scrollup.scss';

class ScrollUp extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { winData } = this.props;
    const settings = {
      autoplay: true,
      vertical: true,
      speed: 500
    };
    if (!winData.length) return null;
    return (
      <div
        className={ cx('box prize-wrap', winData.length - 1 > 0 ? '' : 'hide') }
      >
        <p className="title">他们正在中奖</p>
        <div className="scroll-yfq">
          <div className="content">
            <Slick { ...settings }>
              {winData.map((m, i) => {
                return (
                  <div className="acc" key={ i }>
                    <div className="left">
                      <span>用户:</span>
                      <span className="name">{m.nickName}</span>
                    </div>
                    <span className="right">
                      中奖<i>{formatMoney(m.money)}</i>
                    </span>
                  </div>
                );
              })}
            </Slick>
          </div>
        </div>
      </div>
    );
  }
}

export default ScrollUp;

ScrollUp.propTypes = {
  children: PropTypes.node
};
