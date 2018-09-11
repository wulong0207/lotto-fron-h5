/**
 * Created by wangzhiyong
 * date  2017/2/25.
 * desc:双色球
 */
// var Option = require("./option");
// var calFunc = require("../libs/cal-func");
// let func = require("../../libs/func");
// let regs = require("../../libs/regs");

import Option from './option';
import calFunc from '../libs/cal-func';
import func from '../../libs/func';
import regs from '../../libs/regs';

class BigLotto {
  constructor() {
    this.redBall = [];//红色球
    this.price = 2;//单价
    this.blueBall = [];//蓝色球
    this.bravery = [];//投胆
    this.braveryBlue = [];//后区胆码
    this.inBravery = [];//杀号
    this.option = 5;//任选个数
    this.optionBlue = 2;
    this.redSum = 35;
    this.blueSum = 12;
  }


  calc(betInfo) {
    let result = this.valid(betInfo);
    if (result) {
      return result;
    }
    else if (betInfo.bravery && betInfo.bravery.length > 0) { //
      let option = new Option(5);
      if(betInfo.braveryBlue){
        return calFunc.combin(this.redBall.length - this.bravery.length, this.option - this.bravery.length) * calFunc.combin(this.blueBall.length - this.braveryBlue.length, this.optionBlue - this.braveryBlue.length);
      } else {
        return calFunc.combin(this.redBall.length - this.bravery.length, this.option - this.bravery.length) * calFunc.combin(this.blueBall.length, this.optionBlue);
      }
    } else {//直接得到注数
      return calFunc.combin(this.redBall.length, this.option) * calFunc.combin(this.blueBall.length, this.optionBlue);
    }
  }


  valid(betInfo) {
    if (!betInfo) {
      return "参数不为空";
    }
    for (var props in betInfo) {
      if (props == "price") {
        if (betInfo[props] && !regs.number.test(betInfo[props])) {
          return ("投注单价必须为数字")
        }
      }
      else if (props != "price" && betInfo[props] && !betInfo[props] instanceof Array) {
        return ("投注的参数格式不正确");
      }
      else {
        this[props] = betInfo[props];//参数赋值
      }
    }
    this.redBall = func.outRepeat(this.redBall);//先去重
    this.blueBall = func.outRepeat(this.blueBall);//先去重
    if (this.redBall.length < 5) {
      return ("红球至少选择5个");
    }
    if (this.blueBall.length < 2) {
      return ("蓝球至少选择2个")
    }
    return null;


  }
}
export default BigLotto;
