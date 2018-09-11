/*
 * @Author: yubei 
 * @Date: 2017-08-17 11:33:05 
 * Desc: static utils
 */

var u = navigator.userAgent, app = navigator.appVersion;

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
    getParameter: function(name, param, unfilter, undecode) {
        var obj = {},tmp, str = typeof param == 'string' ? param : location.search.replace('?', '');

        var arr = str.split('&');
        var styHash = location.hash.split('?');
        if(styHash.length>1){
            arr = arr.concat(styHash[1].split('&'));
        }
        if(arr.length > 0){
            for(var i = 0, l=arr.length; i < l; i++){
                try{
                    if(/(.*?)=(.*)/.test(arr[i])){
                        tmp = undecode? RegExp.$2: decodeURIComponent(RegExp.$2);
                        obj[RegExp.$1] = unfilter? tmp: this.filterScript(tmp);
                    }
                }catch(e){}
            }
        }
        return name? obj[name] : obj;

    },

    /**
     * 过滤XSS的非法字符
     *
     * @method $.filterScript
     * @param {String} str 需要进行过滤的字符串
    */
    filterScript: function (str){
        var text = document.createTextNode(str), parser = document.createElement('div'), value = '';
        parser.appendChild(text);
        value = parser.innerHTML;
        text = null; parser = null;
        return value;
    },

    browser: {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        yicaiApp: u.indexOf('YiCai') > -1 || u.indexOf('yicai') > -1, // 是否在益彩APP
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
}