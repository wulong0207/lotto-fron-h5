/*
 * @Author: yubei 
 * @Date: 2017-08-10 14:43:05 
 * Desc: 弹层方法
 */

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Message, Toast } from '../component/message';

export class MessageComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            alert: {
                title: '',
                msg: '',
                btnTxt: ['确认'], // 可不传，默认是确定
                btnFn: [() => {}],
                children: (<span></span>)
            },
            confirm: {
                title: '',
                msg: '',
                btnTxt: ['取消', '确认'], // 可不传，默认是取消，确定
                btnFn: [() => { this.closeConfirm() }, () => {}],
                children: (<span></span>)
            },
            toast: {
                children: (<span></span>),
                timeout: 3000,
                callback: () => {}
            }
        }
    }

    alert(params) {
        this.setState({
            alert: {
                title: params.title,
                msg: params.msg,
                btnTxt: params.btnTxt || ['确认'], // 可不传，默认是确定
                btnFn: params.btnFn,
                children: params.children
            }
        });
        this.alertRef.open();
    }

    confirm(params) {
        this.setState({
            confirm: {
                title: params.title,
                msg: params.msg,
                btnTxt: params.btnTxt || ['取消', '确认'], // 可不传，默认是确定
                btnFn: params.btnFn || [() => { this.closeConfirm() }, () => {}],
                children: params.children
            }
        });
        this.confirmRef.open();
    }

    closeAlert() {
        this.alertRef.close();
    }

    closeConfirm() {
        this.confirmRef.close();
    }

    updateView(children) {
        this.setState({ confirm: { ...this.state.confirm, children } });
    }



    toast(children, timeout = 3000, callback) {
        this.setState({
            toast: { children, timeout, callback }
        })
        this.toastRef.open();
    }

    closeToast() {
        this.toastRef.close();
    }

    render() {
        return (
            <div>
                <Message
                    ref = { alertRef => this.alertRef = alertRef }
                    title = { this.state.alert.title }
                    msg = { this.state.alert.msg }
                    btnTxt = { this.state.alert.btnTxt }
                    btnFn = { this.state.alert.btnFn }>
                    { this.state.alert.children }
                </Message>
                <Message
                    ref = { confirmRef => this.confirmRef = confirmRef }
                    title = { this.state.confirm.title }
                    msg = { this.state.confirm.msg }
                    btnTxt = { this.state.confirm.btnTxt }
                    btnFn = { this.state.confirm.btnFn }>
                    { this.state.confirm.children }
                </Message>
                <Toast ref = { toastRef => this.toastRef = toastRef }
                    timeout = { this.state.toast.timeout }
                    callback = { this.state.toast.callback }>
                    { this.state.toast.children }
                </Toast>
            </div>
        )
    }
}

// ReactDOM.render(<MessageComponent/>,document.getElementById("app"));

class MessageObj {
    constructor() {
        this.render();
    }

    render() {
        this.node = document.createElement('div');
        this.node.className = 'global-message-component';
        document.body.appendChild(this.node);
        render(
            <div>
                <MessageComponent ref = { mess => this.mess = mess }/>
            </div>,
            this.node
        )
    }


    alert(params){
        this.mess.alert(params);
    }

    confirm(params){
      this.mess.confirm(params);
      return this.mess;
    }

      pconfirm(params){
        return new Promise((resolve, reject) => {
          this.mess.confirm({
            ...params,
            btnFn: [reject, resolve]
          });
        })
      }

    toast(content, timeout, callback) {
        this.mess.toast(content, timeout, callback);
    }

    closeAlert() {
        this.mess.closeAlert();
    }

    closeConfirm() {
        this.mess.closeConfirm();
    }

    closeToast() {
        this.mess.closeToast();
    }
}

export default new MessageObj();