export default {
  page() {
    let address = window.location.pathname;

    let pages = {};
    if (address === '/gd11x5.html') {
      pages.tab = [
        {
          name: '任二',
          desc: '6元',
          page: 'rener',
          lotteryChildCode: 21002
        },
        {
          name: '任三',
          desc: '19元',
          page: 'rensan',
          lotteryChildCode: 21003
        },
        {
          name: '任四',
          desc: '78元',
          page: 'rensi',
          lotteryChildCode: 21004
        },
        {
          name: '任五',
          desc: '540元',
          page: 'renwu',
          lotteryChildCode: 21005
        },
        {
          name: '任六',
          desc: '90元',
          page: 'renliu',
          lotteryChildCode: 21006
        },
        {
          name: '任七',
          desc: '26元',
          page: 'renqi',
          lotteryChildCode: 21007
        },
        {
          name: '任八',
          desc: '9元',
          page: 'renba',
          lotteryChildCode: 21008
        },
        {
          name: '前一',
          desc: '13元',
          page: 'qianyi',
          lotteryChildCode: 21009
        },
        {
          name: '前二组选',
          desc: '65元',
          page: 'qianerGroup',
          lotteryChildCode: 21010
        },
        {
          name: '前二直选',
          desc: '130元',
          page: 'qianerSelect',
          lotteryChildCode: 21011
        },
        {
          name: '前三组选',
          desc: '195元',
          page: 'qiansanGroup',
          lotteryChildCode: 21012
        },
        {
          name: '前三直选',
          desc: '1170元',
          page: 'qiansanSelect',
          lotteryChildCode: 21013
        }
      ];
      pages.omit = '/gd11x5/omit';
      pages.LotteryHistory = '/gd11x5/issue/recent/';
      pages.tabPages = 'gd11x5_tab_page';
    } else if (address === '/sd11x5.html') {
      pages.tab = [
        {
          name: '任二',
          desc: '6元',
          page: 'rener',
          lotteryChildCode: 21502
        },
        {
          name: '任三',
          desc: '19元',
          page: 'rensan',
          lotteryChildCode: 21503
        },
        {
          name: '任四',
          desc: '78元',
          page: 'rensi',
          lotteryChildCode: 21504
        },
        {
          name: '任五',
          desc: '540元',
          page: 'renwu',
          lotteryChildCode: 21505
        },
        {
          name: '任六',
          desc: '90元',
          page: 'renliu',
          lotteryChildCode: 21506
        },
        {
          name: '任七',
          desc: '26元',
          page: 'renqi',
          lotteryChildCode: 21507
        },
        {
          name: '任八',
          desc: '9元',
          page: 'renba',
          lotteryChildCode: 21508
        },
        {
          name: '前一',
          desc: '13元',
          page: 'qianyi',
          lotteryChildCode: 21509
        },
        {
          name: '前二组选',
          desc: '65元',
          page: 'qianerGroup',
          lotteryChildCode: 21510
        },
        {
          name: '前二直选',
          desc: '130元',
          page: 'qianerSelect',
          lotteryChildCode: 21511
        },
        {
          name: '前三组选',
          desc: '195元',
          page: 'qiansanGroup',
          lotteryChildCode: 21512
        },
        {
          name: '前三直选',
          desc: '1170元',
          page: 'qiansanSelect',
          lotteryChildCode: 21513
        },
        {
          name: '乐选三',
          desc: '1384元',
          page: 'lesan',
          lotteryChildCode: 21515
        },
        {
          name: '乐选四',
          desc: '154元',
          page: 'lesi',
          lotteryChildCode: 21516
        },
        {
          name: '乐选五',
          desc: '1080元',
          page: 'lewu',
          lotteryChildCode: 21517
        }
      ];
      pages.omit = '/sd11x5/omit';
      pages.LotteryHistory = '/sd11x5/issue/recent/';
      pages.tabPages = 'sd11x5_tab_page';
    } else if (address === '/jx11x5.html') {
      pages.tab = [
        {
          name: '任二',
          desc: '6元',
          page: 'rener',
          lotteryChildCode: 21302
        },
        {
          name: '任三',
          desc: '19元',
          page: 'rensan',
          lotteryChildCode: 21303
        },
        {
          name: '任四',
          desc: '78元',
          page: 'rensi',
          lotteryChildCode: 21304
        },
        {
          name: '任五',
          desc: '540元',
          page: 'renwu',
          lotteryChildCode: 21305
        },
        {
          name: '任六',
          desc: '90元',
          page: 'renliu',
          lotteryChildCode: 21306
        },
        {
          name: '任七',
          desc: '26元',
          page: 'renqi',
          lotteryChildCode: 21307
        },
        {
          name: '任八',
          desc: '9元',
          page: 'renba',
          lotteryChildCode: 21308
        },
        {
          name: '前一',
          desc: '13元',
          page: 'qianyi',
          lotteryChildCode: 21309
        },
        {
          name: '前二组选',
          desc: '65元',
          page: 'qianerGroup',
          lotteryChildCode: 21310
        },
        {
          name: '前二直选',
          desc: '130元',
          page: 'qianerSelect',
          lotteryChildCode: 21311
        },
        {
          name: '前三组选',
          desc: '195元',
          page: 'qiansanGroup',
          lotteryChildCode: 21312
        },
        {
          name: '前三直选',
          desc: '1170元',
          page: 'qiansanSelect',
          lotteryChildCode: 21313
        }
      ];
      pages.omit = '/jx11x5/omit';
      pages.LotteryHistory = '/jx11x5/issue/recent/';
      pages.tabPages = 'jx11x5_tab_page';
    } else if (address === '/xj11x5.html') {
      pages.tab = [
        {
          name: '任二',
          desc: '6元',
          page: 'rener',
          lotteryChildCode: 27302
        },
        {
          name: '任三',
          desc: '19元',
          page: 'rensan',
          lotteryChildCode: 27303
        },
        {
          name: '任四',
          desc: '78元',
          page: 'rensi',
          lotteryChildCode: 27304
        },
        {
          name: '任五',
          desc: '540元',
          page: 'renwu',
          lotteryChildCode: 27305
        },
        {
          name: '任六',
          desc: '90元',
          page: 'renliu',
          lotteryChildCode: 27306
        },
        {
          name: '任七',
          desc: '26元',
          page: 'renqi',
          lotteryChildCode: 27307
        },
        {
          name: '任八',
          desc: '9元',
          page: 'renba',
          lotteryChildCode: 27308
        },
        {
          name: '前一',
          desc: '13元',
          page: 'qianyi',
          lotteryChildCode: 27309
        },
        {
          name: '前二组选',
          desc: '65元',
          page: 'qianerGroup',
          lotteryChildCode: 27310
        },
        {
          name: '前二直选',
          desc: '130元',
          page: 'qianerSelect',
          lotteryChildCode: 27311
        },
        {
          name: '前三组选',
          desc: '195元',
          page: 'qiansanGroup',
          lotteryChildCode: 27312
        },
        {
          name: '前三直选',
          desc: '1170元',
          page: 'qiansanSelect',
          lotteryChildCode: 27313
        }
      ];
      pages.omit = '/xj11x5/omit';
      pages.LotteryHistory = '/xj11x5/issue/recent/';
      pages.tabPages = 'xj11x5_tab_page';
    }

    return pages;
  }
};
