/*
 * @Author: yubei
 * @Date: 2017-06-16 17:44:57
 * @Desc: 加载组件
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';

import '../scss/component/loading.scss';

export class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            text: '加载中...'
        }
    }

    show(text = '加载中...', time) {
        this.setState({
            visible: true,
            text: text
        })
        if(time){
            setTimeout(() => {
                this.setState({
                    visible: false
                })
            }, time);
        }
    }

    hide() {
        this.setState({
            visible: false
        })
    }


    render() {
        return (
            <div className={ cx('loading', this.state.visible? 'show': 'hide') }>
                <div className="loader">加载中...</div>
                <span>{ this.state.text }</span>
            </div>
        )
    }
}

const loading = ReactDOM.render(<Loading/>, document.getElementById('loading'));

export default {
    show(text, time) {
        loading.show(text, time);
    },

    hide() {
        loading.hide();
    }
}