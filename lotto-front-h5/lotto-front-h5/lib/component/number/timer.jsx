/*
 * @Author: YLD
 * @Date: 2017-07-19 16:24:00
 * @Desc: 计时器工具
 *
 * 公开的方法
 *     start(endTime, serverTime) 启动计时器，传入截止时间和服务器时间（可不传）
 *     clear() 清除计时器，计时器归0
 *     setEndTime(val) 设置截止时间
 *     setTimeFix(val) 设置时间修正，例如当服务器有时间时，则修正为与服务器时间相同
 */
export default class Timer {
    constructor(endTime) {
        this.timer = null;
        this.endTime = 0; // 停止时间
        this.onTick = null; // 回调的方法
        this.onTimeout = null; // 计时完成的回调方法
        this.currentTime = 0; //当前时钟开始的时间
        this.timeFix = 0; //设置时间修正，例如当服务器有时间时，则修正为与服务器时间相同
        this.timeFixSpan = 0; //设置时间修正与计时器开始时间的差值
        this.tickSpan = 1000;
        this.setEndTime(endTime);
    }

    getTimeFromInput(val){
        let result = 0;
        //如果是字符串的话，则转为时间
        if(typeof val == "string"){
            let date = this.fixDate(val);
            result = date.getTime();
        }

        return result;
    }

    /**
     * 设置截止时间
     */
    setEndTime(val){
        if (val == null) return;
        //如果是字符串的话，则转为时间
        if(typeof val == "string"){
            let date = this.fixDate(val);
            this.endTime = date.getTime();
        }else if(typeof val == "number"){
            let date = new Date();
            date.setSeconds(date.getSeconds() + val);
            this.endTime = date.getTime();
        }else if(val instanceof Date){
            this.endTime = val.getTime();
        }
    }

    /**
     * 设置时间修正，例如当服务器有时间时，则修正为与服务器时间相同
     */
    setTimeFix(val){
        let curDate = new Date().getTime();

        //如果是字符串的话，则转为时间
        if(typeof val == "string"){
            let date = this.fixDate(val);
            this.timeFix = date.getTime();
        }else if(val instanceof Date){
            this.timeFix = val.getTime();
        }

        this.timeFixSpan = curDate - this.timeFix;
    }

    /**
     * 设置执行间隔时间
     */
    setTickSpan(val){
        this.tickSpan = val;
    }

    /**
     * 开始倒计时
     * @return {[type]} [description]
     */
    start(endTime, serverTime){
        this.clear();

        if(endTime){
            this.setEndTime(endTime);
        }

        if(serverTime){
            this.setTimeFix(serverTime);
        }

        this.timer = setInterval(() => this.tick(), this.tickSpan);
    }

    /**
     * 倒计时的方法
     */
    tick(){
        let curDate = new Date().getTime() - this.timeFixSpan;
        let remaining = this.endTime - curDate;
        let allSeconds = Math.floor(remaining / 1000);
        let hour = Math.floor(allSeconds / 3600);
        let minutes = Math.floor(allSeconds % 3600 / 60);
        let seconds = Math.floor(allSeconds % 3600 % 60);

        if(remaining < 0){
            this.clear();

            if(this.onTimeout){
                this.onTimeout();
            }
        }else{
            let result = {
                timeStr: this.fillUp(hour) + ":" + this.fillUp(minutes) + ":" + this.fillUp(seconds),
                seconds: allSeconds,
                hour: hour,
                minutes: minutes,
                millisecond: remaining
            };

            if(this.onTick){
                this.onTick(result);
            }
        }
    }

    /**
     * 清除时间计时
     */
    clear(){
        if(this.timer){
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    fillUp(val){
        if(val < 10){
            return "0" + val;
        }

        return val;
    }

    fixDate(date){
        let reDate = new Date(date);

        if(isNaN(reDate.getTime())){
            if(date){
                reDate = new Date(date.replace(/-/g,"\/"));
                if(isNaN(reDate.getTime())){
                    return reDate;
                }
            }
        }

        return reDate
    }
}
