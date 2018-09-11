import React, { Component } from 'react';
import '../css/screen.scss';
import cx from 'classnames';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      tabListIndex: [1, 0, 0],
      tabListIsShow: false,
      tabListData: this.props.tabListData
    };
  }

  onTabClick(e, index) {
    if (index === this.state.tabIndex) {
      this.setState({ tabListIsShow: !this.state.tabListIsShow });
    } else {
      this.state.tabItemIndex = index;
      this.setState({ tabListIsShow: true });
    }
    this.setState({ tabIndex: index });
  }

  onTabListClick(index) {
    let tabListIndex = this.state.tabListIndex.concat();
    let tabIndex = this.state.tabIndex;

    if (this.props.onTabChange && tabListIndex[tabIndex] != index) {
      tabListIndex[tabIndex] = index;
      this.props.onTabChange(tabListIndex);
    }
    tabListIndex[tabIndex] = index;
    this.setState({ tabListIndex });
    let tabListData = this.state.tabListData.concat();

    this.setState({ tabListIsShow: !this.state.tabListIsShow });
  }

  getText() {
    let tabData = [
      this.state.tabListData[0][this.state.tabListIndex[0]],
      this.state.tabListData[1][this.state.tabListIndex[1]],
      this.state.tabListData[2][this.state.tabListIndex[2]]
    ];

    return tabData.map((row, index) => {
      return (
        <div
          key={ index }
          className={ cx('item', {
            active: this.state.tabIndex === index && this.state.tabListIsShow
          }) }
          onClick={ e => this.onTabClick(e, index) }
        >
          <div className="txt">{row}</div>
        </div>
      );
    });
  }
  getTabList() {
    let tabIndex = this.state.tabIndex;
    let tabListData = this.state.tabListData[tabIndex];
    return tabListData.map((row, index) => {
      let tabStyle =
        this.state.tabListIndex[tabIndex] === index
          ? 'active single'
          : 'single';
      return (
        <li
          key={ index }
          className={ tabStyle }
          onClick={ this.onTabListClick.bind(this, index) }
        >
          {row} <span className="arrow" />
        </li>
      );
    });
  }

  render() {
    return (
      <div className="screen">
        {this.getText()}
        <div
          className="popUp"
          style={ { display: this.state.tabListIsShow ? 'block' : 'none' } }
        >
          <ul>{this.getTabList()}</ul>
        </div>
      </div>
    );
  }
}

Screen.defaultProps = {
  tabListData: [
    ['全部类型', '足球方案', '篮球方案'],
    ['全部类型', '专家方案', '用户方案'],
    ['抄单最多', '回报率最大', '最大连红']
  ]
};
