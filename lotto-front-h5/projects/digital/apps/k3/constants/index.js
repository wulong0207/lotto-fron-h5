export const LOTTERY = {
  233: {
    name: 'jsk3',
    lotteryCode: 233,
    label: '江苏快三',
    socketEventName: 'jsk3UpdateData',
    children: {
      bth3: 23305,
      th3: 23306,
      thtx3: 23307,
      lhtx3: 23308,
      bth2: 23304,
      th2: 23302,
      thfx2: 23303,
      hz: 23301
    }
  },
  234: {
    name: 'jxk3',
    lotteryCode: 234,
    label: '江西快三',
    socketEventName: 'jxk3UpdateData',
    children: {
      bth3: 23405,
      th3: 23406,
      thtx3: 23407,
      lhtx3: 23408,
      bth2: 23404,
      th2: 23402,
      thfx2: 23403,
      hz: 23401
    }
  }
};

export const PAGES = [
  {
    name: '和值',
    desc: '9-240元',
    page: 'hz',
    lotteryChildCode: 23301
  },
  {
    name: '三同号',
    desc: '40-240元',
    page: 'th3',
    lotteryChildCode: 23306
  },
  {
    name: '二同号',
    desc: '15-80元',
    page: 'th2',
    lotteryChildCode: 23302
  },
  {
    name: '三不同号',
    desc: '10-40元',
    page: 'bth3',
    lotteryChildCode: 23305
  },
  {
    name: '二不同号',
    desc: '8元',
    page: 'bth2',
    lotteryChildCode: 23304
  }
];
