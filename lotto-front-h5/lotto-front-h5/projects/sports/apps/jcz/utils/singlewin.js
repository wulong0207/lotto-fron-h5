import { generateCombinations, average } from '../services/optimization';
import { groupArrayByKey } from '../utils';
import { getMatchStartTimestamp } from './football';
import Decimal from 'decimal.js';

export function getSinglewinMatchs(selectedMatch, allMatchs) {
  // 首先获取开赛时间早于或等于选中的赛事，并获取 sp 值最大的
  const earlyMatch = getearlyMatch(selectedMatch, allMatchs);
  if (earlyMatch) return earlyMatch;
  // 如果没有开赛时间早于选中的赛事，获取开赛时间最近的赛事，如果有多场则选取 sp 值最大的
  const matchs = getMachtedMatch(selectedMatch, allMatchs);
  if (matchs.length === 1) return matchs[0];
  return getMaxSPMatch(matchs);
}

// 获取比选中比赛开赛时间早的比赛，取 sp 值最大的比赛
function getearlyMatch(selectedMatch, allMatchs) {
  const matchs = allMatchs.filter(
    m =>
      m.id !== selectedMatch.id &&
      Math.abs(m.wdf[3]) === 1 &&
      m.status_letWdf !== 4 &&
      m.status_wdf !== 4
  );
  const earlyMatch = matchs.filter(
    m => getMatchStartTimestamp(m) <= getMatchStartTimestamp(selectedMatch)
  );
  if (!earlyMatch.length) return null;
  if (earlyMatch.length === 1) return earlyMatch[0];
  return getMaxSPMatch(earlyMatch);
}

// 获取最近开赛的赛事
function getMachtedMatch(selectedMatch, allMatchs) {
  const matchs = allMatchs.filter(
    m =>
      m.id !== selectedMatch.id &&
      Math.abs(m.wdf[3]) === 1 &&
      m.status_letWdf !== 4 &&
      m.status_wdf !== 4
  );
  // 获取各种比赛和选中比赛的开赛时间的差值(取正值)，并从小到大排序
  const diffDates = matchs
    .filter(
      m => getMatchStartTimestamp(m) > getMatchStartTimestamp(selectedMatch)
    )
    .map(m => {
      const value =
        getMatchStartTimestamp(m) - getMatchStartTimestamp(selectedMatch);
      return {
        ...m,
        value: value
      };
    })
    .sort((a, b) => a.value - b.value);
  const closestMatch = diffDates[0];
  const sameClosestMatchs = diffDates.filter(
    d => d.value === closestMatch.value
  );
  if (!sameClosestMatchs.length) {
    return matchs.filter(a => a.id === closestMatch.id);
  }
  return sameClosestMatchs;
}

// 获取 sp 值最大的赛事
function getMaxSPMatch(matchs) {
  const matchSortedBySP = matchs
    .concat()
    .sort((a, b) => getTotalSP(b) - getTotalSP(a));
  return matchSortedBySP[0];
}

function getTotalSP(match) {
  const sp = match.wdf;
  if (sp[3] < 0) return parseFloat(sp[0]) + parseFloat(sp[6]);
  return parseFloat(sp[2]) + parseFloat(sp[4]);
}

export function generateSinglewinCombinations(betting, matchs) {
  const { selected, times } = betting;
  const bettingMatchs = groupArrayByKey(selected, 'id');
  // 根据投注数据生成 投注数据
  const bettings = bettingMatchs.map(m => {
    const match = m.data[0].match;
    const matchedMatch = getSinglewinMatchs(match, matchs);
    let matchedBettingData = [];
    if (matchedMatch.wdf[3] < 0) {
      matchedBettingData = generateBettingData([0, 6], matchedMatch);
    } else {
      matchedBettingData = generateBettingData([2, 4], matchedMatch);
    }
    return {
      id: m.id,
      bettings: m.data.map(i => {
        return {
          ggType: ['2*1'],
          courage: [],
          name: 'singlewin',
          selected: [i].concat(matchedBettingData)
        };
      })
    };
  });
  // 根据投注数据平均优化
  return bettings.map(b => {
    return {
      id: b.id,
      combinations: b.bettings.map(i =>
        average(generateCombinations(i), times * 2)
      )
    };
  });
}

// 获取组合的最大奖金
export function getSinglewinMaxProfit(combinations) {
  return getCombinationMoney(combinations)
    .map(c => Math.max(...c))
    .reduce((acc, c) => acc.plus(c), new Decimal(0))
    .toFixed(2);
}

// 获取组合中的所有金额
export function getCombinationMoney(combinations) {
  return combinations.map(c => {
    return c.combinations.reduce((acc, i) => {
      return acc.concat(i.map(i => i.money));
    }, []);
  });
}

export function generateOrderData(combinations) {
  return combinations.reduce((acc, c) => {
    return acc.concat(
      c.combinations.reduce((ac, i) => {
        return ac.concat(i);
      }),
      []
    );
  }, []);
}

// 组合的奖金明细
export function generateSinglewinProfitDetail(combinations) {
  const moneyArr = getCombinationMoney(combinations);
  const minArr = moneyArr.map(c => Math.min(...c)).sort((a, b) => a - b);
  const MaxArr = moneyArr.map(c => Math.max(...c)).sort((a, b) => b - a);
  return combinations.map((c, idx) => {
    const min = minArr
      .slice(0, idx + 1)
      .reduce((acc, c) => acc.plus(c), new Decimal(0))
      .toFixed(2);
    const max = MaxArr.slice(0, idx + 1)
      .reduce((acc, c) => acc.plus(c), new Decimal(0))
      .toFixed(2);
    return {
      min,
      max
    };
  });
}

function generateBettingData(idx, match) {
  return idx.map(i => {
    return {
      match,
      sp: match.wdf[i],
      value: mapSPIndexToValue(i),
      id: match.id,
      index: i,
      _id: `${match.id}:singlewin:i`,
      type: i > 3 ? 'let_wdf' : 'wdf'
    };
  });
}

function mapSPIndexToValue(index) {
  switch (index) {
    case 0:
      return 3;
    case 1:
      return 1;
    case 2:
      return 0;
    case 4:
      return 3;
    case 5:
      return 1;
    case 6:
      return 0;
    default:
      return 1;
  }
}
