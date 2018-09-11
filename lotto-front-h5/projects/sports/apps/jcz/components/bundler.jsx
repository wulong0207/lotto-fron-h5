/*
过关方式
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { groupArrayByKey } from '../utils';
import {
  toggleGGType,
  setBettingCourage,
  setBettingGGtype
} from '../actions/betting';
import _ from 'lodash';
import cx from 'classnames';
import Alert from '@/services/message';
import Modal from './modal.jsx';
import analytics from '@/services/analytics';

class FootballBundler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }

  setCourage(number) {
    const length = number - 1;
    let courage = this.props.betting.courage.concat();
    courage = courage.slice(courage.length - length);
    this.props.setBettingCourage(this.props.betting.name, courage);
    this.props.setBettingGGtype(this.props.betting.name, this.state.selected);
    this.toggle();
  }

  toggle() {
    if (this.props.betting.maxGGTypes <= 1) return undefined;
    this.modal.toggle();
  }

  onOpen() {
    this.setState({ selected: this.props.betting.ggType });
  }

  onClose() {
    this.setState({ selected: [] });
  }

  onChoose(number) {
    const value = number + '*1';
    let selected = [...this.state.selected];
    if (selected.indexOf(value) > -1) {
      selected = selected.filter(s => s !== value);
    } else {
      selected.push(value);
    }
    this.setState({ selected });
  }

  setTyppe(number) {
    if (!this.state.selected.length) return this.toggle();
    const { ggType, courage } = this.props.betting;
    // 最小的过关方式
    const min = this.state.selected
      .map(s => s.split('*')[0])
      .sort((a, b) => a - b)[0];
    // 最小的过关方式是否合法 过关方式不得小于等于 胆码 个数
    if (min <= courage.length) {
      const content = (
        <div className="football-alert-tips">
          <p>你当前选择{courage.length}个胆码</p>
          <p>不能选择{min}串1的过关方式</p>
        </div>
      );
      const btnTxt = ['取消', '去掉胆码'];
      const btnFn = [null, this.setCourage.bind(this, min)];
      return Alert.alert({ children: content, btnFn, btnTxt });
    }
    this.props.setBettingGGtype(this.props.betting.name, this.state.selected);
    analytics.send(this.state.selected.map(() => 211308));
    this.toggle();
  }

  renderOptionsTable() {
    const max = this.props.betting.maxGGTypes;
    if (max < 1) {
      return <div style={ { display: 'none' } } />;
    }
    let table = [];
    if (max === 1) {
      if (this.props.betting.ggLabel === '单关') {
        table.push(1);
      } else {
        // table.push(0);
      }
    } else {
      for (let i = 2; i <= max; i++) {
        table.push(i);
      }
    }
    table = _.chunk(table, 3);
    const getLable = cell => {
      if (cell === 0) return '单场致胜';
      if (cell === 1) return '单关';
      return cell + '串1';
    };
    return (
      <Modal
        ref={ modal => (this.modal = modal) }
        klass={ ['pass-way-modal'] }
        onOpen={ this.onOpen.bind(this) }
        onClose={ this.onClose.bind(this) }
      >
        <section className="pass-way">
          {table.map((row, index) => {
            return (
              <div key={ index } className="bundle-row">
                {row.map((cell, idx) => {
                  return (
                    <div className="bundle-cell" key={ cell }>
                      <span
                        className={ cx({
                          'grid-sel':
                            this.state.selected.indexOf(cell + '*1') > -1
                        }) }
                        onClick={ this.onChoose.bind(this, cell) }
                      >
                        {getLable(cell)}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
        <div className="opera-btn">
          <button className="cancel" onClick={ this.toggle.bind(this) }>
            取消
          </button>
          <button className="makesure" onClick={ this.setTyppe.bind(this) }>
            确定
          </button>
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        <div onClick={ this.toggle.bind(this) } className="ggtype-component">
          <span>{this.props.betting.ggLabel}</span>
          {this.props.betting.ggType.length ? (
            <span className="dot-tips" />
          ) : (
            ''
          )}
          {groupArrayByKey(this.props.matchs, 'id').length > 1 ? (
            <span className="round-num">
              {groupArrayByKey(this.props.matchs, 'id').length}
            </span>
          ) : (
            ''
          )}
        </div>
        {this.renderOptionsTable()}
      </div>
    );
  }
}

FootballBundler.propTypes = {
  betting: PropTypes.object.isRequired,
  matchs: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return {
    data: state.football.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setBettingCourage(name, courage) {
      dispatch(setBettingCourage(name, courage));
    },
    toggleGGType(name, type) {
      dispatch(toggleGGType(name, type));
    },
    setBettingGGtype(name, types) {
      dispatch(setBettingGGtype(name, types));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FootballBundler);
