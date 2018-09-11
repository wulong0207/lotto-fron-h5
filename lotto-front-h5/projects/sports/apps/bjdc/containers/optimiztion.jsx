import React, { PureComponent } from 'react';
import OptimizationComponent from '../components/optimization.jsx';
import PropTypes from 'prop-types';
import connect from './betting';
import {
  setOptimizationSum,
  setOptimiztionType
} from '../redux/actions/optimization';
// import OrderComponent from '../components/order.jsx';

class OptimizationContainer extends PureComponent {
  constructor(props) {
    super(props);

    if (this.checkInvalid(props)) {
      window.location.replace('/jcl.html');
    }
  }

  goBack() {
    window.location.href = '/jcl.html';
  }

  checkInvalid(props) {
    return !props.betting.betNum || !props.latestEndSaleDate;
  }

  render() {
    if (this.checkInvalid(this.props)) {
      return <div />;
    }

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
      </div>
    );
  }
}

OptimizationContainer.propTypes = {
  betting: PropTypes.object.isRequired,
  sum: PropTypes.any,
  type: PropTypes.any,
  orderStatus: PropTypes.any,
  setType: PropTypes.func,
  setSum: PropTypes.func,
  submitOrder: PropTypes.func
};

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
    orderStatus: state.order.status
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  OptimizationContainer
);
