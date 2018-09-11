/**
 * Created by housne on 14/7/17.
 */

export const SET_OPTIMIZATION_SUM = 'SET_OPTIMIZATION_SUM';
export const SET_OPTIMIZATION_TYPE = 'SET_OPTIMIZATION_TYPE';

export function setOptimizationSum(sum) {
  return {
    type: SET_OPTIMIZATION_SUM,
    sum
  };
}

export function setOptimiztionType(type) {
  return {
    type: SET_OPTIMIZATION_TYPE,
    opType: type
  };
}
