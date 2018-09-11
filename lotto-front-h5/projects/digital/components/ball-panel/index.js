import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { chunk, sampleSize, range, isEqual } from 'lodash';
import './ball-panel.scss';
import session from '@/services/session';
import { browser } from '@/utils/utils';

const unLoadEventName =
  browser.iPhone || browser.iPad ? 'pagehide' : 'beforeunload';

function BallDataLabel({ data }) {
  if (typeof data === 'undefined') return null;
  if (typeof data === 'string' || typeof data === 'number') {
    return <span className="ball-data">{data}</span>;
  }
  return (
    <span
      className="ball-data"
      style={ { color: data.color ? data.color : '#999' } }
    >
      {data.label}
    </span>
  );
}

BallDataLabel.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ])
};

function Balls({
  balls,
  data,
  selected,
  rowLength,
  random,
  onRandom,
  onSelect,
  fixedBalls,
  color,
  randomLabel,
  labels,
  highlightMin,
  highlight
}) {
  const numberArr = chunk(balls, rowLength);
  const remainder = balls.length % rowLength;
  const emptyCell = random
    ? rowLength - (remainder + 1)
    : rowLength - remainder;
  const values =
    Array.isArray(data) && data.length > 0
      ? data.map(
        d =>
          typeof d.value !== 'undefined' ? parseInt(d.value) : parseInt(d)
      )
      : [];
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const newData =
    Array.isArray(data) &&
    data.map(d => {
      const value = typeof d.label !== 'undefined' ? d.value : d;
      if (value === max && highlight) {
        return {
          label: typeof d.label !== 'undefined' ? d.label : d,
          color: '#ed1c24'
        };
      }
      if (value === min && highlightMin && highlight) {
        return {
          label: typeof d.label !== 'undefined' ? d.label : d,
          color: '#1e88d2'
        };
      }
      return d;
    });
  return (
    <table className="ball-table">
      <tbody>
        {numberArr.map((row, index) => {
          return (
            <tr key={ index }>
              {row.map((cell, idx) => {
                return (
                  <td
                    className={ cx({
                      selected: selected.indexOf(cell.toString()) > -1
                    }) }
                    key={ cell }
                  >
                    <div
                      className="ball"
                      onClick={ () => onSelect(cell) }
                      style={ {
                        color:
                          selected.indexOf(cell) > -1 ||
                          fixedBalls.indexOf(cell) > -1
                            ? '#fff'
                            : color,
                        backgroundColor:
                          selected.indexOf(cell) > -1 ||
                          fixedBalls.indexOf(cell) > -1
                            ? color
                            : 'transparent'
                      } }
                    >
                      <span>{cell}</span>
                      {fixedBalls.indexOf(cell.toString()) > -1 && (
                        <span className="fixed-icon">胆</span>
                      )}
                      {labels &&
                        typeof labels[index * rowLength + idx] !==
                          'undefined' && (
                          <span className="ball-label">
                            {labels[index * rowLength + idx]}
                          </span>
                        )}
                      {data &&
                        typeof data[index * rowLength + idx] !==
                          'undefined' && (
                          <BallDataLabel
                            data={ newData[index * rowLength + idx] }
                          />
                        )}
                    </div>
                  </td>
                );
              })}
              {index === numberArr.length - 1 &&
                random &&
                remainder && (
                  <td>
                    <div className="random" onClick={ onRandom }>
                      <span>机选</span>
                      <span className="label">{randomLabel}</span>
                    </div>
                  </td>
                )}
              {index === numberArr.length - 1 &&
                random &&
                emptyCell > 0 &&
                range(0, emptyCell).map(n => {
                  return <td key={ n } />;
                })}
            </tr>
          );
        })}
        {random &&
          remainder === 0 && (
            <tr>
              <td colSpan={ rowLength }>
                <div className="random" onClick={ onRandom }>
                  <span>机选</span>
                  <span>{randomLabel}</span>
                </div>
              </td>
            </tr>
          )}
      </tbody>
    </table>
  );
}

