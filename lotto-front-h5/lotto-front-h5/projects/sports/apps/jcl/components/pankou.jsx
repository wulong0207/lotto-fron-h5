import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/pankou.scss';
import { setDate } from '@/utils/utils.js';
import SpPush from '../services/sppush';

import { togglePanKou } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';
import { fetchAddOrder } from '../redux/actions/order.js';

// SP值盘口变化
class Pankou extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 获取时间,转换为MM-dd HH:mm格式
  getFullTime(date) {
    let result;
    let reDate = new Date(date);
    if (isNaN(reDate.getTime())) {
      if (date) {
        reDate = new Date(date.replace(/-/g, '/'));
        if (isNaN(reDate.getTime())) {
          return date;
        }
      } else {
        return date;
      }
    }

    if (date) {
      result = setDate.formatDate(reDate, 'MM-dd HH:mm');
    }

    return result;
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  show() {
    this.props.togglePanKou();
  }

  reChoose() {
    SpPush.clear();
    this.props.togglePanKou();
  }

  // 检查是涨还是跌，并返回相应的箭头
  checkZD(old, last) {
    let currentItem = parseFloat(old);
    let nextItem = parseFloat(last);
    if (currentItem < nextItem) {
      return <span className="red">↑</span>;
    } else if (currentItem > nextItem) {
      return <span className="green">↓</span>;
    }

    return '';
  }

  order() {
    this.props.fetchAddOrder(null, null, null, null, true);
  }

  render() {
    let { data, showPanKou } = this.props;
    let style;
    if (!showPanKou) {
      style = { display: 'none' };
    }

    let valueArea = SpPush.getSPChanges().map((v, i) => {
      return (
        <ul key={ i } className="data-list">
          <li className="flex">{v.cc}</li>
          <li className="udpate-time">{this.getFullTime(v.date) || '-'}</li>
          <li className="flex">{v.old}</li>
          <li className="flex">
            {v.last}
            {this.checkZD(v.old, v.last)}
          </li>
        </ul>
      );
    });

    return (
      <div className="pankou">
        <div className="take-position" onClick={ this.show.bind(this) } />
        <div className="dead-line" onClick={ this.show.bind(this) }>
          <div className="txt" />
          <div className="close" />
        </div>
        <div className="cart">
          <p className="message">盘口数据变化提示</p>
          <p className="m-tip">
            你所选的赛事，盘口数据发生变化，是否以最新盘口变化数据提交
            <span className="gray">(以实际出票时结果为准)</span>
          </p>
          <div className="slide">
            <ul className="data-list gray">
              <li className="flex">场次</li>
              <li className="udpate-time">更新时间</li>
              <li className="flex">更新前</li>
              <li className="flex">更新后</li>
            </ul>
            <div className="cart-area">{valueArea}</div>
          </div>
          <div className="bottom-btns">
            <div className="gray" onClick={ this.reChoose.bind(this) }>
              重新选择
            </div>
            <div className="red" onClick={ this.order.bind(this) }>
              继续投注
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showPanKou: state.spHistory.showPanKou
  };
};

const mapDispatchToProps = dispatch => {
  return {
    togglePanKou() {
      return dispatch(togglePanKou());
    },
    // 下单
    fetchAddOrder(betting, saledate, combs, multiple, ignorSP) {
      dispatch(fetchAddOrder(betting, saledate, combs, multiple, ignorSP));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pankou);
