import Bet from '@/bet/bet';
import {
  groupArrayByKey,
  isSingleMatch,
  contains,
  getSelectedMatchs
} from '../utils';
import { MODES, PAGES } from '../constants';
import session from '@/services/session';
import { uniq } from 'lodash';
import store from '../store';
import {MODULE_FUC} from '../../../constants';


/*      JCZQLotteryIds: {
      HT: 30001,//混投
      SPF: 30002,//胜平负
      RSPF: 30003,//让球胜平负
      BF: 30004,//比分
      ZJQ: 30005,//总进球
      BQC: 30006//半全场
    },
 JCLQLotteryIds: {
      SF: 30101,//篮球胜负
      RSF: 30102,//让分
      DXF: 30103,//大小分
      SFC: 30104,//胜分差
      HT: 30105//混合过关
    },
 *
 *   足球  实例：
 *
 let Bet=require("./bet/Bet");
 let football=new Bet("Football");
 var opts = [],ggType = [],bs = 0,lotteryId=30001;
 opts[0] = "周一001^spf-3#4.50|rspf-3@1#2.12,rspf-1@1#3.35,rspf-0@1#2.80|bf-00#13.00,bf-11#7.00|jqs-0#13.00,jqs-1#5.00,jqs-2#3.35|bqc-11#5.50";//玩法和玩法之间用|分隔  如果是定胆的话在单场的赛事内容后面加上D
 opts[1] = "周一002^spf-3#2.98,spf-1#3.35|rspf-3@1#1.60|bf-10#9.50,bf-00#11.00|jqs-0#11.00,jqs-2#3.45|bqc-33#4.80,bqc-11#5.20";
 opts[2] = "周一003^spf-3#3.00,spf-1#3.30,spf-0#2.03";
 ggType[0] = "2*1";
 ggType[1] = "3*1";
 let result=football.calc({bets:opts,type:ggType,times:1,lotteryId:lotteryId});

 console.log("足球",result);

 */

const football = new Bet('Football');

// var opts = [],ggType = [],bs = 0,lotteryId=30001;
// opts[0] = "周一001^spf-3#4.50|rspf-3@1#2.12,rspf-1@1#3.35,rspf-0@1#2.80|bf-00#13.00,bf-11#7.00|jqs-0#13.00,jqs-1#5.00,jqs-2#3.35|bqc-11#5.50";//玩法和玩法之间用|分隔  如果是定胆的话在单场的赛事内容后面加上D
// opts[1] = "周一002^spf-3#2.98,spf-1#3.35|rspf-3@1#1.60|bf-10#9.50,bf-00#11.00|jqs-0#11.00,jqs-2#3.45|bqc-33#4.80,bqc-11#5.20";
// opts[2] = "周一003^spf-3#3.00,spf-1#3.30,spf-0#2.03";
// ggType[0] = "2*1";
// ggType[1] = "3*1";

// 计算最大奖金
export function calculateProfilt(betting) {
  if (!betting.selected.length) return {};
  const bettingMatchs = groupArrayByKey(betting.selected, 'id');
  // if( bettingMatchs.length === 1) {
  //   if(allowSingle) {
  //     if(!betting.ggType.length) return {};
  //     return calculateSingleProfit(betting);
  //   } else {
  //     return {};
  //   }
  // }
  if (!betting.ggType.length) return {};
  const bets = formatFootballBettingData(bettingMatchs, betting);
  const lotteryId = getLotteryCode(betting);
  // console.log(bets);
  const result = football.calc({
    bets,
    type: betting.ggType,
    times: betting.times,
    lotteryId: lotteryId
  });
  return result;
  // console.log(result);
  // console.log(football.calc({ bets, type: ['2*1'], times: betting.times, lotteryId }));
}

