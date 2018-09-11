/*
 * @Author: yubei 
 * @Date: 2017-08-04 13:47:01 
 * Desc: 接口错误码处理
 */

import { browser } from '../utils/utils';
import Message from '../services/message';
import Interaction from "../utils/interaction";
import { Path } from './path';

export const errCode = {
    // 接口异常拦截 - 请求时错误码
    '400': {
        logErr: '请求错误'
    },
    '401': {
        logErr: '未授权，请登录'
    },
    '403': {
        logErr: '拒绝访问'
    },
    '404': {
        logErr: `请求地址出错`
    },
    '408': {
        logErr: '请求超时'
    },
    '500': {
        logErr: '服务器内部错误'
    },
    '501': {
        logErr: '服务未实现'
    },
    '502': {
        logErr: '网关错误'
    },
    '503': {
        logErr: '服务不可用'
    },
    '504': {
        logErr: '网关超时'
    },
    '505': {
        logErr: 'HTTP版本不受支持'
    },

    // 接口错误码 - 后台返回错误码
    '10004': { // hessian接口异常:{0}
        message: '接口异常，请重试！'
    },
    '20100': { // token 为空
        func: () => {
            if (browser.yicaiApp) {
                Interaction.sendInteraction('toLogin', []);
            } else {
                // location.href = `/login/login.html?next=${encodeURIComponent(location.href)}`;
                location.replace(Path.getLogin());
            }
        }
    },
    '30602': { // 重新登录
        func: () => {
            if (browser.yicaiApp) {
                Interaction.sendInteraction('toLogin', []);
            } else {
                location.replace(Path.getLogin());
            }
        }
    },
    '40118': { // 重新登录
        func: () => {
            if (browser.yicaiApp) {
                Interaction.sendInteraction('toLogin', []);
            } else {
                location.replace(Path.getLogin());
            }
        }
    },
    '40261': { // token 为空
        func: () => {
            if (browser.yicaiApp) {
                Interaction.sendInteraction('toLogin', []);
            } else {
                location.replace(Path.getLogin());
            }
        }
    },
    '40001': { // token 为空
        func: () => {
            if (browser.yicaiApp) {
                Interaction.sendInteraction('toLogin', []);
            } else {
                location.replace(Path.getLogin());
            }
        }
    },
    '40127': { // 账号名不存在
        func: () => {
            if (browser.yicaiApp) {
                Interaction.sendInteraction('toLogin', []);
            } else {
                location.replace(Path.getLogin());
            }
        }
    },
    '30595': { // 已过支付截止时间
        func: () => {
            Message.alert({
                title: '已过支付截止时间，请重新下单！',
                btnFn: [() => {
                    if (browser.yicaiApp) {
                        // 关闭当前webview
                        Interaction.sendInteraction('toLastVC', []);
                    } else {
                        location.href = '/';
                    }
                }]
            })
        }
    },
    '40133': { // 账号未实名认证
        func: () => {
            Message.confirm({
                title: '您的账户还没有实名认证',
                msg: '是否立即实名认证？',
                btnTxt: ['返回', '立即认证'],
                btnFn: [() => {
                    console.log('返回')
                }, () => {
                    if (browser.yicaiApp) {
                        Interaction.sendInteraction('toRealName', []);
                    } else {
                        location.href = `/sc.html#/real-name?next=${encodeURIComponent(location.href)}`;
                    }
                }],
            });
        }
    },
    '30554': { // 奖金错误时的提示
        func: () => {
            Message.alert({
                title: '支付金额选择错误，请重新选择'
            });
        }
    }
}