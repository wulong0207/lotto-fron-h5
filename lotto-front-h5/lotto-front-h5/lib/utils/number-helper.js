export default {
    /**
     * 生成投注数组数组
     * count: 构成一注号码个数
     * max: 号码总数
     * arr: 当前已选的号码数组
     * min: 随机数最小号码
     * isZero: 是否显示 0 位
     * 例如 count=3,max=10,时  返回[1,5,9]  最大值为10
     *      count=4,max=10, arr=[1,4]时  返回[1,4,6,9]  最大值为10
     */
    generateNum(count, max, arr, noConcat, min = 1, isZero = true){
        let result = [];
        let resultData = {};
        if(arr){
            for (let i = 0; i < arr.length; i++) {
                resultData[arr[i]] = true;
                if(!noConcat){
                    result.push(arr[i]);
                }
            };
        }

        while(result.length < count){
            let num = parseInt(Math.random() * (max - min + 1) + min, 10); // 生成范围随机数
            // let num = parseInt(Math.random() * max + 1);

            if (num > max) {
                num = max;
            }

            num = isZero? ('0' + num).slice(-2): num+''; // TODO,这里规则有BUG，数字彩9和9位以上才有 01 02 等数字，小或者等于9位时，直接显示1 2

            if(/*num != "00" && */!resultData[num]){
                result.push(num);
                resultData[num] = true;
            }
        }

        return result.sort((a,b)=>{return a - b});
    },

    // 生成随机数组产生冲突，再写一个

    // getRandomNum(count, max, arr, min){
    //     let result = [];
    //     let resultData = {};
    //     if(arr){
    //         for (let i = 0; i < arr.length; i++) {
    //             resultData[arr[i]] = true;            
    //             result.push(arr[i]);

    //         };
    //     }
       
    //     while(result.length < count){
    //         let num;
    //         if(min){
    //             num=parseInt(Math.random()*(max-min)+min);
    //         }else{
    //             num = parseInt(Math.random() * max + 1);
    //         }
    //         if(num>max){
    //             num=max;
    //         }else{
    //             num=num+'';
    //         }    
    //         if(!resultData[num]){        
    //             result.push(num);
    //              resultData[num] = true;
    //         }
    //     }
    //     return result.sort((a,b)=>{return a - b});
    // },

    /**
     * 获取当前时间段的最大注数和倍数
     * arr:时间段的数组 后台返回的
     * time：当前的时间
     */
    getMaxTimes (arr,time){
        let MaxMultipleNum; //倍数
        let MaxBettindNum;   //注数
        for(var i=0;i<arr.length;i++){
            if (arr[i].endTime < time) {
                MaxMultipleNum = arr[i].multipleNum;
                MaxBettindNum = arr[i].bettindNum;
                break;
            }
        }

        return {
            MaxMultipleNum:MaxMultipleNum,
            MaxBettindNum:MaxBettindNum
        }
    },

    /**
     * 处理遗漏数据
     * arr: 数组
     * count: 前多少个,遗漏数据红色为前8个
     * needRed: 最大的几个是否需要标红
     * needBlue: 最小的几个是否需要标蓝
     */
    handleOmit(arr, count, needRed, needBlue){
        let sortArr = JSON.parse(JSON.stringify(arr));
        sortArr = sortArr.sort((a, b) => {
            let av = a, bv = b;
            if(a.color){ av = a.title; }
            if(b.color){ bv = b.title; }
            return bv - av;
        });

        let max = sortArr[count - 1];
        let min = sortArr[sortArr.length - count];
        for (let i = 0; i < arr.length; i++) {
            if(needRed && arr[i] >= max){
                arr[i] = {
                    title: arr[i],
                    color: "red"
                };
            }

            if(needBlue && !arr[i].color && arr[i] <= min){
                arr[i] = {
                    title: arr[i],
                    color: "blue"
                };
            }
        };

        return arr;
    },


    /**
     * 判断一个数组是否包含另一个数组
     * a: 当前数组
     * b: 另一个数组（判断是否被包含的）
     */
    isContained(a, b) {
        var flag = false;
        if (!(a instanceof Array) || !(b instanceof Array)) return false;

        if (!b.length) return false;

        if (a.length < b.length) return false;

        for (var i = 0, len = b.length; i < len; i++) {
            flag = false;
            for(var k=0;k<a.length;k++){
                if (b[i] == a[k]) {
                    flag = true;
                    break;
                }  
            }
            if (!flag) {
                return flag;
            }
        }
        return flag;
    }
}
