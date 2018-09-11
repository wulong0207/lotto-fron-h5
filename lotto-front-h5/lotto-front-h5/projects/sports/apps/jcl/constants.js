import {MODULE_FUC} from '../../constants';

export const PAGES = [
  {
    name: 'mix',
    label: '混合过关'
  },
  {
    name: 'single',
    label: '单关投注'
  }
];

export const MODES = [
  {
    name: 'sf',
    label: '胜负',
    code: 30101,
    sort: 0
  },
  {
    name: 'rfsf',
    label: '让分胜负',
    code: 30102,
    sort: 1
  },
  {
    name: 'dxf',
    label: '大小分',
    code: 30103,
    sort: 2
  },
  {
    name: 'sfc',
    label: '胜分差',
    code: 30104,
    sort: 3
  },
  {
    name: 'mi',
    label: '混合过关',
    code: 30105,
    sort: 4
  }
];

export const FILTER_FUNCS = {
  //全部赛事、五大赛事、反选、热门赛事, 日期、让球、赔率
  "sf": {
    funcs: [MODULE_FUC.DATE],
    filter(m){return m.statusWf !== 4}
  },
  "rfsf": {
    sp: "let_score",
    funcs: [MODULE_FUC.DATE, MODULE_FUC.LC],
    filter(m){return m.statusLetWf !== 4}
  },
  "dxf": {
    funcs: [MODULE_FUC.DATE],
    filter(m){return m.statusBigSmall !== 4}
  },
  "sfc": {
    funcs: [MODULE_FUC.DATE],
    filter(m){return m.statusScoreWf !== 4}
  },
  "mix": {
    funcs: [MODULE_FUC.DATE],
    filter(m){return m.statusScoreWf !== 4 || m.statusWf !== 4 || m.statusLetWf !== 4 || m.statusBigSmall !== 4}
  },
  "single": {
    funcs: [MODULE_FUC.DATE],
    filter(m){return m.statusScoreWf == 1 || m.statusWf == 1 || m.statusLetWf == 1 || m.statusBigSmall == 1}
  },
}

export const LOTTERY_CODE = 301;

export const BASKETBALL_BETTING_STORAGE_KEY = 'basketball_betting';
export const BASKETBALL_BETTTING_CALC_STORAGE_KEY = 'basketball_betting_calc_selected';
