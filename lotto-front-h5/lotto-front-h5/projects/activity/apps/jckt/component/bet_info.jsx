import React, { Component } from 'react';
import BetInfoList from '../component/bet_info_list.jsx';
import '../css/bet_info.scss';

export default class BetInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="betInfo">
        {this.props.deadline ? (
          <div className="stopTime">投注截止时间: {this.props.deadline}</div>
        ) : (
          ''
        )}
        <BetInfoList />
      </div>
    );
  }
}

BetInfo.defaultProps = {};
