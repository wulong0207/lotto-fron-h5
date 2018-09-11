import { MODULE_FUC } from '../../constants';

export const PAGES = [
  {
    name: 'spf',
    label: '胜平负'
  },
  {
    name: 'sfgg',
    label: '胜负过关'
  },
  {
    name: 'sxds',
    label: '上下单双'
  },
  {
    name: 'zjqs',
    label: '总进球数'
  },
  {
    name: 'qcbf',
    label: '全场比分'
  },
  {
    name: 'bqc',
    label: '半全场'
  }
];

export const MODES = [
  {
    name: 'spf',
    label: '胜平负',
    code: 30601,
    sort: 0
  },
  {
    name: 'sfgg',
    label: '胜负过关',
    code: 30701,
    sort: 1
  },
  {
    name: 'sxds',
    label: '上下单双',
    code: 30602,
    sort: 2
  },
  {
    name: 'zjqs',
    label: '总进球数',
    code: 30603,
    sort: 3
  },
  {
    name: 'qcbf',
    label: '全场比分',
    code: 30604,
    sort: 4
  },
  {
    name: 'bqc',
    label: '半全场',
    code: 30605,
    sort: 5
  }
];

export const FILTER_FUNCS = {
  // 全部赛事、五大赛事、反选、热门赛事, 日期、让球、赔率
  spf: {
    sp: 'wdfs',
    funcs: [
      MODULE_FUC.ALL,
      MODULE_FUC.FIVE,
      MODULE_FUC.OPP,
      MODULE_FUC.HOT,
      MODULE_FUC.DATE,
      MODULE_FUC.LB,
      MODULE_FUC.ODDS
    ]
  },
  sfgg: {
    funcs: [MODULE_FUC.AT, MODULE_FUC.HOT, MODULE_FUC.BK]
  },
  sxds: {
    sp: 'uds',
    funcs: [
      MODULE_FUC.ALL,
      MODULE_FUC.FIVE,
      MODULE_FUC.OPP,
      MODULE_FUC.HOT,
      MODULE_FUC.DATE,
      MODULE_FUC.ODDS
    ]
  },
  zjqs: {
    funcs: [
      MODULE_FUC.ALL,
      MODULE_FUC.FIVE,
      MODULE_FUC.OPP,
      MODULE_FUC.HOT,
      MODULE_FUC.DATE
    ]
  },
  qcbf: {
    funcs: [
      MODULE_FUC.ALL,
      MODULE_FUC.FIVE,
      MODULE_FUC.OPP,
      MODULE_FUC.HOT,
      MODULE_FUC.DATE
    ]
  },
  bqc: {
    funcs: [
      MODULE_FUC.ALL,
      MODULE_FUC.FIVE,
      MODULE_FUC.OPP,
      MODULE_FUC.HOT,
      MODULE_FUC.DATE
    ]
  }
};

export const LOTTERY_CODE = 306;

export const BJDC_BETTING_STORAGE_KEY = 'bjdc_betting';
export const BJDC_BETTTING_CALC_STORAGE_KEY = 'bjdc_betting_calc_selected';