// 计算奖金明细
export function calculateProfitDetail(betting) {
  if (!betting.selected.length) return [];
  const bettingMatchs = groupArrayByKey(betting.selected, 'id');
  if (!betting.ggType.length) return {};
  const bets = formatFootballBettingData(bettingMatchs, betting);
  const lotteryId = getLotteryCode(betting);
  const details = football.calcDetail({
    bets,
    type: betting.ggType,
    times: betting.times,
    lotteryId: lotteryId
  });
  return details;
}

// 计算单关的数据
// function calculateSingleProfit (betting) {
//   const max = getProfit(betting);
//   const min = getProfit(betting, true);
//   return {
//     betNum: betting.selected.length,
//     maxBonus: max,
//     minBonus: min
//   }
// }

export function formatFootballBettingData(bettingMatchs, betting) {
  const courage = betting.courage;
  return bettingMatchs.map(s => {
    return formatBettingItem(s) + (courage.indexOf(s.id) > -1 ? 'D' : '');
  });
}

export function formatBettingItem(item) {
  const match = item.data[0].match;
  const itemSortedByType = groupArrayByKey(item.data, 'type');
  const bettingDataStr = itemSortedByType
    .map(i => i.data.map(s => formatSelectedSPItem(s)).join(','))
    .join('|');
  return `${match.week}${match.num}^${bettingDataStr}`;
}

export function formatSelectedSPItem(selectedItem) {
  const { type, sp, value, match } = selectedItem;
  switch (type) {
    case 'wdf':
      return `spf-${value}#${sp}`;
    case 'let_wdf':
      return `rspf-${value}@${match.wdf[3] > 0
        ? '+' + match.wdf[3]
        : match.wdf[3]}#${sp}`;
    case 'score':
      return `bf-${value
        .replace(/90/, '3A')
        .replace(/99/, '1A')
        .replace(/09/, '0A')}#${sp}`;
    case 'goal':
      return `jqs-${value}#${sp}`;
    case 'hf':
      return `bqc-${value}#${sp}`;
    default:
      return '';
  }
}

export function getLotteryCode(betting) {
  if (betting.name === 'singlewin' || betting.ggName === 'singlewin') {
    return 30001;
  }
  const lotteryTypeList = groupArrayByKey(betting.selected, 'type');
  if (lotteryTypeList.length > 1) {
    return 30001;
  } else {
    switch (lotteryTypeList[0].type) {
      case 'wdf':
        return 30002;
      case 'let_wdf':
        return 30003;
      case 'score':
        return 30004;
      case 'goal':
        return 30005;
      case 'hf':
        return 30006;
      default:
        return 30001;
    }
  }
}

export function getContentType(betting) {
  if (betting.courage.length) return 3;
  const matchs = groupArrayByKey(betting.selected, 'id');
  const ggType = betting.ggType;
  // 每场比赛只有一项投注，并且过关方式为总场数串一，则为单试
  if (
    matchs.length === betting.selected.length &&
    ggType.length === 1 &&
    ggType[0].split('*')[0] / 1 === matchs.length
  ) {
    return 1;
  }
  return 2;
}

// 生成订单
export function generateOrderData(betting) {
  debugger;
  const selected = betting.selected;
  const matchs = selected
    .map(s => s.match)
    .sort((a, b) => a.issueCode - b.issueCode);

  const buyScreen = matchs
    .reduce((acc, i) => {
      if (acc.indexOf(i.systemCode) > -1) {
        return acc;
      }
      return acc.concat([i.systemCode]);
    }, [])
    .join(',');
  const lotteryId = getLotteryCode(betting);
  const content = generateOrderPlanContent(betting);
  const children = [
    {
      lotteryChildCode: lotteryId,
      buyNumber: betting.betNum,
      multiple: 1, // 目前没有奖金优化 方案倍数为1
      amount: betting.betNum * 2 * 1, // 目前没有奖金优化金额为注数 * 2
      codeWay: 1,
      contentType: getContentType(betting),
      planContent: content
    }
  ];
  return {
    buyScreen: buyScreen,
    buyType: 1,
    isDltAdd: 0,
    lotteryCode: lotteryId,
    lotteryIssue: matchs[0].issueCode,
    multipleNum: betting.times,
    orderAmount: children.reduce((acc, c) => acc + c.amount, 0) * betting.times, // 目前没有奖金优化金额为注数 * 2
    // 'orderAmount': betting.betNum * 2 * 1,
    maxBonus: `${betting.minBonus}-${betting.maxBonus}`,
    orderDetailList: children,
    tabType: mapPageValue(betting),
    token: session.get('token')
  };
}

