import {
  getGame,
  getCurrentMode,
  getGameById,
  getCurrentStore
} from './basketball.js';
import {
  PAGES,
  BJDC_BETTING_STORAGE_KEY,
  BJDC_BETTTING_CALC_STORAGE_KEY
} from '../constants.js';
import session from '@/services/session.js';

// 获取场次的ID
export function getBetID(gameData) {
  return gameData.g_id + '_' + gameData.h_id + '_' + gameData.issueCode;
}

// 生成默认的数据
export function generateDefault(game) {
  game = game || {};

  return {
    // 胜平负
    spf: [], //
    // 胜负过关
    sfgg: [], // 1为主胜， 2为主负
    // 上下单双
    sxds: [], //
    // 总进球数
    zjqs: [], //
    // 全场比分
    qcbf: [], //
    // 半全场
    bqc: [], //

    // 让分胜负
    id: game.id, // 赛事id
    systemCode: game.systemCode, // 系统编号
    lotteryIssue: game.issueCode, // 彩期
    bravery: {
      // 是否为胆
      spf: false,
      sfgg: false,
      sxds: false,
      zjqs: false,
      qcbf: false,
      bqc: false
    }
  };
}

// 默认的奖金计算数据
export function getDefaultBetCalc(mode) {
  let ggType = [],
    isSingle = false;
  if (mode == 'single') {
    ggType.push('1串1');
    isSingle = true;
  }

  return {
    betNum: 0, // 投资注数
    maxBonus: 0, // 最大奖金
    minBonus: 0, // 最小奖金
    multiple: 1, // 倍数
    ggType, // 过关类型
    isSingle // 是否是单关
  };
}

// 根据选择的结果返回选择的适用于组件的状态
// 例如将[1,2]转化为{left: true, right: true}
export function getSelected(bets, game, mainBetKind, subMainKind) {
  let result = { left: false, right: false };
  let betID = getBetID(game);

  if (betID && bets[betID]) {
    let arr = bets[betID][mainBetKind];

    // 胜分差直接返回
    if (
      mainBetKind == 'sfc' ||
      mainBetKind == 'spf' ||
      mainBetKind == 'sxds' ||
      mainBetKind == 'zjqs' ||
      mainBetKind == 'qcbf' ||
      mainBetKind == 'bqc'
    ) {
      return arr;
    }

    // 混合过关则继续处理
    if (mainBetKind == 'mix' || mainBetKind == 'single') {
      arr = arr[subMainKind];

      // 胜分差直接返回
      if (subMainKind == 'sfc') {
        return arr;
      }
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == 1) {
        result.left = true;
      } else if (arr[i] == 2) {
        result.right = true;
      }
    }
  } else if (
    mainBetKind == 'sfc' ||
    subMainKind == 'sfc' ||
    mainBetKind == 'spf' ||
    mainBetKind == 'sxds' ||
    mainBetKind == 'zjqs' ||
    mainBetKind == 'qcbf' ||
    mainBetKind == 'bqc'
  ) {
    return [];
  }

  return result;
}

// 选择或取消选择，更新胆信息，如果没有投注内容，则取消设置当前胆
export function updateDan(bet, mode) {
  if (!checkHasSelect(bet, mode).hasSelect) {
    bet.bravery[mode] = false;
  }
}

// 选择或取消选择，更新过关信息，如果没有投注内容，则判断过关是否满足条件
export function updateGG(state, mode) {
  let betCalcItem = state.betCalc[mode];
  if (betCalcItem.ggType.length > 0) {
    let gameCount = selectGameCout(state.bets, mode);
    let result = [];
    betCalcItem.ggType.map((val, i) => {
      let count = gameCount.count > 4 && gameCount.hasSFC ? 4 : gameCount.count;
      if (parseInt(val) <= count) {
        result.push(val);
      }
    });

    betCalcItem.ggType = result;
  }
}

