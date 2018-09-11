/**
 * @author chenzhenhua
 * @createTime 2017-08-07 19:01
 * @description 北京单场
 */

// let Direct = require('./direct');
// let Util = require('../libs/cal-func');

import Direct from './direct';
import Util from '../libs/cal-func';

class Bjdc {

  /***
   * 构造方法
   */
  constructor() {

  }

  /***
   * 计算注数和最大奖金
   * @param params
   */
  calcBet(params) {
    this.init(params, false);
  }

  /***
   * 计算奖金明细
   * @param params
   */
  calcDetail(params) {
    this.init(params, true);
  }

  /***
   * 初始化
   * @param orderObj
   * @param passObj
   * @param multiple
   */
  init({
      orderObj = {list: []},
      passObj = {list: []},
      multiple = 1
  } = {}, detail = false) {
    [].concat(orderObj.list).map(key => {
      if (orderObj[key].betObj.list.length < 1) {
        orderObj.list.splice(orderObj.list.indexOf(key), 1);
      }
    });
    [].concat(passObj.list).map(key => {
      if (parseInt(key) > orderObj.list.length) {
        passObj.list.splice(passObj.list.indexOf(key), 1);
      }
    });
    this.orderObj = orderObj; // 订单对象
    this.initOrderObj(); // 计算订单
    this.passObj = passObj; // 串关
    this.initPassObj(); // 计算串关
    this.multiple = multiple; // 倍数
    this.betNum = 0; // 注数
    this.maxBonus = 0; // 最大奖金（命中最大场次的最大奖金）
    this.hitObj = {list: []}; // 命中对象
    this.initHitObj(detail); // 计算命中场次
  }

  /***
   * 计算订单
   */
  initOrderObj() {
    let {orderObj} = this;
    let maxSort = (next, prev) => {
      let nextMax = +Util.get(orderObj, orderObj[next].max[0]) || 1;
      let prevMax = +Util.get(orderObj, orderObj[prev].max[0]) || 1;
      return prevMax - nextMax;
    };
    let minSort = (next, prev) => {
      let nextMin = +Util.get(orderObj, orderObj[next].min[0]) || 1;
      let prevMin = +Util.get(orderObj, orderObj[prev].min[0]) || 1;
      return nextMin - prevMin;
    };
    orderObj.bravery = []; // 胆
    orderObj.tuo = []; // 拖
    orderObj.list.map(key => {
      let order = orderObj[key];
      order.max = null;
      order.min = null;
      if (order.bravery) {
        orderObj.bravery.push(key);
      } else {
        orderObj.tuo.push(key);
      }
      // 最大最小SP值
      order.betObj.list.map(key2 => {
        let SP = +order.betObj[key2] || 1;
        // 判断有SP值
        if (!order.max) {
          order.max = key2;
        } else if (+order.betObj[order.max] < SP) {
          order.max = key2;
        }
        if (!order.min) {
          order.min = key2;
        } else if (+order.betObj[order.min] > SP) {
          order.min = key2;
        }
      });
      // 为了兼容足球和篮球混投扩展为数组
      order.max = [`${key}.betObj.${order.max}`];
      order.min = [`${key}.betObj.${order.min}`];
    });
    // 订单按最大SP值排序
    orderObj.maxBravery = [].concat(orderObj.bravery).sort(maxSort);
    orderObj.maxTuo = [].concat(orderObj.tuo).sort(maxSort);
    // 订单按最小SP值排序
    orderObj.minBravery = [].concat(orderObj.bravery).sort(minSort);
    orderObj.minTuo = [].concat(orderObj.tuo).sort(minSort);
  }

  /***
   * 计算串关
   */
  initPassObj() {
    let {passObj} = this;
    passObj.list.reverse();

    let max = parseInt(passObj.list[0]);
    let min = max;
    for (let i = 1; i < passObj.list.length; i++) {
      let val = parseInt(passObj.list[i]);
      if(val > max) max = val;
      if(val < min) min = val;
    };

    passObj.max = max;
    passObj.min = min;
  }

  /***
   * 得到命中场次对象
   */
  initHitObj(detail) {
    this.calc(detail);
  }

  /***
   * 得到组合
   * @param bravery
   * @param tuo
   * @param num 组合数
   */
  getCombin(bravery, tuo, num) {
    let result = [];
    if (bravery.length >= num) {
      result.push([].concat(bravery).splice(0, num));
    } else {
      Util.mathCR(tuo, num - bravery.length).map(item => {
        result.push([].concat(bravery).concat(item));
      });
    }
    return result;
  }

