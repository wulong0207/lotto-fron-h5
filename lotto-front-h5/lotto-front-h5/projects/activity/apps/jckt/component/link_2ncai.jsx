import React, { Component } from 'react';
import '../css/link_2ncai.scss';

export default class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="link_2ncai">
        <a href={ this.props.linkUrl } className="link">
          进入2N彩票首页
        </a>
      </div>
    );
  }
}

Link.defaultProps = {
  linkUrl: '/'
};
