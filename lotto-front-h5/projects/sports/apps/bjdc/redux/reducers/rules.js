import {
  checkisSaleout,
  getLotteryCode,
  getCurrentMode
} from '../../utils/basketball';
import { MODES } from '../../constants';
import {
  BASKETBALL_FETCH_RULES,
  BASKETBALL_FETCH_RULES_SUCCESS,
  BASKETBALL_FETCH_RULE_FAIL
} from '../actions/rules';

const initState = {
  status: 'pendding',
  rules: {
    curIssue: {},
    lotBetMulList: []
  },
  pageData: {},
  saleStatus: {}
};

export const basketballRules = (state = initState, action) => {
  switch (action.type) {
    case BASKETBALL_FETCH_RULES:
      return Object.assign({}, state, { status: 'pendding' });
    case BASKETBALL_FETCH_RULES_SUCCESS:
      state.pageData[getLotteryCode(getCurrentMode())] = action.data;

      return Object.assign({}, state, {
        pageData: state.pageData,
        status: 'success',
        rules: action.data,
        saleStatus: MODES.reduce((acc, m) => {
          return {
            ...acc,
            [m.name]: !checkisSaleout(m.name, action.data)
          };
        }, {})
      });
    case BASKETBALL_FETCH_RULE_FAIL:
      return Object.assign({}, state, { status: 'fail' });
    default:
      return state;
  }
};
