import Combinatorics from 'js-combinatorics';
import {
  getDirectTotalValueCombinations,
  getS6TotalValueCombinations,
  getS3TotalValueCombinations
} from '@/utils/number/bet-number';

const getDirect = getDirectTotalValueCombinations(0, 9);
const getS3 = getS3TotalValueCombinations(0, 9);
const getS6 = getS6TotalValueCombinations(0, 9);

/* 获取直选的投注注数
  params number: array 选球的数组
  params length: int 组成一注时球的个数
  eg: [[0, 1], [2, 3, 4]] => [[0, 2], [0, 3], [0, 4], [1, 2], [1, 2], [1, 4]].length
 */
export function getBasicBetNum(numbers) {
  if (!numbers.length) return 0;
  for (let i = 0; i < numbers.length; i++) {
    if (!Array.isArray(numbers[i]) || !numbers[i].length) return 0;
  }
  return Combinatorics.cartesianProduct(...numbers).length;
}

/* 获取组三直选的投注注数
 params number: array 选球的数组
 */
export function getD3BetNum(numbers) {
  // 豹子数量
  const sameNumber = getSameNumber(numbers);
  return getBasicBetNum(numbers) - sameNumber;
}

/* 获取组三包号的投注注数
params number: array 选球的数组
*/
export function getC3BetNum(numbers) {
  if (numbers.length < 2) return 0;
  return numbers.length ** 2 - numbers.length;
}

/* 获取组六包号的投注注数
 params number: array 选球的数组
*/
export function getC6BetNum(
  numbers,
  fixedNumbers = [],
  isFixedRequired = false
) {
  if (isFixedRequired && fixedNumbers.length === 0) return 0;
  if (fixedNumbers.length + numbers.length < 3) return 0;
  if (!fixedNumbers.length) {
    return Combinatorics.combination(numbers, 3).length;
  }
  return Combinatorics.combination(numbers, 3 - fixedNumbers.length).length;
}

/* 获取直选和值的投注注数
 params number: array 选球的数组
 */
export function getDirectBetNum(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((acc, n) => {
    const number = getDirect(parseInt(n));
    return acc + number;
  }, 0);
}

/* 获取组三和值的投注注数
 params number: array 选球的数组
 */
export function getS3BetNum(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((acc, n) => {
    const number = getS3(parseInt(n));
    return acc + number;
  }, 0);
}

/* 获取组六和值的投注注数
 params number: array 选球的数组
 */
export function getS6BetNum(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((acc, n) => {
    const number = getS6(parseInt(n));
    return acc + number;
  }, 0);
}

/* 获取包号的投注注数
 params number: array 选球的数组
 params size: int 一注的球的个数
 */
export function getCombinationBetNum(numbers, size) {
  if (numbers.length < size) return 0;
  return Combinatorics.combination(numbers, size).length;
}

// 获取豹子数量
export function getSameNumber(numbers) {
  const first = numbers[0].map(i => parseInt(i.slice(1)));
  const second = numbers[1].map(i => parseInt(i));
  return first.filter(i => second.indexOf(i) > -1).length;
}

/* 获取组六包号的投注注数
 params number: array 选球的数组
*/
export function getC7BetNum(
  numbers,
  fixedNumbers = [],
  isFixedRequired = false
) {
  if (isFixedRequired && fixedNumbers.length === 0) return 0;
  if (fixedNumbers.length + numbers.length < 7) return 0;
  if (!fixedNumbers.length) {
    return Combinatorics.combination(numbers, 7).length;
  }
  return Combinatorics.combination(numbers, 7 - fixedNumbers.length).length;
}

/**
 * 获取胆拖投注的注数
 *
 * @export
 * @param {array} 拖码
 * @param {array} 胆码
 * @param {int} 一注的球的个数
 * @returns
 */
export function getFixedNumberCombination(
  numbers,
  fixedNumbers,
  length,
  fixedRequired = true
) {
  const maxFixedLength = length - 1;
  if (fixedNumbers.length > maxFixedLength) {
    throw new Error('胆码的个数不得大于' + maxFixedLength + '个');
  }
  if (!numbers.length) return 0;
  if (fixedRequired && !fixedNumbers.length) return 0;
  if (numbers.length + fixedNumbers.length < length) return 0;
  return Combinatorics.combination(numbers, length - fixedNumbers.length)
    .length;
}
