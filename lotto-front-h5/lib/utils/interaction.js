// var Env = require('./env');
import Env from './env';
window.handleKeyBoard = null;

// function fillInputContent(data)
window.fillInputContent = function(data)
{
    console.log("测试fillInputContent"+data);
    window.handleKeyboard(data);
};

window.handlePageBack = null;

export default {

    /*--------------------Begin: H5调用原生的请求--------------------*/

    /**
     *    URL 跳转界面
     *    @param url    url地址
     *    @param hasRefresh    标识有无刷新按钮 0：显示，4：隐藏(占空间),8:隐藏(不占空间)
     *    @param direction    1：下一级界面；-1：返回上一级界面  0：在原生覆盖掉当前页面  -100：直接成为顶层页面
     */
    navigate: function(url, hasRefresh, direction, handlePageBack){
        console.log("Env.platform.isBrower", Env.platform.isBrower);
        if(handlePageBack){
            window.handlePageBack = handlePageBack;
        }
        if(Env.platform.isPhone){
        // if(!Env.platform.isBrower){
            // 未传第2个参数时默认为0
            hasRefresh = hasRefresh == undefined ? 0 : hasRefresh;
            // 未传第3个参数时默认为1
            direction = direction == undefined ? 1 : direction;
            // hasRefresh 参数值不是数字，使用默认值 0
            hasRefresh = !isNaN(hasRefresh) ? parseInt(hasRefresh) : 0;
            // direction 参数值不是数字，使用默认值 1
            direction = !isNaN(direction) ? parseInt(direction) : 1;

            this.sendInteraction("navigate", [url, hasRefresh, direction]);
        }else{
            url = this.getFirstHref() + url;
            console.log("跳转地址：" + url);
            // 平级页面之间的跳转
            if(direction == 0) {
                location.replace(url)
            } else {
                location.href = url;
            }
        }
    },


    //2.返回个人中心页面
    goCenter:function(){
        this.sendInteraction("goCenter", []);
    },

    //3.前往添加新的银行卡
    goAddbankCard:function(){
        this.sendInteraction("goAddbankCard", []);
    },

    //前往双色球页面
    goSSQ: function(){
        this.sendInteraction("goSSQ", []);
    },

    //前往福彩3D
    goFC3D: function() {
        this.sendInteraction("goFC3D", []);
    },

    // 支付结果确认
    payResult: function(content){
        this.sendInteraction('payResult', [content]);
    },

    //记录日志
    //提示：由于IOS平台限制，该方法需在页面跳转之后调用，否则会阻止页面跳转
    log: function(content){
        this.sendInteraction("log", [content]);
    },

    /**
     * 调用原生的方法，前往对应彩种购彩页面
     * @param lotteryCode 彩种的id
     */
    toBetVC: function(lotteryCode){
        this.sendInteraction("toBetVC", [lotteryCode]);
    },

    /*--------------------End: H5调用原生的请求--------------------*/

    /**
     * 发送与原生接口的交互请求
     * @param  {String} methodName 方法名
     * @param  {Array} parameters 参数数组
     */
    sendInteraction: function(methodName, parameters){
        // 判断如果是 PC, 则不处理
        if (Env.platform.isBrower) {

        }else{
            YcNative[methodName].apply(YcNative, parameters);
        }

        // //判断如果是IOS平台则发送IOS请求，是Android平台则发送Android请求
        // else if(Env.platform.isAndroid) {
        //     if(methodName == "log"){
        //         console.log.apply(console, parameters);
        //     } else {
        //         // Android 平台
        //         YcNative[methodName].apply(YcNative, parameters);
        //     }
        // } else if(Env.platform.isPhone) {
        //     //IOS 平台
        //     //组装方法
        //     var iosMethod = "YcNative://" + methodName;

        //     //组装参数
        //     var iosParams = "";
        //     if(parameters){
        //         for (var i = 0; i < parameters.length; i++) {
        //             iosParams += ":" + parameters[i];
        //         };
        //     }

        //     //与IOS端交互
        //     location.href = iosMethod + iosParams;
        // }
    },

    /**
     * 函数功能：获取当前URL地址前半部分
     */
    getFirstHref: function() {
        var _url = window.location.href;
        var _index = _url.indexOf("views/");
        _url = _url.substring(0,_index+6);
        return _url;
    },
};
