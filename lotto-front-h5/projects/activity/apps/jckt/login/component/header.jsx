import React, { Component } from 'react';
import '../css/header.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="header">
        <div className="title">{this.props.title}</div>
        <div className="close" />
      </div>
    );
  }
}
Header.defaultProps = {
  title: '账号登陆'
};
