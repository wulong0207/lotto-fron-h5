import Bet from '@/bet/lottery/bjdc.js';
import { MODES, PAGES } from '../constants';
import store from '../store';
import { getBetID } from './bet.js';

const basketball = new Bet();

// 计算最大奖金及奖金明细
/**
 * {
    "passObj": {
        "list": [
            "4串1",
            "3串1"
        ]
    },
    "orderObj": {
        "5140": {
            "name": "周五301",
            "bravery": true,  //是否是胆
            "betObj": {
                "list": [
                    "sf-1",
                    "sf-2",
                    "rfsf-1",
                    "rfsf-2",
                    "dxf-1",
                    "dxf-2",
                    "sfc-01",
                    "sfc-02",
                    "sfc-03",
                    "sfc-04",
                    "sfc-05",
                    "sfc-06",
                    "sfc-11",
                    "sfc-12",
                    "sfc-13",
                    "sfc-14",
                    "sfc-15",
                    "sfc-16"
                ],
                "sf-1": "1.24",
                "letScore": "-6.50",
                "sf-2": "2.92",
                "rfsf-1": "1.81",
                "rfsf-2": "1.69",
                "dxf-1": "1.70",
                "dxf-2": "1.80",
                "sfc-01": "4.10",
                "sfc-02": "3.50",
                "sfc-03": "4.55",
                "sfc-04": "8.00",
                "sfc-05": "14.50",
                "sfc-06": "18.00",
                "sfc-11": "5.90",
                "sfc-12": "6.45",
                "sfc-13": "13.50",
                "sfc-14": "29.00",
                "sfc-15": "70.00",
                "sfc-16": "82.00"
            }
        },
        "list": [
            5140
        ]
    },
    "multiple": 2,
    "isMix": true
}
 */

// 计算注数和最大奖金
export function calcBet(betting) {
  basketball.calcBet(betting);

  return basketball;
}

// 计算奖金明细
export function calcProfitDetail(betting) {
  basketball.calcDetail(betting);

  return basketball;
}

/* 获取投注的选择
                sf: [1, 2], //1为主胜， 2为主负
                //让分胜负
                rfsf: [1],//1为主胜， 2为主负
                //大小分
                dxf: [2], //1为主胜， 2为主负
                //胜分差
                sfc: ["01", "02", "11", "12"], //主胜"01", "02",主负 "11", "12"

         =====转化为===>

                "list": [
                    "sf-1",
                    "sf-2",
                    "rfsf-1",
                    "rfsf-2",
                    "dxf-1",
                    "dxf-2",
                    "sfc-01",
                    "sfc-02",
                    "sfc-03",
                    "sfc-04",
                    "sfc-05",
                    "sfc-06",
                    "sfc-11",
                    "sfc-12",
                    "sfc-13",
                    "sfc-14",
                    "sfc-15",
                    "sfc-16"
                ],
*/
export function getSelectBet(bet, field) {
  let list = [];

  if (field == 'mix' || field == 'single') {
    for (let subField in bet[field]) {
      for (let i = 0; i < bet[field][subField].length; i++) {
        let subItem = bet[field][subField][i];
        list.push(subField + '-' + subItem);
      }
    }
  } else {
    for (let i = 0; i < bet[field].length; i++) {
      let subItem = bet[field][i];
      list.push(field + '-' + subItem);
    }
  }

  return list;
}

// 根据id获取比赛
export function getGame(games, id) {
  let game = {},
    find = false;
  for (let i = 0; i < games.length; i++) {
    if (getBetID(games[i]) == id) {
      game = games[i];
      find = true;
      break;
    }
  }

  return {
    game,
    find
  };
}

// 根据ID获取比赛信息
export function getGameById(id) {
  let games = getCurrentStore('basketball').data;

  return getGame(games, id);
}

