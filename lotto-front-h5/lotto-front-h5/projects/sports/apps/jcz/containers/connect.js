import { connect } from 'react-redux';
import { toggleBetting } from '../actions/betting';
import { createSelector } from 'reselect';

const mapDispatchToProps = dispatch => {
  return {
    onSelect: data => {
      dispatch(toggleBetting(data));
    }
  };
};

const pageSelector = state => state.football.page;
const bettingSelector = state => state.footballBettingSelected;
const modeSelector = state => state.footballMix.mode;

const selectedSelector = createSelector(
  [pageSelector, modeSelector, bettingSelector],
  (page, mode, selected) => {
    let category = page;
    if (page === 'mix' && mode !== 'mi') {
      category = mode;
    }
    return selected[category];
  }
);

const mapStateToProps = (type, mode) => (_, initialProps) => state => {
  const { id } = initialProps;
  const bettings = selectedSelector(state);
  const page = state.football.page;
  let selected = [];
  if (page === 'mix' && mode && mode === 'mi') {
    selected = bettings[type][id];
  } else {
    selected = bettings[id];
  }
  return {
    selected: selected
  };
};

export default (type = 'wdf', Component, mode) => {
  return connect(mapStateToProps(type, mode), mapDispatchToProps, null, {
    pure: true
  })(Component);
};
