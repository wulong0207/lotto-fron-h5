/**
 * @author chenzhenhua
 * @createTime 2017-04-24 10:19
 * @description 江苏快三
 */

// let Option = require("./option");
// let Direct = require("./direct");
// let calFunc = require("../libs/cal-func");
// let regs = require("../../libs/regs");

import Option from './option';
import Direct from './direct';
import calFunc from '../libs/cal-func';
import regs from '../../libs/regs';



let playList = [23301, 23307, 23306, 23305, 23308, 23303, 23302, 23304, 23309];
let bonusObj = {
  23301: {
    3: 240,
    4: 80,
    5: 40,
    6: 25,
    7: 16,
    8: 12,
    9: 10,
    10: 9,
    11: 9,
    12: 10,
    13: 12,
    14: 16,
    15: 25,
    16: 40,
    17: 80,
    18: 240
  },
  23302: 80,
  23303: 15,
  23304: 8,
  23305: 40,
  23306: 240,
  23307: 40,
  23308: 10,
  23309: [240, 80, 40]
};

class Jsk3 {
  /***
   * 计算注数
   * @param betInfo
   * @return {*}
   */
  calc({
      play = 23301,
      bets = [],
      price = 2,
      bonus = 2
  } = {}) {
    let betInfo = {
      play: play,
      bets: bets,
      price: price,
      bonus: bonus,
    };
    let result = this.valid(betInfo);
    if (result) {
      return result;
    } else {
      let option1 = new Option(1);
      let direct2 = new Direct(2);
      let option2 = new Option(2);
      let option3 = new Option(3);
      switch (betInfo.play) {
        case 23302: // 二同号单选
          result = direct2.calc(betInfo.bets);
          break;
        case 23304: // 二不同号
          if (bets[0] instanceof Array) { // 胆拖投注
            result = option2.calc([].concat(betInfo.bets[0], betInfo.bets[1]), betInfo.bets[0]);
          } else { // 普通投注
            result = option2.calc(betInfo.bets, null);
          }
          break;
        case 23307: // 三同号通选
          result = [].concat(bets);
          break;
        case 23305: // 三不同号
          if (bets[0] instanceof Array) { // 胆拖投注
            result = option3.calc([].concat(betInfo.bets[0], betInfo.bets[1]), betInfo.bets[0]);
          } else { // 普通投注
            result = option3.calc(betInfo.bets, null);
          }
          break;
        case 23309: // 一码包中
          if (betInfo.bets.length < 1) {
            result = [];
          } else {
            result = new Direct(3, false, betInfo.bets, false).calc([[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6]]);
          }
          break;
        default:
          result = option1.calc(betInfo.bets, null);
          break;
      }
      return this.calcBonus(betInfo, result);
    }
  }

  /***
   * 计算奖金
   * @param result
   * @return {{bets: *, minBonus: number, maxBonus: number, minProfit: number, maxProfit: number}}
   */
  calcBonus(betInfo, result) {
    let minBonus; //最小奖金
    let maxBonus; //最大奖金
    let minProfit; //最小分红
    let maxProfit; //最大分红
    let bounsList = [];
    switch (betInfo.play) {
      case 23301: // 和值
        result.map(item => {
          bounsList.push(bonusObj[betInfo.play][item[0]]);
        });
        break;
      case 23309: // 一码包中
        bounsList = [].concat(bonusObj[betInfo.play]);
        break;
      default:
        bounsList.push(bonusObj[betInfo.play]);
        break;
    }
    minBonus = Math.min(...bounsList);
    maxBonus = Math.max(...bounsList);
    minProfit = minBonus - result.length * betInfo.price;
    maxProfit = maxBonus - result.length * betInfo.price;
    return {
      bets: result,
      minBonus: minBonus,
      maxBonus: maxBonus,
      minProfit: minProfit,
      maxProfit: maxProfit
    }
  }

  /***
   * 验证参数
   * @param betInfo
   * @return {*}
   */
  valid(betInfo) {
    let result = null;
    if (playList.indexOf(betInfo.play) < 0) {
      result = '玩法类型错误';
    } else {
      switch (betInfo.play) {
        case 23301:
          break;
      }
    }
    return result;
  }
}

export default Jsk3;