export function generateOptimizedOrderData(
  combinations,
  times,
  betting,
  isSinglewin = false
) {
  const sysCodes = uniq(
    combinations.reduce((acc, c) => {
      const codes = c.combinations.map(i => i.match.systemCode);
      return acc.concat(codes);
    }, [])
  );
  const lotteryCode = getLotteryCode(betting);
  const children = generateOrderChildData(
    combinations,
    betting.courage,
    lotteryCode
  );
  const selected = betting.selected;
  const matchs = selected
    .map(s => s.match)
    .sort((a, b) => a.issueCode - b.issueCode);
  // const buyScreen = matchs.reduce((acc, i) => {
  //   if (acc.indexOf(i.systemCode) > -1) {
  //     return acc;
  //   }
  //   return acc.concat([i.systemCode]);
  // }, []).join(',');
  return {
    buyScreen: sysCodes.join(','),
    categoryId: isSinglewin ? 2 : 3,
    buyType: 1,
    isDltAdd: 0,
    lotteryCode: lotteryCode,
    lotteryIssue: matchs[0].issueCode,
    multipleNum: times,
    orderAmount: children.reduce((acc, c) => acc + c.amount, 0) * times, // 目前没有奖金优化金额为注数 * 2
    orderDetailList: children,
    tabType: mapPageValue(betting),
    token: session.get('token')
  };
}

function generateOrderChildData(combinations, courage, lotteryCode) {
  return combinations.map(c => {
    const betting = {
      courage,
      selected: c.combinations,
      ggType: [`${c.combinations.length}*1`]
    };
    return {
      lotteryChildCode: lotteryCode,
      buyNumber: 1,
      multiple: c.times,
      amount: c.times * 2,
      codeWay: 1,
      contentType: getContentType(betting),
      planContent: generateOrderPlanContent(betting, c.times, lotteryCode)
    };
  });
}

function mapPageValue(betting) {
  const isInMixPage =
    ['mix', 'wdf', 'lef_wdf', 'score', 'goal', 'hf'].indexOf(betting.name) > -1;
  if (isInMixPage) {
    return getMixTabType(betting);
  }
  switch (betting.name) {
    case 'single':
      return 2;
    case 'alternative':
      return 3;
    case 'singlewin':
      return 4;
    default:
      return 1;
  }
}

// todo 单场致胜
function getMixTabType(betting) {
  if (betting.ggType.length === 1 && betting.ggType[0] === '1*1') return 2;
  return 1;
}

// 计算单关的最大金额
export function getMatchBettingTypes(bettings) {
  return bettings.reduce((acc, b) => {
    if (acc.indexOf(b.type) < 0) {
      return acc.concat([b.type]);
    }
    return acc.concat();
  }, []);
}

export function getProfit(betting, reverse) {
  const selected = betting.selected;
  const matchs = getSelectedMatchs(selected);
  const maxSP = matchs.reduce((acc, m) => {
    const matchBettingList = selected.filter(s => s.id === m);
    const bettingTypes = getMatchBettingTypes(matchBettingList);
    let maxBettingSPList = bettingTypes.map(type => {
      const bettingList = matchBettingList.filter(m => m.type === type);
      if (reverse) return bettingList.sort((a, b) => a.sp - b.sp)[0];
      return bettingList.sort((a, b) => b.sp - a.sp)[0];
    });
    const matchMaxSPValue = maxBettingSPList.reduce((acc, betting) => {
      return acc + Math.round(betting.sp * 100);
    }, 0);
    return acc + matchMaxSPValue;
  }, 0);
  return maxSP * 2 / 100 * betting.times;
}

