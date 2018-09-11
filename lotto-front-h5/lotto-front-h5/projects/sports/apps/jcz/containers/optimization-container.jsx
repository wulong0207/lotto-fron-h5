import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  setOptimizationSum,
  setOptimiztionType
} from '../actions/optimization';

class FootOptimizationContainer extends PureComponent {
  componentWillUnmount() {
    this.props.setSum(0);
    this.props.setType('average');
  }

  render() {
    return (
      <div className="foot-ball-optimization-app">{this.props.children}</div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSum(sum) {
      dispatch(setOptimizationSum(sum));
    },
    setType(type) {
      dispatch(setOptimiztionType(type));
    }
  };
};

export default connect(null, mapDispatchToProps)(FootOptimizationContainer);
