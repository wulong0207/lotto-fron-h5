/*
 * @Author: yanglidong
 * @Date: 2017-04-18 21:32:51
 * @Desc: Navigator 页面跳转方法
 */
import BrowserHistory from 'react-router/lib/hashHistory';
import Message from '../services/message';

export default {
  Pages: {
    TradeInfo: 100, // 交易明细
    RedPacket: 101, // 我的红包
    Recharge: 102, // 充值
    DrawMoney: 103, // 提款
    SafeAccount: 104, // 账户安全
    MyBank: 105 // 我的银行卡
  },

  /**
     * 根据注册页面类型获取URL
     */
  getUrlFromPageType: function(pageType, data) {
    let url;

    switch (pageType) {
      case this.Pages.TradeInfo:
        url = '/trade-info';
        break;
      case this.Pages.RedPacket:
        url = '/red-packet';
        break;
      case this.Pages.Recharge:
        url = '/recharge';
        break;
      case this.Pages.DrawMoney:
        url = '/draw-money';
        break;
      case this.Pages.SafeAccount:
        url = '/safe-account';
        break;
      case this.Pages.MyBank:
        url = '/my-bank';
        break;
    }

    return url;
  },
  goPage: function(url) {
    window.location.href = url;
  },

  goAddr: function(addr) {
    console.log(addr);
    console.log(window.location.href);
    // window.location.hash = addr;
    window.location.hash = addr;
    // window.location.hash = '#/czTradeDetail/'+subItem.orderCode;
  },

  // 返回
  goback: function(addr, accept) {
    if (accept) {
      window.location.hash = addr;
      return;
    }

    history.back();
  },

  /**
     * 前往已注册页面，且保存浏览器地址
     */
  go: function(pageType, data) {
    let url = this.getUrlFromPageType(pageType, data);
    let query;
    if (data) {
      try {
        query = { param: JSON.stringify(data) };
      } catch (e) {}
    }

    if (url) {
      BrowserHistory.push({
        pathname: url,
        query: query
      });
    }
  },

  /**
     * 前往已注册页面，且不保存浏览器地址
     * @param  {String} pageType 已注册的页面
     * @param  {Object} data     参数
     */
  replace: function(pageType, data) {
    let url = this.getUrlFromPageType(pageType, data);

    let query;
    if (data) {
      try {
        query = { param: JSON.stringify(data) };
      } catch (e) {}
    }

    if (url) {
      BrowserHistory.replace({
        pathname: url,
        query
      });
    }
  },

  // 前往首页
  goHome: function() {
    window.location.href = './index.html';
  },

  // 前往资讯
  goZX: function() {
    window.location.href = './news.html';
  },

  // 前往双色球页面
  goSSQ: function() {
    window.location.href = './ssq.html';
  },

  // 前往山东十一选五页面
  goSD11x5: function() {
    window.location.href = './sd11x5.html';
  },

  // 前往竞彩足球页面
  goJCZ: function() {
    window.location.href = './jczq.html';
  },

  // 前往赛事直播
  goZB: function() {
    window.location.href =
      '//m.13322.com/live/?wap=YC&YCURL=https://m.2ncai.com/index.html';
  },

  /**
     * 前往彩期详情页
     * @param  {Object} resultItem 彩期参数，包括以下属性
     *                             orderCode 订单编号
     *                             lotteryCode 彩种编号
     *                             lotteryChildCode 彩种子编号 -- 非必需参数
     *                             buyType 购买类型
     *
     */
  goLotteryDetail: function(resultItem) {
    // let params = `?orderCode=${resultItem.orderCode}&lotteryCode=${resultItem.lotteryCode}&buyType=${resultItem.buyType}&lotteryChildCode=${resultItem.lotteryChildCode}`;
    let params = `#orders/${resultItem.orderCode}`;
    let addr = '';
    addr += params;
    if (location.pathname.indexOf('sc.html') < 0) {
      location.href = '/sc.html' + addr;
    } else {
      this.goAddr(addr);
    }
  },
  handleLotteryDetail: function(resultItem) {
    let addr = `#orders/${resultItem.orderCode}`;
    if (location.pathname.indexOf('sc.html') < 0) {
      location.href = './sc.html' + addr;
    } else {
      this.goAddr(addr);
    }
  },
  /**
     * 前往出票明细页面
     * orderCode 订单编号
     */
  goTicket(orderCode) {
    window.location.href = `/ticket.html?orderCode=${orderCode}`;
  }
};
