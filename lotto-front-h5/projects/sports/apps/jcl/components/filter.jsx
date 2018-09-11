import React from 'react';
import { formatShortDateStr } from '../utils';
import { connect } from 'react-redux';
import Modal from './modal';
import {
  toggleFilter,
  changeFilterType,
  changeFilter
} from '../redux/actions/basketball';
import { getCurrentMode, getCurrentStore } from '../utils/basketball';
import { FILTER_FUNCS } from '../constants';
import { filterMatch, filterFinal } from '../../../filter';
import Filter from '../../../components/filter';
import { checkSell } from '../pages/common/gameHelper';

// 过滤赛事
export function filterData(data) {
  let mode = getCurrentMode();
  let filter = getCurrentStore().basketball.filter[mode];

  return filterFinal(data, filter, FILTER_FUNCS[mode]);
}

class FilterComponent extends Filter {
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
        klass={ ['basketball-page-filter'] }
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

export const filterMathOne = data => {
  data = data || [];
  let mode = getCurrentMode();

  if (data.length === 1) {
    let item = data[0];
    let sell = true;
    switch (mode) {
      case 'sf':
        sell = item.statusWf === 1;
        break;
      // case 'sfc':
      //   sell = item.statusScoreWf === 1;
      //   break;
      case 'dxf':
        sell = item.statusBigSmall === 1;
        break;
      case 'rfsf':
        sell = item.statusLetWf === 1;
        break;
      // default:
      //   sell = checkSell('single', item);
    }

    if (!sell) data = [];
  }

  return data;
};

const mapStateToProps = (state, props) => {
  let filterFunc = FILTER_FUNCS[getCurrentMode()];

  return {
    filter: state.basketball.filter,
    show: state.basketball.showFilter,
    type: state.basketball.filterType,
    name: state.basketball.page,
    funcs: filterFunc.funcs,
    markObj: filterMatch(filterMathOne(state.basketball.data), filterFunc)
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
