import React, { Component } from 'react';
import './tab.scss';

export default class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      menuIndex: 0,
      menuIsShow: false
    };
  }

  tabClick(index) {
    this.setState({ current: index });

    if (this.props.tabChange) {
      this.props.tabChange(index);
    }
  }

  onmenuListClick(index) {
    this.setState({ menuIndex: index });

    if (this.props.menuLsitClick) {
      this.props.menuLsitClick(index);
    }
  }

  onmenuClick() {
    this.setState({ menuIsShow: !this.state.menuIsShow });
  }

  back() {
    // 返回回调方法
    // 解决Safari缓存问题导致页面不加载JS或不执行js
    //
    if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
      window.location.href = window.document.referrer;
    } else {
      window.history.go('-1');
    }
  }

  componentDidMount() {}

  render() {
    let tabData = this.props.tabData;
    let menuData = this.props.menuData;
    let tabStyle, menuIndex;
    return (
      <div className="tabBox">
        <div className="backBox">
          <a
            href="javascript: void(0);"
            className="back"
            onClick={ this.back.bind(this) }
          />
        </div>
        <ul className="tab">
          {tabData.map((row, index) => {
            tabStyle = this.state.current === index ? 'item active' : 'item';
            return (
              <li
                className={ tabStyle }
                key={ index }
                onClick={ this.tabClick.bind(this, index) }
              >
                {row}
              </li>
            );
          })}
        </ul>
        <div
          className="menuBox"
          onClick={ this.onmenuClick.bind(this) }
          style={ { visibility: this.props.isShow ? 'visible' : 'hidden' } }
        >
          <div className="menu">
            <i className="dot" />
            <i className="dot" />
            <i className="dot" />
          </div>
          <ul
            className="menuList"
            style={ { display: this.state.menuIsShow ? 'block' : 'none' } }
          >
            {menuData.map((row, index) => {
              menuIndex =
                this.state.menuIndex === index ? 'item active' : 'item';
              return (
                <li
                  className={ menuIndex }
                  key={ index }
                  onClick={ this.onmenuListClick.bind(this, index) }
                >
                  {row}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

Tab.defaultProps = {
  tabData: ['足球专家', '篮球专家'], // tab栏的数据
  menuData: ['命中率最大', '推荐最多', '最大猜中'], // 头部右边的菜单
  isShow: true // 头部右边菜单是否显示
};
