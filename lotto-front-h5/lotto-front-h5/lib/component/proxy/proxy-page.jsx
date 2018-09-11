/*
 * @Author: yubei 
 * @Date: 2017-09-15 15:59:35 
 * Desc: 代理入口
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Header from "../header";

import "../../scss/component/proxy/proxy-page.scss";

export default class ProxyPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        };
        this.Env = '';
    }

    static defaultProps = {
        isPage: false
    }

    static propTypes = {
        isPage: PropTypes.bool.isRequired
    }

    componentWillMount() {
        let host = location.host;
        if(host.indexOf('.193') > -1) {
            this.Env = 'dev';
        }
        if(host.indexOf('sit.') > -1) {
            this.Env = 'sit';
        }

        if(this.timer) clearTimeout(this.timer);

        if(this.props.isPage) {
            this.onOpen();
        }
    }

    register() {
        if(this.Env == 'dev') {
            window.location = 'http://sitmdl.2ncai.com/registerForOther?mchId=97199037186310154';
        }else if(this.Env == 'sit') {
            window.location = 'http://sitmdl.2ncai.com/registerForOther?mchId=97199037186310154';
        } else {
            window.location = 'http://mdl.2ncai.com/registerForOther?mchId=97199037186310154';
        }
    }
    login() {
         if(this.Env == 'dev') {
            window.location = 'http://sitmdl.2ncai.com/login?mchId=97199037186310154';
        }else if(this.Env == 'sit') {
            window.location = 'http://sitmdl.2ncai.com/login?mchId=97199037186310154';
        } else {
            window.location = 'http://mdl.2ncai.com/login?mchId=97199037186310154';
        }
    }

    onOpen() {
        const html = document.getElementsByTagName('html')[0];
        html.classList.add('pop-open');
        // html.style.height = window.innerHeight + 'px';
        this.setState({ visible: true });
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => { this.setState({ fade: true })}, 10);
    }

    onClose() {
        const html = document.getElementsByTagName('html')[0];
        html.classList.remove('pop-open');
        // html.style.height = 'auto';
        if(this.timer) clearTimeout(this.timer);
        this.setState({ fade: false });
        this.timer = setTimeout(() => { this.setState({ visible: false })}, 300);
    }

    onBack() {
        if(this.props.isPage) {
            history.go(-1);
        }else{
            this.onClose();
        }
    }

    render() {
        return (
            <div className={ cx(this.props.isPage? 'show-page': 'proxy-page', {'show': this.state.visible, 'showProxyPage': this.state.fade })}>
                <Header title='代理' back={ this.onBack.bind(this) }></Header> 
                <section className="proxy-rule">
                    <h1 className="proxy-title">
                        代理佣金收入规则
                    </h1>
                    <table className="proxy-table">
                        <thead>
                            <tr>
                                <th>收入来源</th>
                                <th>销量</th>
                                <th>返佣比例</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowSpan="4">返佣</td>
                                <td>{ '0 < X < 300000' }</td>
                                <td>2.0%</td>
                            </tr>
                            <tr>
                                <td>{ '300000 ≤ X < 1000000' }</td>
                                <td>3.0%</td>
                            </tr>
                            <tr>
                                <td>{ '1000000 ≤ X < 2000000' }</td>
                                <td>3.5%</td>
                            </tr>
                            <tr>
                                <td>{ '≥ 200万' }</td>
                                <td>4.0%</td>
                            </tr>
                            <tr>
                                <td rowSpan="4">额外奖励</td>
                                <td>{ '100000 < X < 300000' }</td>
                                <td>0.5%</td>
                            </tr>
                            <tr>
                                <td>{ '300000 ≤ X < 1000000' }</td>
                                <td>0.8%</td>
                            </tr>
                            <tr>
                                <td>{ '1000000 ≤ X < 2000000' }</td>
                                <td>1.0%</td>
                            </tr>
                            <tr>
                                <td>{ '≥ 200万' }</td>
                                <td>1.2%</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="proxy-info">
                    <span>备注：</span>
                    <ul className="proxy-desc">
                        <li>代理收入=返佣+额外奖励</li>
                        <li>返佣：根据直属购彩会员的销量多少进行计算</li>
                        <li>额外奖励：根据直属下级代理发展的购彩会员销量进行计算</li>
                    </ul>
                </section>
                <div className="proxy-btn">
                    <span className="button btn-blue btn-large" onClick={ this.register.bind(this) }>注册代理</span>
                    <p onClick={ this.login.bind(this) }>已有账号，立即登录</p>
                </div>
            </div>
        )
    }
}