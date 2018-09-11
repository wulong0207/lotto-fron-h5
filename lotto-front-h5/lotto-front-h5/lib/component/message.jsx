/*
 * @Author: yubei
 * @Date: 2017-05-05 20:44:54
 * @Desc: 弹层
 */

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import cx from 'classnames';
import '../scss/component/message.scss';

/**
 *

Message.alert({
    title: '标题',
    msg: '提示的内容',
    btnTxt: ['确定'], // 可不传，默认是确定
    btnFn: [() => {console.log('确定')}],
    children: (<em>内容</em>)
});

Message.confirm({
    title: '标题',
    msg: '提示的内容',
    btnTxt: ['取消', '确定'],
    btnFn: [() => {console.log('取消')},() => {console.log('确定')}],
    children: (<em>内容</em>)
});

Message.toast(err.message， 3000, () => {console.log('回调')});

 *
 */



export class Message extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            fade: false // 延时处理
        }
        this.timer = null;
    }

    static defaultProps = {
        title: '', // 标题
        msg: '', // 提示的内容
        btnTxt: ['确定'], // 可不传，默认为 确定 ['取消', '确定']
        btnFn: [() => {console.log('确定')}]
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        msg: PropTypes.string.isRequired,
        btnTxt: PropTypes.array.isRequired,
        btnFn: PropTypes.array.isRequired
    }

    componentWillUnmount() {
        if(this.timer) clearTimeout(this.timer);
    }

    okHandler() {
        const btnFn = this.props.btnFn;
        let isClose = Array.isArray(btnFn) && typeof btnFn[1] === 'function' && btnFn[1]();
        if(typeof isClose == 'undefined' || isClose) {
            this.close();
        }
    }

    cancelHandler() {
        const btnFn = this.props.btnFn;
        if (Array.isArray(btnFn) && typeof btnFn[0] === 'function') {
            const isClose = btnFn[0]();
            if (typeof isClose === 'boolean' && isClose) return undefined;
            this.close();
        }
    }

    open() {
        this.setState({
            visible: true
        })        
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState({
                fade: true
            }
        )}, 10);
    }

    close() {
        this.setState({
            fade: false
        })
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState({
                visible: false
            }
        )}, 300);
    }

    render(){
        return (
            <section className={ cx('alert', {'alert-show': this.state.visible, 'alert-fade': this.state.fade})}>
                <div className="mask" onClick={this.close.bind(this)}></div>
                <div className="alert-cover">
                    <div className="alert-warp">
                        <div className="alert-con">
                            <h1>{this.props.title}</h1>
                            {/*{ this.props.title? <h1>{this.props.title}</h1>: '' }*/}
                            <div className="content">
                                <p>{this.props.msg}</p>
                                {this.props.children}
                            </div>
                        </div>
                        { this.props.btnTxt.length > 1 ?
                            <div className="alert-btn">
                                <a className="btn-l" href="javascript: void(0)" onClick={this.cancelHandler.bind(this)}>{this.props.btnTxt[0]}</a>
                                <a className="btn-r" href="javascript: void(0)" onClick={this.okHandler.bind(this)}>{this.props.btnTxt[1]}</a>
                            </div>
                            :
                            <div className="alert-btn">
                                <a className="btn-l" href="javascript: void(0)" onClick={this.cancelHandler.bind(this)}>{this.props.btnTxt[0]}</a>
                            </div>
                        }
                    </div>
                </div>
            </section>
        )
    }
}


export class Toast extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    static defaultProps = {
        timeout: 3000, // 超出时间
        callback: () => {} // 回调方法
    }

    static propTypes = {
        timeout: PropTypes.number.isRequired,
        callback: PropTypes.func.isRequired
    }

    open() {
        this.setState({
            visible: true
        });

        if(this.props.timeout){
            setTimeout(() => {
                this.setState({
                    visible: false
                });
                typeof this.props.callback === 'function' && this.props.callback();
            }, this.props.timeout);
        }
    }

    close() {
        this.setState({
            visible: false
        });
        typeof this.props.callback ==='function' && this.props.callback();
    }

    render(){
        return (
            <section className={ cx('toast', {'toast-show':  this.state.visible}) }>
                {this.props.children}
            </section>
        )
    }
}


// export default {
//     alert(params) {
//         // 默认数据填充
//         if(!params.btnTxt){
//             params.btnTxt = [['确定']];
//         }
//         if(!!document.getElementById('alert')) {
//             // 存在
//             let child = document.getElementById('alert');
//             document.body.removeChild(child);
//         }
//         let alertElement = document.createElement('div');
//         alertElement.id = 'alert';
//         document.body.appendChild(alertElement);
//         //const children = <div dangerouslySetInnerHTML={{__html: params.children }} />;
//         ReactDOM.render(<MessageView params={params}>{ params.children }</MessageView>, document.getElementById('alert'));
//     },

//     confirm(params) {
//         return new Promise((resolve, reject) => {
//             if(!params.btnTxt){
//                 params.btnTxt = ['取消', '确定'];
//             }
//             params.btnFn = [params.btnFn && params.btnFn[0] || reject, params.btnFn && params.btnFn[1] || resolve];
//             if(!!document.getElementById('confrim')) {
//             // 存在
//                 let child = document.getElementById('confrim');
//                 document.body.removeChild(child);
//             }
//             let alertElement = document.createElement('div');
//             alertElement.id = 'confrim';
//             document.body.appendChild(alertElement);
//             //const children = <div dangerouslySetInnerHTML={{__html: params.children }} />;
//             ReactDOM.render(<MessageView params={params}> { params.children }</MessageView>, document.getElementById('confrim'));
//         });

//     },

//     toast(text, timeout = 3000, callback) {
//         console.log(text);
//         if(!!document.getElementById('toast')) {
//             // 存在
//             let child = document.getElementById('toast');
//             document.body.removeChild(child);
//         }
//         let toastElement = document.createElement('div');
//         toastElement.id = 'toast';
//         document.body.appendChild(toastElement);
//         // const children = <div dangerouslySetInnerHTML={{__html: text}}/>
//         ReactDOM.render(<ToastView>{ text }</ToastView>, document.getElementById('toast'));

//         let toast = document.getElementById('toast');
//         setTimeout(()=>{
//             document.body.removeChild(toast);
//             callback && callback();
//         }, timeout);
//     }
// }