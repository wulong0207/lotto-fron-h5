import React, { Component } from 'react';
import User from './user';
import page from '@/component/hoc/page';
import Panels from './panels';
import './dashboard.scss';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null
    };
  }

  setUserId(id) {
    this.setState({ id });
  }

  render() {
    return (
      <div>
        <User onGetUserId={ this.setUserId.bind(this) } />
        {this.state.id ? (
          <Panels id={ this.state.id } />
        ) : (
          <div className="empty-receipt-record">暂无发单记录</div>
        )}
      </div>
    );
  }
}

export default page('我的推荐', undefined, undefined, true)(Dashboard);
