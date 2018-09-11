/**
 * @author wangzhiyong
 * @createTime 2017-03-14 10:11
 * @description 公共函数
 */

var func = {

    /***
     * 得到地址栏参数
     * @param key 参数key，默认null
     * @param url 地址，默认为location.href
     * @param decode 转码
     * @return {*}
     */
    getUrlParams(key = null, url = location.href, decode = true){
        let arr = url.substr(url.indexOf('?') + 1, url.length - url.indexOf('?')).split('&');
        let paramsObj = {};
        for (let i = 0, iLen = arr.length; i < iLen; i++) {
            let param = arr[i].split('=');
            paramsObj[param[0]] = decode ? decodeURIComponent(param[1]) : param[1];
        }
        if (key) {
            return paramsObj[key] || '';
        }
        return paramsObj;
    },

    /**
     * 转为英文数字
     * @param num
     * @returns {*}
     */
    commafy: function (num) {
        if ((num + "").trim() == "") {
            return "";
        }
        if (isNaN(num)) {
            return "";
        }
        num = num + "";
        if (/^.*\..*$/.test(num)) {
            var pointIndex = num.lastIndexOf(".");
            var intPart = num.substring(0, pointIndex);
            var pointPart = num.substring(pointIndex + 1, num.length);
            intPart = intPart + "";
            var re = /(-?\d+)(\d{3})/
            while (re.test(intPart)) {
                intPart = intPart.replace(re, "$1,$2")
            }
            num = intPart + "." + pointPart;
        } else {
            num = num + "";
            var re = /(-?\d+)(\d{3})/
            while (re.test(num)) {
                num = num.replace(re, "$1,$2")
            }
        }
        return num;
    },

    /**
     * 数字转星期
     * @param num
     * @returns {*}
     */
    week: function (num) {
        num = num * 1;
        switch (num) {
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
            default:
                return "日";
        }
    },

    /***
     * 字符转日期
     * @param strDate 日期字符格式
     * @returns {Date}
     */
    stringToDate: function (strDate) {
        if (isNaN(strDate)) {
            var date = new Date(Date.parse(strDate.replace(/-/g, "/"))); //转换成Date();
        } else {
            var date = new Date(+strDate);
        }
        return date;
    },

    /**
     * 日期格式化为字符串
     * @param date 日期
     * @param format yyyy-MM-dd hh:mm:ss
     * @returns {*}
     */
    dateformat: function (date, format) {
        if (date instanceof Date) {

        } else if (date && !isNaN(date)) {
            date = new Date(date);
        } else {
            //日期格式错误
            return null;
        }
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },

    /***
     * 计算倒计时
     * @param endTime 结束时间
     * @param timeDiff 时间差(或开始时间)
     * @returns {
   *     total，总毫秒数
   *     day，天
   *     hour，小时
   *     minute，分钟
   *     second，秒
   *     ms，毫秒(0-9)
   * }
     */
    calculateCountdown(endTime, timeDiff = 0){
        // 结束时间毫秒数
        let end = typeof endTime === 'string' ? +this.stringToDate(endTime) : endTime;
        // 当前时间毫秒数
        let now;
        if (typeof timeDiff === 'string') {
            now = +this.stringToDate(timeDiff);
        } else {
            now = +new Date() - timeDiff;
        }
        // 倒计时毫秒数
        let total = end - now;
        // 倒计时的天，小时，分钟，秒，毫秒
        let day = '00';
        let hour = '00';
        let minute = '00';
        let second = '00';
        let ms = '00';
        if (total > 0) {
            // 计算倒计时的天，小时，分钟，秒，毫秒
            day = parseInt(total / (1000 * 60 * 60 * 24));
            hour = parseInt(total % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            minute = parseInt(total % (1000 * 60 * 60) / (1000 * 60));
            second = parseInt(total % (1000 * 60) / 1000);
            ms = parseInt(total % 1000 / 100);
            day = day > 9 ? day : '0' + day;
            hour = hour > 9 ? hour : '0' + hour;
            minute = minute > 9 ? minute : '0' + minute;
            second = second > 9 ? second : '0' + second;
            ms = ms > 9 ? ms : '0' + ms;
        }
        return {total, day, hour, minute, second, ms};
    },

    /**
     * 球对象转数组
     * @param obj {'b01':1}
     * @param num 球个数，默认11
     * @returns {Array}
     */
    balls2List(obj, num = 11){
        let result = [];
        for (let i = 1; i <= num; i++) {
            result.push(obj['b' + (i > 9 ? '' + i : '0' + i)]);
        }
        return result;
    },


    /***
     * 得到hash之后的参数列表(#?)
     * @param key
     * @return {*}
     */
    getHashParams(key){
        let hash = location.hash;
        let url = hash.substr(hash.indexOf('?') + 1, hash.length - hash.indexOf('?')).split('&');
        let paramsObj = {};
        for (let i = 0, iLen = url.length; i < iLen; i++) {
            let param = url[i].split('=');
            paramsObj[param[0]] = param[1];
        }
        if (key) {
            return paramsObj[key] || '';
        }
        return paramsObj;
    },

    /***
     * 对象转URL参数
     * @param obj
     * @returns {string}
     */
    parseParam(obj, key, encode = true) {
        if (obj == null) return '';
        var paramStr = '';
        var t = typeof(obj);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + (encode ? encodeURIComponent(obj) : obj);
        } else {
            for (var i in obj) {
                var k = key == null ? i : key + (obj instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.parseParam(obj[i], k, encode);
            }
        }
        return paramStr;
    },

    /***
     * 改变地址hash
     * @param obj
     */
    hashChange(obj){
        let params = this.getHashParams();
        for (var key in obj) {
            params[key] = obj[key];
        }
        location.hash = '?' + this.parseParam(params).substr(1);
    },

    /***
     * 得到对应class的父元素
     * @param $dom
     * @param className
     * @return {*}
     */
    getParentNode($dom, className){
        let num = 100, result = $dom;
        for (let i = 0; i < num; i++) {
            result = result.parentNode;
            if (result && new RegExp(`${className}$|^${className} `).test(result.className)) {
                return result;
            }
        }
        return null;
    },

    /***
     * 精确加法(浮点数乘10的任意次幂)
     * @return {number}
     */
    add(){
        let args = arguments,
            powList = [],
            pow = 10,
            result = 0;
        for (let i = 0; i < args.length; i++) {
            let arr = args[i].toString().split('.');
            powList.push(arr[1] ? arr[1].length : 0);
        }
        pow = Math.pow(10, Math.max(...powList));
        for (let i = 0; i < args.length; i++) {
            result += args[i] * pow;
        }
        return parseInt(result) / pow;
    },

    /***
     * 设置对象值
     * @param obj
     * @param key
     */
    set(obj, key, value){
        let result = obj;
        let list = key.split('.');
        key = list.pop();
        list.map(item => {
            result = result[item];
        });
        result[key] = value;
    },

    /***
     * 取obj属性值给target
     * @param target
     * @param obj
     */
    assign(target, obj){
        let key;
        for (key in target) {
            if (target[key] instanceof Array) {
                obj[key] && obj[key].length > 0 ? target[key] = obj[key] : void(0);
            } else if (target[key] instanceof Object) {
                obj[key] && JSON.stringify(obj[key]) != '{}' ? target[key] = obj[key] : void(0);
            } else {
                obj[key] ? target[key] = obj[key] : void(0);
            }
        }
    },

    /***
     * 容器内元素画线
     * @param $target 父元素
     * @param selector 节点
     * @param color 颜色
     */
    drawLine($target, selector, color = '#ed1c24') {
        let pBCR = $target.getBoundingClientRect();
        let $weizhi = $target.querySelectorAll(selector);
        if ($weizhi.length > 0) {
            let wPoints = [];
            for (let i = 0; i < $weizhi.length; i++) {
                let cBCR = $weizhi[i].getBoundingClientRect();
                wPoints.push(this.getPoint(cBCR.left - pBCR.left, cBCR.top - pBCR.top, cBCR.width, cBCR.height));
                if (i > 0) {
                    let line = document.createElement('canvas');
                    if (line.getContext) {
                        $target.appendChild(line);
                        let context = line.getContext('2d');
                        let width, height, top, left, start = {}, end = {};
                        if (wPoints[i].left.left == wPoints[i - 1].left.left) {
                            // 正下方
                            width = cBCR.width;
                            height = wPoints[i].top.top - wPoints[i - 1].bottom.top;
                            top = wPoints[i - 1].bottom.top;
                            left = wPoints[i].left.left;
                            start = {x: width / 2, y: 0};
                            end = {x: width / 2, y: height};
                        } else if (wPoints[i].left.left > wPoints[i - 1].left.left) {
                            // 右下方
                            width = wPoints[i].left.left - wPoints[i - 1].right.left;
                            height = wPoints[i].top.top - wPoints[i - 1].top.top;
                            top = wPoints[i - 1].right.top;
                            left = wPoints[i - 1].right.left;
                            start = {x: 0, y: 0};
                            end = {x: width, y: height};
                        } else {
                            // 左下方
                            width = wPoints[i - 1].left.left - wPoints[i].right.left;
                            height = wPoints[i].top.top - wPoints[i - 1].top.top;
                            top = wPoints[i - 1].left.top;
                            left = wPoints[i].right.left;
                            start = {x: width, y: 0};
                            end = {x: 0, y: height};
                        }
                        line.style.width = width + 'px';
                        line.style.height = height + 'px';
                        line.style.top = top + 'px';
                        line.style.left = left + 'px';
                        line.width = width;
                        line.height = height;
                        context.strokeStyle = color;
                        context.lineWidth = 1;
                        context.beginPath();
                        context.moveTo(start.x, start.y);
                        context.lineTo(end.x, end.y);
                        context.stroke();
                        context.closePath();
                    }
                }
            }
        }
    },

    /***
     * 得到元素上下左右4个中间点位置
     * @param left
     * @param top
     * @param width
     * @param height
     * @return {{top: {left: *, top: *}, left: {left: *, top: *}, bottom: {left: *, top: *}, right: {left: *, top: *}}}
     */
    getPoint(left, top, width, height) {
        return {
            top: {
                left: left + width / 2,
                top: top
            },
            left: {
                left: left,
                top: top + height / 2
            },
            bottom: {
                left: left + width / 2,
                top: top + height
            },
            right: {
                left: left + width,
                top: top + height / 2
            }
        };
    },

    /***
     * 得到最大注数和倍数
     * @param ms 截止毫秒数
     * @param list 配置数组
     * @return {{}}
     */
    getBetMultiple(ms, list){
        let bet = 0;
        let multiple = 0;
        let bool = true;
        list.map(item => {
            if (ms > item.endTime * 1000 && bool) {
                bet = item['bettindNum'];
                multiple = item['multipleNum'];
                bool = false;
            }
        });
        return {bet, multiple};
    },

    /**
     * 数组除去重复的
     * @param a
     */
    outRepeat: function (a) {
        let hash = [], arr = [];
        for (var i = 0, elem; (elem = a[i]) != null; i++) {
            if (!hash[elem]) {
                arr.push(elem);
                hash[elem] = true;
            }
        }
        return arr;
    },

    /**
     * 浏览器类型
     * @returns {string}
     */
    browerType()
    {
        var inBrowser = typeof window !== 'undefined';
        var UA = inBrowser && window.navigator.userAgent.toLowerCase();
        var type = "other";
        UA && /msie|trident/.test(UA) ? type = "ie" : null;
        UA && UA.indexOf('msie 9.0') > 0 ? type = "ie9" : null;
        UA && UA.indexOf('edge/') > 0 ? type = "edge" : null;
        UA && UA.indexOf('android') > 0 ? type = "android" : null;
        UA && /iphone|ipad|ipod|ios/.test(UA) ? type = "ios" : null;
        UA && /chrome\/\d+/.test(UA) && !isEdge ? type = "chrome" : null;
        return type;
    },

    /**
     * 是否为IE
     * @returns {boolean|string}
     */
    isIE(){//
        var inBrowser = typeof window !== 'undefined';
        var UA = inBrowser && window.navigator.userAgent.toLowerCase();
        return UA && /msie|trident/.test(UA);
    },

    setCookie(c_name, value, expiredays){
        var exdate = new Date();
        exdate.setTime(exdate.getTime() + expiredays * 24 * 60 * 60 * 1000);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },

    getCookie(c_name){
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                let c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                // token操作登录后保存半小时
                if (c_name == 'token') {
                    this.setCookie('token', unescape(document.cookie.substring(c_start, c_end)), 0.5 / 24)
                }
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    MoneyCN: function (number) {
        var daw = ["亿", "万"];
        var yinum = "";
        var wannum = "";
        var num = Math.floor(number || 0).toString().replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
        var s = "";
        s = num.split(",");
        if (s.length > 2) {
            var count=s.length-3;
            yinum = s[count] + daw[0];
            wannum = parseFloat(s[1]).toString() + daw[1];
            s = yinum + wannum;
        }
        if (s.length > 1 && s.length < 3) {
            wannum = parseFloat(s[0] + s[1]) * 0.0001;
            wannum = wannum.toFixed(2);
            wannum = parseFloat(wannum);
            wannum = wannum.toString() + daw[1];
            s = wannum;
        }
        return s;
    },
}

export default func;