// 获取SP值
export function getSP(games, id, selectList) {
  let { game, find } = getGame(games, id);

  let current = {};
  let addSp = (field, val) => {
    let spval = val;
    if (field.indexOf('-') >= 0) {
      spval = parseFloat(spval);
      if (isNaN(spval) || spval == 0) {
        spval = 1;
      }
    }
    current[field] = spval;
  };

  let addSpArr = (fieldName, arr, addIndex = 0) => {
    for (let i = 0; i < arr.length; i++) {
      addSp(fieldName + (i + addIndex), arr[i]);
    }
  };

  if (game.wdfs) {
    addSp('spf-1', game.wdfs[1]);
    addSp('spf-2', game.wdfs[2]);
    addSp('spf-3', game.wdfs[3]);
  }

  if (game.sfs) {
    addSp('sfgg-1', game.sfs[1]);
    addSp('sfgg-2', game.sfs[2]);
    addSp('letScore', game.sfs[0]);
  }

  if (game.uds) {
    addSp('sxds-1', game.uds[0]);
    addSp('sxds-2', game.uds[1]);
    addSp('sxds-3', game.uds[2]);
    addSp('sxds-4', game.uds[3]);
  }

  // 总进球数
  if (game.goals) {
    addSp('zjqs-0', game.goals[0]);
    addSp('zjqs-1', game.goals[1]);
    addSp('zjqs-2', game.goals[2]);
    addSp('zjqs-3', game.goals[3]);

    addSp('zjqs-4', game.goals[4]);
    addSp('zjqs-5', game.goals[5]);
    addSp('zjqs-6', game.goals[6]);
    addSp('zjqs-7', game.goals[7]);
  }

  // 全场比分
  if (game.wins) {
    addSp('qcbf-10', game.wins[0]);
    addSp('qcbf-20', game.wins[1]);
    addSp('qcbf-21', game.wins[2]);
    addSp('qcbf-30', game.wins[3]);
    addSp('qcbf-31', game.wins[4]);
    addSp('qcbf-32', game.wins[5]);
    addSp('qcbf-40', game.wins[6]);
    addSp('qcbf-41', game.wins[7]);
    addSp('qcbf-42', game.wins[8]);
    addSp('qcbf-90', game.wins[9]);

    addSp('qcbf-00', game.draws[0]);
    addSp('qcbf-11', game.draws[1]);
    addSp('qcbf-22', game.draws[2]);
    addSp('qcbf-33', game.draws[3]);
    addSp('qcbf-99', game.draws[4]);

    addSp('qcbf-01', game.losts[0]);
    addSp('qcbf-02', game.losts[1]);
    addSp('qcbf-12', game.losts[2]);
    addSp('qcbf-03', game.losts[3]);
    addSp('qcbf-13', game.losts[4]);
    addSp('qcbf-23', game.losts[5]);
    addSp('qcbf-04', game.losts[6]);
    addSp('qcbf-14', game.losts[7]);
    addSp('qcbf-24', game.losts[8]);
    addSp('qcbf-09', game.losts[9]);
  }

  // 半全场
  if (game.hfwdfs) {
    addSp('bqc-1', game.hfwdfs[0]);
    addSp('bqc-2', game.hfwdfs[1]);
    addSp('bqc-3', game.hfwdfs[2]);
    addSp('bqc-4', game.hfwdfs[3]);

    addSp('bqc-5', game.hfwdfs[4]);
    addSp('bqc-6', game.hfwdfs[5]);
    addSp('bqc-7', game.hfwdfs[6]);
    addSp('bqc-8', game.hfwdfs[7]);
    addSp('bqc-9', game.hfwdfs[8]);
  }

  return current;
}

/**
 * 获取当前的玩法
 */
export function getCurrentMode(basketball, basketballMix) {
  if (basketball == null || basketballMix == null) {
    let state = store.getState();
    basketballMix = state.basketballMix;
    basketball = state.basketball;
  }

  const { page } = basketball;
  const { mode } = basketballMix || {};

  return getMode(page, mode);
}

// 获取玩法
export function getMode(page, subpage) {
  let currentMode = '';

  if (page == 'mix') {
    currentMode = subpage == 'mi' ? 'mix' : subpage;
  } else {
    currentMode = page;
  }

  return currentMode;
}

/**
 * 获取当前库
 */
export function getCurrentStore(field) {
  let result = store.getState();

  return field ? result[field] : result;
}

/**
 * 深拷贝
 * @return {[type]} [description]
 */
export function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 * 更新state
 */
