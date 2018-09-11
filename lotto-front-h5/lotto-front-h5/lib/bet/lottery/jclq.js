/**
 * @author chenzhenhua
 * @createTime 2017-08-16 20:42
 * @description 竞彩篮球
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
    // 所有胜分差彩果
    let allSfc = {
      list: ['sfc-01', 'sfc-02', 'sfc-03', 'sfc-04', 'sfc-05', 'sfc-06', 'sfc-11', 'sfc-12', 'sfc-13', 'sfc-14', 'sfc-15', 'sfc-16']
    };
    allSfc.list.map(key => {
      allSfc[key] = {
        key: key,
        diff: 1 + (+key.substr(5, 1) - 1) * 5,
        win: 1 - key.substr(4, 1)
      };
    });
    this.allSfc = allSfc;
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
   * @param isMix
   */
  init({
      orderObj = {list: []},
      passObj = {list: []},
      multiple = 1,
      isMix = false
  } = {}, detail = false) {
    this.isMix = isMix; // 是否混投
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
    let {orderObj, isMix} = this;
    let maxSort = (next, prev) => {
      return orderObj[prev].maxSum - orderObj[next].maxSum;
    };
    let minSort = (next, prev) => {
      return orderObj[next].maxSum - orderObj[prev].maxSum;
    };
    orderObj.bravery = []; // 胆
    orderObj.tuo = []; // 拖
    orderObj.list.map(key => {
      let order = orderObj[key];
      if (order.bravery) {
        orderObj.bravery.push(key);
      } else {
        orderObj.tuo.push(key);
      }
      if (isMix) { // 混投
        this.initOrder(key, order);
      } else { // 非混投最大最小SP值
        order.max = null;
        order.min = null;
        order.betObj.list.map(key2 => {
          if (!order.max) {
            order.max = key2;
          } else if (+order.betObj[order.max] < +order.betObj[key2]) {
            order.max = key2;
          }
          if (!order.min) {
            order.min = key2;
          } else if (+order.betObj[order.min] > +order.betObj[key2]) {
            order.min = key2;
          }
        });
        order.maxSum = +order.betObj[order.max];
        order.max = [`${key}.betObj.${order.max}`];
        order.minSum = +order.betObj[order.min];
        order.min = [`${key}.betObj.${order.min}`];
      }
    });
    // 订单按最大SP值排序
    orderObj.maxBravery = [].concat(orderObj.bravery).sort(maxSort);
    orderObj.maxTuo = [].concat(orderObj.tuo).sort(maxSort);
    // 订单按最小SP值排序
    orderObj.minBravery = [].concat(orderObj.bravery).sort(minSort);
    orderObj.minTuo = [].concat(orderObj.tuo).sort(minSort);
  }

  /***
   * 初始化混投
   * @param key
   * @param order
   */
  initOrder(key, order) {
    let {allSfc} = this;
    let max = {sum: 0, list: []};
    let min = {sum: 0, list: []};
    allSfc.list.map(key => {
      let sfc = allSfc[key];
      let maxSumList = this.getMaxSumList(order.betObj, sfc);
      let minSumList = this.getMinSumList(order.betObj, sfc);
      if (max.sum == 0 || maxSumList.sum > max.sum) {
        max = JSON.parse(JSON.stringify(maxSumList));
      }
      if (min.sum == 0 || (minSumList.sum >0 && minSumList.sum < min.sum)) {
        min = JSON.parse(JSON.stringify(minSumList));
      }
    });
    order.max = max.list.map(item => `${key}.betObj.${item}`);
    order.maxSum = max.sum;
    order.min = min.list.map(item => `${key}.betObj.${item}`);
    order.minSum = min.sum;
  }

  /***
   * 得到最大彩果
   * @param betObj
   * @param sfc
   */
  getMaxSumList(betObj, sfc) {
    let sum = 0;
    let list = [];
    let sort = (next, prev) => {
      return +betObj[prev] - +betObj[next];
    };
    let add = (bet) => {
      if (betObj.list.indexOf(bet) > -1) {
        sum += +betObj[bet];
        list = list.concat([bet]);
      }
    };
    let rfsf = () => {
      let rfsf = this.getSumList(betObj, 'rfsf-1', 'rfsf-2');
      sum += rfsf.sum;
      list = list.concat(rfsf.list);
    };
    let dxf = () => {
      let dxf = this.getSumList(betObj, 'dxf-1', 'dxf-2');
      sum += dxf.sum;
      list = list.concat(dxf.list);
    };
    add(sfc.key);
    if (sfc.win) {
      // 主胜分差
      add('sf-1'); // 主胜
      if (sfc.diff == 26 && -betObj['letScore'] > 26) {
        // 让分胜负取大值
        rfsf();
      } else if (-betObj['letScore'] > sfc.diff + 4) {
        // 让分主负
        add('rfsf-2');
      } else if (-betObj['letScore'] < sfc.diff) {
        // 让分主胜
        add('rfsf-1');
      } else {
        // 让分胜负取大值
        rfsf();
      }
    } else {
      // 客胜分差
      add('sf-2'); // 客胜
      if (sfc.diff == 26 && +betObj['letScore'] > 26) {
        // 让分胜负取大值
        rfsf();
      } else if (+betObj['letScore'] > sfc.diff + 4) {
        // 让分主胜
        add('rfsf-1');
      } else if (+betObj['letScore'] < sfc.diff) {
        // 让分客胜
        add('rfsf-2');
      } else {
        // 让分胜负取大值
        rfsf();
      }
    }
    // 大小分取大值
    dxf();
    list = list.sort(sort);
    return {sum, list};
  }

  /***
   * 得到最小彩果
   * @param betObj
   * @param sfc
   */
  getMinSumList(betObj, sfc) {
    let sum = 0;
    let list = [];
    let sort = (next, prev) => {
      return +betObj[next] - +betObj[prev];
    };
    let add = (bet) => {
      if (betObj.list.indexOf(bet) > -1) {
        sum += +betObj[bet];
        list = list.concat([bet]);
      }
    };
    let rfsf = () => {
      let rfsf = this.getSumList(betObj, 'rfsf-1', 'rfsf-2', true);
      sum += rfsf.sum;
      list = list.concat(rfsf.list);
    };
    let dxf = () => {
      if (betObj.list.indexOf('dxf-1') > -1 && betObj.list.indexOf('dxf-2') > -1) {
        let dxf = this.getSumList(betObj, 'dxf-1', 'dxf-2', true);
        sum += dxf.sum;
        list = list.concat(dxf.list);
      } else if (sum == 0 && betObj.list.indexOf('dxf-1') > -1) {
        add('dxf-1');
      } else if (sum == 0 && betObj.list.indexOf('dxf-2') > -1) {
        add('dxf-2');
      }
    };
    add(sfc.key);
    if (sfc.win) {
      // 主胜分差
      add('sf-1'); // 主胜
      if (sfc.diff == 26 && -betObj['letScore'] > 26) {
        // 让分胜负取小值
        rfsf();
      } else if (-betObj['letScore'] > sfc.diff + 4) {
        // 让分主负
        add('rfsf-2');
      } else if (-betObj['letScore'] < sfc.diff) {
        // 让分主胜
        add('rfsf-1');
      } else {
        // 让分胜负取小值
        rfsf();
      }
    } else {
      // 客胜分差
      add('sf-2'); // 客胜
      if (sfc.diff == 26 && +betObj['letScore'] > 26) {
        // 让分胜负取小值
        rfsf();
      } else if (+betObj['letScore'] > sfc.diff + 4) {
        // 让分主胜
        add('rfsf-1');
      } else if (+betObj['letScore'] < sfc.diff) {
        // 让分客胜
        add('rfsf-2');
      } else {
        // 让分胜负取小值
        rfsf();
      }
    }
    // 大小分取小值
    dxf();
    list = list.sort(sort);
    return {sum, list};
  }

  /***
   * 比较两个SP值
   * @param betObj
   * @param bet1
   * @param bet2
   * @param flag
   * @return {{sum: *, list: *}}
   */
  getSumList(betObj, bet1, bet2, flag = false) {
    let sum = 0, list = [];
    if (flag) { // 取小值
      if (betObj.list.indexOf(bet1) > -1 && betObj.list.indexOf(bet2) > -1) {
        if (+betObj[bet1] < +betObj[bet2]) {
          sum = +betObj[bet1];
          list = [bet1];
        } else {
          sum = +betObj[bet2];
          list = [bet2];
        }
      }
    } else { // 取大值
      if (betObj.list.indexOf(bet1) > -1 && betObj.list.indexOf(bet2) > -1) {
        if (+betObj[bet1] > +betObj[bet2]) {
          sum = +betObj[bet1];
          list = [bet1];
        } else {
          sum = +betObj[bet2];
          list = [bet2];
        }
      } else if (betObj.list.indexOf(bet1) > -1) {
        sum = +betObj[bet1];
        list = [bet1];
      } else if (betObj.list.indexOf(bet2) > -1) {
        sum = +betObj[bet2];
        list = [bet2];
      }
    }
    return {sum, list};
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
   * 得到奖金和奖金明细（篮球足球混投）
   * 混投要考虑多个SP值存在的情况
   * @param arrayList 二维数组
   */
  getBonusDetail(arrayList) {
    let {orderObj, multiple} = this;
    let bonus = 0;
    let detail = [];
    arrayList.map(item => {
      let list = item.split(',');
      let mul = 1;
      let str = '';
      list.map(key => {
        mul *= Util.get(orderObj, key);
        str += `×[${orderObj[key.split('.')[0]].name}]${Util.get(orderObj, key)}`;
      });
      mul = (Math.round(mul * multiple * 2 * 100) / 100).toFixed(2);
      str += `×${multiple}倍×2元=${mul}`;
      bonus = Util.add(bonus, mul).toFixed(2);
      detail.push(str.substr(1));
    });
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
                maxList.push(orderObj[key].max);
              });
              let maxBonusDetail = this.getBonusDetail(new Direct(maxList.length).calc(maxList));
              maxBetNum += maxMul;
              maxBouns = Util.add(maxBouns, maxBonusDetail.bonus);
              maxDetail = maxDetail.concat(maxBonusDetail.detail);
            });
            minArray.map(list => {
              let minMul = 1;
              let minList = [];
              list.map(key => {
                minMul *= orderObj[key].min.length;
                minList.push(orderObj[key].min);
              });
              let minBonusDetail = this.getBonusDetail(new Direct(minList.length).calc(minList));
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
              maxList.push(orderObj[key].max);
            });
            let maxBonusDetail = this.getBonusDetail(new Direct(maxList.length).calc(maxList));
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
