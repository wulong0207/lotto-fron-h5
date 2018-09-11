export default {
  page() {
    let address = window.location.pathname;

    let pages = {};
    if (address === '/klpk3.html') {
      pages.tab = [
        {
          name: '同花',
          desc: '90元',
          page: 'rener',
          lotteryChildCode: 22507
        },
        {
          name: '顺子',
          desc: '400元',
          page: 'rensan',
          lotteryChildCode: 22508
        },
        {
          name: '对子',
          desc: '88元',
          page: 'rensi',
          lotteryChildCode: 22509
        },
        {
          name: '豹子',
          desc: '6400元',
          page: 'renwu',
          lotteryChildCode: 22510
        },
        {
          name: '任选一',
          desc: '5元',
          page: 'renliu',
          lotteryChildCode: 22501
        },
        {
          name: '任选二',
          desc: '33元',
          page: 'renqi',
          lotteryChildCode: 22502
        },
        {
          name: '任选三',
          desc: '116元',
          page: 'renba',
          lotteryChildCode: 22503
        },
        {
          name: '任选四',
          desc: '46元',
          page: 'qianyi',
          lotteryChildCode: 22504
        },
        {
          name: '任选五',
          desc: '22元',
          page: 'qianerGroup',
          lotteryChildCode: 22505
        },
        {
          name: '任选六',
          desc: '12元',
          page: 'qianerSelect',
          lotteryChildCode: 22506
        }
      ];
      pages.omit = '/sdpk/omit';
      pages.LotteryHistory = '/sdpk/issue/recent/';
      pages.tabPages = 'gd11x5_tab_page';
    }

    return pages;
  }
};
