import React, { Component } from 'react';
import { PAGES } from '../constants';
import Tab from '../../../components/tab';
import PropTypes from 'prop-types';

export default class Pages extends Component {
  tabChangeHandle(index) {
    const page = mapIndexToPageName(index);
    this.props.onPageChange && this.props.onPageChange(page);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page && nextProps.page !== this.props.page) {
      this.tab.changeTab(mapPageNamToIndex(nextProps.page), true);
    }
  }

  render() {
    return (
      <div className="header-menu">
        <Tab
          tabs={ PAGES }
          showSwitch={ false }
          onChangeTab={ this.tabChangeHandle.bind(this) }
          index={ mapPageNamToIndex(this.props.page) }
          ref={ tab => (this.tab = tab) }
        />
      </div>
    );
  }
}

Pages.propTypes = {
  page: PropTypes.oneOf(PAGES.map(i => i.page)),
  onPageChange: PropTypes.func
};

Pages.defaultProps = {
  page: PAGES[0].name
};

function mapPageNamToIndex(page) {
  let index = 0;
  for (let i = 0; i < PAGES.length; i++) {
    if (PAGES[i].page === page) {
      index = i;
    }
  }
  return index;
}

function mapIndexToPageName(index) {
  if (index < PAGES.length) {
    return PAGES[index].page;
  }
  return PAGES[0].page;
}
