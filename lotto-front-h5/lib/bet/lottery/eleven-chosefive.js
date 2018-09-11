/**
 * Created by wangzhiyong
 * date on 2017/2/28.
 * desc:11选5
 */
// let Option = require("./option");
// let Direct = require("./direct");
// let calFunc = require("../libs/cal-func");
// let regs = require("../../libs/regs");

import Option from './option';
import Direct from './direct';
import calFunc from '../libs/cal-func';
import regs from '../../libs/regs';

class ElevenChoseFive {
  constructor() {
    this.bets = []; // 所选择的号码
    this.option = 0; // 任选/直选/组选数
    this.bravery = []; // 设胆号码
    this.type = 0; // 0为任选，1，为组选，2为直选
    this.price = 2; // 每注单价
    this.bonus = 2; // 每注奖金
  }

  calc(betInfo) {
    // 计算投注信息
    let result = this.valid(betInfo);
    if (result) {
      return result;
    } else {
      let optionCalc = new Option(this.option); // 任选、组选
      let directCalc = new Direct(this.option); // 直选,二维数数组
      switch (this.type) {
        case 0: // 任选
          result = optionCalc.calc(this.bets, this.bravery);
          break;
        case 1: // 组选
          result = optionCalc.calc(this.bets, this.bravery);
          break;
        case 2: // 直选
          result = directCalc.calc(this.bets);
          break;
      }
      return this.calcBonus(result);
    }
  }

  calcBonus(result) {
    // 计算奖金
    const allNum = 11; // 总共号码数，
    const openNum = 5; // 开奖号码数
    let minBonus = 0; // 最小奖金
    let maxBonus = 0; // 最大奖金
    let minProfit = 0; // 最小分红
    let maxProfit = 0; // 最大分红
    switch (this.type) {
      case 0: // 任选
        if (this.bonus instanceof Array) {
          // 乐选四五
          let b0 = this.bonus[this.bonus.length - 1];
          let b1 = this.bonus[0];
          let lxBonus = {
            4: {
              4: [b0, b1],
              5: [b0 * 2, b1 * 5],
              6: [b0 * 3, b1 * 5 + b0 * 10],
              7: [b0 * 4, b1 * 5 + b0 * 20],
              8: [b0 * 5, b1 * 5 + b0 * 30],
              9: [b0 * 6, b1 * 5 + b0 * 40],
              10: [b1 + b0 * 4 * 6, b1 * 5 + b0 * 50],
              11: [b1 * 5 + b0 * 60, b1 * 5 + b0 * 60]
            },
            5: {
              5: [b0, b1],
              6: [b0 * 2, b1 + b0 * 5],
              7: [b0 * 3, b1 + b0 * 10],
              8: [b0 * 4, b1 + b0 * 15],
              9: [b0 * 5, b1 + b0 * 20],
              10: [b0 * 6, b1 + b0 * 25],
              11: [b1 + b0 * 30, b1 + b0 * 30]
            }
          };
          let lxB = lxBonus[+this.option][this.bets.length] || [0, 0];
          minBonus = lxB[0];
          maxBonus = lxB[1];
        } else {
          // 普通任选
          if (this.option < 5) {
            /** *****选数小于5,没有胆码*********/
            if (this.bravery.length === 0) {
              // 最小奖金计算公式: (任选2，7个号码） 5-(11-10)=4 C(4,2)=6
              minBonus =
                calFunc.combin(
                  openNum - (allNum - this.bets.length),
                  this.option
                ) * this.bonus;

              // 最大奖金计算公式：任选2 ，最大开奖注数：10
              maxBonus =
                result.length < calFunc.combin(openNum, this.option)
                  ? result.length * this.bonus
                  : calFunc.combin(openNum, this.option) * this.bonus;
            } else {
              /** *****选数小于5,有胆码*********/
              // 最小奖金计算公式：任选2 胆码1个,9个号码  (5-1)-(11-1-9)=3
              let betNum = openNum - this.bravery.length;
              let minNum =
                openNum - (allNum - this.bets.length) - this.bravery.length;
              if (minNum < 1) {
                minNum = 1;
              }
              minBonus = this.bonus * minNum;
              // 最大奖金计算公式：任选2 胆码1个 C(5-1,2-1)=4
              maxBonus =
                result.length <
                calFunc.combin(
                  openNum - this.bravery.length,
                  this.option - this.bravery.length
                )
                  ? this.bonus * result.length
                  : this.bonus *
                    calFunc.combin(
                      openNum - this.bravery.length,
                      this.option - this.bravery.length
                    );
            }
          } else {
            if (!this.bravery || this.bravery.length === 0) {
              // *******选数大于等于5,没有胆码 *********
              // 最大/小奖金计算公式 ：任选6  ,选择了7个号码 C(7-5，6-5)=2
              minBonus = maxBonus =
                this.bonus *
                calFunc.combin(
                  this.bets.length - openNum,
                  this.option - openNum
                );
            } else {
              // *******选数大于等于5,有胆码*********
              minBonus = this.bonus * 1; // 一注
              if (this.option > 6) {
                minBonus =
                  this.bonus *
                  calFunc.combin(
                    this.bets.length - openNum - this.bravery.length,
                    this.option - openNum - this.bravery.length
                  );
              }
              // 最大奖金计算公式 ：任选6  ,选择了7个号码 C(7-5，6-5)=2
              maxBonus =
                this.bonus *
                Math.min(
                  calFunc.combin(
                    this.bets.length - openNum,
                    this.option - openNum
                  ),
                  result.length
                );
            }
          }
        }
        break;
      case 1: // 组选
        minBonus = maxBonus = this.bonus * 1;
        break;
      case 2: // 直选
        if (this.bonus instanceof Array) {
          let bonus0 = this.bonus[this.bonus.length - 1];
          let bonus1 = this.bonus[0];
          let len = 0;
          // 乐选三
          let lengths = this.bets
            .map(item => {
              len += item.length;
              return item.length;
            })
            .sort();
          if (lengths[0] === 1 && lengths[1] === 1) {
            // 1,1,n>=1
            maxBonus = bonus1 + Math.min(2, result.length - 1) * bonus0;
          } else {
            // 1,2,n>=2
            maxBonus = bonus1 + 3 * bonus0;
          }
          minBonus = bonus0 * Math.max(len - 8, 1);
        } else {
          minBonus = maxBonus = this.bonus * 1;
        }
        break;
    }
    minProfit = minBonus - result.length * this.price;
    maxProfit = maxBonus - result.length * this.price;
    return {
      bets: result,
      minBonus: minBonus,
      maxBonus: maxBonus,
      minProfit: minProfit,
      maxProfit: maxProfit
    };
  }

