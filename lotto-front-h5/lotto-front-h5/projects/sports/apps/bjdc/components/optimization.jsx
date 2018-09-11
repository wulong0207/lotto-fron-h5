import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { groupArrayByKey } from '../utils';
import NumberInput from '../components/number-input.jsx';
import Optimization from '../services/optimization';
import cx from 'classnames';
import { Link } from 'react-router';
import Alert from '@/services/message';

const StatusBar = ({ ggType, selected }) => {
  return (
    <div className="status-bar">
      <p>
        <span>已选{groupArrayByKey(selected, 'id').length}场比赛</span>
        <span>
          {ggType
            .map(i => i.split('*')[0])
            .sort((a, b) => a - b)
            .map(g => {
              return <span key={ g }>{`${g}`}</span>;
            })}
        </span>
      </p>
    </div>
  );
};

StatusBar.propTypes = {
  ggType: PropTypes.any,
  selected: PropTypes.any
};

const BettingBar = ({ combinations, submitOrder, orderStatus }) => {
  const betNum = combinations.reduce((acc, c) => acc + c.times, 0);
  return (
    <div className="betting-bar">
      <div className="total-summary">
        <div className="total-money-summary">
          {/* <div className="total-money-range">
            <h5>奖金范围</h5>
            <p>{ new Decimal(min).toFixed(2) }~{ new Decimal(max).toFixed(2) }元</p>
          </div> */}
          <div className="total-bet-num">
            <h5 className="total">
              共<i>{betNum * 2}</i>元
            </h5>
          </div>
        </div>
        <button
          className="order-btn"
          onClick={ () => submitOrder(combinations) }
          disabled={ orderStatus === 'pending' }
        >
          {orderStatus === 'pending' ? '处理中' : '立即投注'}
        </button>
      </div>
    </div>
  );
};

BettingBar.propTypes = {
  combinations: PropTypes.any,
  submitOrder: PropTypes.any,
  orderStatus: PropTypes.any
};

