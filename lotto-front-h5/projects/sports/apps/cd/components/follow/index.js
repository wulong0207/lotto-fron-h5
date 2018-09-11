import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { isLogin, getUser, goLogin } from '@/services/auth';
import cx from 'classnames';
import './follow.scss';

function FollowBtn({ isFollowed, onClick }) {
  if (typeof isFollowed === 'undefined') return null;
  return (
    <button
      className={ cx('follow-button', {
        followed: isFollowed,
        unfollowed: !isFollowed
      }) }
      onClick={ () => onClick() }
    >
      {isFollowed ? '已关注' : '关注'}
    </button>
  );
}

FollowBtn.propTypes = {
  isFollowed: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default class FollowComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollowed: props.isFollowed
    };
    this.pending = false;
  }

  componentDidMount() {
    if (!isLogin()) {
      return this.setState({ isFollowed: false });
    }
    this.getFollowStatus();
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.isFollowed === 'boolean' &&
      nextProps.isFollowed !== this.state.isFollowed
    ) {
      this.setState({ isFollowed: nextProps.isFollowed });
    }
  }

  getFollowStatus(followHandle) {
    const user = getUser();
    // 如果已传过关注状态或者
    // 没有登录或者
    // 登录用户为关注用户
    // 则不请求关注状态
    if (
      typeof this.props.isFollowed === 'boolean' ||
      (typeof this.props.userId !== 'undefined' &&
        user.u_id === this.props.userId)
    ) {
      return undefined;
    }
    const { userIssueId } = this.props;
    api.getFollowStatus(userIssueId).then(res => {
      const isFollowed = Boolean(res.data);
      this.setState({ isFollowed });
      if (typeof followHandle !== 'undefined') {
        followHandle(isFollowed);
      }
    });
  }

  followHandle(isFollowed = this.state.isFollowed) {
    const { userIssueId } = this.props;
    if (!isLogin()) return goLogin();
    if (typeof isFollowed === 'undefined') {
      return this.getFollowStatus(this.followHandle.bind(this));
    }
    if (this.pending) return undefined;
    this.pending = true;
    if (!isFollowed) {
      api.follow(userIssueId).then(res => {
        this.setState({ isFollowed: true });
        this.pending = false;
        this.props.onChange && this.props.onChange(true);
      });
    } else {
      api.follow(userIssueId, 1).then(res => {
        this.setState({ isFollowed: false });
        this.pending = false;
        this.props.onChange && this.props.onChange(false);
      });
    }
  }

  render() {
    return (
      <FollowBtn
        isFollowed={ this.state.isFollowed }
        onClick={ this.followHandle.bind(this) }
      />
    );
  }
}

FollowComponent.propTypes = {
  isFollowed: PropTypes.bool,
  userIssueId: PropTypes.number.isRequired,
  userId: PropTypes.number,
  onChange: PropTypes.func
};
