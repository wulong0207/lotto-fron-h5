import React, { Component } from 'react';
import Tab from '../tab';
import PropTypes from 'prop-types';
import emitter from '../../helpers/event-emitter';
import { NUMBER_CHILD_LOTTERY_CHANGE } from '../../helpers/event-types';

export default class Pages extends Component {
  tabChangeHandle(index) {
    const page = mapIndexToPageName(index, this.props.pages);
    this.props.onChange && this.props.onChange(page.page);
    emitter.emit(NUMBER_CHILD_LOTTERY_CHANGE, page.page, page.lotteryChildCode);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page && nextProps.page !== this.props.page) {
      this.tab.changeTab(
        mapPageNamToIndex(nextProps.page, this.props.pages),
        true
      );
    }
  }

  render() {
    return (
      <div className="header-menu">
        <Tab
          tabs={ this.props.pages }
          showSwitch={ this.props.showSwitch }
          onChangeTab={ this.tabChangeHandle.bind(this) }
          index={ mapPageNamToIndex(this.props.page, this.props.pages) }
          ref={ tab => (this.tab = tab) }
        />
      </div>
    );
  }
}

Pages.propTypes = {
  page: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      desc: PropTypes.string,
      page: PropTypes.string.isRequired,
      lotteryChildCode: PropTypes.number
    })
  ),
  showSwitch: PropTypes.bool
};

Pages.defaultProps = {
  showSwitch: true
};

function mapPageNamToIndex(page, pages) {
  let index = 0;
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].page === page) {
      index = i;
    }
  }
  return index;
}

function mapIndexToPageName(index, pages) {
  if (index < pages.length) {
    return pages[index];
  }
  return pages[0];
}
