/*
奖金优化
*/

import { groupArrayByKey } from '../utils';
import { flatten } from 'lodash';
import Combinatorics from 'js-combinatorics';
import Decimal from 'decimal.js';

/*
  数组所有的排列组合
  eg: choose_iter([0, 1, 2], 2) => [[0, 1], [0, 2], [1, 2]]
*/
export function choose_iter(elements, length) {
  let combination = [];
  let val;
  const cmb = Combinatorics.combination(elements, length);
  while ((val = cmb.next())) {
    combination.push(val);
  }
  return combination;
}

/*
  含有二维数组的排列组合
  eg: compose_iter([[0], [1, 2], [3]]) => [[0, 1, 3], [0, 2, 3]]
*/
function compose_iter(arr) {
  return Combinatorics.cartesianProduct(...arr).toArray();
}

/*
  排列组合
  首先根据限定的过关长度排列所有的场次组合
  然后根据场次组合排列出所有的投注组合
*/
export function combination(arr, length) {
  let matchCombinations = choose_iter(arr, length);
  return matchCombinations.reduce((acc, m) => {
    return acc.concat(compose_iter(m.map(i => i.data)));
  }, []);
}

/*
  遍历所有的过关方式，排列出所有的投注组合
*/
export function compose({ selected, ggType }) {
  return ggType.reduce((acc, g) => {
    const size = g;
    const data = groupArrayByKey(selected, 'id');
    return acc.concat(combination(data, size));
  }, []);
}

export function bettingCompose({ selected, ggType, courage }) {
  const bettings = selected.concat();
  if (courage && courage.length) {
    const courageBetting = bettings.filter(s => courage.indexOf(s.id) > -1);
    // 设胆的排列组合
    const courageCombination = compose_iter(
      groupArrayByKey(courageBetting, 'id').map(b => b.data)
    );
    // console.log('courageCombination', courageCombination.toArray());
    // // 胆拖的排列组合
    const combinations = compose({
      selected: bettings.filter(s => courage.indexOf(s.id) < 0),
      ggType: ggType.map(i => i - courage.length)
    });
    // console.log('combination', combination);
    return compose_iter([courageCombination, combinations]).map(i =>
      flatten(i)
    );
  } else {
    return compose({ selected, ggType });
  }
}

export function generateCombinations(betting) {
  return bettingCompose({
    ...betting,
    selected: betting.selected.map(i => {
      const teamName = i.match.h_s_name ? i.match.h_s_name : i.match.h_f_name;
      return {
        ...i,
        teamName,
        match: {
          systemCode: i.match.systemCode,
          wdf: i.match.wdf
        }
      };
    }),
    ggType: betting.ggType.map(g => parseInt(g.split('串')[0]))
  })
    .map(c => {
      const sp = c
        .reduce((acc, i) => {
          return acc.times(i.sp);
        }, new Decimal(1))
        .times(2)
        .toFixed(2);
      return {
        times: 1,
        combinations: c,
        _id: new Date().getTime() * Math.random(),
        sp,
        money: sp
      };
    })
    .sort((a, b) => a.sp - b.sp);
}

export function average(combs, sum) {
  const sumTimes = sum / 2;
  // 先把每一注单注奖金的  基数相加
  const totalSp = combs
    .reduce((acc, c) => {
      return acc.plus(new Decimal(1).div(c.sp));
    }, new Decimal(0))
    .toNumber();
  // 根据总注数除以总基数得到平均标准基数点
  const base = new Decimal(sumTimes).div(totalSp);
  const combinations = combs.map(c => {
    const times = base
      .div(c.sp)
      .round()
      .toNumber()
      ? base.div(c.sp).round()
      : new Decimal(1);
    return {
      ...c,
      times: times.toNumber(),
      money: times.times(c.sp).toFixed(2)
    };
  });
  const totalTimes = combinations.reduce((acc, c) => acc + c.times, 0);
  const diffTimes = sumTimes - totalTimes; // 投注倍数减去平均算出的倍数，得出相差的倍数
  if (diffTimes === 0) return combinations;
  return fixTimesDiff(combinations, sum);
}

/*
 修复算法完成后，得出的总的投注倍数和用户投注金额不相等的情况，
 在大于用户投注的金额情况下，从 sp 值小的组合开始递减
 相反，从 sp 值大的组合开始递增
 */
