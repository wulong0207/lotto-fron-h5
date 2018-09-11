/*
 * @Author: yubei
 * @Date: 2017-05-15 17:18:24
 * @Desc: 统一下单接口
 */

import http from '../utils/request';
import Message from '../services/message';
import session from '../services/session.js';

/**
 * 监控下单错误时，处理事件
 * @Author: YLD
 */
export function handlerOrderErr(res, params, callback) {
  let ok = true;
  if (res.success) {
    return ok;
  }
  // Message.toast(res.message); // 注释掉，避免下单时没token提示框出现了
  return ok;
}

// 前往支付
// @Author: YLD
export function goPay(orderId, buyType) {
  window.location.href =
    '/pay.html?orderCode=' + orderId + '&buyType=' + buyType;
}

/**
 * 统一下单接口
 * http://192.168.74.164:8189/workspace/myWorkspace.do?projectId=16#53
 */
export default function Order(params, callback, addChase) {
  let orderUrl = '/order/addOrder';
  if (addChase) {
    orderUrl = '/chase/addChase';
  }

  const reqNoPayList = (callback, counter, orderId) => {
    let param = {
      lotteryCode: params.lotteryCode,
      lotteryIssue: params.lotteryIssue || params.issueCode,
      token: session.get('token')
    };

    http
      .post('/order/queryNoPayOrderDetailList', param)
      .then(res => {
        if (callback) {
          callback(res, counter || true, orderId);
        }
        return res;
      })
      .catch(err => {
        if (
          err.code !== '20100' &&
          err.code !== '30602' &&
          err.code !== '40118' &&
          err.code !== '40261' &&
          err.code !== '40127'
        ) {
          Message.toast(err.message);
        }
      });
  };

  http
    .post(orderUrl, params)
    .then(res => {
      // 如果未支付订单存在16个，就查询未支付详情列表
      let counter = res.data.counter || res.data.noPayCount; // 追号计划取noPayCount

      let orderId = res.data.oc || res.data.orderAddCode || ''; // 追号计划取orderAddCode
      if (counter > 8) {
        reqNoPayList(callback, counter, orderId);
        return;
      }

      let buyType = res.data.buyType || params.buyType || '';
      if (addChase) {
        buyType = 2;
      }

      if (callback) {
        callback(res);
      }

      goPay(orderId, buyType);
    })
    .catch(err => {
      if (err.code === '40312') {
        // 未支付订单已超限制
        reqNoPayList(callback);
      } else {
        if (callback) {
          callback(err);
        }
        if (
          err.code !== '20100' &&
          err.code !== '30602' &&
          err.code !== '40118' &&
          err.code !== '40261' &&
          err.code !== '40127'
        ) {
          Message.toast(err.message);
        }
      }
    });
}
