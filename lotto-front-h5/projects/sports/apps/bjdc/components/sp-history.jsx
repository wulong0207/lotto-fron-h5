import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/sp-history.scss';
import { setDate } from '@/utils/utils.js';

import { toggle, fetchSP } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';

// SP历史值
class SPHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.fieldSet = {
      sf: {
        titles: ['负', '胜', '更新时间'],
        fields: [1, 0, 2]
      },
      rfsf: {
        titles: ['负', '让分', '胜', '更新时间'],
        fields: [1, 0, 2, 3]
      },
      dxf: {
        titles: ['大分', '预设总分', '小分', '更新时间'],
        fields: [1, 0, 2, 3]
      }
    };
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

  componentDidMount() {
    this.props.fetchSP(this.props.selectData.id, this.props.betKind);
  }

  componentWillReceiveProps(nextProps) {
    let { selectData } = this.props;
    if (nextProps.selectData && nextProps.selectData.id) {
      if (!(selectData && selectData.id === nextProps.selectData.id)) {
        this.props.fetchSP(nextProps.selectData.id, nextProps.betKind);
      }
    }
  }

  show() {
    this.props.toggle(null, null);
  }

  // 检查是涨还是跌，并返回相应的箭头
  checkZD(dataArr, itemIndex, filedIndex) {
    if (itemIndex !== dataArr.length - 1) {
      let currentItem = parseFloat(dataArr[itemIndex][filedIndex]);
      let nextItem = parseFloat(dataArr[itemIndex + 1][filedIndex]);
      if (currentItem > nextItem) {
        return <span className="red">↑</span>;
      } else if (currentItem < nextItem) {
        return <span className="green">↓</span>;
      }
    }

    return '';
  }

  render() {
    let { data, selectData, betKind } = this.props;
    selectData = selectData || {};

    let titleArea;
    let valueArea = [];
    let fieldItem = this.fieldSet[betKind];
    if (fieldItem) {
      titleArea = fieldItem.titles.map((val, index) => {
        if (val !== '更新时间') {
          return (
            <li key={ index } className="flex">
              {val}
            </li>
          );
        } else {
          return (
            <li key={ index } className="udpate-time">
              更新时间
            </li>
          );
        }
      });

      if (data) {
        valueArea = data.map((dataItem, dataIndex) => {
          let className = (dataIndex + 1) % 2 === 0 ? 'gray' : '';
          return (
            <ul key={ dataIndex } className={ 'data-list data ' + className }>
              {dataItem.map((val, index) => {
                if (index !== dataItem.length - 1) {
                  let label = '';
                  if (betKind === 'rfsf' && index === 1) {
                    label = dataItem[fieldItem.fields[index]] > 0 ? '+' : label;
                  }
                  return (
                    <li key={ index } className="flex">
                      {label}
                      {dataItem[fieldItem.fields[index]]}
                      {this.checkZD(data, dataIndex, fieldItem.fields[index])}
                    </li>
                  );
                } else {
                  return (
                    <li key={ index } className="udpate-time">
                      {this.getFullTime(val)}
                    </li>
                  );
                }
              })}
            </ul>
          );
        });
      }
    }

    return (
      <div className="sp-history">
        <div className="take-position" onClick={ this.show.bind(this) } />
        <div className="dead-line" onClick={ this.show.bind(this) }>
          <div className="txt" />
          <div className="close" />
        </div>
        <div className="cart">
          <p className="message">
            {' '}
            {selectData.week} {selectData.num} {selectData.g_s_name} vs{' '}
            {selectData.h_s_name}
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

SPHistory.propTypes = {
  showMode: PropTypes.bool,
  selectData: PropTypes.object,
  betKind: PropTypes.string,
  data: PropTypes.object,
  fetchSP: PropTypes.func,
  toggle: PropTypes.func
};

const mapStateToProps = state => {
  return {
    showMode: state.spHistory.showMode,
    selectData: state.spHistory.selectData,
    betKind: state.spHistory.betKind,
    data: state.spHistory.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSP(matchId, betKind) {
      return dispatch(fetchSP(matchId, betKind));
    },
    toggle(selectData, betKind) {
      return dispatch(toggle(selectData, betKind));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SPHistory);