Balls.propTypes = {
  balls: PropTypes.array.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        color: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ])
  ),
  selected: PropTypes.array,
  rowLength: PropTypes.number,
  random: PropTypes.bool.isRequired,
  onRandom: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  fixedBalls: PropTypes.array,
  color: PropTypes.string.isRequired,
  randomLabel: PropTypes.string.isRequired,
  labels: PropTypes.array,
  highlightMin: PropTypes.bool,
  highlight: PropTypes.bool
};

// 恢复数据时，先检查球是否合法
function checkBalls(balls, allBalls) {
  if (typeof balls === 'undefined') return [];
  const formatAllBalls = allBalls.map(b => b.toString());
  if (typeof balls === 'string' || typeof balls === 'number') {
    if (formatAllBalls.indexOf(balls) < 0) return [];
    return [balls];
  }
  if (!Array.isArray(balls)) return [];
  if (!balls.length) return [];
  return balls.reduce(
    (acc, n) => (formatAllBalls.indexOf(n) > -1 ? acc.concat(n) : acc),
    []
  );
}

export default class BallPanel extends Component {
  constructor(props) {
    super(props);
    let selected = [];
    let fixedBalls = [];
    // 从 session 里获取数据
    const prevData = session.get(`number-data-${props.name}`);
    if (prevData) {
      if (prevData.selected) {
        selected = checkBalls(prevData.selected, props.balls);
      }
      if (prevData.fixedBalls) {
        fixedBalls = checkBalls(prevData.fixedBalls, props.balls);
      }
      session.remove(`number-data-${props.name}`);
    }
    // 从 props 里取数据
    if (props.selected && props.selected.length) {
      selected = checkBalls(props.selected, props.balls);
    }
    if (props.fixedBalls && props.fixedBalls.length) {
      fixedBalls = checkBalls(props.fixedBalls, props.balls);
    }
    this.state = {
      selected,
      fixedBalls
    };
    this.saveDataHandle = this.saveData.bind(this);
  }

  componentDidMount() {
    // if (this.state.selected.length && this.props.onChange) {
    //   const { selected, fixedBalls } = this.state;
    //   // 如果页面中有多个选球，恢复数据时，会同时触发，由于 setState 为异步
    //   // 会出现数据丢失的情况，这里设置延时，不让他们同时触发
    //   const index = this.props.index ? this.props.index : 0;
    //   setTimeout(() => this.props.onChange(selected, fixedBalls, this.props.index), index * 50);
    // }
    this.recoveryPrevData(this.state.selected, this.state.fixedBalls);
    window.addEventListener(unLoadEventName, this.saveDataHandle); // 在页面刷新或离开前保存选中球的数据
  }

  /**
   * 恢复选中的球
   * 
   * @param {array} selected 
   * @param {array} fixedBalls 
   * @memberof BallPanel
   */
  recoveryPrevData(selected, fixedBalls) {
    if ((selected.length || fixedBalls.length) && this.props.onChange) {
      this.props.onChange(selected, fixedBalls, this.props.index);
    }
  }

