/**
 * Created by YLD on 21/9/22.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/spf.scss';
import { equalArr } from '../utils.js';

export default class SXDS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: []
    };

    this.config = [
      { des: '上单', selectMark: '1' },
      { des: '上双', selectMark: '2' },
      { des: '下单', selectMark: '3' },
      { des: '下双', selectMark: '4' }
    ];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.select && !equalArr(nextProps.select, this.state.select)) {
      this.setState({ select: nextProps.select });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.select && !equalArr(nextProps.select, this.state.select)) ||
      !equalArr(nextProps.data.uds, this.props.data.uds) ||
      nextProps.data.id !== this.props.data.id
    );
  }

  componentDidMount() {
    if (this.props.select) {
      this.setState({ select: this.props.select });
    }
  }

  // 点击各子项的事件
  onLiClick(item, ref) {
    let { data, onSelect } = this.props;
    let add = false;

    let index = this.state.select.indexOf(item.selectMark);
    if (index < 0) {
      add = true;
    }

    if (onSelect) {
      onSelect(data, item.selectMark, add);
    }
  }

  // 获取排名信息
  getRange(range, left) {
    // if(range){
    //     let cn = "range gray";
    //     if(!left){
    //         cn += " right";
    //     }

    //     return <span className={cn}>[{range.split(",")[0]}]</span>
    // }

    return '';
  }

  // 获取让分
  getRf(rf) {
    if (rf && rf !== '0') {
      return (
        <span className={ rf.indexOf('-') >= 0 ? 'fail' : 'rise' }>{rf}</span>
      );
    }

    return '';
  }

  render() {
    let { select } = this.state;
    let { linebox, data } = this.props;
    data = data || {};
    let lc = select.left ? 'active' : '';
    let isSell = true;
    // 胜平负sp值
    let sp = data.uds || [0, 0, 0, 0];
    let colorStyle;
    if (data.color) {
      colorStyle = { color: data.color };
    }

    return (
      <div className={ 'spf-bar ' + linebox }>
        {isSell ? (
          <ul className="display-flex">
            <li className="ls-info">
              <div className="ls gray">
                {data.bjNum} <span style={ colorStyle }>{data.m_s_name}</span>
              </div>
              <div className="gray">{data.saleEndTime}截止</div>
              <div>{data.h_s_name || data.h_f_name}</div>
              <div>{data.g_s_name || data.g_f_name}</div>
              <div>
                <span className="zhibo" />
              </div>
            </li>
            {this.config.map((val, i) => {
              let active =
                this.state.select.indexOf(val.selectMark) >= 0 ? ' active' : '';

              return (
                <li
                  className={ 'flex ' + lc + active }
                  key={ i }
                  onClick={ this.onLiClick.bind(this, val) }
                >
                  <div className="tc">
                    <div className="team-name">{val.des}</div>
                    <div className="mid">{sp[i]}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-sell">未开售</div>
        )}
      </div>
    );
  }
}

SXDS.propTypes = {
  onSelect: PropTypes.func,
  select: PropTypes.array,
  data: PropTypes.object,
  linebox: PropTypes.string
};

SXDS.defaultProps = {
  onSelect: null, // 选择事件
  sellMark: 1 // 是属于单关还是过关  1：单关；2：过关;
};
