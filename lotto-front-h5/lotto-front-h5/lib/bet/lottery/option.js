/**
 * Created by wangzhiyong
 * date:2017-02-23
 * desc-任选彩种的算法基类(如：14选择9,8选择3，8选择8则代表全选,计算公式C(M,N)
 */
import combin from "./../libs/combin";

export default class Option {

    /**
     *
     * @param (number,required)option 任选个数
     */
    constructor(option=0) {
        this.option=option;
    }

    /**
     *
     * @param {array,required}betArray 投注信息
     * @param {array}bravery 投胆信息
     * @returns {Array}
     */
    calc(bets,bravery) {
        if(!this.option){
          return ("任选个数未设置");

        }
        if(!bets instanceof Array ||(bravery&&!bravery instanceof Array )){
          return ("投注信息不正确");

        }
      
        return combin(bets,this.option,bravery);//无序的组合
    }
}