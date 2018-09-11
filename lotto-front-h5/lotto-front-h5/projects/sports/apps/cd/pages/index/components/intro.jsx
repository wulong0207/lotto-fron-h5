import React, { Component } from 'react';
import '../css/intro.scss';

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getintro() {
    let introMes = this.props.introMes || [];
    return introMes.map((row, index) => {
      return (
        <a href={ row.skipHref } key={ index }
          className="introMes">
          <div className="introBox">
            <img src={ row.imgSrc } />
            <p className="label">{row.label}</p>
          </div>
        </a>
      );
    });
  }

  render() {
    return <div className="intro">{this.getintro()}</div>;
  }
}

Intro.defaultProps = {
  introMes: [
    {
      skipHref: '#/follows',
      imgSrc: require('../../../img/ic_dynamics.png'),
      label: '关注动态'
    },
    {
      skipHref: '#/receipts',
      imgSrc: require('../../../img/ic_Real single.png'),
      label: '实单方案'
    },
    {
      skipHref: '/jczq.html',
      imgSrc: require('../../../img/ic_posted.png'),
      label: '发布方案'
    },
    {
      skipHref: '#/dashboard',
      imgSrc: require('../../../img/ic_Push.png'),
      label: '我的推单'
    }
  ]
};
