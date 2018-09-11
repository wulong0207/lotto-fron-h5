import { connect } from 'react-redux';
import { singleBettingToggle, singleBettingClear } from '../../actions/mix';

const mapBettingStateToProps = type => (_, initialProps) => state => {
  const id = state.footballMix.detailMatchId;
  const singleSelected = state.footballMixSingle[id]
    ? state.footballMixSingle[id][type] || []
    : [];
  const selectedBefore = state.footballBettingSelected.mix[type]
    ? state.footballBettingSelected.mix[type][id] || []
    : [];
  return {
    selected: singleSelected.concat(selectedBefore)
  };
};

const mapBettingDispatchToProps = dispatch => {
  return {
    onSelect(data) {
      dispatch(singleBettingToggle(data));
    },
    clear(id) {
      dispatch(singleBettingClear(id));
    }
  };
};

export default (type, Component) => {
  return connect(
    mapBettingStateToProps(type),
    mapBettingDispatchToProps,
    null,
    { pure: true }
  )(Component);
};
