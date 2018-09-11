import React, { PureComponent } from 'react';
import NumberInput from './number-input.jsx';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import cx from 'classnames';

const CombinationsTable = props => {
  const onChange = (value, id) => {
    if (props.onTimesChange) props.onTimesChange(value, id)
  };
    const maxInfo = props.betting.maxInfo || {};
    const multiple = maxInfo.betNum || 50000;

  return (
    <table>
      <tbody>
        <tr>
          <th>过关方式</th>
          <th>单注组合</th>
          <th>倍数</th>
          <th>理论奖金</th>
        </tr>
        {
          props.combinations.map(c => {
            return (
              <tr key={ c._id }>
                <td>{c.combinations.length + '串1'}</td>
                <td>
                  {
                    c.combinations.map(m => {
                      return (
                        <div className="match-label" key={ `${m.id}-${m.type}-${m.value}` }>
                          <div className="team-name">{ m.teamName }</div>
                          <div className="label">{ m.label }<br/>{ m.sp }</div>
                        </div>
                      )
                    })
                  }
                </td>
                <td>
                  <NumberInput
                    number={c.times}
                    min={ props.combinations.length === 1 ? 1 : 0 }
                    max={ multiple }
                    onChange={ value => onChange(value, c._id) }
                    messages={{max: '最大为'+multiple+'倍'}}
                  />
                </td>
                <td><i>{ c.money }</i></td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
};

CombinationsTable.propTypes = {
  combinations: PropTypes.array.isRequired,
  onTimesChange: PropTypes.func
};

class BettingBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      times: 1
    }
  }

  setTimes(times) {
    this.setState({ times });
  }

  render() {
    const { combinations,betting } = this.props;
    // const moneyList = combinations.map(c => parseFloat(c.money));
    // const max = Math.max(...moneyList);
    // const min = Math.min(...moneyList);
    const betNum = combinations.reduce((acc, c) => acc + c.times, 0);
    const { times } = this.state;
    const maxInfo = betting.maxInfo || {};
    const multiple = maxInfo.multiple || 50000;
    return (
      <div className="betting-bar">
        <div className="times-input">
          <div className="money-range">
            <h5>倍数</h5>
            {/*<p>单倍奖金范围{ min }~{ max }元</p>*/}
          </div>
          <NumberInput
            onChange={ this.setTimes.bind(this) }
            min={1}
            max={ multiple }
            messages={{
              max: '总倍数不能大于'+multiple+'倍',
            }}
          />
        </div>
        <div className="total-summary">
          <div className="total-money-summary">
            {/*<div className="total-money-range">*/}
              {/*<h5>奖金范围</h5>*/}
              {/*<p>{ new Decimal(min).times(times).toFixed(2) }~{ new Decimal(max).times(times).toFixed(2) }元</p>*/}
            {/*</div>*/}
            <div className="total-bet-num">
              <p><i>{ betNum * 2 * times }元</i></p>
              <p>={ betNum * 2 }元x{ times }倍</p>
            </div>
          </div>
          <button
            className="order-btn"
            onClick={ this.props.submitOrder.bind(this, combinations, times)}
            disabled={ this.props.orderStatus === 'pending' }
          >{ this.props.orderStatus === 'pending' ? '处理中' : '立即投注' }</button>
        </div>
      </div>
    )
  }
}

BettingBar.propTypes = {
  combinations: PropTypes.array.isRequired
};

class CombinationsComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      combinations: props.combinations,
      show: true,
      ready: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ ready: true })
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ combinations: nextProps.combinations });
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.combinations || !nextProps.combinations.length) return false;
    return this.state.show;
  }

  submitOrder(combinations, times) {
    if (this.props.orderStatus === 'pending') return undefined;
    if (!this.props.combinations || !this.props.combinations.length) {
      alert('重复订单');
      return location.replace('/jclq.html');
    }
    const combs = combinations.filter(c => c.times > 0);
    this.props.submitOrder(this.props.betting, combs, times)
  }

  toggle() {
    this.setState({ show: !this.state.show });
  }

  onTimeChange(value, id) {
    const combinations = this.state.combinations.map(c => {
      if (c._id !== id) return c;
      return {
        ...c,
        times: value,
        money: new Decimal(c.sp).times(value).toFixed(2)
      }
    });
    this.setState({ combinations });
  }

  render() {
    if (typeof this.props.combinations === 'undefined') {
      return (<div />);
    }
    if (!this.state.ready) return (
      <div style={{textAlign: 'center', padding: '100px', fontSize: '28px', color: '#999'}}>加载中...</div>
    );
    return (
      <div className={'combinations-page '+ this.props.type }>
        <div className="combinations-table">
          <CombinationsTable
            betting = {this.props.betting}
            combinations={ this.state.combinations }
            onTimesChange={ this.onTimeChange.bind(this) }
          />
        </div>
        <BettingBar
          betting = {this.props.betting}
          combinations={ this.state.combinations }
          submitOrder={ this.submitOrder.bind(this) }
          orderStatus={ this.props.orderStatus }
        />
      </div>
    )
  }
}

CombinationsComponent.propTypes = {
  combinations: PropTypes.array,
  type: PropTypes.string.isRequired,
  // orderStatus: PropTypes.string.isRequired
};

export default CombinationsComponent;
