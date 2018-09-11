import React, { Component } from 'react';
import { Link } from 'react-router';
import '../css/tools/list.scss';
import PropTypes from 'prop-types';

export class LinkList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  connect(e, target, txt) {
    if (txt === '联系客服') {
      window.open(target);
    } else if (txt === '我的推荐') {
      window.location.href = target;
    } else if (txt === '消息中心') {
      window.location.href = target;
    } else if (txt === '帮助中心') {
      window.location.href = target;
    } else {
      window.location.hash = target;
    }
  }
  render() {
    var links = this.props.links || [];
    return (
      <div className="linklist-box">
        <ul>
          {links.map((e, i) => {
            return (
              <li className="linklist-item" key={ i }>
                <div
                  className="link"
                  onClick={ event => this.connect(event, e.target, e.txt) }
                >
                  {e.icon ? <img src={ e.icon } /> : ''}
                  <span>{e.txt}</span>
                  <span className="pull-r">{e.tip}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
LinkList.defaultPrpos = {
  links: []
};
// LinkList.propTypes = {
//   onClick: PropTypes.func
// };