function fixTimesDiff(combinations, sum) {
  const diff = sum / 2 - combinations.reduce((acc, c) => acc + c.times, 0);
  if (diff === 0) {
    return combinations;
  } else {
    const diffPositive = Math.abs(diff);
    return changeCombinationTime(combinations, diff > 0, diffPositive);
  }
}

/*
 搏冷搏热优化
 首先使所有的投注组合保本
 然后找出 sp 最大(小)的投注组合, 把剩下倍数分配给它
 */
export function optimize(combs, type, sum) {
  const combinations = combs.map(c => {
    const times = new Decimal(sum)
      .div(c.sp)
      .ceil()
      .toNumber();
    return {
      ...c,
      times,
      money: new Decimal(c.sp).times(times).toFixed(2)
    };
  });
  const diff = sum / 2 - combinations.reduce((acc, c) => acc + c.times, 0);
  if (diff === 0) {
    return combinations;
  } else if (diff < 0) {
    return fixTimesDiff(combinations, sum);
  } else {
    // 获取 sp 最小或最大的投注组合
    const optCombination = combinations.concat().sort((a, b) => {
      if (type === 'heat') {
        return a.sp - b.sp;
      } else if (type === 'cold') {
        return b.sp - a.sp;
      }
    })[0];
    // 获取非优化的投注组合，并计算出剩下的倍数
    const leftCombination = combinations.filter(
      i => i._id !== optCombination._id
    );
    const leftTimes = leftCombination.reduce((acc, c) => {
      return acc - c.times;
    }, sum / 2);
    return combinations.map(c => {
      if (c._id !== optCombination._id) return c;
      return {
        ...optCombination,
        money: new Decimal(optCombination.sp).times(leftTimes).toFixed(2),
        times: leftTimes
      };
    });
  }
}

function changeTimes(comb, positive, num = 1) {
  const times = positive ? comb.times + num : comb.times - num;
  return {
    ...comb,
    times,
    money: new Decimal(comb.sp).times(times).toFixed(2)
  };
}

/*
在优化金额比较大的时候, diff 的差距会很大
如果 diff 大于组合的数量，采用一次更改多倍，避免每次只能更改一倍造成的多次循环
* */
function changeCombinationTime(combinations, positive, length) {
  let combs = [];
  const combLength = positive
    ? combinations.length
    : combinations.filter(c => c.times > 1).length;
  if (length >= combLength) {
    let leftTimes = 0;
    const times = parseInt(length / combLength);
    const partLength = length % combLength;
    combs = combinations.map(c => {
      if (!positive && c.times <= times) {
        if (c.times === 1) {
          return c;
        }
        leftTimes += times - (c.times - 1);
        return changeTimes(c, positive, c.times - 1);
      }
      return changeTimes(c, positive, times);
    });
    leftTimes += partLength;
    if (leftTimes) {
      combs = changeCombinationTime(combs, positive, leftTimes);
    }
  } else {
    combs = changePartTimes(combinations, length, positive);
  }
  return combs;
}

function changePartTimes(combinations, length, positive) {
  const combs = combinations.concat().sort((a, b) => {
    if (positive) return b.sp - a.sp;
    return a.sp - b.sp;
  });
  let changeCombinations = combs;
  if (!positive) changeCombinations = combs.filter(c => c.times > 1);
  changeCombinations = changeCombinations.slice(0, length).map(c => c._id);
  return combinations.map(c => {
    if (changeCombinations.indexOf(c._id) < 0) return c;
    return changeTimes(c, positive, 1);
  });
}

class Optimization {
  constructor(betting) {
    this.betting = betting;
    // 初始化投注的所有排列组合
    this.combinations = this.compose({
      ...betting,
      selected: betting.selected.map(i => {
        const teamName = i.match.h_s_name ? i.match.h_s_name : i.match.h_f_name;
        return {
          ...i,
          teamName,
          match: {
            systemCode: i.match.systemCode,
            wdf: i.match.wdf
          }
        };
      }),
      ggType: betting.ggType.map(g => parseInt(g.split('串')[0]))
    })
      .map(c => {
        const sp = c
          .reduce((acc, i) => {
            return acc.times(i.sp);
          }, new Decimal(1))
          .times(2)
          .toFixed(2);
        return {
          times: 1,
          combinations: c,
          _id: new Date().getTime() * Math.random(),
          sp,
          money: sp
        };
      })
      .sort((a, b) => a.sp / 1 - b.sp / 1);
  }

