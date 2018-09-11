/*
 * @Author: yubei
 * @Date: 2017-06-27 16:31:26
 * @Desc: 数字彩tab切换组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import '../../scss/component/number/tab.scss';

export default class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    static defaultProps = {
        bg: 'blue',     // 背景颜色
        index: 0,      // 当前选中第几个
        onChangeTab: function () { },
        switch: true, // 下拉展开菜单
        tabs: [{
            name: 'tab1',
            desc: '1元'
        }, {
            name: 'tab2',
            desc: '2元'
        }]
    }

    static PropTypes = {
        bg: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        switch: PropTypes.bool.isRequired,
        tabs: PropTypes.array.isRequired,
        onChangeTab: PropTypes.func.isRequired
    }

    // ready
    componentWillMount() {
        // 初始化默认选中
        this.setState({ index: this.props.index });
    }


    // 切换
    switcher(e, index) {
        this.setState({ 
            index,
            visible: false
        });
        this.props.onChangeTab(index);
    }

    // 切换tab开关
    switchtTabs() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        const props = this.props;
        return (
            <section className={"header-tab bg-" + props.bg}>
                <div className="tabs">
                    <table>
                        <tbody>
                            <tr>
                                {props.tabs.map((row, index) => {
                                    return (
                                        <td className={cx({ 'cur': index == this.state.index })} key={index} onClick={e => this.switcher(e, index)}>
                                            <div>{row.name}</div>
                                            <span>{row.desc}</span>
                                        </td>
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
                { this.props.switch? (
                    <div className="tab-switch">
                        <span className="tab-switch-arrow" onClick={this.switchtTabs.bind(this)}></span>
                        <section className={ cx('tab-switch-con', this.state.visible? 'show': 'hide') }>
                            <div className="tab-switch-bg">
                                <ul>
                                    {props.tabs.map((row, index) => {
                                        return (
                                            <li className={cx({ 'cur': index == this.state.index })} key={index} onClick={e => this.switcher(e, index)}>
                                                <div>{row.name}</div>
                                                <span>{row.desc}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </section>
                    </div>
                ): '' }
            </section>
        )
    }
}