export function updateField(state, field) {
  if (!field) {
    return Object.assign({}, state);
  }

  let obj = {};
  obj[field] = deepClone(state[field]);

  return Object.assign({}, state, obj);
}

// 检查是否是混合过关或者单关投注
export function checkIsMixSingle(mode) {
  return mode == 'mix' || mode == 'single';
}

// 获取彩种编号
export function getLotteryChildCode(mode, forFetch) {
  let codes = {
    spf: 30601, // 篮球胜负
    sfgg: 30701, // 胜负过关
    sxds: 30602, // 上下单双
    zjqs: 30603, // 总进球数
    qcbf: 30604, // 全场比分
    bqc: 30605 // 半全场
  };

  // 从服务器获取数据只能使用307而不能使用30701
  if (mode == 'sfgg' && forFetch) {
    return 307;
  }

  return codes[mode];
}

export function getLotteryCode(mode) {
  switch (mode) {
    case 'sfgg':
      return 307;
    default:
      return 306;
  }
}

/***********************************************/

// 计算单关的最大金额
export function getMatchBettingTypes(bettings) {
  return bettings.reduce((acc, b) => {
    if (acc.indexOf(b.type) < 0) {
      return acc.concat([b.type]);
    }
    return acc.concat();
  }, []);
}

// 获取比赛截至销售时间戳
export function getEndSaleTimeStamp(match) {
  return new Date(
    `${('2017' + match.saleDate).replace(/-/, '/')} ${match.saleEndTime}`
  ).getTime();
}

// 判断当前彩期是否正常销售
// true 为暂停销售
export function isSaleout(rules) {
  return rules.curIssue.saleStatus === 0;
}

// 判断子玩法是否正常销售
// true 为暂停销售
export function checkisSaleout(mode, rules) {
  const children = rules.lotChildList;
  let code;
  try {
    code = MODES.filter(m => m.name === mode)[0].code;
  } catch (e) {
    console.error(
      '错误的玩法 name, 必须为[' + MODES.map(m => m.name).join(',') + ']之一'
    );
    return true;
  }
  const child = children.filter(c => c.lotteryChildCode === code);
  return Boolean(child.length && child[0].saleStatus !== 1);
}

export function getNextNormalSaleLottery(mode, rules) {
  const modes = MODES.filter(m => m.name !== mode);
  for (let i = 0, l = modes.length; i < l; i++) {
    const name = modes[i].name;
    if (!checkisSaleout(name, rules)) {
      return name;
    }
  }
  return '';
}

export function getNextOpenDateTime(serverTime) {
  const hour = serverTime.getHours();
  const date = serverTime.getDate();
  const isNextDay = hour >= 9;
  const nextDate = new Date(serverTime.getTime());
  nextDate.setHours(9, 0, 0, 0, 0);
  if (isNextDay) nextDate.setDate(date + 1);
  return nextDate;
}

export function getPageData(data, name) {
  // if (name === 'single') {
  //   return data.filter(m => Boolean(m.status_letWdf === 1 || m.status_wdf === 1));
  // } else if (name === 'alternative') {
  //   return data.filter(m => Boolean(Math.abs(m.wdf[3] / 1) === 1 && m.status_letWdf !== 4));
  // }
  return data;
}

// 是否为合法的 page name
export function isValidPage(name) {
  const pages = PAGES.concat(MODES);
  return pages.map(i => i.name).indexOf(name) >= 0;
}

// page name 是否为混合里的玩法
export function isInMixPage(name) {
  return MODES.map(i => i.name).indexOf(name) >= 0;
}

export function setHistoryState(page) {
  let url = `${location.origin}${location.pathname}`;
  if (page !== 'mi') {
    url = `${url}?page=${page}`;
  }
  history.replaceState({}, null, url);
}

export function getMatchSaleEndTimestamp(match) {
  return new Date(
    match.saleEndDate.replace(/-/g, '/') + ' ' + match.saleEndTime
  ).getTime();
}

export function getMatchStartTimestamp(match) {
  return new Date(match.date.replace(/-/g, '/') + ' ' + match.time).getTime();
}

// 删除最后一个字符串
export function removeLast(str) {
  return str.substring(0, str.length - 1);
}
