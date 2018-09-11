/*
 * @Author: yubei
 * @Date: 2017-05-08 17:09:25
 * @Desc: 下单组件
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../scss/component/public.scss';

export default class Public extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                {/*加减输入*/}
                <div className="less-add">
                    <span className="less">-</span>
                    <input type="text" />
                    <span className="add">+</span>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<Public />, document.getElementById('app'));