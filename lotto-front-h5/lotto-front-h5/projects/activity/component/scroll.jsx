import React, { Component } from 'react';
import http from '@/utils/request.js';
import Message from '@/services/message.js';
import Slider from 'react-slick';

export class ScrollCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winData: [],
      visibleGetPrize: false,
      phonenumber: '',
      light: '',
      agreeStyle: true
    };
  }

  componentWillMount() {
    this.getRecentWin();
  }
  getRecentWin() {
    let params = {
      activityCode: 'CJ20171019'
    };
    http
      .get('/activity/awardRoll', { params })
      .then(res => {
        let winData = res.data || [];
        this.setState({
          winData: winData
        });
        // if (winData.length > 0) {
        //   this.handleScrollUp();
        // }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  handleScrollUp() {
    let timer = null;
    let stop = false;
    let { scrollTop } = this.state;
    // let scroll = this.refs.scrollBox.scrollTop ||0; //box 盒子容器
    let overScroll = this.refs.overScroll.offsetHeight; // 实际移动的距离
    let content2 = this.refs.content2;
    content2.innerHTML = this.refs.overScroll.innerHTML;
    let self = this;
    function start() {
      timer = setInterval(scrolling, 50);
      if (!stop) {
        self.refs.scrollBox.scrollTop++;
      }
      self.setState({ scrollTop: self.refs.scrollBox.scrollTop });
    }
    function scrolling() {
      if (self.refs.scrollBox.scrollTop % 18 != 0) {
        self.refs.scrollBox.scrollTop++;
        if (self.refs.scrollBox.scrollTop >= overScroll) {
          self.refs.scrollBox.scrollTop = 0;
          // scrollTop = 0;
        }
        self.setState({ scrollTop: self.refs.scrollBox.scrollTop });
      } else {
        clearInterval(timer);
        setTimeout(start, 1000);
      }
    }
    setTimeout(start, 50);
  }

  render() {
    let { winData } = this.state;
    let settings = {
      speed: 500,
      autoplay: true,
      vertical: true
    };
    if (!winData.length) return null;
    return (
      <div className="scroll-cont">
        <div className="scroll-box" ref="scrollBox">
          <div className="over-scroll" ref="overScroll">
            <Slider { ...settings }>
              {winData.map((m, i) => {
                return (
                  <div className="acc" key={ i }>
                    <div className="left">
                      <span>用户:</span>
                      <span className="name">{m.userName}</span>
                    </div>
                    <span className="right">
                      抽中了<i>{m.redName}</i>
                    </span>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div className="content2" ref="content2" />
        </div>
      </div>
    );
  }
}
