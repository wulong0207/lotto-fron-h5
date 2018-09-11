/**
 * Created by YLD on 21/9/17.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/spf.scss';
import { equalArr } from '../utils.js';

export default class SPF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: []
    };

    this.config = [
      { des: '胜', selectMark: '1' },
      { des: '平局', selectMark: '2' },
      { des: '胜', selectMark: '3' }
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
      !equalArr(nextProps.data.wdfs, this.props.data.wdfs) ||
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
    if (range) {
      let cn = 'range gray';
      if (!left) {
        cn += ' right';
      }

      return <span className={ cn }>[{range.split(',')[0]}]</span>;
    }

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

  checkActive(cn, item) {
    let { select } = this.state;

    return cn + (select.indexOf(item.selectMark) >= 0 ? ' active' : '');
  }

  render() {
    let { select } = this.state;
    let { linebox, data } = this.props;
    data = data || {};
    let lc = select.left ? 'active' : '';
    let rc = select.right ? 'active' : '';
    let isSell = true;
    // 胜平负sp值
    this.sp = data.wdfs;
    let sp = data.wdfs || [0, 0, 0, 0];
    let colorStyle;
    if (data.color) {
      colorStyle = { color: data.color };
    }

    return (
      <div className={ 'spf-bar ' + linebox }>
        {isSell ? (
          <ul className="display-flex">
            <li className="ls-info">
              <div className="ls" style={ colorStyle }>
                {data.m_s_name}
              </div>
              <div className="gray">{data.bjNum}</div>
              <div className="gray">
                {data.saleEndTime}截止<span className="zhibo" />
              </div>
            </li>
            <li
              className={ this.checkActive('flex ' + lc, this.config[0]) }
              ref={ li0 => (this.li0 = li0) }
              onClick={ this.onLiClick.bind(this, this.config[0], 'li0') }
            >
              {this.getRange(data.h_order, true)}
              <div className="tc">
                <div className="team-name">
                  {data.h_s_name}
                  {this.getRf(sp[0])}
                </div>
                <div className="mid">
                  <span className="gray">{this.config[0].des}</span>
                  {sp[1]}
                </div>
              </div>
            </li>
            <li
              className={ this.checkActive('pj ' + rc, this.config[1]) }
              ref={ li1 => (this.li1 = li1) }
              onClick={ this.onLiClick.bind(this, this.config[1], 'li1') }
            >
              <div className="tc">
                <div className="gray">{this.config[1].des}</div>
                <div className="mid">{sp[2]}</div>
              </div>
            </li>
            <li
              className={ this.checkActive('flex ' + rc, this.config[2]) }
              ref={ li2 => (this.li2 = li2) }
              onClick={ this.onLiClick.bind(this, this.config[2], 'li2') }
            >
              {this.getRange(data.g_order)}
              <div className="tc">
                <div className="team-name">{data.g_s_name}</div>
                <div className="mid">
                  <span className="gray">{this.config[2].des}</span>
                  {sp[3]}
                </div>
              </div>
            </li>
          </ul>
        ) : (
          <div className="no-sell">未开售</div>
        )}
      </div>
    );
  }
}

SPF.propTypes = {
  onSelect: PropTypes.func,
  select: PropTypes.array,
  data: PropTypes.object,
  linebox: PropTypes.string
};

SPF.defaultProps = {
  onSelect: null, // 选择事件
  sellMark: 1 // 是属于单关还是过关  1：单关；2：过关;
};