  /*
    投注组合
  */
  compose({ selected, ggType, courage }) {
    const bettings = selected.concat();
    if (courage && courage.length) {
      const courageBetting = bettings.filter(s => courage.indexOf(s.id) > -1);
      // 设胆的排列组合
      const courageCombination = compose_iter(
        groupArrayByKey(courageBetting, 'id').map(b => b.data)
      );
      // console.log('courageCombination', courageCombination.toArray());
      // // 胆拖的排列组合
      const combinations = compose({
        selected: bettings.filter(s => courage.indexOf(s.id) < 0),
        ggType: ggType.map(i => i - courage.length)
      });
      // console.log('combination', combination);
      return compose_iter([courageCombination, combinations]).map(i =>
        flatten(i)
      );
    } else {
      return compose({ selected, ggType });
    }
  }

  /*
   平均优化
  */
  average(sum) {
    return average(this.combinations, sum);
    // const sumTimes = sum / 2;
    // // 先把每一注单注奖金的  基数相加
    // const totalSp = this.combinations.reduce((acc, c) => {
    //   return acc.plus(new Decimal(1).div(c.sp));
    // }, new Decimal(0)).toNumber();
    // // 根据总注数除以总基数得到平均标准基数点
    // const base = new Decimal(sumTimes).div(totalSp);
    // const combinations = this.combinations.map(c => {
    //   const times = base.div(c.sp).round().toNumber() ? base.div(c.sp).round() : new Decimal(1);
    //   return {
    //     ...c,
    //     times: times.toNumber(),
    //     money: times.times(c.sp).toFixed(2)
    //   }
    // });
    // const totalTimes = combinations.reduce((acc, c) => acc + c.times, 0);
    // const diffTimes = sumTimes - totalTimes; // 投注倍数减去平均算出的倍数，得出相差的倍数
    // if (diffTimes === 0) return combinations;
    // let changeCombination = [];
    // // 找出 sp 值最小的组合，增加或相减，减少差距
    // if (diffTimes > 0) { // 有结余，需要增加
    //   changeCombination = combinations.concat().sort((a, b) => a.sp - b.sp).slice(0, Math.abs(diffTimes)).map(c => c._id);
    // } else { // 不够，需要找出大于一的减去
    //   changeCombination = combinations.concat().filter(c => c.times > 1).sort((a, b) => a.sp - b.sp).slice(0, Math.abs(diffTimes)).map(c => c._id);
    // }
    // return combinations.map(c => {
    //   if (changeCombination.indexOf(c._id) < 0) return c;
    //   const times = diffTimes > 0 ? c.times + 1 : c.times - 1;
    //   return {
    //     ...c,
    //     times,
    //     money: new Decimal(times).times(c.sp).toFixed(2)
    //   }
    // })
    // const sumTimes = sum / 2;
    // // 先把每一注单注奖金的  基数相加
    // const totalSp = this.combinations.reduce((acc, c) => {
    //   return acc.plus(new Decimal(1).div(c.sp));
    // }, new Decimal(0)).toNumber();
    // // 根据总注数除以总基数得到平均标准基数点
    // const base = new Decimal(sumTimes).div(totalSp);
    // const combinations = this.combinations.map(c => {
    //   const times = base.div(c.sp).round().toNumber() ? base.div(c.sp).round() : new Decimal(1);
    //   return {
    //     ...c,
    //     times: times.toNumber(),
    //     money: times.times(c.sp).toFixed(2)
    //   }
    // });
    // const totalTimes = combinations.reduce((acc, c) => acc + c.times, 0);
    // const diffTimes = sumTimes - totalTimes; // 投注倍数减去平均算出的倍数，得出相差的倍数
    // if (diffTimes === 0) return combinations;
    // return this.fixTimesDiff(combinations, sum);
  }

