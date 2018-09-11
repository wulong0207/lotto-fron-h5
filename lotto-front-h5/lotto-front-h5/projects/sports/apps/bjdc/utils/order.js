import {
  loopBets,
  checkHasSelect,
  getBetDetail,
  getDefaultGGType
} from './bet.js';
import {
  checkIsMixSingle,
  getCurrentMode,
  getCurrentStore,
  removeLast,
  getLotteryCode,
  getGame,
  getLotteryChildCode
} from './basketball.js';
import session from '@/services/session.js';
import { uniq } from 'lodash';

// 生成订单
export function addOrder() {
  let store = getCurrentStore();
  let mode = getCurrentMode();
  let bets = store.betSelected.bets;
  let betCalc = store.betSelected.betCalc;
  let gameSP = store.basketball.data;

  return generateOrderData(bets, betCalc, gameSP, mode);
}

// 生成奖金优化订单
export function addOptimizeOrder(betting, combinations, multiple) {
  let store = getCurrentStore();
  let mode = getCurrentMode();
  let betCalc = store.betSelected.betCalc;

  const sysCodes = uniq(
    combinations.reduce((acc, c) => {
      const codes = c.combinations.map(i => i.match.systemCode);
      return acc.concat(codes);
    }, [])
  );
  const lotteryCode = getLotteryCode(mode);
  const children = generateOrderChildData(combinations, lotteryCode);
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
  return {
    maxBonus: betCalc[mode].maxBonus,
    minBonus: betCalc[mode].minBonus,
    buyScreen: sysCodes.join(','),
    categoryId: 3,
    buyType: 1,
    isDltAdd: 0,
    lotteryCode: lotteryCode,
    lotteryIssue: matchs[0].issueCode,
    multipleNum: multiple,
    orderAmount: children.reduce((acc, c) => acc + c.amount, 0) * multiple, // 目前没有奖金优化金额为注数 * 2
    orderDetailList: children,
    // 1、过关投注；2、单关；3、2选1；4、单场致胜
    tabType: betCalc[mode].isSingle ? 2 : 1,
    token: session.get('token')
  };
}

// 生成订单
export function generateOrderData(bets, betCalc, gameSP, mode) {
  // 在混合投注里的玩法, 选择投注的赛事编号, 彩期
  let mixMode = '',
    buyScreen = '',
    lotteryIssue = '';
  let content = ''; // 投注内容

  // 遍历投注内容
  loopBets(bets, (item, field) => {
    // 投注有选择项
    if (checkHasSelect(item, mode).hasSelect) {
      lotteryIssue = item.lotteryIssue;
      buyScreen += item.systemCode + ',';

      if (checkIsMixSingle(mode)) {
        mixMode = getPlanMode(mixMode, item[mode]);
      }

      // 添加子投注
      let subPlanContent = getSubContent(
        item,
        getGame(gameSP, field).game,
        mode
      );
      content = addSubContent(content, subPlanContent, item.bravery[mode]);
    }
  });
  // 胆
  // 1708207304_S(0@1.21)#1708207301_S(3@1.40,0@2.30)_C(11@5.25,12@5.95)_D[162.50](99@1.70)^2_1^1
  // 1708207301_S(3@1.40,0@2.30)_C(11@5.25,12@5.95)_D[162.50](99@1.70)#1708207304_S(0@1.21)^2_1^1

  // 1708207304_D[160.50](99@1.75)|1708207301_S(3@1.40,0@2.30)^2_1^1
  // 1708207304(0@1.21)|1708207301(3@1.40,0@2.30)^2_1^1
  // 1708207304_S(0@1.21)|1708207301_S(3@1.40,0@2.30)_C(11@5.25,12@5.95)_D[162.50](99@1.70)^2_1^1

  // 单关
  // 1708207301_S(0@2.30)_C(01@4.05)^1_1^1
  // 1708207301(3@1.40,0@2.30)^1_1^1
  // 1708207301[162.50](99@1.70,00@1.80)^1_1^1
  // 获取彩种子玩法ID
  let resultMode = mixMode || mode;
  const lotteryId = getLotteryChildCode(resultMode);
  content = removePlanType(
    resultMode,
    addGGAndMulInfo(content, bets, betCalc, mode)
  );
  const children = [
    {
      lotteryChildCode: lotteryId,
      buyNumber: betCalc[mode].betNum,
      multiple: 1, // 目前没有奖金优化 方案倍数为1
      amount: betCalc[mode].betNum * 2 * 1, // 目前没有奖金优化金额为注数 * 2
      codeWay: 1,
      // 根据文档定义有#时说明是胆拖投注
      contentType: getContentType(
        content.indexOf('#') >= 0,
        betCalc[mode].betNum
      ),
      planContent: content
    }
  ];

  let isSingle = 1;
  if (
    betCalc[mode].isSingle ||
    (betCalc[mode].ggType.length == 1 && betCalc[mode].ggType[0] == '1串1')
  ) {
    isSingle = 2;
  }

  return {
    maxBonus: betCalc[mode].minBonus + '-' + betCalc[mode].maxBonus,
    buyScreen: removeLast(buyScreen),
    buyType: 1,
    isDltAdd: 0,
    lotteryCode: getLotteryCode(resultMode),
    lotteryIssue: lotteryIssue,
    multipleNum: betCalc[mode].multiple,
    orderAmount: betCalc[mode].betNum * betCalc[mode].multiple * 2,
    orderDetailList: children,
    // 可选。竞技彩专用：1、过关投注；2、单关；3、2选1；4、单场致胜
    tabType: isSingle,
    token: session.get('token')
  };
}

