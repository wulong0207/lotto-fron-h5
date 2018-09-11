/*
 * @Author: yubei 
 * @Date: 2017-11-09 16:58:55 
 * Desc: 调用APP JS库
 */

 ;(function(global){
    var u = navigator.userAgent, app = navigator.appVersion;

    function JSBridge() {
        this.name = 'HSBridge';
        this.reset = true;
    };

    JSBridge.prototype.device = {
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
        yicaiApp: u.indexOf('YiCai') > -1 || u.indexOf('yicai') > -1 // 是否在益彩APP        
    };

    JSBridge.prototype._init = function(callback) {
        if(window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                return callback(WebViewJavascriptBridge);
            }, false);
        } 
    };
 })