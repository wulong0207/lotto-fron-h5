import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/matchbar.scss';

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
  onCenterClickHandler() {
    let { data, field, onCenterClick } = this.props;
    if (onCenterClick) {
      onCenterClick(data, field);
    }
  }

  // 获取中间显示
  getCenter() {
    let { field } = this.props;
    let centerArea = (
      <li
        className="display-flex des-center"
        onClick={ this.onCenterClickHandler.bind(this) }
      >
        <div>赔率</div>
        <div>变化</div>
      </li>
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
          <li
            className={ 'display-flex des-center ' + cn }
            onClick={ this.onCenterClickHandler.bind(this) }
          >
            {result}
          </li>
        );
      }
    }

    return centerArea;
  }

  render() {
    let { select } = this.state;
    let { linebox, data, field, leftTitle, rightTitle, sellMark } = this.props;
    data = data || {};
    let lc = select.left ? 'active' : '';
    let rc = select.right ? 'active' : '';
    let isSell = true;

    // 是属于单关还是过关  1：单关；2：过关;
    // 1：销售单关；2：仅售过关；4：暂停销售
    if (sellMark === 1) {
      if (field === 'sf' && (data.statusWf === 2 || data.statusWf === 4)) {
        isSell = false;
      } else if (
        field === 'rfsf' &&
        (data.statusLetWf === 2 || data.statusLetWf === 4)
      ) {
        isSell = false;
      } else if (
        field === 'dxf' &&
        (data.statusBigSmall === 2 || data.statusBigSmall === 4)
      ) {
        isSell = false;
      }
    } else if (sellMark === 2) {
      if (field === 'sf' && data.statusWf === 4) {
        isSell = false;
      } else if (field === 'rfsf' && data.statusLetWf === 4) {
        isSell = false;
      } else if (field === 'dxf' && data.statusBigSmall === 4) {
        isSell = false;
      }
    }

    return (
      <div className={ 'match-bar ' + linebox }>
        {isSell ? (
          <ul className="display-flex">
            <li
              className={ 'flex display-flex ' + lc }
              onClick={ this.onSelectHandler.bind(this, 0) }
            >
              <div className="tl">
                <span>{leftTitle}</span>
                <span className="gray">{this.getValue('left')}</span>
              </div>
            </li>
            {this.getCenter()}
            <li
              className={ 'flex display-flex ' + rc }
              onClick={ this.onSelectHandler.bind(this, 1) }
            >
              <div className="tr">
                <span>{rightTitle}</span>
                <span className="gray">{this.getValue('right')}</span>
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

Match.propTypes = {
  select: PropTypes.object,
  data: PropTypes.object,
  field: PropTypes.string,
  onSelect: PropTypes.func,
  onCenterClick: PropTypes.func,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  sellMark: PropTypes.number,
  linebox: PropTypes.string
};

Match.defaultProps = {
  leftTitle: '主负',
  rightTitle: '主胜',
  onCenterClick: null,
  onSelect: null, // 选择事件
  sellMark: 1 // 是属于单关还是过关  1：单关；2：过关;
};