// 获取投注的SP值
// TODO: SP值取值
export function mapBetSP(betArr, game, mode) {
  let betMap = getBetDetail();
  return betArr.map((item, i) => {
    let key = betMap[mode].sp;
    let val;
    if (key.getVal) {
      val = game[key.getVal(item)][key[item]];
    } else {
      val = game[key.val][key[item]];
    }

    val = parseFloat(val);
    if (isNaN(val) || val == 0) {
      val = 1;
    }

    return val.toFixed(2);
  });
}

// 获取投注内容
export function getPlanConentItem(arr, spArr, mode) {
  let result = '';

  for (let i = 0; i < arr.length; i++) {
    result += mapSelectToOrderValue(arr[i], mode) + '@' + spArr[i];
    result = i != arr.length - 1 ? result + ',' : result;
  }

  return result;
}

// 获取投注类型
export function getPlanMode(preMode, bet) {
  let mixMode = '';

  let check = (targetBet, targetMode) => {
    if (mixMode == 'mix') {
      return mixMode;
    }
    let betArr = targetBet[targetMode];
    if (betArr && betArr.length > 0) {
      // 判断是否为混合投注
      return mixMode && targetMode != mixMode ? 'mix' : targetMode;
    } else {
      return mixMode;
    }
  };

  mixMode = check(bet, 'spf');
  mixMode = check(bet, 'sfgg');
  mixMode = check(bet, 'sxds');
  mixMode = check(bet, 'zjqs');
  mixMode = check(bet, 'qcbf');
  mixMode = check(bet, 'bqc');
  mixMode = preMode && preMode != mixMode ? 'mix' : mixMode;

  return mixMode;
}

// 获取玩法
// 如竞彩，1：单式；2：复式；3：胆拖；6 : 和值
export function getContentType(hasDan, betNum) {
  if (hasDan) return 3;
  return betNum > 1 ? 2 : 1;
}

// 生成子投注内容
// 1708207304_D[160.50](99@1.75)//大小分
// 1708207304_S(0@1.21) //胜负
// 1708207301[162.50](99@1.70,00@1.80) //大小分
export function getSubContent(bet, gameSP, mode) {
  let content = [];

  // 生成D[160.50](99@1.75)或S(0@1.21)类型的字符串的数组
  let addContent = (subMode, handerStr) => {
    let betArr;
    if (checkIsMixSingle(mode)) {
      betArr = bet[mode][subMode];
    } else {
      betArr = bet[subMode];
    }
    // 获取sp值
    let spArr = mapBetSP(betArr, gameSP, subMode);
    // 组装获取投注子内容
    let contentItem = getPlanConentItem(betArr, spArr, subMode);
    content.push(handerStr(contentItem));
  };

  let check = (subMode, addLet) => {
    let boolResult;
    if (!checkIsMixSingle(mode)) {
      boolResult = subMode == mode;
    } else {
      boolResult = bet[mode][subMode].length > 0;
    }

    if (boolResult) {
      addContent(subMode, item => {
        if (addLet) {
          let letSroce = gameSP[getBetDetail()[subMode].sp.val][0];
          if (!letSroce || letSroce == '0') {
            letSroce = '+0';
          }

          return `${mapModePlanType(subMode)}[${letSroce}](${item})`;
        } else {
          return `${mapModePlanType(subMode)}(${item})`;
        }
      });
    }
  };

  // 胜平负
  check('spf', true);
  // 胜负过关
  check('sfgg', true);
  // 上下单双
  check('sxds');
  // 总进球数
  check('zjqs');
  // 全场比分
  check('qcbf');
  // 半全场
  check('bqc');

  let buyScreen = bet.systemCode;
  return `${buyScreen}_${content.join('_')}`;
}

