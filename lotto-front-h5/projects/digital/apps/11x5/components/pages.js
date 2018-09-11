import React, { Component } from 'react';
import PageConfig from '../constants/pages';
import Tab from '../../../components/tab';
import PropTypes from 'prop-types';

export default class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tabChangeHandle(index) {
    const page = mapIndexToPageName(index);
    this.props.onChange && this.props.onChange(page);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page && nextProps.page !== this.props.page) {
      this.tab.changeTab(mapPageNamToIndex(nextProps.page), true);
    }
  }

  render() {
    let pages = this.props.pages;
    return (
      <div className="header-menu">
        <Tab
          tabs={ pages }
          showSwitch={ true }
          onChangeTab={ this.tabChangeHandle.bind(this) }
          index={ mapPageNamToIndex(this.props.page) }
          ref={ tab => (this.tab = tab) }
        />
      </div>
    );
  }
}
let p = PageConfig.page().tab;
Pages.propTypes = {
  page: PropTypes.string,
  onPageChange: PropTypes.func
};

Pages.defaultProps = {
  page: p[0].name
};

function mapPageNamToIndex(page) {
  let index = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i].page === page) {
      index = i;
    }
  }
  return index;
}

function mapIndexToPageName(index) {
  if (index < p.length) {
    return p[index].page;
  }
  return p[0].page;
}