// 计算过关方式
export function calculateGGType(betting) {
  const { selected, ggType, autoGGType } = betting;
  const allowSingle = betting.name !== 'alternative'; // 二选一是不允许单关
  let gTypes = ggType.concat();
  const matchs = getSelectedMatchs(selected);
  let label = '至少2场赛事';
  let max = matchs.length;
  let name = 'combination'; // 组合过关
  if (betting.name === 'single') {
    max = 1;
    label = '单关';
    name = 'single';
    gTypes = ['1*1'];
  } else {
    if (matchs.length === 1) {
      if (isSingleMatch(selected) && allowSingle) {
        label = '单关';
        gTypes = ['1*1'];
        name = 'single';
      } else {
        label = '至少2场赛事';
        gTypes = [];
        let isAllWDF = true;
        selected.map(s => {
          if (s.type !== 'wdf') isAllWDF = false;
          return undefined;
        });
        if (isAllWDF) {
          label = '单场制胜';
          name = 'singlewin';
        }
      }
    } else {
      if (matchs.length === 2 && gTypes.length === 1 && gTypes[0] === '1*1') {
        gTypes = ['2*1'];
        name = 'combination';
      }
      const maxLimitPackageCount = getMaxLimitPackageCount(selected);
      max = max > maxLimitPackageCount ? maxLimitPackageCount : max;
      label = `${max}串1`;
      if (autoGGType === true) {
        const autoMax = max < 4 ? max : 4;
        gTypes = [autoMax + '*1'];
        label = `${autoMax}串1`;
        name = 'combination';
      }
    }
    gTypes = gTypes.length
      ? gTypes.filter(g => parseInt(g.split('*')[0]) <= max)
      : [];
    // if(!gTypes.length && max > 1) {
    //   gTypes = ['2*1'];
    // }
    if (gTypes.length) {
      if (gTypes.length === 1 && gTypes[0] === '1*1') {
        label = '单关';
        name = 'single';
      } else {
        label = gTypes.slice(-1)[0].replace('*', '串');
        name = 'combination';
      }
    }
  }
  return {
    label,
    name,
    gTypes,
    maxGtype: max
  };
}

// 根据投注内容获取最大过关方式
// 胜平负和让球是 8
// 总进球是 6
// 比分和办全场为 4
export function getMaxLimitPackageCount(selected) {
  let max = 8;
  if (
    contains(selected, 'type', 'wdf') ||
    contains(selected, 'type', 'let_wdf')
  ) {
    max = 8;
  }
  if (contains(selected, 'type', 'goal')) {
    max = 6;
  }
  if (contains(selected, 'type', 'score') || contains(selected, 'type', 'hf')) {
    max = 4;
  }
  return max;
}

export function generateOrderPlanContent(betting, times = 1, lotteryCode) {
  const courage = betting.courage;
  const multiple =
    groupArrayByKey(betting.selected, 'type').length > 1 ||
    lotteryCode === 30001; // 选择的下注类别大于一则为混投
  if (!courage.length) {
    return generateOrderContent(
      betting.selected,
      betting,
      multiple,
      true,
      times
    );
  }
  const selected = {
    withCourage: [],
    withoutCourage: []
  };
  betting.selected.forEach(function(i) {
    if (courage.indexOf(i.id) > -1) {
      selected.withCourage.push(i);
    } else {
      selected.withoutCourage.push(i);
    }
  });
  return (
    generateOrderContent(
      selected.withCourage,
      betting,
      multiple,
      false,
      times
    ) +
    '#' +
    generateOrderContent(
      selected.withoutCourage,
      betting,
      multiple,
      true,
      times
    )
  );
}

