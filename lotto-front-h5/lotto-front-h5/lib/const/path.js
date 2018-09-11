/*
 * @Author: yubei 
 * @Date: 2017-08-10 20:57:39 
 * Desc: 常用静态链接
 */

 export const Path = {
     
    // 登录
    getLogin: () => {
        // return `/login/login.html?next=${encodeURIComponent(location.href)}`;
        return `/account.html#/login?next=${encodeURIComponent(location.href)}`;
    },

    // 客服
    getCustomer: () => {
        return 'http://www.71chat.com/scsf/phone/visitor.html?cmpcd=126378';
    },

    // 一比分直播
    getYbfLive: () => {
        return `http://m.13322.com/live/?wap=YC&YCURL=${location.href}`;
    }
 };
