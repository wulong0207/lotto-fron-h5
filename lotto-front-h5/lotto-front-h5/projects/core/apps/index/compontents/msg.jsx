import React, { Component } from 'react';
import Slider from 'react-slick';

import '../css/msg.scss';

export class MsgScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let winData = this.props.winInfoList;
    let settings = {
      speed: 500,
      autoplay: true,
      vertical: true
    };
    if (!winData || winData.length < 1) return <div />;
    return (
      <div className="msg-cont">
        <div className="cont">
          <Slider { ...settings }>
            {winData.map((m, i) => {
              return (
                <div className="acc" key={ i }>
                  <span className="msg">{m}</span>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    );
  }
}
