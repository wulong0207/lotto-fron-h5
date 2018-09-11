import React, { Component } from 'react';
import '../css/specialist.scss';
import { Link } from 'react-router';

export default class Specialist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getspecialist() {
    let data = this.props.data;
    return data.map((row, index) => {
      return (
        <Link to={ `/experts/${row.id}` } key={ row.id }
          className="skip">
          <li className="specialistBox">
            <img
              src={
                row.headUrl ? row.headUrl : require('../../../img/default.png')
              }
            />
            <p className="percentage">{row.bonusRate ? row.bonusRate : ''}</p>
            <p className="txt">盈利率</p>
          </li>
        </Link>
      );
    });
  }

  render() {
    return (
      <div className="specialist">
        <div className="title">
          <p className="txt">专家推荐</p>
          <Link to="/experts" className="link">
            <span className="arrow" />
          </Link>
        </div>
        {this.props.data.length ? (
          <div className="contentBox">
            <ul className="content">{this.getspecialist()}</ul>
          </div>
        ) : (
          <div className="contentBox">
            <div className="content_null">暂无数据</div>
          </div>
        )}
      </div>
    );
  }
}
