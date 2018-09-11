import React, { PureComponent } from 'react';
import request from '../utils/request';

class AuthContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: 'pending',
      authed: false
    };
    retryTimes = 0;
  }

  componentDidMount () {
    this.checkoutToken();
  }

  componentDidUpdate () {
    if (this.state.status === 'success' && !this.state.authed) {
      // return location.href = '/login/login.html';
      return location.href = '/account.html#/login';
    }
  }

  checkoutToken () {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return this.setState({ status: 'success', authed: false });
    }
    this.setState({ status: 'pending' });
    request.get('/token?token=' + token).then(res => {
      this.setState({ status: 'success', authed: true });
    }).catch(e => {
      if (this.retryTimes < 5) {
        this.checkoutToken();
      } else {
        this.setState({ status: 'fail'});
      }
    })
  }

  render () {
    if (this.state.status === 'pending' || !this.state.authed ) {
      return (<div className="pending">加载中</div>);
    }
    if (this.state.status === 'fail') {
      return (<div className="server-error">服务器繁忙</div>)
    }
    return this.props.children;
  }
}