var Env = {
    platform: {
        "isPhone":      true,
        "isAndroid":    true,
        "type":         "PC",
        "isBrower":     true,
    },

    //判断浏览器
    getBrowserType: function() {
        console.log("执行getBrowerType");
        this.platform['type'] = "PC";
        this.platform['isPhone'] = false;
        var ua = navigator.userAgent.toLowerCase();
        console.log("ua:"+ ua);

        if(ua.indexOf('android') > -1) {
            this.platform['type'] = "Android";
            this.platform['isAndroid'] = true;
            this.platform['isPhone'] = true;
            this.platform['isBrower'] = false;
        } else if(ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
            this.platform['type'] = "iOS";
            this.platform['isAndroid'] = false;
            this.platform['isPhone'] = true;
            this.platform['isBrower'] = false;
        }
        return this.platform['type'];
    },
};

Env.getBrowserType();

export default Env;