  /**
   * 保存未加入投注面板中但用户已选中的球
   * 
   * @returns 
   * @memberof BallPanel
   */
  saveData() {
    if (this.state.selected.length || this.state.fixedBalls.length) {
      session.set(`number-data-${this.props.name}`, {
        selected: this.state.selected,
        fixedBalls: this.state.fixedBalls
      });
    }
    return null;
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selected &&
      !isEqual(nextProps.selected, this.state.selected)
    ) {
      this.setState({ selected: nextProps.selected });
    }
    if (
      nextProps.fixedBalls &&
      !isEqual(nextProps.fixedBalls, this.state.fixedBalls)
    ) {
      this.setState({ fixedBalls: nextProps.fixedBalls });
    }
  }

  componentWillUnmount() {
    // 保存未提交的号码
    this.saveDataHandle(); // 在组件销毁前保存选中球的数据
    window.removeEventListener(unLoadEventName, this.saveDataHandle); // 取消监听页面刷新事件
  }

  randomHandle(length) {
    const selected = this.random(length);
    this.setState({ selected, fixedBalls: [] });
    this.props.onChange && this.props.onChange(selected, [], this.props.index);
  }

  completion(size) {
    const { betSize } = this.props;
    if (!betSize && !size) throw new Error('无补全的长度');
    const length =
      size ||
      betSize - (this.state.selected.length + this.state.fixedBalls.size);
    if (length < 1) throw new Error('无需补全');
    // 如果面板中已有用户选中的球，则排除选中的球和设胆的球
    const unexpectedBalls = this.props.selected.concat(this.props.fixedBalls);
    return this.ballRandom(length, false, unexpectedBalls);
  }

  ballRandom(length = 1, highlight = false, exclude = []) {
    const len =
      typeof length === 'number' && length > 0 ? length : this.props.betSize;
    const { sort, balls } = this.props;
    const { selected } = this.state;
    const randomBalls = random(len, balls, exclude, selected, sort);
    if (!highlight) {
      return randomBalls;
    }
    this.setState({ selected: randomBalls, fixedBalls: [] });
    this.props.onChange &&
      this.props.onChange(randomBalls, [], this.props.index);
  }

  /**
   * 随机
   * 
   * @param {number} [length=1] 随机的长度
   * @param {boolean} highlight 是否需要高亮随机球
   * @param {array} exclude 需要排除的球
   * @returns { array } 随机的球
   * @memberof BallPanel
   */
  random(length, highlight = false, exclude = []) {
    const { betSize } = this.props;
    const len = typeof length === 'number' && length > 0 ? length : betSize;
    if (betSize > len) {
      return this.completion(len);
    }
    return this.ballRandom(len, highlight, exclude);
  }

  /**
   * 手动选球的处理函数
   * 
   * @param {number, string} 用户选中的球 
   * @returns undefined
   * @memberof BallPanel
   */
  selectHandle(number) {
    const { sort } = this.props;
    const selected = this.state.selected.concat().map(i => i.toString());
    const fixedBalls = this.state.fixedBalls.concat().map(i => i.toString());
    const maxFixedNumberLength = this.props.betSize - 1;
    if (this.props.fixed && maxFixedNumberLength === 0) {
      throw new Error('你设置了可设胆码(fixed), 但是未设置注数的长度(betSize)');
    }
    let newSelected = selected;
    let newFixedBalls = fixedBalls;
    if (selected.indexOf(number) < 0 && fixedBalls.indexOf(number) < 0) {
      newSelected = selected.concat(number);
    } else {
      if (
        this.props.fixed &&
        fixedBalls.length < maxFixedNumberLength &&
        fixedBalls.indexOf(number) < 0
      ) {
        newFixedBalls = this.state.fixedBalls.concat(number);
      } else {
        if (this.props.fixed && this.state.fixedBalls.indexOf(number) > -1) {
          newFixedBalls = this.state.fixedBalls.filter(n => n !== number);
        }
        newSelected = selected.filter(n => n !== number);
      }
    }
    if (this.props.onChange) {
      try {
        const selected = newSelected
          .filter(n => newFixedBalls.indexOf(n) < 0)
          .concat()
          .sort(sort);
        const fixedBalls = newFixedBalls.concat().sort();
        this.props.onChange(selected, fixedBalls, this.props.index, number);
      } catch (e) {
        return;
      }
      const selected = newSelected.concat().sort(sort);
      const fixedBalls = newFixedBalls.concat().sort(sort);
      this.setState({
        selected,
        fixedBalls
      });
    } else {
      const selected = newSelected.concat().sort(sort);
      const fixedBalls = newFixedBalls.concat().sort(sort);
      this.setState({
        selected,
        fixedBalls
      });
    }
    // this.props.onChange && this.props.onChange(newSelected.filter(n => newFixedBalls.indexOf(n) < 0), newFixedBalls, this.props.index);
  }

  clear() {
    this.setState({ selected: [], fixedBalls: [] });
    this.props.onChange && this.props.onChange([], [], this.props.index);
  }

  render() {
    return (
      <div className="ball-panel">
        {this.props.title && (
          <div className="panel-title">{this.props.title}</div>
        )}
        <Balls
          balls={ this.props.balls.map(s => s.toString()) }
          selected={ this.state.selected.map(s => s.toString()) }
          rowLength={ this.props.rowLength }
          random={ this.props.random }
          onRandom={ this.randomHandle.bind(this) }
          onSelect={ this.selectHandle.bind(this) }
          fixedBalls={ this.state.fixedBalls.map(s => s.toString()) }
          color={ this.props.color }
          data={ this.props.data }
          randomLabel={ this.props.randomLabel }
          highlightMin={ this.props.highlightMin }
          highlight={ this.props.highlight }
          labels={ this.props.labels }
        />
        {this.props.children}
      </div>
    );
  }
}

