/**
 * Created by YLD on 7/9/17.
 */

import {
  SET_OPTIMIZATION_SUM,
  SET_OPTIMIZATION_TYPE
} from '../actions/optimization';

export const optimization = (state={ sum: 0, type: 'average'}, action) => {
  switch (action.type) {
    case SET_OPTIMIZATION_SUM:
      return { ...state, sum: action.sum };
    case SET_OPTIMIZATION_TYPE:
      return { ...state, type: action.opType };
    default:
      return state;
  }
};