// 胜负, 让分胜负,大小分,通用选择
export function selectSimple(stateData, action) {
  let field = action.mainBetKind,
    gameData = action.data,
    selection = action.selection,
    subField = action.subBetKind;
  let targetField = getBetID(gameData);

  if (!stateData.bets[targetField]) {
    stateData.bets[targetField] = generateDefault(gameData);
  }

  if (field == 'mix' || field == 'single') {
    // 混合过关
    stateData.bets[targetField][field][subField] = [];
    if (selection.left) {
      stateData.bets[targetField][field][subField].push(1);
    }
    if (selection.right) {
      stateData.bets[targetField][field][subField].push(2);
    }
  } else {
    stateData.bets[targetField][field] = [];
    if (selection.left) {
      stateData.bets[targetField][field].push(1);
    }
    if (selection.right) {
      stateData.bets[targetField][field].push(2);
    }
  }

  if (field != 'single') {
    // 选择或取消选择，更新胆信息，如果没有投注内容，则取消设置当前胆
    updateDan(stateData.bets[targetField], field);
    // 选择或取消选择，更新过关信息，如果没有投注内容，则判断过关是否满足条件
    updateGG(stateData, field);
  }
}

// 胜分差选择
export function selectSFC(stateData, action) {
  let {
    data, // 投注的基础数据
    itemMark, // 选择的项
    add, // 操作，增加还是删除。 true： 增加， false:删除
    betKind // 混合过关时传
  } = action;

  let targetField = getBetID(data);
  if (!stateData.bets[targetField]) {
    stateData.bets[targetField] = generateDefault(data);
  }

  let arr = stateData.bets[targetField][betKind];

  let index = arr.indexOf(itemMark);
  if (index < 0) {
    arr.push(itemMark);
  } else {
    arr.splice(index, 1);
  }

  // 选择或取消选择，更新胆信息，如果没有投注内容，则取消设置当前胆
  updateDan(stateData.bets[targetField], betKind);
  // 选择或取消选择，更新过关信息，如果没有投注内容，则判断过关是否满足条件
  updateGG(stateData, betKind);
}

/**
 * 选择的比赛场数
 */
export function selectGameCout(bets, mode) {
  let count = 0;
  let hasSFC = false;

  if (bets) {
    loopBets(bets, item => {
      let sels = checkHasSelect(item, mode);

      if (sels.hasSelect) {
        count++;
      }
      if (sels.hasSFC) {
        hasSFC = true;
      }
    });
  }

  return {
    hasSFC,
    count
  };
}

/**
 * 获取默认的过关方式
 */
export function getDefaultGGType(bets, mode) {
  let gameCount = selectGameCout(bets, mode);
  let count = gameCount.count;
  if (count > 3 && mode == 'qcbf') {
    count = 3; // 全场比分默认串关最大为3串1
  } else if (count > 4) {
    // 默认串关最大为4串1
    count = 4;
  } else if (mode != 'single' && count < 2) {
    count = 2;
  }

  return {
    gg: count,
    ggStr: count + '串' + 1,
    ggList: [count + '串' + 1]
  };
}

// 获取数组中的最小过关值
export function getMinGG(arr) {
  let min = parseInt(arr[0] || 0);
  for (let i = 0; i < arr.length; i++) {
    let num = parseInt(arr[i]);
    if (min > num) min = num;
  }

  return min;
}

// 获取各个彩种的最大过关数
export function getMaxGG(mode) {
  switch (mode) {
    case 'qcbf':
      return 3;
    case 'sxds':
    case 'zjqs':
    case 'bqc':
      return 6;
    default:
      return 15;
  }
}

/**
 * 检查投注是否有投注数据
 */
export function checkHasSelect(bet, mode) {
  let data = bet;
  let result = { hasSelect: false, hasSFC: false };

  if (mode == 'single' || mode == 'mix') {
    let sf = data[mode].sf.length;
    let rfsf = data[mode].rfsf.length;
    let dxf = data[mode].dxf.length;
    let sfc = data[mode].sfc.length;
    if (sf > 0 || rfsf > 0 || dxf > 0 || sfc > 0) {
      result.hasSelect = true;
      if (sfc > 0) {
        result.hasSFC = true;
      }
    }
  } else {
    if (data[mode].length > 0) {
      result.hasSelect = true;
      if (mode == 'sfc') {
        result.hasSFC = true;
      }
    }
  }

  return result;
}

// 检查所有的玩法是否有选项
export function checkAllHasSelect(bet) {
  for (var i = 0; i < PAGES.length; i++) {
    let item = PAGES[i];
    if (bet[item.name].length > 0) {
      return true;
    }
  }

  return false;
}

