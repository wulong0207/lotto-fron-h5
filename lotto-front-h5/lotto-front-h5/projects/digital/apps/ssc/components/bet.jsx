export default function(target) {
  target.CALC = obj => {
    let result = {
      num: 0,
      bonus: 0,
      profit: 0
    };
    let betArr = obj.betArr;
    let index = obj.ind;
    let money = obj.money;
    result.bonus = money;
    let count;
    let num = 0;
    switch (index) {
      // 五星直选
      case 0:
        result.num =
          betArr[0].length *
          betArr[1].length *
          betArr[2].length *
          betArr[3].length *
          betArr[4].length;
        break;
      // 五星通选
      case 1:
        result.num =
          betArr[0].length *
          betArr[1].length *
          betArr[2].length *
          betArr[3].length *
          betArr[4].length;
        if (result.num === 0) {
          money = 0;
          result.bonus = 0;
        }

        let n1 = betArr[0] ? betArr[0].length : 0;
        let n2 = betArr[1] ? betArr[1].length : 0;
        let n3 = betArr[2] ? betArr[2].length : 0;
        let n4 = betArr[3] ? betArr[3].length : 0;
        let n5 = betArr[4] ? betArr[4].length : 0;
        if (n1 > 0 && n2 > 0 && n3 > 0 && n4 > 0 && n5 > 0) {
          // 五星通选算法
          let max =
            (n4 * n5 - 1 + n1 * n2 - 1) * 200 +
            (n3 * n4 * n5 - 1 + n1 * n2 * n3 - 1) * 20 +
            20440;
          let before = n1 * n2;
          let after = n4 * n5;
          let min = 0;
          if (n3 === 10) {
            if (max === 100000) {
              min = max;
            } else {
              // 特殊情况（第3位选10个），需要计算 后3+后2 和 前3前2 取小
              let num1 = before * 220 + 9 * before * 20;
              let num2 = after * 220 + 9 * after * 20;
              min = num1 > num2 ? num2 : num1;
            }
          } else {
            let num = before > after ? after : before;
            min = num * n3 * 20;
            // 如果第一第二第四第五 都是全选，需要翻倍
            if (before === 100 && after === 100) {
              min *= 2;
            }
          }
          let maxBonus = max;
          let minBonus = min;

          if (result.num !== 0) {
            result.bonus =
              maxBonus === minBonus ? maxBonus : minBonus + ' ~ ' + maxBonus;
            let maxProfit = maxBonus - result.num * 2;
            let minProfit = minBonus - result.num * 2;
            result.profit =
              maxProfit === minProfit
                ? maxProfit
                : minProfit + ' ~ ' + maxProfit;
          }
        }

        break;
      // 三星直选
      case 2:
        result.num = betArr[0].length * betArr[1].length * betArr[2].length;
        break;
      // 三星直选和值
      case 3:
        for (let i = 0; i < betArr[0].length; i++) {
          count = betArr[0][i];
          if (count === '0' || count === '27') {
            num++;
          } else if (count === '26' || count === '1') {
            num += 3;
          } else if (count === '25' || count === '2') {
            num += 6;
          } else if (count === '3' || count === '24') {
            num += 10;
          } else if (count === '4' || count === '23') {
            num += 15;
          } else if (count === '5' || count === '22') {
            num += 21;
          } else if (count === '6' || count === '21') {
            num += 28;
          } else if (count === '7' || count === '20') {
            num += 36;
          } else if (count === '8' || count === '19') {
            num += 45;
          } else if (count === '9' || count === '18') {
            num += 55;
          } else if (count === '10' || count === '17') {
            num += 63;
          } else if (count === '11' || count === '16') {
            num += 69;
          } else if (count === '12' || count === '15') {
            num += 73;
          } else if (count === '13' || count === '14') {
            num += 75;
          }
        }

        result.num = num;
        break;
      // 三星组三
      case 4:
        result.num = betArr[0].length * (betArr[0].length - 1);
        break;
      // 三星组三胆拖
      case 5:
        result.num = betArr[0].length * betArr[1].length * 2;
        break;
      // 三星组六
      case 6:
        betArr.map((item, index) => {
          result.num =
            betArr[0].length *
              (betArr[0].length - 1) *
              (betArr[0].length - 2) /
              6 <
            0
              ? 0
              : betArr[0].length *
                (betArr[0].length - 1) *
                (betArr[0].length - 2) /
                6;
        });
        break;
      // 三星组六胆拖
      case 7:
        if (betArr[0].length >= 1) {
          result.num = betArr[1].length * (betArr[1].length - 1) / 2;
          if (betArr[0].length === 2) {
            result.num *= betArr[0].length;
            if (betArr[1].length === 1) {
              result.num = betArr[1].length;
            }
          }
        } else {
          result.num = 0;
        }
        break;
      // 二星直选
      case 8:
        result.num = betArr[0].length * betArr[1].length;
        break;
      // 二星直选和值
      case 9:
        for (let k = 0; k < betArr[0].length; k++) {
          count = betArr[0][k];
          if (count === '0' || count === '18') {
            num++;
          } else if (count === '1' || count === '17') {
            num += 2;
          } else if (count === '2' || count === '16') {
            num += 3;
          } else if (count === '3' || count === '15') {
            num += 4;
          } else if (count === '4' || count === '14') {
            num += 5;
          } else if (count === '5' || count === '13') {
            num += 6;
          } else if (count === '6' || count === '12') {
            num += 7;
          } else if (count === '7' || count === '11') {
            num += 8;
          } else if (count === '8' || count === '10') {
            num += 9;
          } else {
            num += 10;
          }
        }
        result.num = num;
        break;
      // 二星组选
      case 10:
        result.num =
          betArr[0].length * (betArr[0].length - 1) / 2 < 0
            ? 0
            : betArr[0].length * (betArr[0].length - 1) / 2;
        break;
      // 二星组选胆拖
      case 11:
        result.num = betArr[0].length * betArr[1].length;
        break;
      // 二星组选和值
      case 12:
        for (var i = 0; i < betArr[0].length; i++) {
          count = betArr[0][i];
          if (
            count === '0' ||
            count === '18' ||
            count === '1' ||
            count === '17'
          ) {
            num++;
          } else if (
            count === '2' ||
            count === '3' ||
            count === '15' ||
            count === '16'
          ) {
            num += 2;
          } else if (
            count === '4' ||
            count === '5' ||
            count === '13' ||
            count === '14'
          ) {
            num += 3;
          } else if (
            count === '6' ||
            count === '7' ||
            count === '11' ||
            count === '12'
          ) {
            num += 4;
          } else if (count === '8' || count === '9' || count === '10') {
            num += 5;
          }
        }
        result.num = num;
        break;
      // 一星选号
      case 13:
        result.num = betArr[0].length;
        break;
      // 大小单双
      case 14:
        result.num = betArr[0].length * betArr[1].length;
        break;
    }

    if (index !== 1) {
      if (result.num === 0) {
        money = 0;
        result.bonus = 0;
      }
      result.profit = money - result.num * 2;
    }
    return result;
  };
}
