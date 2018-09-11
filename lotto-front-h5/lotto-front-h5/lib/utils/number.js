/*
 * @Author: yubei 
 * @Date: 2017-08-24 21:41:39 
 * Desc: 数字生成
 */

export const Number = {

    /**
     * 阶乘计算 m > n
     * @param {number} m 
     * @param {number} n 
     */
    getFactorial(m, n) {
        if (m <= 0 || n <= 0 || m < n) {
            return 0;
        }
        var max = m, min = n, total = 1, div;
        // m * (m-1) * (m 2) * ... * (n+1)
        for (var i = min + 1; i <= max; i++) {
            total *= i;
            div = i - min;
            total /= div;
        }
        return total;
    },

    /**
     * 从n个元素中取出m个元素的组合公式n!/((n-m)!m!)
     * @param {*} m 
     * @param {*} n 
     */
    getCombineCount(m, n) {
        if(m < 0 || n < 0 || n < m) {
            return 0; // 当m小于0时返回0
        }
        if(m === 0 || n === 0) {
            return 1; // 当m为0或者n为0时，返回1
        }
        let n1 =1, n2 =1;
        for(let i = n, j = 1; j <= m; n1 *= i--, n2 *= j++) {

        }
        return n1 / n2;
    },

    /**
     * 从n个元素中取出m个元素的排列公式n!/(n-m)!
     * @param {number} m 
     * @param {number} n 
     */
    getPLNumber(m, n) {
        let p = 1;
        if(m <= 1 || n <= 0 || n < m) {
            return 0;
        }
        p = this.getJCNumber(n) / this.getJCNumber(n - m);
        console.log('从' + n + '个不同数中取' + m + '个数字的排列数：' + p);
        return p;
    },

    /**
     * 计算n的阶乘 1*2*3*4.....n-1
     * @param {number} n 
     */
    getJCNumber(n) {
        let result = 1;
        if((n < 0) || (n > 19)) {
            return -1;
        }
        for(let i = 1; i <= n; i++) {
            result = i * result;
        }
        return result;
    },

    /**
     * 随机从m-n数中，随机选择count个数，并用spilt分割
     * @param {number} m 开始数
     * @param {number} n 结束数
     * @param {bumber} count 随机个数
     */
    getSrand(m, n, count) {
        let arr = [];
        if(m == n || m > n || count === 0) {
            return arr;
        }
        do {
            let val = this.getRandom(m, n);
            if(!this.isContain(arr, val)) {
                arr.push(val);
            }
        } while (arr.length < count);
        // 排序
        arr = this.sortNumber(arr, 'asc');
        /* for(let i = 0, arrLen = arr.length; i < arrLen; i++){
            let arrthis = arr[i];
            if(arrthis<10){
                arr[i] = "0" + arrthis;
            }
        } */
        return arr;
    },

    /**
     * 制定范围的一个随机数
     * @param {number} s 开始数
     * @param {number} e 结束数
     */
    getRandom(s, e) {
        return Math.floor(Math.random() * (e + 1 -s)) +s;
    },

    /**
     * 数组中是否包含某项值
     * @param {array} arr 数组
     * @param {number} n  某项值
     */
    isContain(arr, n) {
        for(let i = 0, len = arr.length; i < len; i++) {
            if(arr[i] == n) {
                return true;
            }
        }
        return false;
    },

    /**
     * 补0操作
     * @param {array} arr 数组 
     */
    attachZero(arr) {
        return arr.map((row, index) => {
            return row < 10 ? '0' + row : row;
        });
    },

    /**
     * 数组排序
     * @param {array} arr 数组
     * @param {string} ad 排序方式
     */
    sortNumber(arr, ad) {
        let f = ad != 'desc'? (a, b) => {
            return a - b;
        } : (a, b) => {
            return b - a;
        }
        return arr.sort(f);
    }

}
