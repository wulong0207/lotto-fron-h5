import React, { PureComponent } from 'react';
import CombinationsComponent from '../components/combination.jsx';
import connect from './betting';
import PropTypes from 'prop-types';
import { TYPES } from '../constants/optimization';
import Optimization from '../services/optimization';
// import OrderComponent from '../components/order.jsx';

class CombinationsConainter extends PureComponent {
  constructor(props) {
    super(props);

    if (this.checkInvalid(props)) {
      location.replace('/jclq.html');
      return;
    }
    this.op = new Optimization(props.betting);
  }

  checkInvalid(props){
    return !props.betting.betNum || !props.latestEndSaleDate|| !props.latestEndSaleDate;
  }

  goBack() {
    location.href = '/jclq.html';
  }

  render() {
    const { type, sum, betting } = this.props;
    if (this.checkInvalid(this.props)) {
      return (
        <div></div>
      );
    }
    let combinations = [];
    if (type === 'average') {
      combinations = this.op.average(sum);
    } else if (type === 'heat') {
      combinations = this.op.heat(sum);
    } else if (type ==='cold') {
      combinations = this.op.cold(sum);
    }
    return (
      <div>
        <CombinationsComponent
          type={type}
          combinations={combinations}
          betting={ this.props.betting }
          submitOrder={ this.props.submitOrder.bind(this) }
          orderStatus={ this.props.orderStatus }
        />
        {/*<OrderComponent
          onClose={ this.goBack.bind(this) }
        />*/}
      </div>
    );
  }
}

CombinationsConainter.propTypes = {
  type: PropTypes.oneOf(TYPES.map(i => i.name))
};

const mapStateToProps = state => {
  return {
    sum: state.optimization.sum,
    // orderStatus: state.footballOrders.status
  }
};

export default connect(mapStateToProps, null, CombinationsConainter);


