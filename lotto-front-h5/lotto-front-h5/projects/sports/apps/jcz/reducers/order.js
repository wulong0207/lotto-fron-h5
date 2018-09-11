import {
  FOOTABLL_SET_ORDER_DATA,
  FOOTBALL_TOOGLE_ORDER,
  FOOTBALL_ORDERS_SELECT_ALL,
  FOOTBALL_ORDERS_SELECT_REVERSE,
  FOOTBALL_DELETE_ORDERS,
  FOOTBALL_NEW_ORDER_REQUEST,
  FOOTBALL_NEW_ORDER_REQUEST_SUCCESS,
  FOOTBALL_ORDER_DISPLAY_TOGGLE,
  FOOTBALL_NEW_ORDER_REQUEST_FAIL
} from '../actions/order';

const defaultState = {
  show: false,
  data: [],
  currentOrder: '',
  endTime: new Date(),
  status: 'ide'
};

export const order = (state = {}, action) => {
  switch (action.type) {
    case FOOTBALL_TOOGLE_ORDER:
      if (state.orderCode !== action.orderId || state.current) return state;
      return Object.assign({}, state, { selected: !state.selected });
    case FOOTBALL_ORDERS_SELECT_ALL:
      return Object.assign({}, state, { selected: true });
    case FOOTBALL_ORDERS_SELECT_REVERSE:
      if (state.current) return state;
      return Object.assign({}, state, { selected: !state.selected });
    case FOOTBALL_DELETE_ORDERS:
      return action.orderIds.indexOf(state.orderCode) < 0;
  }
};

export const footballOrders = (state = defaultState, action) => {
  switch (action.type) {
    case FOOTABLL_SET_ORDER_DATA:
      return Object.assign({}, state, {
        data: action.data.map(d =>
          Object.assign(
            {},
            d,
            { selected: true },
            { current: d.orderCode === action.currentOrder }
          )
        ),
        show: true,
        currentOrder: action.currentOrder ? action.currentOrder : '',
        endTime: action.latestEndSaleDate
      });
    case FOOTBALL_TOOGLE_ORDER:
      return Object.assign({}, state, {
        data: state.data.map(s => order(s, action))
      });
    case FOOTBALL_ORDERS_SELECT_ALL:
      return Object.assign({}, state, {
        data: state.data.map(s => order(s, action))
      });
    case FOOTBALL_ORDERS_SELECT_REVERSE:
      return Object.assign({}, state, {
        data: state.data.map(s => order(s, action))
      });
    case FOOTBALL_DELETE_ORDERS:
      return Object.assign({}, state, {
        data: state.data.filter(s => order(s, action))
      });
    case FOOTBALL_NEW_ORDER_REQUEST:
      return { ...state, status: 'pending' };
    case FOOTBALL_NEW_ORDER_REQUEST_SUCCESS:
      return { ...state, status: 'success' };
    case FOOTBALL_NEW_ORDER_REQUEST_FAIL:
      return { ...state, status: 'fail' };
    case FOOTBALL_ORDER_DISPLAY_TOGGLE:
      return { ...state, show: !state.show };
    default:
      return state;
  }
};
