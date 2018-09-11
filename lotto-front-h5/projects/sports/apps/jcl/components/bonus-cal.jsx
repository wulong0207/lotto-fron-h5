import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/bonus-cal.scss';

import { toggleBonusCal } from '../redux/actions/bet.js';
import { getCurrentMode } from '../utils/basketball.js';
import { connect } from 'react-redux';

// 奖金计算器
class BonusCal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.fieldSet = {
      titles: ['命中场数', '最小奖金', '最大奖金']
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  show() {
    this.props.toggle(null, null);
  }

  render() {
    let { showMode, betSelected } = this.props;
    let mode = getCurrentMode();
    let titleArea;
    let valueArea = [];
    let fieldItem = this.fieldSet;
    if (fieldItem) {
      titleArea = fieldItem.titles.map((val, index) => {
        return (
          <li key={ index } className="flex">
            {val}
          </li>
        );
      });
      let hitObj = betSelected.betCalc[mode].hitObj;
      valueArea = hitObj.list.map((val, i) => {
        let hitItem = hitObj[val];
        return (
          <ul key={ i } className="data-list data">
            <li className="flex">{hitItem.hitNum}</li>
            <li className="flex">{hitItem.minObj.bonus}</li>
            <li className="flex">{hitItem.maxObj.bonus}</li>
          </ul>
        );
      });
    }

    return (
      <div className="bonus-cal">
        <div className="take-position" onClick={ this.show.bind(this) } />
        <div className="dead-line" onClick={ this.show.bind(this) }>
          <div className="txt" />
          <div className="close" />
        </div>
        <div className="cart">
          <p className="message">
            奖金计算器<em className="gray">仅供参考，最终奖金以出票为准</em>
          </p>
          <div className="slide">
            <ul className="data-list gray">{titleArea}</ul>
            <div className="cart-area">{valueArea}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showMode: state.betSelected.showBonusCal,
    betSelected: state.betSelected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle() {
      return dispatch(toggleBonusCal());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusCal);
