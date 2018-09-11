import { checkisSaleout } from '../utils/football';
import { MODES } from '../constants';
import {
  FOOTBALL_FETCH_RULES,
  FOOTBALL_FETCH_RULES_SUCCESS,
  FOOTBALL_FETCH_RULE_FAIL
} from '../actions/rules';

const initState = {
  status: 'pendding',
  rules: {},
  saleStatus: {}
};

export const footballRules = (state = initState, action) => {
  switch (action.type) {
    case FOOTBALL_FETCH_RULES:
      return Object.assign({}, state, { status: 'pendding' });
    case FOOTBALL_FETCH_RULES_SUCCESS:
      return Object.assign({}, state, {
        status: 'success',
        rules: action.data,
        saleStatus: MODES.reduce((acc, m) => {
          return {
            ...acc,
            [m.name]: !checkisSaleout(m.name, action.data)
          };
        }, {})
      });
    case FOOTBALL_FETCH_RULE_FAIL:
      return Object.assign({}, state, { status: 'fail' });
    default:
      return state;
  }
};