// 生成订单内容
export function generateOrderContent(
  selected,
  betting,
  multiple = false,
  withType = true,
  times = 1
) {
  const matchs = groupArrayByKey(selected, 'id'); // 将选择内容通过 id 分类
  let content = matchs
    .map(d => {
      const matchData = d.data[0].match;
      return `${matchData.systemCode}${generateOrderMatchData(d, multiple)}`;
    })
    .join('|');
  if (betting.ggType.length && withType) {
    content += `^${betting.ggType
      .map(t => t.replace('*', '_'))
      .join(',')}^${times}`; // 目前没有奖金优化 方案倍数为1
  }
  return content;
}

// 根据比赛 id 生成SP数据
export function generateOrderMatchData(match, multiple) {
  let spValueContent = '';
  // const matchData = match.data[0].match;
  const types = groupArrayByKey(match.data, 'type');
  if (multiple) {
    spValueContent = types
      .map(t => {
        return (
          '_' +
          mapPlayTypeValue(t.type).toUpperCase() +
          generateSPValueContent(t.data, t.type)
        );
      })
      .join('');
  } else {
    spValueContent = generateSPValueContent(types[0].data, types[0].type);
  }
  return spValueContent;
}

// 根据选项生成SP数据
export function generateSPValueContent(item, type) {
  const spContent = item
    .map(s => {
      return `${s.value}@${s.sp}`;
    })
    .join(',');
  if (type === 'let_wdf') {
    const letNum = item[0].match.wdf[3] / 1;
    return `[${letNum > 0 ? '+' : ''}${letNum}](${spContent})`;
  }
  return `(${spContent})`;
}

