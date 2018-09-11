import Order, { handlerOrderErr } from '@/component/order.jsx';
import { addOrder, addOptimizeOrder } from '../../utils/order.js';
import { clearCart } from '../actions/bet.js';

// 下单
export const Add_ORDER = 'Add_ORDER';
// 显示未支付订单详情
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const NEW_ORDER_REQUEST = 'NEW_ORDER_REQUEST';
export const NEW_ORDER_REQUEST_SUCCESS = 'NEW_ORDER_REQUEST_SUCCESS';
export const NEW_ORDER_REQUEST_FAIL = 'NEW_ORDER_REQUEST_FAIL';

// 显示未支付订单详情
export function toggleOrder(data, currentOrderId) {
  return {
    type: TOGGLE_ORDER,
    data,
    currentOrderId
  };
}

// 请求下单
export function fetchAddOrder(betting, saledate, combs, multiple) {
  return dispatch => {
    let params = betting
      ? addOptimizeOrder(betting, combs, multiple)
      : addOrder();
    dispatch({ type: NEW_ORDER_REQUEST });

    Order(
      params,
      (res, counter, currentOrderId) => {
        if (res.success) {
          dispatch(clearCart());
          if (counter) {
            // 有未支付的订单并超过了8个
            dispatch({ type: NEW_ORDER_REQUEST_FAIL });
            dispatch(toggleOrder(res.data, currentOrderId));
            window.location.hash = '/';
          } else {
            dispatch({ type: NEW_ORDER_REQUEST_SUCCESS });
          }
        } else {
          dispatch({ type: NEW_ORDER_REQUEST_FAIL });
          handlerOrderErr(res, noPayReq => {
            window.location.hash = '/';
            dispatch(clearCart());
            dispatch(toggleOrder(res.data));
          });
        }
      },
      false
    );
  };
}