BallPanel.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // 独立的名称，用于将数据存在 sessionStorage 里， 一般使用子彩种 id 例如 10501
  balls: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired, // 所有球的数据, 例如: [1, 2, 3, 4, 5, 6, 7, 8, 9] 或者 ['a', 'b', 'c', 'd']
  index: PropTypes.number, // 页面中有多个选球时，用于区分不同的数据
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  ), // 遗漏/冷热/概率数据, 长度必须和球的个数相同
  fixedBalls: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.string
  ]), // 选中的设胆
  selected: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.string
  ]), // 选中的球
  title: PropTypes.string, // 标题
  rowLength: PropTypes.number, // 每一行球的个数
  random: PropTypes.bool, // 是否有机选功能
  betSize: PropTypes.number, // 投一注,球的个数
  onChange: PropTypes.func, // 选球和设胆后回调的方法，会回传已选择的球和设胆的球以及传进来的 index
  fixed: PropTypes.bool, // 是否有设胆
  color: PropTypes.string, // 球的颜色
  randomLabel: PropTypes.string, // 机选的标签
  children: PropTypes.node,
  labels: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element])
  ),
  highlight: PropTypes.bool, // 是否需要自动高亮数据中的最大和最小数据
  sort: PropTypes.func, // 球的排序方法，一般情况下会尽量处理，特殊情况请传 function 排序
  highlightMin: PropTypes.bool // 是否高亮最小的数据
};

BallPanel.defaultProps = {
  rowLength: 6,
  random: true,
  betSize: 1,
  fixed: false,
  color: '#ED1C24',
  randomLabel: '一注',
  index: 0,
  fixedBalls: [],
  selected: [],
  highlight: true,
  sort: ballSort,
  highlightMin: true
};

function ballSort(a, b) {
  if (isNaN(parseInt(a)) || isNaN(parseInt(b))) {
    return getBallCharCode(a) - getBallCharCode(b);
  }
  return a - b;
}

function getBallCharCode(ball) {
  return ball.split('').reduce((acc, l) => acc + l.charCodeAt(0), 0);
}

function random(length = 1, balls = [], exclude = [], selected = [], sort) {
  if (length > balls.length) throw new Error('随机的个数不得大于面板球的总个数');
  if (length === balls.length) {
    return balls;
  }
  const validBalls = balls.filter(ball => exclude.indexOf(ball.toString()) < 0);
  if (validBalls.length < length) throw new Error('可随机球的个数不得小于随机的个数');
  if (validBalls.length === length) {
    return validBalls;
  }
  let randomBalls = [];
  do {
    randomBalls = sampleSize(validBalls, length);
    try {
      randomBalls.sort(sort);
    } catch (e) {}
  } while (isEqual(randomBalls, selected));
  return randomBalls;
}
