import React, { Component } from 'react';
import cx from 'classnames';
import '../css/musicplayer.scss';

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false, // 默认暂停
      duration: '00:00',
      currentTime: '00:00',
      durationTime: ''
    };
  }
  componentDidMount() {
    this.onloade();
    this.timeUpdate();
  }
  onloade(e) {
    let audioNode = document.getElementById('audio');
    let audioDuration = this.formatTime(audioNode.duration, 'HH:mm:ss');
    let audioCurrent = this.formatTime(audioNode.currentTime, 'HH:mm:ss');
    this.setState({ duration: audioDuration, currentTime: audioCurrent });
    // console.log(audioDuration,audioCurrent);
  }
  // 进度条
  timeUpdate() {
    let timeline = document.getElementById('timeline');
    let playhead = document.getElementById('playhead');
    let block = document.getElementById('block');
    let audioNode = document.getElementById('audio');
    let timelineWidth = timeline.offsetWidth;
    let playPercent =
      timelineWidth * (audioNode.currentTime / audioNode.duration);
    playhead.style.webkitTransform = 'translateX(' + playPercent + 'px)';
    playhead.style.transform = 'translateX(' + playPercent + 'px)';
    block.style.webkitTransform = 'translateX(' + playPercent + 'px)';
    block.style.transform = 'translateX(' + playPercent + 'px)';
    if (audioNode.currentTime === audioNode.duration) {
      this.setState({ isPlay: false });
      this.Play();
    }
    let timeCurrent = this.formatTime(audioNode.currentTime, 'HH:mm:ss');
    this.setState({ currentTime: timeCurrent });
  }
  // 控制播放暂停
  Play() {
    let audioNode = document.getElementById('audio');
    this.setState({ isPlay: !this.state.isPlay });
    if (!this.state.isPlay) {
      audioNode.play();
      this.timeUpdate();
      this.timer = setTimeout(event => {
        this.onloade();
      }, 500);
    } else {
      // pause music
      audioNode.pause();
    }
  }
  // 时间格式化
  formatTime(time, format) {
    let transformed = '';
    let hours = '';
    let minutes = '';
    let seconds = '';
    hours = Math.floor(time / 3600);
    minutes = Math.floor(Math.floor(time % 3600) / 60);
    seconds = Math.floor(Math.floor(time % 3600) % 60);
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if (format === 'HH:mm:ss') {
      if (hours > 0) {
        transformed = `${hours}:${minutes}:${seconds}`;
      } else {
        transformed = `${minutes}:${seconds}`;
      }
    }
    return transformed;
  }
  render() {
    let isPlay = this.state.isPlay;
    let duration = this.state.duration;
    let currentTime = this.state.currentTime;
    let url = this.props.audio;
    return (
      <div className="new-player-box">
        {/* 音频控件 */}
        <audio
          className="audio-original"
          ref="audio"
          id="audio"
          src={ url }
          controls
          preload="metadata"
          onLoadedMetadata={ event => this.onloade(event) }
          onTimeUpdate={ event => this.timeUpdate(event) }
        />
        <div className="player-tools">
          <div className="play-control">
            <span
              ref="play"
              className={ cx(!isPlay ? 'play' : 'pause') }
              onClick={ event => this.Play(event) }
            />
          </div>
          <div className="time">
            <p className="text">点击收听客服MM语音解答</p>
            <div id="timeline" ref="timeline"
              className="timeline">
              <div id="playhead" ref="playhead"
                className="playhead" />
            </div>
            <div id="block" ref="block"
              className="block" />
          </div>
          <div className="time-num">
            <span ref="timeCurrent" className="num-current">
              {currentTime}/{' '}
            </span>
            <span ref="timeDuration" className="num-duration">
              {duration}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