// 将玩法转化为投注的玩法
/// /胜负：S ; 让分胜负：R ; 胜分差：C ; 大小分：D ;
export function mapModePlanType(mode) {
  switch (mode) {
    case 'spf':
      return 'R';
    case 'qcbf':
      return 'Q';
    case 'zjqs':
      return 'Z';
    case 'sxds':
      return 'S';
    case 'bqc':
      return 'B';
    case 'sfgg':
      return 'G';
  }
}

// 添加子投注内容
export function addSubContent(content, subContent, isDan) {
  if (isDan) {
    content =
      content.indexOf('#') >= 0
        ? subContent + '|' + content
        : subContent + '#' + content;
  } else if (content) {
    let lastChar = content[content.length - 1];
    if (lastChar == '#' || lastChar == '|') {
      content = content + subContent;
    } else {
      content = content + ('|' + subContent);
    }
  } else {
    return subContent;
  }

  return content;
}

// 将选择的值转换为投注对应的值
export function mapSelectToOrderValue(val, mode) {
  const config = {
    spf: { 1: '3', 2: '1', 3: '0' },
    sfgg: { 1: '3', 2: '0' },
    bqc: {
      1: '33',
      2: '31',
      3: '30',
      4: '13',
      5: '11',
      6: '10',
      7: '03',
      8: '01',
      9: '00'
    }
  };

  config[mode] = config[mode] || {};

  return (config[mode][val] || val).toString();
}

// 添加过关信息和倍数信息
export function addGGAndMulInfo(content, bets, betCalc, mode) {
  let gg = betCalc[mode].ggType;
  if (gg.length == 0) {
    gg = getDefaultGGType(bets, mode).ggList;
  }
  let ggStr = gg.join(',').replace(/串/g, '_');
  // 判断是否是单关
  if (betCalc[mode].isSingle) {
    ggStr = '1_1';
  }

  return `${content}^${ggStr}^1`;
}

// 移除投注类型
export function removePlanType(mode, content) {
  if (mode == 'mix') {
    return content;
  }
  let reg = new RegExp(`_${mapModePlanType(mode)}`, 'g');
  return content.replace(reg, '');
}

// 生成奖金优化的子投注
function generateOrderChildData(combinations, lotteryCode) {
  return combinations.map(item => {
    return {
      lotteryChildCode: lotteryCode,
      buyNumber: 1,
      multiple: item.times,
      amount: item.times * 2,
      codeWay: 1,
      contentType: 1,
      // TODO: 未完成部分
      planContent: generateOpPlanContent(item.combinations, item.times)
    };
  });
}

// 生成投注内容
// 1708207304_S(0@1.21)#1708207301_S(3@1.40,0@2.30)_C(11@5.25,12@5.95)_D[162.50](99@1.70)^2_1^1
// 1708207301(3@1.40,0@2.30)^1_1^1
function generateOpPlanContent(combinations, multiple) {
  let arr = combinations.map((item, index) => {
    let val = mapSelectToOrderValue(item.value, item.type);
    let letVal = item.score ? `[${item.score}]` : '';
    let type = item.category == 'mix' ? '_' + mapModePlanType(item.type) : '';

    return `${item.match.systemCode}${type}${letVal}(${val}@${item.sp})`;
  });

  return `${arr.join('|')}^${combinations.length}_1^${multiple}`;
}
