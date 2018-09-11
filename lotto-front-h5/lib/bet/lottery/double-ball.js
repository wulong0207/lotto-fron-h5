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
import func from './../../libs/func';
import regs from '../../libs/regs';


class DoubleBall {
  constructor() {
    this.redBall = [];//红色球
    this.price = 2;//单价
    this.blueBall = [];//蓝色球
    this.bravery = [];//投胆
    this.inBravery = [];//杀号
    this.option = 6;//任选个数
    this.redSum = 33;
    this.blueSum = 16;
  }

  calc(betInfo) {
    let result = this.valid(betInfo);
    if (result) {
      return result;
    } else if (betInfo.bravery && betInfo.bravery.length > 0) { //
      let option = new Option(6);
      return calFunc.combin(this.redBall.length - this.bravery.length, this.option - this.bravery.length) * this.blueBall.length;
      // return option.calc(this.redBall, this.bravery).length * this.blueBall.length;
    } else {//直接得到注数
      return calFunc.combin(this.redBall.length, this.option) * this.blueBall.length;
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
    if (this.redBall.length < 6) {
      return ("红球至少选择6个");
    }
    if (this.blueBall.length < 1) {
      return ("蓝球至少选择1个")
    }
    return null;


  }
}
export default DoubleBall;
