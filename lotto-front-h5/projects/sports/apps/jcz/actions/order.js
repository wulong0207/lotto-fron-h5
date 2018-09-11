import http from '@/utils/request';
import { clearBettings } from './betting';
import { LOTTERY_CODE } from '../constants';
import alert from '@/services/alert';
import { getToken } from '@/services/auth';
import { browser } from '@/utils/utils';
import interaction from '@/utils/interaction';
import session from '@/services/session';
import toast from '@/services/toast';

export const FOOTBALL_NEW_ORDER = 'FOOTBALL_NEW_ORDER';
export const FOOTBALL_NEW_ORDER_REQUEST = 'FOOTBALL_NEW_ORDER_REQUEST';
export const FOOTBALL_NEW_ORDER_REQUEST_SUCCESS =
  'FOOTBALL_NEW_ORDER_REQUEST_SUCCESS';
export const FOOTBALL_NEW_ORDER_REQUEST_FAIL =
  'FOOTBALL_NEW_ORDER_REQUEST_FAIL';
export const FOOTBALL_UNPAID_REQUEST = 'FOOTBALL_UNPAID_REQUEST';
export const FOOTBALL_UNPAID_REQUEST_SUCCESS =
  'FOOTBALL_UNPAID_REQUEST_SUCCESS';
export const FOOTBALL_UNPAID_REQUEST_FAIL = 'FOOTBALL_UNPAID_REQUEST_FAIL';
export const FOOTABLL_SET_ORDER_DATA = 'FOOTABLL_SET_ORDER_DATA';
export const FOOTBALL_TOOGLE_ORDER = 'FOOTBALL_TOOGLE_ORDER';
export const FOOTBALL_CLEAR_ORDER = 'FOOTBALL_CLEAR_ORDER';
export const FOOTBALL_ORDERS_SELECT_ALL = 'FOOTBALL_ORDERS_SELECT_ALL';
export const FOOTBALL_ORDERS_SELECT_REVERSE = 'FOOTBALL_ORDERS_SELECT_REVERSE';
export const FOOTBALL_DELETE_ORDERS = 'FOOTBALL_DELETE_ORDERS';
export const FOOTBALL_ORDER_DISPLAY_TOGGLE = 'FOOTBALL_ORDER_DISPLAY_TOGGLE';

export function getUnpaidOrder(dispatch) {
  dispatch({ type: FOOTBALL_UNPAID_REQUEST });
  return http
    .post('/order/queryNoPayOrderDetailList', {
      lotteryCode: LOTTERY_CODE,
      token: session.get('token')
    })
    .catch(err => {
      alert.alert(err.message);
    });
}

export function displayToggle() {
  return {
    type: FOOTBALL_ORDER_DISPLAY_TOGGLE
  };
}

export function placeNewOrder(data, name, latestEndSaleDate) {
  return dispatch => {
    dispatch({ type: FOOTBALL_NEW_ORDER_REQUEST });
    http
      .post('/order/addOrder', data)
      .then(res => {
        dispatch({ type: FOOTBALL_NEW_ORDER_REQUEST_SUCCESS });
        dispatch(clearBettings(name));
        if (res.data.counter >= 8) {
          getUnpaidOrder(dispatch)
            .then(response => {
              dispatch({
                type: FOOTABLL_SET_ORDER_DATA,
                data: response.data,
                currentOrder: res.data.oc,
                latestEndSaleDate
              });
            })
            .catch(err => {
              alert.alert(err.message);
              dispatch({ type: FOOTBALL_UNPAID_REQUEST_FAIL });
            });
        } else {
          if (browser.yicaiApp) {
            return interaction.sendInteraction('toPay', [
              JSON.stringify([{ oc: res.data.oc }])
            ]);
          } else {
            return (window.location.href = `/pay.html?orderCode=${
              res.data.oc
            }&buyType=${1}&token=${session.get('token')}`);
          }
        }
      })
      .catch(err => {
        dispatch({
          type: FOOTBALL_NEW_ORDER_REQUEST_FAIL
        });
        if (err.code === '40312') {
          const fn = () => {
            getUnpaidOrder(dispatch)
              .then(response => {
                dispatch({
                  type: FOOTABLL_SET_ORDER_DATA,
                  data: response.data,
                  latestEndSaleDate
                });
              })
              .catch(err => {
                alert.alert(err.message);
                dispatch({ type: FOOTBALL_UNPAID_REQUEST_FAIL });
              });
          };
          alert.alert(err.message).then(fn);
        } else {
          alert.alert(err.message);
        }
        dispatch({ type: FOOTBALL_NEW_ORDER_REQUEST_FAIL });
      });
  };
}

export function toggleOrder(orderId) {
  return {
    type: FOOTBALL_TOOGLE_ORDER,
    orderId
  };
}

export function selectAll() {
  return {
    type: FOOTBALL_ORDERS_SELECT_ALL
  };
}

export function selecteReverse() {
  return {
    type: FOOTBALL_ORDERS_SELECT_REVERSE
  };
}

export function deleteOrder(orderIds) {
  return (dispatch, getState) => {
    http
      .post('/order/batchCancelOrderList', {
        lotteryCode: LOTTERY_CODE,
        orderCodes: orderIds,
        token: getToken()
      })
      .then(res => {
        toast.toast(`你已成功删除${orderIds.length}个方案`);
        dispatch({
          type: FOOTBALL_DELETE_ORDERS,
          orderIds
        });
      })
      .catch(err => {
        alert.alert(err.message);
      });
  };
}
