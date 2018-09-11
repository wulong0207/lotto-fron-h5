/**
 * Created by YLD on 21/9/22.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/qcbf.scss';
import { equalArr } from '../utils.js';

const qcbfConfig = [
  {
    title: '胜',
    fields: [
      { title: '1:0', selectMark: '10' },
      { title: '2:0', selectMark: '20' },
      { title: '2:1', selectMark: '21' },
      { title: '3:0', selectMark: '30' },
      { title: '3:1', selectMark: '31' },
      { title: '3:2', selectMark: '32' },
      { title: '4:0', selectMark: '40' },
      { title: '4:1', selectMark: '41' },
      { title: '4:2', selectMark: '42' },
      { title: '胜其他', selectMark: '90' }
    ],
    value: 'wins'
  },
  {
    title: '平',
    fields: [
      { title: '0:0', selectMark: '00' },
      { title: '1:1', selectMark: '11' },
      { title: '2:2', selectMark: '22' },
      { title: '3:3', selectMark: '33' },
      { title: '平其他', selectMark: '99' }
    ],
    value: 'draws'
  },
  {
    title: '负',
    fields: [
      { title: '0:1', selectMark: '01' },
      { title: '0:2', selectMark: '02' },
      { title: '1:2', selectMark: '12' },
      { title: '0:3', selectMark: '03' },
      { title: '1:3', selectMark: '13' },
      { title: '2:3', selectMark: '23' },
      { title: '0:4', selectMark: '04' },
      { title: '1:4', selectMark: '14' },
      { title: '2:4', selectMark: '24' },
      { title: '胜其他', selectMark: '09' }
    ],
    value: 'losts'
  }
];

export default class QCBF extends Component {
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
      !equalArr(nextProps.data.wins, this.props.data.wins) ||
      !equalArr(nextProps.data.draws, this.props.data.draws) ||
      !equalArr(nextProps.data.losts, this.props.data.losts) ||
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

  render() {
    let { linebox, data } = this.props;
    data = data || {};
    let isSell = true;
    let items = qcbfConfig.map((val, index) => {
      return (
        <ul key={ index } className="display-flex">
          <li className="ls-info">{val.title}</li>
          <li className="flex">
            <div className="display-flex fill flex-wrap">
              {val.fields.map((v, i) => {
                let active =
                  this.state.select.indexOf(v.selectMark) >= 0 ? ' active' : '';

                let icn = '';
                if (val.fields.length > 5 && i < 5) {
                  icn = 'border';
                } else if ((i + 1) % 5 !== 0) icn = 'border-right';
                return (
                  <div
                    className={ 'one-four tc ' + icn + active }
                    key={ i }
                    onClick={ this.onLiClick.bind(this, v) }
                  >
                    <div className="team-name">{v.title}</div>
                    <div className="mid">{(data[val.value] || [])[i]}</div>
                  </div>
                );
              })}
            </div>
          </li>
        </ul>
      );
    });

    let colorStyle;
    if (data.color) {
      colorStyle = { color: data.color };
    }

    return (
      <div className={ 'qcbf-bar ' + linebox }>
        {isSell ? (
          <div>
            <div className="game-title display-flex">
              <div>
                <span>
                  {this.getRange(data.h_order, true)}
                  {data.h_s_name || data.h_f_name}
                </span>
                <span className="gray"> vs </span>
                <span>
                  {data.g_s_name || data.g_f_name}
                  {this.getRange(data.g_order)}
                </span>
                <span className="zhibo" />
              </div>
              <div className="flex" />
              <div>
                <span className="ls gray">{data.bjNum} </span>
                <span className="gray">
                  {data.saleEndTime}截止{' '}
                  <span style={ colorStyle }>{data.m_s_name}</span>
                </span>
              </div>
            </div>
            {items}
          </div>
        ) : (
          <div className="no-sell">未开售</div>
        )}
      </div>
    );
  }
}

QCBF.propTypes = {
  onSelect: PropTypes.func,
  select: PropTypes.array,
  data: PropTypes.object,
  linebox: PropTypes.string
};

QCBF.defaultProps = {
  onSelect: null, // 选择事件
  sellMark: 1 // 是属于单关还是过关  1：单关；2：过关;
};
