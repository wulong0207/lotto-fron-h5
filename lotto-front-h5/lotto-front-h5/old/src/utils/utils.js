/*
 * @Author: yubei
 * @Date: 2017-06-16 16:15:01
 * @Desc: utils
 */

const u = navigator.userAgent, app = navigator.appVersion;

var utils = {


    /**
     * 获取url或者自定义的hash字符串中的参数信息
     *
     * @method $.getParameter
     * @param {String} name 不传name则直接返回整个参数对象
     * @param {String} param 转成对象的hash字符串
     * @param {Boolean} [unfilter:false] 不进行参数XSS安全过滤
     * @param {Boolean} [undecode:false]] 不进行自动解码
     * @return {String|Object} 获取到的参数值或者由所有参数组成完整对象
     */
    getParameter: function (name, param, unfilter, undecode) {
        var obj = {},
            tmp,
            str = typeof param == "string" ? param : location.search.replace("?", "");

        var arr = str.split("&");
        var styHash = location.hash.split("?");
        if (styHash.length > 1) {
            arr = arr.concat(styHash[1].split("&"));
        }
        if (arr.length > 0) {
            for (var i = 0, l = arr.length; i < l; i++) {
                try {
                    if (/(.*?)=(.*)/.test(arr[i])) {
                        tmp = undecode ? RegExp.$2 : decodeURIComponent(RegExp.$2);
                        obj[RegExp.$1] = unfilter ? tmp : this.filterScript(tmp);
                    }
                } catch (e) {}
            }
        }
        return name ? obj[name] : obj;
    },

    /**
     * 过滤XSS的非法字符
     *
     * @method $.filterScript
     * @param {String} str 需要进行过滤的字符串
     */
    filterScript: function (str) {
        var text = document.createTextNode(str),
            parser = document.createElement("div"),
            value = "";

        parser.appendChild(text);

        value = parser.innerHTML;

        text = null;
        parser = null;

        return value;
    },

    /*
    * 智能机浏览器版本信息:
    */
    browser: {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        // mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        mobile: /(iPhone|iPad|iPod|iOS|Android)/i.test(u), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        yicaiApp: u.indexOf('YiCai') > -1 || u.indexOf('yicai') > -1, // 是否在益彩APP
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    },



    // channelId 渠道ID 2、本站PC；4、本站android；5、本站IOS；6、本站WAP；7、未知渠道；运营渠道移动端比较清楚
    // clientType 客户端类型	1：Web; 2：Wap；3：Android；4：IOS；5：其他。这个字段主要是针对H5的。
    // platform 注册平台 1.web, 2.wap, 3.android, 4.ios
    // 如果android和IOS的支付都是跳转到H5，此参数应该传对应的android和ios的编码

    // 获取渠道，客户端信息，代理编码等
    getSpread: function() {
        let channelId = this.getChannelId();
        let clientType = this.getClientType();
        let agentCode = this.getAgentCode();
        return Object.assign(channelId, clientType, agentCode);
    },

    // 获取渠道
    getChannelId: function() {
        let channelId = this.getParameter('channelId') || localStorage.getItem('channelId') || '';
        if(!channelId) channelId = 6;
        if(typeof channelId == 'number' || typeof channelId == 'string'){
            localStorage.setItem('channelId', channelId);
        }else{
            localStorage.setItem('channelId', JSON.stringify(channelId));
        }
        return { channelId };
    },

    // 获取客户端信息
    getClientType: function () {
        let clientType = 2; // wap
        if(this.browser.mobile){
            clientType = 2; // wap
        }
        if(this.browser.yicaiApp && browser.android){
            clientType = 3; // android
        }
        if(this.browser.yicaiApp && browser.ios){
            clientType = 4; // ios
        }
        return { clientType, platform: clientType }
    },

    // 获取代理编码
    getAgentCode: function () {
        let agentCode = this.getParameter('agentCode') || localStorage.getItem('agentCode') || '';
        if(!agentCode){
            return {};
        }else{
            if(typeof agentCode == 'number' || typeof agentCode == 'string'){
                localStorage.setItem('agentCode', agentCode);
            }else{
                localStorage.setItem('agentCode', JSON.stringify(agentCode));
            }
        }
        return { agentCode };
    }
}