import React from 'react';
import { formatShortDateStr } from '../utils';
import { connect } from 'react-redux';
import Modal from './modal';
import {
  toggleFilter,
  changeFilterType,
  changeFilter
} from '../actions/football';
import {
  getCurrentMode,
  getCurrentStore,
  filterFuncs
} from '../utils/football';
import { filterMatch, filterFinal } from '../../../filter';
import Filter from '../../../components/filter';

// 过滤赛事
export function filterData(data) {
  let mode = getCurrentMode();
  let filter = getCurrentStore().football.filter[mode];

  return filterFinal(data, filter, filterFuncs[mode]);
}

class FilterComponent extends Filter {
  constructor(props) {
    super(props);
    this.lotteryCode = 300;
  }

  componentDidMount() {
    super.componentDidMount();
    let { filter } = this.props;
    let mode = getCurrentMode();
    this.setState(filter[mode] || {});
  }

  formatShortDateStr(key) {
    return formatShortDateStr(key);
  }

  render() {
    return (
      <Modal
        klass={ ['football-page-filter'] }
        ref={ pop => (this.pop = pop) }
        modal={ true }
        onOpen={ this.onOpen.bind(this) }
        onClose={ this.onClose.bind(this) }
      >
        {this.renderFilterContent()}
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  let filterFunc = filterFuncs[getCurrentMode()];

  return {
    filter: state.football.filter,
    show: state.football.showFilter,
    type: state.football.filterType,
    name: state.football.page,
    pageData: state.football.data,
    funcs: filterFunc.funcs,
    markObj: filterMatch(state.football.data, filterFunc)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    change(filter) {
      dispatch(changeFilter(filter));
    },
    toggle() {
      dispatch(toggleFilter());
    },
    changeFilterType(type) {
      dispatch(changeFilterType(type));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(FilterComponent);