// 获取投注的标示：例如 主胜[+11.5]
export function getLabel(sp, title, signed) {
  let result = sp;
  if (signed) result = sp > 0 ? '+' + sp : sp;
  title = title || '';
  return `${title}[${result}]`;
}

// 获取投注的基本信息
export function getBetDetail() {
  let getTitle = () => {};
  return {
    // 胜平负
    spf: {
      title: '胜平负',
      1: '胜',
      2: '平',
      3: '负',
      // sp是一个数组，以下代表取的game字段的哪个值，值分别对应sp数组的哪个位置
      sp: { 1: 1, 2: 2, 3: 3, val: 'wdfs' }
    },
    // 胜负过关
    sfgg: {
      title: '胜负过关',
      1: '胜',
      2: '负',
      // sp是一个数组，以下代表取的game字段的哪个值，值分别对应sp数组的哪个位置
      sp: { 1: 1, 2: 2, val: 'sfs' }
    },
    // 上下单双
    sxds: {
      title: '上下单双',
      1: '上单',
      2: '上双',
      3: '下单',
      4: '下双',
      // sp是一个数组，以下代表取的game字段的哪个值，值分别对应sp数组的哪个位置
      sp: { 1: 0, 2: 1, 3: 2, 4: 3, val: 'uds' }
    },
    // 总进球数
    zjqs: {
      title: '总进球数',
      0: '0球',
      1: '1球',
      2: '2球',
      3: '3球',
      4: '4球',
      5: '5球',
      6: '6球',
      7: '7+',
      // sp是一个数组，以下代表取的game字段的哪个值，值分别对应sp数组的哪个位置
      sp: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, val: 'goals' }
    },
    // 全场比分
    qcbf: {
      title: '全场比分',
      '10': '1:0',
      '20': '2:0',
      '21': '2:1',
      '30': '3:0',
      '31': '3:1',
      '32': '3:2',
      '40': '4:0',
      '41': '4:1',
      '42': '4:2',
      '90': '胜其他',
      '00': '0:0',
      '11': '1:1',
      '22': '2:2',
      '33': '3:3',
      '99': '平其他',
      '01': '0:1',
      '02': '0:2',
      '12': '1:2',
      '03': '0:3',
      '13': '1:3',
      '23': '2:3',
      '04': '0:4',
      '14': '1:4',
      '24': '2:4',
      '09': '负其他',

      // sp是一个数组，以下代表取的game字段的哪个值，值分别对应sp数组的哪个位置
      sp: {
        '10': '0',
        '20': '1',
        '21': '2',
        '30': '3',
        '31': '4',
        '32': '5',
        '40': '6',
        '41': '7',
        '42': '8',
        '90': '9',
        '00': '0',
        '11': '1',
        '22': '2',
        '33': '3',
        '99': '4',
        '01': '0',
        '02': '1',
        '12': '2',
        '03': '3',
        '13': '4',
        '23': '5',
        '04': '6',
        '14': '7',
        '24': '8',
        '09': '9',
        getVal: val => {
          let a = parseInt(val[0]),
            b = parseInt(val[1]);
          if (a > b) return 'wins';
          else if (a == b) return 'draws';
          else return 'losts';
        }
      }
    },
    // 半全场
    bqc: {
      title: '半全场',
      1: '胜胜',
      2: '胜平',
      3: '胜负',
      4: '平胜',
      5: '平平',
      6: '平负',
      7: '负胜',
      8: '负平',
      9: '负负',
      // sp是一个数组，以下代表取的game字段的哪个值，值分别对应sp数组的哪个位置
      sp: {
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
        9: 8,
        val: 'hfwdfs'
      }
    },

    // 获取key值
    getKey(key) {
      return key + 'val';
    }
  };
}

// 获取胆个数
export function getDanCount(bets, mode) {
  let count = 0;
  loopBets(bets, item => {
    if (item.bravery[mode]) {
      count++;
    }
  });

  return count;
}

// 遍历投注内容
export function loopBets(bets, handler, checkSelect) {
  let mode = getCurrentMode();
  for (let field in bets) {
    if (handler) {
      if (!checkSelect || checkHasSelect(bets[field], mode).hasSelect) {
        handler(bets[field], field);
      }
    }
  }
}

