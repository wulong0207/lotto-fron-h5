/**
 * Created by YLD on 21/9/22.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/spf.scss';
import { equalArr } from '../utils.js';

const bqCconfig = [
  { title: '胜胜', selectMark: '1' },
  { title: '胜平', selectMark: '2' },
  { title: '胜负', selectMark: '3' },

  { title: '平胜', selectMark: '4' },
  { title: '平平', selectMark: '5' },
  { title: '平负', selectMark: '6' },

  { title: '负胜', selectMark: '7' },
  { title: '负平', selectMark: '8' },
  { title: '负负', selectMark: '9' }
];

export default class ZJQS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.select && !equalArr(nextProps.select, this.state.select)) {
      this.setState({ select: nextProps.select });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.select && !equalArr(nextProps.select, this.state.select)) ||
      !equalArr(nextProps.data.hfwdfs, this.props.data.hfwdfs) ||
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
      let cn = 'gray';
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

  render() {
    let { linebox, data } = this.props;
    data = data || {};
    let isSell = true;
    // 胜平负sp值
    let sp = data.hfwdfs || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let items = bqCconfig.map((val, i) => {
      let icn = '';
      let active =
        this.state.select.indexOf(val.selectMark) >= 0 ? ' active' : '';
      if ((i + 1) % 3 !== 0 && i < 6) icn = 'border';
      else if (i < 6) icn = 'border-bottom';
      else if (i < 8) icn = 'border-right';
      return (
        <div
          className={ 'one-three tc ' + icn + active }
          key={ i }
          onClick={ this.onLiClick.bind(this, val) }
        >
          <div className="team-name">{val.title}</div>
          <div className="mid">{sp[i]}</div>
        </div>
      );
    });

    let colorStyle;
    if (data.color) {
      colorStyle = { color: data.color };
    }

    return (
      <div className={ 'spf-bar ' + linebox }>
        {isSell ? (
          <ul className="display-flex">
            <li className="ls-info">
              <div className="ls gray">{data.bjNum}</div>
              <div className="gray" style={ colorStyle }>
                {' '}
                {data.m_s_name}
              </div>
              <div className="gray">{data.saleEndTime}截止</div>
              <div>
                {data.h_s_name || data.h_f_name}
                {this.getRange(data.h_order, true)}
              </div>
              <div>
                {data.g_s_name || data.g_f_name}
                {this.getRange(data.g_order)}
              </div>
              <div>
                <span className="zhibo" />
              </div>
            </li>
            <li className="flex">
              <div className="display-flex fill flex-wrap">{items}</div>
            </li>
          </ul>
        ) : (
          <div className="no-sell">未开售</div>
        )}
      </div>
    );
  }
}

ZJQS.propTypes = {
  data: PropTypes.object,
  linebox: PropTypes.string,
  select: PropTypes.array,
  onSelect: PropTypes.func
};

ZJQS.defaultProps = {
  onSelect: null, // 选择事件
  sellMark: 1 // 是属于单关还是过关  1：单关；2：过关;
};
