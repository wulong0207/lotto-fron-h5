/**
 * 常用的限号检查
 */

import Combinatorics from 'js-combinatorics';

export function checkCombination(balls, length, limitBets) {
  const cmb = Combinatorics.combination(balls, length);
  return cmb.filter(bet => limitBets.indexOf(bet) > -1);
}

export function checkFixedCombination(
  balls,
  fixedBalls = [],
  length,
  limitBets,
  divider = ','
) {
  const cmb = Combinatorics.combination(balls, length - fixedBalls.length);
  const limited = cmb.filter(bet => {
    return (
      limitBets.indexOf(
        fixedBalls
          .concat(bet)
          .sort()
          .join(divider)
      ) > -1
    );
  });
  return limited.map(bet =>
    fixedBalls
      .concat(bet)
      .sort()
      .join(divider)
  );
}
