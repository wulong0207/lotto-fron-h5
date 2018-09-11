import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../css/lottoDetail/load.scss';

function LoadMore({ hasMoreCount, loadMore }) {
  return (
    <div className="load-more" onClick={ loadMore }>
      <span>还有{hasMoreCount}个方案</span>
      <i className="icon-arrow-d-grey" />
    </div>
  );
}

LoadMore.propTypes = {
  hasMoreCount: PropTypes.number,
  loadMore: PropTypes.func
};
export default LoadMore;