export default class OptimizationComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.op = new Optimization(props.betting);
    this.numberInput = undefined;
  }

  componentDidMount() {
    const { betting } = this.props;
    const sum = betting.betNum * 2 * betting.times;
    if (sum && !this.props.sum) {
      this.props.setSum(sum);
    }
  }

  shouldComponentUpdate(newProps) {
    if (!newProps.betting.selected.length) return false;
    return true;
  }

  onSumChange(sum) {
    if (sum % 2) {
      const fn = () => {
        const { betting } = this.props;
        let num;
        const min = betting.betNum * 2 * betting.times;
        const max = 500000;
        if (sum + 1 < min) {
          num = min;
        } else if (sum + 1 > max) {
          num = max;
        } else {
          num = sum + 1;
        }
        this.props.setSum(num);
        // this.numberInput.openKeyboard();
        // this.numberInput.change(this.props.sum);
      };
      return Alert.alert({ msg: '投注金额必须为偶数', btnFn: [fn] });
    }
    this.props.setSum(sum);
  }

  setOptimizeType(type, disabled) {
    if (disabled || type === this.props.type) return undefined;
    this.props.setType(type);
  }

  submitOrder(combinations) {
    if (this.props.orderStatus === 'pending') return undefined;
    if (!this.props.betting.selected.length) {
      return window.location.replace('/jcl.html');
    }
    this.props.submitOrder(this.props.betting, combinations, 1);
  }

  render() {
    const { betting, sum, type } = this.props;
    if (!betting || !betting.betNum || !sum) {
      return <div className="invalid" />;
    }
    // 是否能进行博冷或搏热优化，选择的场次等于过关方式
    const optimizeAvailable =
      betting.ggType.length === 1 &&
      betting.ggType[0].split('串')[0] / 1 ===
        groupArrayByKey(betting.selected, 'id').length;
    let average, heat, cold;
    average = this.op.combinations;
    if (sum === betting.betNum * 2) {
      average = this.op.combinations;
      if (optimizeAvailable) {
        heat = this.op.combinations;
        cold = this.op.combinations;
      }
    } else {
      average = this.op.average(sum);
      if (optimizeAvailable) {
        heat = this.op.heat(sum);
        cold = this.op.cold(sum);
      }
    }
    let combinations = average;
    if (type === 'heat') {
      combinations = heat;
    } else if (type === 'cold') {
      combinations = cold;
    }
    return (
      <div className="football-optimization">
        <StatusBar { ...this.props.betting } />
        <div className="amount-money">
          <h5>计划购买金额</h5>
          <NumberInput
            number={ this.props.sum }
            min={ betting.betNum * 2 * betting.times }
            max={ 500000 }
            messages={ {
              max: '本次计划购买金额不能大于500000元',
              min: `本次计划购买金额至少为${this.props.betting.betNum *
                2 *
                this.props.betting.times}元`
            } }
            step={ 2 }
            ref={ input => (this.numberInput = input) }
            onChange={ this.onSumChange.bind(this) }
          />
        </div>
        <div className="average optimization-item">
          <div
            className={ cx('optimization-title', {
              selected: type === 'average'
            }) }
            onClick={ this.setOptimizeType.bind(this, 'average', false) }
          >
            <h5>平均优化</h5>
            <span>单注理论奖金趋于一致</span>
          </div>
          <Link to="/optimization/average">
            <div className="optimization-range">
              <span>奖金明细</span>
              {/* <span className="money-range"> */}
              {/* <i>{ Math.min(...average.map(i => parseFloat(i.money)))}~{ Math.max(...average.map(i => parseFloat(i.money)))}</i> */}
              {/* </span> */}
            </div>
          </Link>
        </div>
        <div
          className={ cx('heat', 'optimization-item', {
            disabled: !optimizeAvailable
          }) }
        >
          <div
            className={ cx('optimization-title', { selected: type === 'heat' }) }
            onClick={ this.setOptimizeType.bind(
              this,
              'heat',
              !optimizeAvailable
            ) }
          >
            <h5>博热优化</h5>
            <span>概率最高注奖金最大化，其他注保本</span>
          </div>
          {optimizeAvailable ? (
            <Link to="/optimization/heat">
              <div className="optimization-range">
                <span>奖金明细</span>
                {/* <span className="money-range"> */}
                {/* <i>{ Math.min(...heat.map(i => parseFloat(i.money)))}~{ Math.max(...heat.map(i => parseFloat(i.money)))}</i> */}
                {/* </span> */}
              </div>
            </Link>
          ) : (
            ''
          )}
        </div>
        <div
          className={ cx('cold', 'optimization-item', {
            disabled: !optimizeAvailable
          }) }
        >
          <div
            className={ cx('optimization-title', { selected: type === 'cold' }) }
            onClick={ this.setOptimizeType.bind(
              this,
              'cold',
              !optimizeAvailable
            ) }
          >
            <h5>博冷优化</h5>
            <span>回报最高注奖金最大化，其他注保本</span>
          </div>
          {optimizeAvailable ? (
            <Link to="/optimization/cold">
              <div className="optimization-range">
                <span>奖金明细</span>
                {/* <span className="money-range"> */}
                {/* <i>{ Math.min(...cold.map(i => parseFloat(i.money)))}~{ Math.max(...cold.map(i => parseFloat(i.money)))}</i> */}
                {/* </span> */}
              </div>
            </Link>
          ) : (
            ''
          )}
        </div>
        <BettingBar
          combinations={ combinations }
          submitOrder={ this.submitOrder.bind(this) }
          orderStatus={ this.props.orderStatus }
        />
      </div>
    );
  }
}

OptimizationComponent.propTypes = {
  betting: PropTypes.object,
  sum: PropTypes.number.isRequired,
  setSum: PropTypes.func.isRequired,
  orderStatus: PropTypes.string,
  setType: PropTypes.func,
  submitOrder: PropTypes.func,
  type: PropTypes.string
};
