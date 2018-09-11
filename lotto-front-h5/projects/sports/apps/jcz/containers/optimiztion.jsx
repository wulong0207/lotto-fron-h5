import React, { PureComponent } from 'react';
import OptimizationComponent from '../components/optimization.jsx';
import PropTypes from 'prop-types';
import connect from './betting';
import {
  setOptimizationSum,
  setOptimiztionType
} from '../actions/optimization';
import OrderComponent from '../components/order.jsx';

class OptimizationContainer extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.betting.betNum) {
      window.location.replace('/jczq.html');
    }
  }

  goBack() {
    window.location.href = '/jczq.html';
  }

  render() {
    return (
      <div>
        <OptimizationComponent
          betting={ this.props.betting }
          sum={ this.props.sum }
          type={ this.props.type }
          setType={ this.props.setType.bind(this) }
          setSum={ this.props.setSum.bind(this) }
          submitOrder={ this.props.submitOrder.bind(this) }
          orderStatus={ this.props.orderStatus }
        />
        <OrderComponent onClose={ this.goBack.bind(this) } />
      </div>
    );
  }
}

OptimizationContainer.propTypes = {
  betting: PropTypes.object.isRequired
};

// const pageSelector = state => state.football.page;
// const modeSelector = state => state.footballMix.mode;
// const bettingsSelector = state => state.footballBettings;
//
// const getBettingSelector = createSelector(
//   [pageSelector, modeSelector, bettingsSelector],
//   (page, mode, bettings) => {
//     let name = page;
//     if (page === 'mix' && mode !== 'mi') {
//       name = mode;
//     }
//     const betting = bettings.filter(b => b.name === name)[0]
//     return betting ? betting : {}
//   }
// );

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

const mapStateToProps = state => {
  return {
    sum: state.optimization.sum,
    type: state.optimization.type,
    orderStatus: state.footballOrders.status
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  OptimizationContainer
);