  /***
   * 得到奖金和奖金明细
   * @param list
   */
  getBonusDetail(list) {
    let {orderObj, multiple} = this;
    let bonus = 0;
    let detail = [];
    let mul = 1;
    let str = '';
    list.map(key => {
      if (Util.get(orderObj, key) != '-') {
        mul *= Util.get(orderObj, key);
        str += `×[${orderObj[key.split('.')[0]].name}]${Util.get(orderObj, key)}`;
      }
    });
    if (mul > 1) {
      mul = (Math.round(mul * multiple * 2 * 0.65 * 100) / 100).toFixed(2);
      str += `×${multiple}倍×2元×65%=${mul}`;
      bonus = Util.add(bonus, mul).toFixed(2);
      detail.push(str.substr(1));
    }
    return {bonus, detail};
  }

  /***
   * 计算所有奖金明细
   */
  calc(detail) {
    let {passObj, hitObj, orderObj} = this;
    // 命中场次循环
    for (let i = orderObj.list.length; i >= passObj.min; i--) {
      hitObj[i] = {
        hitNum: i,
        maxObj: {bonus: 0, list: []}, // 最大奖金
        minObj: {bonus: 0, list: []} // 最小奖金
      };
      hitObj.list.push(i);
      if (detail) { // 所有奖金明细
        passObj.list.map(pass => {
          let maxBetNum = 0;
          let maxBouns = 0;
          let maxDetail = [];
          let minBetNum = 0;
          let minBouns = 0;
          let minDetail = [];
          // 最大奖金对应各串关的注数和详情
          hitObj[i].maxObj.list.push(pass);
          hitObj[i].maxObj[pass] = {
            betNum: maxBetNum,
            bonus: maxBouns,
            detail: maxDetail
          };
          // 最小奖金对应各串关的注数和详情
          hitObj[i].minObj.list.push(pass);
          hitObj[i].minObj[pass] = {
            betNum: minBetNum,
            bonus: minBouns,
            detail: minDetail
          };
          if (parseInt(pass) <= i) { // 计算串关注数
            let maxArray = this.getCombin(orderObj.maxBravery, [].concat(orderObj.maxTuo).splice(0, i - orderObj.maxBravery.length), parseInt(pass));
            let minArray = this.getCombin(orderObj.minBravery, [].concat(orderObj.minTuo).splice(0, i - orderObj.minBravery.length), parseInt(pass));
            maxArray.map(list => {
              let maxMul = 1;
              let maxList = [];
              list.map(key => {
                maxMul *= orderObj[key].max.length;
                maxList = maxList.concat(orderObj[key].max);
              });
              let maxBonusDetail = this.getBonusDetail(maxList);
              maxBetNum += maxMul;
              maxBouns = Util.add(maxBouns, maxBonusDetail.bonus);
              maxDetail = maxDetail.concat(maxBonusDetail.detail);
            });
            minArray.map(list => {
              let minMul = 1;
              let minList = [];
              list.map(key => {
                minMul *= orderObj[key].min.length;
                minList = minList.concat(orderObj[key].min);
              });
              let minBonusDetail = this.getBonusDetail(minList);
              minBetNum += minMul;
              minBouns = Util.add(minBouns, minBonusDetail.bonus);
              minDetail = minDetail.concat(minBonusDetail.detail);
            });
            hitObj[i].maxObj[pass] = {
              betNum: maxBetNum,
              bonus: maxBouns,
              detail: maxDetail
            };
            hitObj[i].minObj[pass] = {
              betNum: minBetNum,
              bonus: minBouns,
              detail: minDetail
            };
            hitObj[i].maxObj.bonus = Util.add(hitObj[i].maxObj.bonus, maxBouns);
            hitObj[i].minObj.bonus = Util.add(hitObj[i].minObj.bonus, minBouns);
          }
        });
      }
      // 第一次计算总注数和最大奖金
      if (i == orderObj.list.length) {
        passObj.list.map(pass => {
          let arrayList = this.getCombin(orderObj.maxBravery, [].concat(orderObj.maxTuo).splice(0, i - orderObj.maxBravery.length), parseInt(pass));
          let betNum = 0;
          let maxBouns = 0;
          arrayList.map(list => { // 订单数组
            let mul = 1;
            let maxMul = 1;
            let maxList = [];
            list.map(key => { // 订单投注内容
              mul *= orderObj[key].betObj.list.length;
              maxMul *= orderObj[key].max.length;
              maxList = maxList.concat(orderObj[key].max);
            });
            let maxBonusDetail = this.getBonusDetail(maxList);
            betNum += mul;
            maxBouns = Util.add(maxBouns, maxBonusDetail.bonus);
          });
          // 总注数
          this.betNum += betNum;
          // 最大奖金
          this.maxBonus = Util.add(this.maxBonus, maxBouns);
        });
      }
    }
  }
}

export default Bjdc;