// 混合投注的单关检查，并将只有单关且只有一场比赛的转为单关投注
export function checkSingle(params, gameSrc) {
  let { orderObj, passObj } = params;
  let dg = '1串1';
  if (passObj.list.length == 0 && passObj.list[0] == dg) {
    return true;
  }

  let isSingle = false;
  // 只有一场比赛
  if (orderObj.list.length == 1) {
    let game = getGame(gameSrc, orderObj.list[0]).game || {};
    let betList = orderObj[orderObj.list[0]].betObj.list;
    isSingle = betList.length > 0;
    for (let i = 0; i < betList.length; i++) {
      let item = betList[i];
      if (
        (item.indexOf('sf-') >= 0 && game.statusWf != 1) ||
        (item.indexOf('rfsf-') >= 0 && game.statusLetWf != 1) ||
        (item.indexOf('dxf-') >= 0 && game.statusBigSmall != 1) ||
        (item.indexOf('sfc-') >= 0 && game.statusScoreWf != 1)
      ) {
        isSingle = false;
        break;
      }
    }
  }

  // 是单关投注
  if (isSingle) {
    passObj.list = [dg];
  }

  return isSingle;
}

// 获取选择的投注信息
export function getSelectedBets() {
  let result = [];
  let dan = [];
  let mode = getCurrentMode();
  let betDetail = getBetDetail();
  let { bets, betCalc } = getCurrentStore('betSelected');

  // 遍历选号
  loopBets(
    bets,
    (bet, field) => {
      let match = getGameById(bet.id).game;
      if (bet.bravery[mode]) {
        dan.push(bet.id);
      }

      let getSp = sp => {
        sp = parseFloat(sp);
        if (isNaN(sp) || sp == 0) {
          sp = 1;
        }

        return sp;
      };

      if (mode == 'mix' || mode == 'single') {
        for (let subField in bet[mode]) {
          for (let i = 0; i < bet[mode][subField].length; i++) {
            let sel = bet[mode][subField][i];
            let arrItem = {
              category: mode,
              id: bet.id,
              index: result.length,
              match,
              single: false,
              sp: getSp(match[betDetail[subField][sel + 'val']]),
              type: subField,
              title: betDetail[subField].getTitle(match),
              value: sel,
              label: betDetail[subField].getLabel
                ? betDetail[subField].getLabel(match, betDetail[subField][sel])
                : betDetail[subField][sel],
              times: betCalc[mode].multiple,
              score: betDetail[subField].getScore
                ? betDetail[subField].getScore(match)
                : ''
            };

            result.push(arrItem);
          }
        }
      } else {
        for (let i = 0; i < bet[mode].length; i++) {
          let sel = bet[mode][i];
          let arrItem = {
            category: mode,
            id: bet.id,
            index: result.length,
            match,
            single: false,
            sp: getSp(match[betDetail[mode][sel + 'val']]),
            type: mode,
            title: betDetail[mode].getTitle(match),
            value: sel,
            label: betDetail[mode].getLabel
              ? betDetail[mode].getLabel(match, betDetail[mode][sel])
              : betDetail[mode][sel],
            times: betCalc[mode].multiple,
            score: betDetail[mode].getScore
              ? betDetail[mode].getScore(match)
              : ''
          };

          result.push(arrItem);
        }
      }
    },
    true
  );

  return {
    bets: result,
    dan
  };
}

// 获取存储的投注信息
export function getSavedBets() {
  return {
    bets: session.get(BJDC_BETTING_STORAGE_KEY),
    betCalc: session.get(BJDC_BETTTING_CALC_STORAGE_KEY)
  };
}

// 存储投注信息
export function saveBets(betSelected) {
  betSelected = betSelected || getCurrentStore('betSelected');
  session.set(BJDC_BETTING_STORAGE_KEY, betSelected.bets);
  session.set(BJDC_BETTTING_CALC_STORAGE_KEY, betSelected.betCalc);
}

// 清除存储信息
export function clearBetsStorage() {
  session.clear(BJDC_BETTING_STORAGE_KEY);
  session.clear(BJDC_BETTTING_CALC_STORAGE_KEY);
}