  valid(betInfo) {
    if (!betInfo) {
      return '参数不为空';
    }
    if (!regs.number.test(betInfo.price)) {
      return '投注单价必须为数字';
    } else {
      this.price = betInfo.price;
    }

    this.bonus = betInfo.bonus;

    if (typeof betInfo['option'] !== 'number') {
      return '任选数必须为数字';
    } else {
      this.option = betInfo.option;
    }
    var Reg = new RegExp('[012]', 'i');
    if (!Reg.test(betInfo['type'])) {
      return '类型必须为0,1,2';
    } else {
      this.type = betInfo.type;
    }

    if (betInfo['bets'] && !(betInfo['bets'] instanceof Array)) {
      return '所选号码为数组格式';
    } else {
      this.bets = betInfo.bets ? betInfo.bets : [];
    }
    if (betInfo['bravery'] && !(betInfo['bravery'] instanceof Array)) {
      return '设胆号码为数组格式';
    } else {
      this.bravery = betInfo.bravery ? betInfo.bravery : [];
    }

    let type = null;
    let betsLength = 0;
    for (let index = 0; index < this.bets.length; index++) {
      if (type && type !== typeof this.bets[index]) {
        return '投注信息内的数据类型必须相同';
      } else if (this.type === 2 && !(this.bets[index] instanceof Array)) {
        return '直选必须是二维数组';
      }
      if (this.type === 2) {
        betsLength++;
      }
      type = typeof this.bets[index];
    }
    if (this.type === 2 && betsLength !== this.option) {
      return '直选下投注的二维数组长度必须与直选数相同';
    }
    for (let index = 0; index < this.bravery.length; index++) {
      if (type && type !== typeof this.bravery[index]) {
        return '设胆内的数据类型必须与投注信息内的数据类型相同';
      }
      type = typeof this.bravery[index];
    }
    return null;
  }
}

export default ElevenChoseFive;