export function mapPlayTypeValue(type) {
  switch (type) {
    case 'wdf':
      return 's';
    case 'singlewin':
      return 's';
    case 'let_wdf':
      return 'r';
    case 'score':
      return 'q';
    case 'goal':
      return 'z';
    case 'hf':
      return 'b';
    default:
      return '';
  }
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
  if (rules.curLottery.saleStatus !== 1) return true;
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

export function getMaxBetNumberAndTimes(rules, leftTime) {
  const maxRules = rules.lotBetMulList
    .concat()
    .sort((a, b) => b.endTime - a.endTime);
  for (let i = 0; i < maxRules.length; i++) {
    if (
      i > 0 &&
      leftTime < maxRules[i - 1].endTime &&
      leftTime >= maxRules[i].endTime
    ) {
      return maxRules[i];
    }
  }
  return maxRules[0];
}

export function calculateCourage(betting) {
  const { selected, courage, maxGGTypes } = betting;
  const matchs = getSelectedMatchs(selected);
  if (matchs.length <= 1) return [];
  let newCourage = courage.filter(c => matchs.indexOf(c) > -1);
  if (newCourage.length >= matchs.length) {
    newCourage = newCourage.slice(newCourage.length - (matchs.length - 1));
  }
  if (newCourage.length >= maxGGTypes) {
    newCourage = newCourage.slice(newCourage.length - (maxGGTypes - 1));
  }
  return newCourage;
}

// 是否为单关
export function isSingleBetting(betting) {
  return betting.ggType.length === 1 && betting.ggType[0] === '1*1';
}

export function getPageData(data, name) {
  if (name === 'single') {
    return data.filter(m =>
      Boolean(m.status_letWdf === 1 || m.status_wdf === 1)
    );
  } else if (name === 'alternative') {
    return data.filter(m =>
      Boolean(Math.abs(m.wdf[3] / 1) === 1 && m.status_letWdf !== 4)
    );
  }
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
  let url = `${window.location.origin}${window.location.pathname}`;
  if (page !== 'mi') {
    url = `${url}?page=${page}`;
  }
  window.history.replaceState({}, null, url);
}

export function getMatchSaleEndTimestamp(match) {
  return new Date(
    match.saleEndDate.replace(/-/g, '/') + ' ' + match.saleEndTime
  ).getTime();
}

export function getMatchStartTimestamp(match) {
  return new Date(match.date.replace(/-/g, '/') + ' ' + match.time).getTime();
}

export function getSaleEndLeftTime(
  latestEndSaleDateTime,
  serverTime,
  requestSuccessTime
) {
  const now = new Date();
  const gap = now.getTime() - requestSuccessTime; // 请求成功后到现在的间隔时间
  const nowServerTime = serverTime + gap;
  return latestEndSaleDateTime - nowServerTime;
}

/**
 * 获取当前的玩法
 */
export function getCurrentMode(football, footballMix){
  if(football == null || footballMix == null){
      let state = store.getState();
      footballMix = state.footballMix;
      football = state.football;
  }

  const { page } = football;
  const { mode } = footballMix || {};

  return getMode(page, mode);
}

//获取玩法
export function getMode(page, subpage){
  let currentMode = "";

  if(page == 'mix'){
      currentMode = subpage == "mi" ? "mix": subpage;
  }else{
      currentMode = page;
  }

  return currentMode;
}

/**
* 获取当前库
*/
export function getCurrentStore(field){
  let result = store.getState();

  return field ? result[field]: result;
}

/**
 * 更新state
 */
export function updateField(state, field){
  if(!field){
      return Object.assign({}, state);
  }

  let obj = {};
  obj[field] = deepClone(state[field]);

  return Object.assign({}, state, obj);
}

/**
 * 深拷贝
 * @return {[type]} [description]
 */
export function deepClone(data){
  return JSON.parse(JSON.stringify(data));
}

export const filterFuncs = {
  //全部赛事、五大赛事、反选、热门赛事, 日期、让球、赔率
  "mix": {
    sp: "wdf",
    spIndex: 3,
    getMinSP(item){
      let wdf = item["wdf"].concat();
      wdf.splice(3, 1);
      let minWdf = Math.min.apply({}, wdf);
      let minGoal = Math.min.apply({}, item["goal"]);
      let minHf = Math.min.apply({}, item["hf"]);
      let minScoreW = Math.min.apply({}, item["score"]["w"]);
      let minScoreD = Math.min.apply({}, item["score"]["d"]);
      let minScoreF = Math.min.apply({}, item["score"]["f"]);

      return Math.min(minWdf, minGoal, minHf, minScoreD, minScoreF, minScoreW);
    },
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.LB, MODULE_FUC.ODDS , MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "single": {
    filter(m){return Boolean(m.status_wdf === 1 || m.status_letWdf === 1)},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.ODDS, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "alternative": {
    sp: "wdf",
    spIndex: 3,
    getMinSP(item){
      let sps = item["wdf"];
      return sps[3] == '-1' ? Math.min(sps[0], sps[6]): Math.min(sps[4], sps[2]);
    },
    filter(m){return Boolean(Math.abs(m.wdf[3] / 1) === 1 && m.status_letWdf !== 4)},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.ODDS, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "singlewin":{
    sp: "wdf",
    spIndex: 3,
    getMinSP(item){
      let sps = item["wdf"];
      return Math.min(sps[0], sps[1], sps[2]);
    },
    filter(item){return item.status_wdf !== 4},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.ODDS, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "wdf":{
    sp: "wdf",
    spIndex: 3,
    getMinSP(item){
      let sps = item["wdf"];
      return Math.min(sps[0], sps[1], sps[2]);
    },
    filter(item){return item.status_wdf !== 4},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.ODDS, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "let_wdf":{
    sp: "wdf",
    spIndex: 3,
    getMinSP(item){
      let sps = item["wdf"];
      return Math.min(sps[4], sps[5], sps[6]);
    },
    filter(item){return item.status_letWdf !== 4},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.LB, MODULE_FUC.ODDS, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "goal":{
    filter(item){return item.status_goal !== 4},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.FIVE, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "score":{
    filter(item){return item.status_score !== 4},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.FIVE, MODULE_FUC.HOT, MODULE_FUC.OPP]
  },
  "hf":{
    filter(item){return item.status_hfWdf !== 4},
    funcs: [MODULE_FUC.ALL, MODULE_FUC.DATE, MODULE_FUC.FIVE, MODULE_FUC.HOT, MODULE_FUC.OPP]
  }
}
