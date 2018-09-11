import http from '@/utils/request';
import { getToken, isLogin, goLogin } from '@/services/auth';

export default {
  /**
   * 发单
   *
   * @param {object} data 发单数据
   * @returns
   */
  createCopy(data) {
    return http.post('/order-copy', data);
  },
  /**
   * 获取发单详情
   *
   * @param {int} id 发单id
   * @returns
   */
  getReceipt(id) {
    return http.get('/order-copy/info', {
      params: { id, token: getToken() }
    });
  },
  /**
   * 获取关注状态
   *
   * @param {int} userIssueId 发单用户id
   * @returns
   */
  getFollowStatus(userIssueId) {
    return http.post('/order-copy/isFocus', {
      token: getToken(),
      userIssueId
    });
  },
  /**
   * 关注或取消关注请求
   *
   * @param {int} userIssueId
   * @param {int} flag 取消关注时，需传非空值；关注时，不需。
   * @returns
   */
  follow(userIssueId, flag) {
    if (!isLogin()) {
      goLogin();
      return Promise.reject(new Error('not login'));
    }
    let data = {
      userIssueId: userIssueId,
      token: getToken()
    };
    if (flag) {
      data = {
        ...data,
        flag
      };
    }
    return http.post('/order-copy/updateFocus', data);
  },
  /**
   * 发单(专家)用户消息
   *
   * @param {int} userIssueId
   * @returns
   */
  getIssueUserData(userIssueId) {
    return http.get('/order-copy/user-issue-info', {
      params: { id: userIssueId, token: getToken() || '' }
    });
  },
  /**
   * 用户跟单
   *
   * @param {int} id 发单id
   * @param {any} times 倍数
   * @returns
   */
  betFollow(id, times) {
    return http.post('/order-copy/followed', {
      multipleNum: times,
      orderIssueId: id,
      token: getToken()
    });
  },
  /**
   * 用户跟单 超出倍数之后请求
   *
   * @param {int} id 发单id
   * @param {any} times 倍数
   * @returns
   */
  overflowBet(lotteryCode) {
    return http.get('/lottery/betRule/2/' + lotteryCode, {});
  },
  /**
   * 发单信息统计
   *
   * @param {int} id 发单用户id
   * @param {int} lotteryCode 彩种id
   * @returns
   */
  getAnalytics(id, lotteryCode) {
    return http.get('/order-copy/user-prize-count', {
      params: { id, lotteryCode }
    });
  },
  /**
   * 获取推荐抄单
   * @param {int } issueUserId 发单用户id
   * @param {int} lotteryCode 彩种id
   * @param {int} queryType 查询类型
   * @param {int} pageSize 请求数据个数
   * @param {int} pageIndex 页数
   */
  getRecommend(
    issueUserId,
    lotteryCode,
    queryType = 3,
    pageSize = 10,
    pageIndex = 1
  ) {
    return http.post('/order-copy/listOrderIssues', {
      issueUserId,
      lotteryCode,
      queryType,
      pageSize,
      pageIndex
    });
  },
  /**
   * 获取专家列表
   * @param {int } lotteryCode 彩种id
   * @param {int} queryType 查询类型
   * @param {int} pageSize 请求数据个数
   * @param {int} pageIndex 页数
   * @param {int} sortCondition 排序字段  1：命中率最高；2：推荐最多
   */
  getSpeciaList(
    lotteryCode,
    queryType = 3,
    pageSize = 10,
    pageIndex = 1,
    sortCondition = 1
  ) {
    return http.post('/order-copy/listUserIssueInfo', {
      lotteryCode,
      queryType,
      pageSize,
      pageIndex,
      sortCondition
    });
  },
  /**
   * 获取动态列表 与我相关数据
   * @param {int } lotteryCode 彩种id
   * @param {int} queryType 查询类型
   * @param {int} pageSize 请求数据个数
   * @param {int} pageIndex 页数
   * @param {int} sortCondition 排序字段  1：命中率最高；2：推荐最多
   */
  getRelevant(pageIndex = 1, pageSize = 20, queryType = 5, token = getToken()) {
    return http.post('/order-copy/listOrderIssues', {
      pageIndex,
      pageSize,
      queryType,
      token
    });
  },
  /**
   * 获取动态列表 我的关注数据
   * @param {int } lotteryCode 彩种id
   * @param {int} queryType 查询类型
   * @param {int} pageSize 请求数据个数
   * @param {int} pageIndex 页数
   * @param {int} sortCondition 排序字段  1：命中率最高；2：推荐最多
   */
  getAttention(
    pageIndex = 1,
    pageSize = 20,
    queryType = 2,
    token = getToken(),
    sortCondition = 1
  ) {
    return http.post('/order-copy/listUserIssueInfo', {
      pageIndex,
      pageSize,
      queryType,
      token,
      sortCondition
    });
  },
  /**
   * 获取实单抄单综合查询接口列表
   * @param {int } lotteryCode 彩种id
   * @param {int} queryType 查询类型
   * @param {int} pageSize 请求数据个数
   * @param {int} pageIndex 页数
   * @param {int} sortCondition 排序字段  1：命中率最高；2：推荐最多
   */
  getTranscribe(
    level = 0,
    lotteryCode = 0,
    queryType = 2,
    pageSize = 10,
    pageIndex = 1,
    sortCondition = 1
  ) {
    return http.post('/order-copy/listOrderIssues', {
      level,
      lotteryCode,
      queryType,
      pageSize,
      pageIndex,
      sortCondition
    });
  },
  /**
   * 获取订单的跟单列表
   *
   * @param {int} 订单编号
   * @param {number} [pageIndex=0] 页数
   * @param {number} [pageSize=10] 请求数据个数
   * @returns
   */
  getFollowList(orderCode, pageIndex = 0, pageSize = 10) {
    return http.post('/order-copy/listFollowedDetails', {
      orderCode,
      pageIndex,
      pageSize
    });
  },
  /**
   * 获取用户关注列表
   *
   * @param {any} userIssueId 发单用户id
   * @param {number} [pageIndex=0] 页数
   * @param {number} [pageSize=10] 请求数据个数
   * @returns
   */
  getFollowers(userIssueId, pageIndex = 0, pageSize = 10) {
    return http.post('/order-copy/listFocusOfIssueUser', {
      userIssueId,
      pageIndex,
      pageSize,
      token: getToken()
    });
  },
  /**
   * 获取返佣列表
   *
   * @param {int} 查询近天数
   * @param {number} [pageIndex=0] 页数
   * @param {number} [pageSize=10] 请求数据个数
   * @returns
   */
  getRebateList(daysNum = 3, pageIndex = 0, pageSize = 10) {
    return http.post('/order-copy/listCommissions', {
      daysNum,
      pageIndex,
      pageSize,
      token: getToken()
    });
  },
  /**
   * 获取订单的返佣明细
   *
   * @param {string} orderCode 订单编号
   * @param {number} [pageIndex=0] 页数
   * @param {number} [pageSize=10] 请求数据个数
   * @returns
   */
  getRebateDetailList(orderCode, pageIndex = 0, pageSize = 10) {
    return http.post('/order-copy/listCommissionDetails', {
      orderCode,
      pageIndex,
      pageSize
    });
  },
  /**
   * 获取订单是否能发单的状态
   *
   * @param {string} order 订单号
   * @returns
   */
  getAvailableStatus(order) {
    return new Promise((resolve, reject) => {
      http
        .get('/order-copy/validate', {
          params: { orderCode: order, token: getToken() }
        })
        .then(res => {
          resolve(Boolean(res.success));
        })
        .catch(reject);
    });
  },
  /**
   * 获取订单提成总额
   *
   * @param {string} orderCode 订单编号
   */
  getOrderTotalCommissionAmount(orderCode) {
    return http.post('/order-copy/getTotalCommissionDetails', { orderCode });
  }
};
