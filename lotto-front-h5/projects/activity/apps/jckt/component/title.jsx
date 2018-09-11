import React, { Component } from 'react';
import '../css/title.scss';

export default class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="title" />;
  }
}

Title.defaultProps = {};
