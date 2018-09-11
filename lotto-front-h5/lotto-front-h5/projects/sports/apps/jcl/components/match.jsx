import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/match.scss';
import defaultUrl from '../img/souye_cai.png';

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        left: false,
        right: false
      }
    };

    this.fieldsSet = {
      // 胜负
      sf: {
        left: 'l',
        right: 'w' // 左右取值
      },
      // 让分胜负
      rfsf: {
        left: 'let_l',
        right: 'let_w',
        // 组件中间取值
        center: {
          field: 'let_score',
          color: { rise: 'rise', fall: 'fall' },
          sign: true
        }
      },
      // 大小分
      dxf: {
        labelL: '大分',
        labelR: '小分',
        left: 'b',
        right: 's',
        // 组件中间取值
        center: {
          field: 'p_score',
          color: 'dxf'
        }
      }
    };
  }

  static propTypes = {
    select: PropTypes.object,
    data: PropTypes.object,
    field: PropTypes.string,
    onSelect: PropTypes.func,
    onCenterClick: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.select &&
      (nextProps.select.left !== this.state.select.left ||
        nextProps.select.right !== this.state.select.right)
    ) {
      this.setState({ select: nextProps.select });
    }
  }

  componentDidMount() {
    if (this.props.select) {
      this.setState({ select: this.props.select });
    }
  }

  onSelectHandler(index) {
    let { data, field, onSelect } = this.props;
    let { select } = this.state;
    if (index === 0) {
      select.left = !select.left;
    } else {
      select.right = !select.right;
    }

    if (onSelect) {
      onSelect(select, data, field);
    }

    this.setState({ select });
  }

  getValue(targetField) {
    let { data, field } = this.props;
    let result = '-';
    if (!field || !data || !this.fieldsSet[field]) {
      return result;
    }

    let fieldResult = this.fieldsSet[field][targetField];
    if (typeof fieldResult === 'object') {
      result = data[fieldResult.field];
    } else {
      result = data[fieldResult];
    }

    return result;
  }

  // 中间部分的点击事件
  onCenterClickHandler(e) {
    let { data, field, onCenterClick } = this.props;
    if (onCenterClick) {
      onCenterClick(data, field);
    }

    e.stopPropagation();
  }

  // 获取中间显示
  getCenter() {
    let { field } = this.props;
    let centerArea = (
      <div className="pl-change" onClick={ this.onCenterClickHandler.bind(this) }>
        赔率变化
      </div>
    );
    // 存在设置中间的让分等值
    if (field) {
      let centerConfig = this.fieldsSet[field].center;
      if (this.fieldsSet[field] && centerConfig) {
        let result = parseFloat(this.getValue('center'));
        let cn = '';
        if (typeof centerConfig.color === 'object') {
          if (result > 0 && centerConfig.color.rise) {
            cn = centerConfig.color.rise;
          } else if (result < 0 && centerConfig.color.fall) {
            cn = centerConfig.color.fall;
          }
        } else {
          cn = centerConfig.color;
        }

        if (centerConfig.sign && result > 0) {
          result = '+' + result;
        }
        centerArea = (
          <div
            className={ 'pl-change ' + cn }
            onClick={ this.onCenterClickHandler.bind(this) }
          >
            {result}
          </div>
        );
      }
    }

    return centerArea;
  }

  render() {
    let { field } = this.props;
    let data = this.props.data;
    let { select } = this.state;
    let lc = select.left ? 'active' : '';
    let rc = select.right ? 'active' : '';
    let style;
    if (data.color) {
      style = { color: data.color };
    }

    return (
      <div className="ct-match">
        <h4 className="date">
          <span style={ style }>{data.m_s_name || data.m_f_name}</span>{' '}
          {data.week} {data.num} {data.saleEndTime} 截止<i className="zhibo" />
        </h4>
        <ul className="display-flex">
          <li
            className={ 'flex display-flex first-child ' + lc }
            onClick={ this.onSelectHandler.bind(this, 0) }
          >
            <div>
              <img className="flex logo" src={ data.g_logo || defaultUrl } />
            </div>
            <div className="flex tr team">
              <h3 className="tr">
                {data.g_order ? (
                  <span className="gray">[{data.g_order}]</span>
                ) : (
                  ''
                )}
                {data.g_s_name || data.g_f_name}
                <div className="sep">vs</div>
              </h3>
              <h3 className="team-bet">
                {this.fieldsSet[field].labelL || '主负'}
                <span className="green">{this.getValue('left')}</span>
                {this.getCenter()}
              </h3>
            </div>
          </li>
          <li className="ver-line" />
          <li
            className={ 'flex display-flex ' + rc }
            onClick={ this.onSelectHandler.bind(this, 1) }
          >
            <div className="flex tl team">
              <h3 className="tl">
                {data.h_s_name || data.h_f_name}
                {data.h_order ? (
                  <span className="gray">[{data.h_order}]</span>
                ) : (
                  ''
                )}
              </h3>
              <h3 className="team-bet">
                <span className="green">{this.getValue('right')}</span>
                {this.fieldsSet[field].labelR || '主胜'}
              </h3>
            </div>
            <div>
              <img className="logo" src={ data.h_logo || defaultUrl } />
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

Match.defaultProps = {
  field: 0,
  onCenterClick: null,
  onSelect: null, // 选择事件
  select: {
    // 选择情况
    left: false,
    right: false
  }
};
