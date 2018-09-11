import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/component/keyboard.scss';
import Dialog from '@/services/message.js';

export default class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curNum: 1,
      show: false
    };
  }

  static propTypes = {
    show: PropTypes.bool,
    curNum: PropTypes.number,
    onShow: PropTypes.func,
    onConfirm: PropTypes.func,
    title: PropTypes.any,
    menu: PropTypes.any,
    message: PropTypes.object,
    onChange: PropTypes.func
  };

  componentDidMount() {
    this.setState({ show: this.props.show, curNum: this.props.curNum || 1 });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.state.show ||
      nextState.curNum !== this.state.curNum
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show != null && this.state.show !== nextProps.show) {
      this.setState({ show: nextProps.show });
    }
  }

  // 展示或隐藏键盘
  show(isShow) {
    let show = !this.state.show;
    if (isShow != null) {
      show = isShow;
    }

    this.setState({ show });

    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  open() {
    this.show(true);
  }

  // 点击确认事件
  onConfirmHandler() {
    let self = this;
    this.show(false);

    if (!self.inputk.value) {
      self.state.curNum = 1;
    }

    if (this.props.onConfirm) {
      this.props.onConfirm(this.state.curNum);
    }
  }

  getKeyBoard() {
    let numPad = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let style;
    let self = this;
    let { title, menu } = this.props;
    let topCustomBtns = menu;
    let topCustomBtnsArea; // 顶部自定义按钮
    let num = this.state.curNum;

    if (topCustomBtns) {
      topCustomBtnsArea = (
        <div className="top-area">
          {topCustomBtns.map((val, index) => {
            val.subColor = val.subColor || '';

            return (
              <div
                key={ index }
                className="top-item"
                onClick={ self.onNumClick.bind(self, 1, val.value) }
              >
                <div className="title">{val.title}</div>
                <div className={ 'subtitle ' + val.subColor }>{val.subtitle}</div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        style={ style }
        ref={ keyboard => (this.keyboard = keyboard) }
        className="keyboard"
      >
        <div className="take-position" onClick={ this.show.bind(this, false) } />
        <div className="keyboard-area">
          <div className="item-set">
            <div className="txt">{title}</div>
            <div className="button-area">
              <span onClick={ this.onAddNum.bind(this, -1) } className="btn-set">
                -
              </span>
              <div className="input-ct">
                <input
                  ref={ inputk => (this.inputk = inputk) }
                  type="text"
                  value={ num || '' }
                  readOnly="readonly"
                />
              </div>
              <span onClick={ this.onAddNum.bind(this, 1) } className="btn-set">
                +
              </span>
            </div>
          </div>
          {topCustomBtnsArea}
          <div className="keyboard-btns">
            {numPad.map((val, index) => {
              return (
                <div
                  key={ index }
                  className="btn-item"
                  onClick={ self.onNumClick.bind(self, 2, val) }
                >
                  {val}
                </div>
              );
            })}
            <div
              className="btn-item delete"
              onClick={ self.onNumClick.bind(self, 3, null) }
            >
              <img
                width="80"
                height="80"
                src={ require('../img/keyboard_delete@2x.png') }
              />
            </div>
            <div
              className="btn-item"
              onClick={ self.onNumClick.bind(self, 2, 0) }
            >
              0
            </div>
            <div
              className="btn-item special"
              onClick={ this.onConfirmHandler.bind(this) }
            >
              确定
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 键盘上各按钮的点击事件
  onNumClick(type, value) {
    let { curNum } = this.state;

    switch (type) {
      case 1:
        {
          // 直接赋值
          let numVal = parseInt(value);
          this.onAddNum(numVal - curNum);
        }
        break;
      case 2:
        {
          // 在值末尾添加字符
          let num = this.inputk.value + value;
          if (!this.inputk.value && value === '0') {
            return;
          }
          let numVal = parseInt(num);
          this.onAddNum(numVal - curNum);
        }
        break;
      case 3:
        {
          // 删除
          this.inputk.value = this.inputk.value.slice(0, -1);
          let numi = parseInt(this.inputk.value);
          if (this.inputk.value && !isNaN(numi)) {
            this.onAddNum(numi - curNum);
          }
        }
        break;
    }
  }

  // 点击加减按钮事件
  onAddNum(num) {
    let { message, onChange } = this.props;
    let curNum = this.state.curNum + num;
    if (curNum > 0) {
      if (message.max > 0 && curNum > message.max) {
        this.setState({ curNum: message.max });
        Dialog.alert({
          title: message.title,
          btnTxt: ['我知道了'], // 可不传，默认是确定
          children: message.msg
        });
      } else {
        this.setState({ curNum });
        if (onChange) {
          onChange(curNum);
        }
      }
    }
  }

  render() {
    let { show } = this.state;

    return <div className="yc-keyboard">{show ? this.getKeyBoard() : ''}</div>;
  }
}

// 生成键盘按钮
Keyboard.createMenu = (mul, money, noadd) => {
  mul = mul || '';
  money = money || '';
  let result = [
    // 投注倍数
    { title: '投10倍', value: 10 },
    { title: '投50倍', value: 50 },
    { title: '投100倍', value: 100 }
  ];

  if (mul && money) {
    result.push({
      title: '投' + mul + '倍',
      value: mul,
      subtitle: `可掏空奖池${money}`,
      subColor: 'red'
    });
  } else {
    if (!noadd) {
      result.push({ title: '投200倍', value: 200 });
    }
  }
  return result;
};

Keyboard.defaultProps = {
  menu: Keyboard.createMenu(false, false, true), // 投注倍数
  num: 1,
  message: {
    max: 0,
    msg: '',
    title: '哇, 土豪！'
  },
  title: '倍数',
  onChange: null,
  onConfirm: null, // 点击确定事件
  onShow: null // 展示事件
};
