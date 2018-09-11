/*
 * @Author: yubei
 * @Date: 2017-06-16 20:50:20
 * @Desc: 工具库
 */

const u = navigator.userAgent, app = navigator.appVersion;

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
export function getParameter(name, param, unfilter, undecode){
    let obj = {},tmp, str = typeof param == 'string' ? param : location.search.replace('?', '');

    /**
     * 过滤XSS的非法字符
     *
     * @method $.filterScript
     * @param {String} str 需要进行过滤的字符串
    */
    function filterScript(str){
        let text = document.createTextNode(str), parser = document.createElement('div'), value = '';
        parser.appendChild(text);
        value = parser.innerHTML;
        text = null; parser = null;
        return value;
    }

    let arr = str.split('&');
    let styHash = location.hash.split('?');
    if(styHash.length>1){
        arr = arr.concat(styHash[1].split('&'));
    }
    if(arr.length > 0){
        for(let i = 0, l=arr.length; i < l; i++){
            try{
                if(/(.*?)=(.*)/.test(arr[i])){
                    tmp = undecode? RegExp.$2: decodeURIComponent(RegExp.$2);
                    obj[RegExp.$1] = unfilter? tmp: filterScript(tmp);
                }
            }catch(e){}
        }
    }
    return name? obj[name] : obj;
}

export function getHashParameters(name) {
    let arr = (location.hash || "").replace(/^\#/,'').split("&");
    let params = {};
    for(let i = 0; i < arr.length; i++){
        let data = arr[i].split("=");
        if(data.length == 2){
             params[data[0]] = data[1];
        }
    }
    return name? params[name] : params;
}



// 判断是否在益彩 App 中
// export function isYiCaiApp() {
// 	const ua = navigator.userAgent.toLowerCase();
// 	console.log('ua:'+ ua);
// 	if(ua.indexOf('yicai') > -1){
// 		return true;
// 	}else{
// 		return false;
// 	}
// }

// 复制内容至剪贴板
export function copyContent(str) {
    let temp = document.createElement('input');
    temp.setAttribute('value',str);
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    console.log('已复制：' + str);
}

// 提取固定字符之间的字符串
export function subInner(str, prefix, postfix) {
    let result;
    prefix = prefix || '';
    postfix = postfix || '';

    if(str){
        let preIndex = str.indexOf(prefix);
        let poIndex = str.lastIndexOf(postfix);

        if(preIndex < 0 && poIndex < 0){
            result = '';
        }else{
            if(preIndex < 0){
                preIndex = 0;
            }else{
                preIndex += prefix.length;
            }
            if(poIndex < 0){
                poIndex = str.length;
            }

            result = str.substring(preIndex, poIndex);
        }
    }

    return result;
}


export const setDate = {
	// 加减天数
	setDays: function(date, d) {
		date.setDate(date.getDate() + d);
	},

	// 加减星期
	setWeeks: function(date, w){
		date.addDays(w * 7);
	},

	// 加减月份
	setMonths: function(date, m) {
		var d = date.getDate();
		date.setMonth(date.getMonth() + m);

		if (date.getDate() < d){
			date.setDate(0);
		}
	},

	// 加减年份
	setYears: function(date, y) {
		date.setFullYear(date.getFullYear() + y);
	},



    /**
    * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    * Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
    * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
    * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
    * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
    * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
    */
    formatDate: function(source, format) {
        if(typeof source == 'string'){
            if(source.indexOf('-') > -1) {
                source = this.convertTime(source);
            }
            source = new Date(source);
        }

        if(!(source instanceof Date)){
            console.log('formatDate：参数不是一个合法的时间字符串或对象');
            return '--'
        }

        if(!format) {
            console.log('formatDate：格式不能为空');
            return '--'
        }

        const o = {
            'M+': source.getMonth() + 1, // 月份
            'd+': source.getDate(), // 日
            'H+': source.getHours(), // 小时
            'm+': source.getMinutes(), // 分
            's+': source.getSeconds(), // 秒
            'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
            'f+': source.getMilliseconds() // 毫秒
        }
        const week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if(/(E+)/.test(format)){
            format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? '\u661f\u671f' : '\u5468') : '') + week[source.getDay() + '']);
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return format
    },

	/**
	 * 格式化时间，有的浏览器不认识 - 格式的时间，需转换为 / 格式的时间字符串
	 * @param {String} 时间 '2017-03-25 20:30:00'
	 * @return {Array} 格式化后的时间 '2017/03/25 20:30:00'
	 */
	convertTime: function(date) {
		return date.replace(/-/g, '/');
	}
}

// 将数值转换为金钱表示法
// export function pareseMoney(num) {
//     if(num){
//         let floatNum = parseFloat(num);
//         if(isNaN(floatNum)){
//             floatNum = 0;
//         }
//         return floatNum.toFixed(2);
//     }
//     return '0.00';
// }

/**
 * 格式化数字金额
 * @param {String} 数字 | 123456789000
 * @param {bool} 是否显示小数2位，角 分
 * @return {Array} 格式化后的金额 123,456,789,000
 */
export function formatMoney(number, split = 3, unit = true) {
    if(typeof number == 'undefined' || (number == '' && number != 0) || number == '--') return number;
    if(unit) {
        number = parseFloat(number).toFixed(2);
    }
    number = number && ('' + number).replace(new RegExp('\\B(?=(?:\\d{' + split + '})+\\b)', 'g'), ',');
	return number == 'NaN'? '--': number;
}

/**
 * 货币格式化
 * @param {String} money 529,892,270，必须是带逗号分隔的格式
 */
export function moneyToCN(money) {
    var monArr = money.split(',');
    var monTxt='';
    // 529,892,270
    switch (monArr.length){
      case 4:
        monTxt = monArr[0] + monArr[1].substr(0,1)+'.'+monArr[1].substr(1,2)+"亿";
        break;
      case 3:
        if(monArr[0].length == 3){
          monTxt = monArr[0].substr(0,1)+'.'+monArr[0].substr(1,2)+"亿";
        } else if (monArr[0].length == 2){
          monTxt = monArr[0].substr(0,2)+monArr[1].substr(0,2)+"万"
        } else if (monArr[0].length == 1){
          monTxt = monArr[0].substr(0,1)+monArr[1].substr(0,2)+"万"
        }
        break;
      case 2:
        if(monArr[0].length == 3){
          monTxt = monArr[0].substr(0,2)+"万";
        } else if (monArr[0].length == 2){
          monTxt = monArr[0].substr(0,1)+"万"
        } else if (monArr[0].length == 1){
          monTxt = '0.'+monArr[0].substr(0,1)+"万"
        }
        break;
      default :
        monTxt = money;
        break;
    }
    return monTxt;
}

/*
 * 智能机浏览器版本信息:
 */
export const browser = {
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
    weixin: u.match(/MicroMessenger/i) == 'MicroMessenger', // 是否在微信打开
    safari: u.indexOf("Safari") != -1 && u.indexOf("Version") != -1, // 是否在safari里面打开
    chrome: u.indexOf("Chrome") && window.chrome, // 是否在chrome里面打开
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

/**
 * 判断两个对象是否相等
 */
export function objEqual(a, b){
    let result = true;

    if(a != b){
        if(JSON.stringify(a) != JSON.stringify(b)){
            result = false;
        }
    }

    return result;
}
