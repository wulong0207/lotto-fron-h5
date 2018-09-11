import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './pagination.scss';

export default class Pagination extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page || 1
    };
  }

  static propTypes = {
    page: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
    hasNextPage: PropTypes.bool,
    isPending: PropTypes.bool
  };

  static defaultProps = {
    pageSize: 10,
    hasNextPage: true,
    isPending: false
  };

  nextPageHandle() {
    if (this.props.isPending) return undefined;
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.onChange && this.props.onChange(page);
  }

  render() {
    if (!this.props.hasNextPage) return null;
    return (
      <div className="load-more">
        <button
          className="load-more-button"
          onClick={ this.nextPageHandle.bind(this) }
        >
          加载更多
        </button>
      </div>
    );
  }
}
