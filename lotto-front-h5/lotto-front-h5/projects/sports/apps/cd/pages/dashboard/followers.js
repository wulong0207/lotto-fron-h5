import React, { Component } from 'react';
import { Follower } from '../../types';
import PropTypes from 'prop-types';
import './followers.scss';
import list from '@/component/hoc/list';
import api from '../../services/api';

function FollowerListComponent({ data }) {
  return (
    <div className="follower-list">
      {data.map((follower, index) => {
        return (
          <div className="follower" key={ index }>
            <div className="info">
              <h2>{follower.nickName}</h2>
              <span>关注时间 {follower.focusTime}</span>
            </div>
            <div className="status">
              {parseInt(follower.remark) === 1 ? '已抄单' : '--'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

FollowerListComponent.propTypes = {
  data: PropTypes.arrayOf(Follower)
};

let FollowerList;

export default class Followers extends Component {
  constructor(props) {
    super(props);
    FollowerList = list(this.fetch.bind(this))(FollowerListComponent);
  }

  fetch(page) {
    return new Promise((resolve, reject) => {
      api
        .getFollowers(this.props.id, page)
        .then(res => {
          resolve(res.data);
        })
        .catch(reject);
    });
  }

  static propTypes = {
    id: PropTypes.number.isRequired
  };

  render() {
    return <FollowerList />;
  }
}
