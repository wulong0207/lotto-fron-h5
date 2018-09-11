import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/match.scss';
import defaultUrl from '../img/souye_cai.png';
import { equalArr } from '../utils.js';

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
      // 胜负过关
      sfgg: {
        // 组件中间取值
        center: { color: { rise: 'rise', fall: 'fall' } },
        labelL: '主胜',
        labelR: '主负'
      }
    };

    // 1：足球赛事；2：篮球赛事；3：网球；4：橄榄球；5：排球；6：羽毛球；7：乒乓球；8：沙滩排球；9：冰球；10：曲棍球；11：手球；12：水球
    this.MT = {
      1: '足球',
      2: '篮球',
      3: '网球',
      4: '橄榄球',
      5: '排球',
      6: '羽毛球',
      7: '乒乓球',
      8: '沙滩排球',
      9: '冰球',
      10: '曲棍球',
      11: '手球',
      12: '水球'
    };
  }

  static propTypes = {
    select: PropTypes.object,
    data: PropTypes.object,
    field: PropTypes.string,
    onSelect: PropTypes.func
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

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.select &&
        (nextProps.select.left !== this.state.select.left ||
          nextProps.select.right !== this.state.select.right)) ||
      !equalArr(nextProps.data.sfs, this.props.data.sfs) ||
      nextProps.data.id !== this.props.data.id
    );
  }

  componentDidMount() {
    if (this.props.select) {
      this.setState({ select: this.props.select });
    }
  }

  onSelectHandler(index) {
    let { data, field, onSelect } = this.props;
    let select = {
      left: this.state.select.left,
      right: this.state.select.right
    };
    if (index === 0) {
      select.left = !this.state.select.left;
    } else {
      select.right = !this.state.select.right;
    }

    if (onSelect) {
      onSelect(select, data, field);
    } else {
      this.setState({ select });
    }
  }

  // 中间部分的点击事件
  onCenterClickHandler(e) {
    // let {data, field, onCenterClick} = this.props;
    // if(onCenterClick){
    //     onCenterClick(data, field);
    // }
    // e.stopPropagation();
  }

  // 获取中间显示
  getCenter() {
    let { data, field } = this.props;
    let centerArea;
    if (field) {
      let centerConfig = this.fieldsSet[field].center;
      if (this.fieldsSet[field] && centerConfig) {
        let result = parseFloat((data.sfs[0] || '').replace('+', ''));
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

        centerArea = (
          <div
            className={ 'pl-change ' + cn }
            onClick={ this.onCenterClickHandler.bind(this) }
          >
            {data.sfs[0]}
          </div>
        );
      }
    }

    return centerArea;
  }

  /**
   * 获取排名
   */
  getOrder(str) {
    if (str && str.indexOf(',') >= 0) {
      str = str.split(',')[0];
    }

    return str;
  }

  render() {
    let { field } = this.props;
    let data = this.props.data;
    let { select } = this.state;
    let lc = select.left ? 'active' : '';
    let rc = select.right ? 'active' : '';
    data.sfs = data.sfs || ['', '', ''];

    let colorStyle;
    if (data.color) {
      colorStyle = { color: data.color };
    }

    return (
      <div className="ct-match">
        <h4 className="date">
          <span>
            {this.MT[data.m_t] || ''}{' '}
            <span style={ colorStyle }>{data.m_s_name || data.m_f_name}</span>
          </span>{' '}
          {data.bjNum} {data.saleEndTime} 截止<i className="zhibo" />
        </h4>
        <ul className="display-flex">
          <li
            className={ 'flex display-flex first-child ' + lc }
            onClick={ this.onSelectHandler.bind(this, 0) }
          >
            <div className="img">
              <img className="flex logo" src={ data.h_logo || defaultUrl } />
            </div>
            <div className="flex tr team">
              <h3 className="tr">
                {data.h_order ? (
                  <span className="gray">[{this.getOrder(data.h_order)}]</span>
                ) : (
                  ''
                )}
                {data.h_s_name || data.h_f_name}
              </h3>
              <h3 className="team-bet">
                {this.fieldsSet[field].labelL || '主负'}
                <span className="green">{data.sfs[1]}</span>
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
                {data.g_s_name || data.g_f_name}
                {data.g_order ? (
                  <span className="gray">[{this.getOrder(data.g_order)}]</span>
                ) : (
                  ''
                )}
              </h3>
              <h3 className="team-bet">
                <span className="green">{data.sfs[2]}</span>
                {this.fieldsSet[field].labelR || '主胜'}
              </h3>
            </div>
            <div className="img right">
              <img className="logo" src={ data.g_logo || defaultUrl } />
            </div>
          </li>
        </ul>
        <div className="game-vs">
          <div className="sep">vs</div>
          {this.getCenter()}
        </div>
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
