export default {
  page() {
    let address = window.location.pathname;

    let pages = {};
    if (address === '/ssc.html') {
      pages.tab = [
        {
          name: '五星直选',
          desc: '100000元',
          page: 'rener',
          lotteryChildCode: 20101
        },
        {
          name: '五星通选',
          desc: '20440元',
          page: 'rensan',
          lotteryChildCode: 20102
        },
        {
          name: '三星直选',
          desc: '1000元',
          page: 'rensi',
          lotteryChildCode: 20103
        },
        {
          name: '三星直选和值',
          desc: '1000元',
          page: 'renwu',
          lotteryChildCode: 20103
        },
        {
          name: '三星组三',
          desc: '320元',
          page: 'renliu',
          lotteryChildCode: 20104
        },
        {
          name: '三星组三胆拖',
          desc: '320元',
          page: 'renqi',
          lotteryChildCode: 20104
        },
        {
          name: '三星组六',
          desc: '160元',
          page: 'renba',
          lotteryChildCode: 20105
        },
        {
          name: '三星组六胆拖',
          desc: '160元',
          page: 'qianyi',
          lotteryChildCode: 20105
        },
        {
          name: '二星直选',
          desc: '100元',
          page: 'qianerGroup',
          lotteryChildCode: 20106
        },
        {
          name: '二星直选和值',
          desc: '100元',
          page: 'qianerSelect',
          lotteryChildCode: 20106
        },
        {
          name: '二星组选',
          desc: '50元',
          page: 'qiansanGroup',
          lotteryChildCode: 20107
        },
        {
          name: '二星组选胆拖',
          desc: '50元',
          page: 'qiansanSelect',
          lotteryChildCode: 20107
        },
        {
          name: '二星组选和值',
          desc: '50元',
          page: 'exzxhz',
          lotteryChildCode: 20107
        },
        {
          name: '一星',
          desc: '10元',
          page: 'selectOne',
          lotteryChildCode: 20108
        },
        {
          name: '大小单双',
          desc: '4元',
          page: 'MaxMin',
          lotteryChildCode: 20109
        }
      ];
      pages.omit = '/cqssc/omit';
      pages.LotteryHistory = '/cqssc/issue/recent/';
    }

    return pages;
  }
};
