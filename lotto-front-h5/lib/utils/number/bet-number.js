import Combinatorics from 'js-combinatorics';

/*
直选和值计算
 */
export function getDirectTotalValueCombinations(start, end) {
  const dict = {};
  for (let i=start; i<=end; i++) {
    for (let k=start; k<=end; k++) {
      for (let j=start; j<=end; j++) {
        const sum = i + k + j;
        if (dict[sum]) {
          dict[sum] = dict[sum] + 1;
        } else {
          dict[sum] = 1
        }
      }
    }
  }
  return number => dict[number] ? dict[number] : 0;
}

/*
 组六和值计算
 */
export function getS6TotalValueCombinations(start, end) {
  const dict = {};
  for (let i=start; i<=end; i++) {
    for (let k=i+1; k<=end; k++) {
      for (let j=k+1; j<=end; j++) {
        const sum = i + k + j;
        if (dict[sum]) {
          dict[sum] = dict[sum] + 1;
        } else {
          dict[sum] = 1
        }
      }
    }
  }
  return number => dict[number] ? dict[number] : 0;
}

/*
 组三和值计算
 */
export function getS3TotalValueCombinations(start, end) {
  const dict = {};
  for (let i=start; i<=end; i++) {
    for (let k=i; k<=end; k++) {
      for (let j=i; j<=end; j++) {
        if ((i === k && i !== j) || (k === j && k !== i)) {
          const sum = i + k + j;
          if (dict[sum]) {
            dict[sum] = dict[sum] + 1;
          } else {
            dict[sum] = 1
          }
        }
      }
    }
  }
  return number => dict[number] ? dict[number] : 0;
}

/*
包号注数计算
* */

export function getCombinations(arr, length) {
  if(arr.length < length) return 0;
  return Combinatorics.combination(arr, length).length;
}
