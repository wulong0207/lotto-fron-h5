import { pickBy } from 'lodash';
import Combinatorics from 'js-combinatorics';

export function mapSaleStatusText(status) {
  switch (status) {
    case 0:
      return '暂停销售';
    case 1:
      return '未开售';
    case 2:
      return '预售中';
    case 3:
      return '销售中';
    case 4:
      return '销售截止';
    case 5:
      return '已开奖';
    case 6:
      return '已派奖';
    case 7:
      return '已审核';
    default:
      return '未开售'
  }
}

export function mapPageToLotteryCode(page) {
  switch (page) {
    case '14':
      return 304;
    case '9':
      return 305;
    default:
      return 304;
  }
}

export function filterEmptybettings(bettings) {
  return pickBy(bettings, (value) => Boolean(value && value.length));
}

export function compose(bettings, courage, length=9) {
  let combs = [];
  for (let b in bettings) {
    combs.push({id: b, value: bettings[b]});
  }
  if (courage && courage.length) {
    let courageBetting = [];
    let withoutCouragebetting = [];
    for (let b in bettings) {
      if (courage.indexOf(parseInt(b)) < 0) {
        withoutCouragebetting.push({id: b, value: bettings[b]})
      } else {
        courageBetting.push({ id: b, value: bettings[b]});
      }
    }
    // const courageCompose = Combinatorics.cartesianProduct(...courageBetting);
    const cmb = Combinatorics.combination(withoutCouragebetting, 9 - courageBetting.length);
    // let combinations = [];
    // let n;
    // while(n = cmb.next()) {
    //   combinations = combinations.concat(Combinatorics.cartesianProduct(...n).toArray())
    // }
    return Combinatorics.cartesianProduct([courageBetting], cmb.toArray());
  } else {
    return Combinatorics.combination(combs, length);
  }
}

export function composeLength(bettings, courage, length=9) {
  let combs = [];
  for (let b in bettings) {
    combs.push(bettings[b]);
  }
  if (courage && courage.length) {
    let courageBetting = [];
    let withoutCouragebetting = [];
    for (let b in bettings) {
      if (courage.indexOf(parseInt(b)) < 0) {
        withoutCouragebetting.push(bettings[b])
      } else {
        courageBetting.push(bettings[b]);
      }
    }
    const courageCompose = Combinatorics.cartesianProduct(...courageBetting).toArray();
    const cmb = Combinatorics.combination(withoutCouragebetting, 9 - courageBetting.length);
    let len = 0;
    let n;
    while (n = cmb.next()) {
      len += Combinatorics.cartesianProduct(...n).length
    }
    return courageCompose.length * len;
  } else {
    return combinationsLength(combs)
  }

}

export function combinationsLength(arr, length=9) {
  const cmb = Combinatorics.combination(arr, length);
  let len = 0;
  let n;
  while(n = cmb.next()) {
    len += Combinatorics.cartesianProduct(...n).length
  }
  return len;
}