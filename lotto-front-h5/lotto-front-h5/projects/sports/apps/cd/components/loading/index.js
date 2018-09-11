import React, { Component } from 'react';
import './loading.scss';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0
    };
  }

  onPageIndexChange() {
    let index = this.state.pageIndex + 1;
    this.setState({ pageIndex: index });

    if (this.props.onPageIndexChange) {
      this.props.onPageIndexChange(index);
    }
  }

  render() {
    return (
      <div className="loadingMore" onClick={ this.onPageIndexChange.bind(this) }>
        点击加载更多
      </div>
    );
  }
}