  // /*
  //   搏冷搏热优化
  //   首先使所有的投注组合保本
  //   然后找出 sp 最大(小)的投注组合, 把剩下倍数分配给它
  // */
  // optimize(type, sum) {
  //   const combinations = this.combinations.map(c => {
  //     const times = new Decimal(sum).div(c.sp).ceil().toNumber();
  //     return {
  //       ...c,
  //       times,
  //       money: new Decimal(c.sp).times(times).toFixed(2)
  //     }
  //   });
  //   const diff = (sum / 2) - combinations.reduce((acc, c) => acc + c.times, 0);
  //   if (diff === 0) {
  //     return combinations;
  //   } else if (diff < 0) {
  //     return this.fixTimesDiff(combinations, sum);
  //   } else {
  //     // 获取 sp 最小或最大的投注组合
  //     const optCombination = combinations.concat().sort((a, b) => {
  //       if (type === 'heat') {
  //         return a.sp - b.sp;
  //       } else if (type === 'cold') {
  //         return b.sp - a.sp;
  //       }
  //     })[0];
  //     // 获取非优化的投注组合，并计算出剩下的倍数
  //     const leftCombination = combinations.filter(i => i._id !== optCombination._id);
  //     const leftTimes = leftCombination.reduce((acc, c) => {
  //       return acc - c.times;
  //     }, sum / 2);
  //     return combinations.map(c => {
  //       if (c._id !== optCombination._id) return c;
  //       return {
  //         ...optCombination,
  //         money: new Decimal(optCombination.sp).times(leftTimes).toFixed(2),
  //         times: leftTimes
  //       }
  //     });
  //   }
  // }

  // /*
  //   修复算法完成后，得出的总的投注倍数和用户投注金额不相等的情况，
  //   在大于用户投注的金额情况下，从 sp 值小的组合开始递减
  //   相反，从 sp 值大的组合开始递增
  // */
  // fixTimesDiff(combinations, sum) {
  //   const diff = (sum / 2) - combinations.reduce((acc, c) => acc + c.times, 0);
  //   let changeTimes = Math.abs(diff);
  //   if (diff === 0) {
  //     return combinations;
  //   } else if (diff < 0) {
  //     return range(Math.abs(diff)).reduce((acc, i) => {
  //       if (changeTimes === 0) return acc;
  //       let combs = acc.concat().sort((a, b) => a.sp - b.sp);
  //       let minusCombinations = combs.filter(c => c.times > 1);
  //       if (changeTimes < minusCombinations.length) {
  //         minusCombinations = minusCombinations.slice(0, changeTimes)
  //       }
  //       combs = combs.map(c => {
  //         if (minusCombinations.map(m => m._id).indexOf(c._id) < 0) {
  //           return c;
  //         }
  //         const times = c.times - 1;
  //         return {
  //           ...c,
  //           money: new Decimal(c.sp).times(times).toFixed(2),
  //           times
  //         }
  //       });
  //       changeTimes = changeTimes - minusCombinations.length;
  //       return combs;
  //     }, combinations);
  //   } else {
  //     return range(Math.abs(diff)).reduce((acc, i) => {
  //       if (changeTimes === 0) return acc;
  //       let combs = acc.concat().sort((a, b) => b.sp - a.sp);
  //       let minusCombinations = combs.concat();
  //       if (changeTimes < minusCombinations.length) {
  //         minusCombinations = minusCombinations.slice(0, changeTimes)
  //       }
  //       combs.map(c => {
  //         if (minusCombinations.map(m => m._id).indexOf(c._id) < 0) {
  //           return c;
  //         }
  //         const times = c.times + 1;
  //         return {
  //           ...c,
  //           money: new Decimal(c.sp).times(times).toFixed(2),
  //           times
  //         }
  //       });
  //       changeTimes = changeTimes - minusCombinations.length;
  //       return combs;
  //     }, combinations);
  //   }
  // }

  /*
    搏热优化
    首先使所有的投注组合保本
    然后找出 sp 最小的投注组合, 把剩下的钱分配给它
  */
  heat(sum) {
    return optimize(this.combinations, 'heat', sum);
  }

  /*
   搏冷优化
   首先使所有的投注组合保本
   然后找出 sp 最大的投注组合, 把剩下的钱分配给它
   */
  cold(sum) {
    return optimize(this.combinations, 'cold', sum);
  }
}

// const op = new Optimization(require('./betting.json'));
// console.log(op.average(200));

export default Optimization;
