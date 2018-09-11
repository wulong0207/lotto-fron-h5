/**
 * Created by wangzhiyong
 * date:2017-02-21
 * desc:14场胜负彩及任选择9的投注算法  TODO 待优化
 */
/*
 实例：
 let bet=new Bet("Footbal14win");
 let result= bet .calc({
 option:14,//
 master:[1,2,3,4,5,6,8],
 draw:[1,2,3,4,5,6,7,8,9,10,11,12],
 guest:[1,2,3,4,5,6,7,8,9,10,11,12],
 bravery:[1,2,3,4]
 })
 */
import Option from "./option";
import func from "../../libs/func";
class Football14Win {

  constructor() {
    this.option = 14;//任选数,默认值
    this.master = null;//主队胜
    this.draw = null;//平局
    this.guest = null;//客队胜
    this.bravery = null;//设胆信息
    this.choseSet = null;//没有主客平区别的投注信息
  }

  /**
   *计算注数
   * @param {object,required}betInfo 投注信息
   */
  calc(betInfo) {

    let result = this.valid(betInfo);//检测有效性

    if (result) {
      return result;
    }
    else {//有效
      let bets = [...this.choseSet];//转为数组
      let noTypeResult = this.optionCalc(bets);//得到初始的没有主客平区别的组合
      result = 0;//最终结果
      noTypeResult.forEach((betItem, rowIndex) => {
        let rowTimes = 1;
        betItem.forEach((betSubItem, colIndex) => {
          let colTimes = 0;
          if (this.master.indexOf(betSubItem) > -1) {
            colTimes++;
          }
          if (this.draw.indexOf(betSubItem) > -1) {
            colTimes++;
          }
          if (this.guest.indexOf(betSubItem) > -1) {
            colTimes++;
          }
          rowTimes = rowTimes * colTimes;
        })
        result += rowTimes;
      })
      return result;
    }
  }

  /**
   * 计算无分类任选注数
   * @param bets
   */
  optionCalc(bets) {
    var OptionCal = new Option(this.option);//得到一个任选计算函数的实例
    return OptionCal.calc(bets, this.bravery);//得到初始的没有主客平区别的组合
  }


  typeCalc(type, betItem, colIndex, currentTypeBet) {
    if (this[type].indexOf(betItem[colIndex]) > -1) {
      if (colIndex == 0) {//第一列的时候不需要判断，直接作为新的类型投注就可以了
        let arr1 = [].concat(betItem);//复制当前投注
        arr1[colIndex] += "-" + type;
        currentTypeBet.push(arr1);
      }
      else {
        let currentTypeBetIndex = 0;//当前类型投注的下标
        while (currentTypeBetIndex < currentTypeBet.length) {
          if (typeof currentTypeBet[currentTypeBetIndex][colIndex] === "number") {//没有处理过,不需要新增,直接赋值
            currentTypeBet[currentTypeBetIndex][colIndex] += "-" + type;
          }
          else {
            let arr1 = [].concat(currentTypeBet[currentTypeBetIndex]);//复制
            if (arr1[colIndex].indexOf("-" + type) == -1) {//多增加一个类型投注
              arr1[colIndex] = arr1[colIndex].split("-")[0] + "-" + type;
              currentTypeBet.push(arr1);
            }
          }
          currentTypeBetIndex++;
        }
      }
    }
    return currentTypeBet;
  }

  /**
   *验证有效性
   * @param {object,required}betInfo 投注信息
   * @returns {*}
   */
  valid(betInfo) {
    let result = null;
    if (!betInfo) {
      return "参数不为空";
    }
    let reg = new RegExp("^[+]?[0-9]+$", "i");
    if (betInfo.option && !reg.test(betInfo.option)) {
      return ("场数必须为数字")
    }
    else {
      this.option = betInfo.option;
    }
    for (var props in betInfo) {
      if (props != "option" && betInfo[props] && !betInfo[props] instanceof Array) {
        return ("投注的参数格式不正确");
      }
      else {
        this[props] = betInfo[props];//参数赋值
      }
    }
    this.choseSet = [];
    if (this.bravery && this.bravery instanceof Array) {
      this.choseSet = [].concat(this.bravery)
    }
    this.master instanceof Array ? this.master.forEach(x => {
          this.choseSet.indexOf(x) < 0 ? this.choseSet.push(x) : void(0);
        }) : void(0);
    this.draw instanceof Array ? this.draw.forEach(x => {
          this.choseSet.indexOf(x) < 0 ? this.choseSet.push(x) : void(0);
        }) : void(0);
    this.guest instanceof Array ? this.guest.forEach(x => {
          this.choseSet.indexOf(x) < 0 ? this.choseSet.push(x) : void(0);
        }) : void(0);//
    this.choseSet = func.outRepeat(this.choseSet);//去重复
    //至少选择N场
    this.choseSet.length < this.option ? (() => {
          result = ("至少选择" + this.option.toString() + "场")
        })() : void (0);
    //设胆的场必须选择
    return !result && this.bravery && this.bravery.length > 0 ? (() => {
          for (var i = this.bravery.length - 1; i > -1; i--) {
            result = !(this.choseSet.indexOf(this.bravery[i]) > -1 ) ? (() => {
                  return ("设胆的场号" + this.bravery[i] + "必须下注");
                })() : void(0);
            if (result) {
              return result;
            }
          }
        })() : result;

  }
}
export default Football14Win;