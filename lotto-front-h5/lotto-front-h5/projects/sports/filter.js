/**
 * Created by YLD on 2017/12/07.
 */

import { MODULE_FUC } from './constants';

export const checkKey = (obj, key) => {
  if (obj[key]) {
    obj[key]++;
  } else {
    obj[key] = 1;
  }
};

// 过滤赛事得到对应的键值
export const filterMatch = (data, config) => {
  let field = config.sp;
  let result = [],
    rqIndex = config.spIndex || 0,
    minSp = 1.5,
    maxSp = 2.0,
    // 让球 sp 球类 联赛 日期
    rqMark = {},
    spMark = { 0: 0, 1: 0, 2: 0 },
    ballMark = {},
    matchMark = {},
    dateMark = {},
    lcMark = { 0: 0, 1: 0 },
    state = {
      date: [], // 日期
      matchs: [], // 联赛
      lb: [], // 让球
      sp: ['0', '1', '2'], // sp值 赔率范围
      at: [], // 全部类型
      lc: ['0', '1'] // 让分
    },
    count = 0,
    matchs = [];
  let add = (arr, value) => {
    value = value.toString();
    if (arr.indexOf(value) < 0) arr.push(value);
  };
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (config.filter && !config.filter(item)) continue;
    if (field && item[field]) {
      if (item[field] instanceof Array) {
        let key = item[field][rqIndex];
        // 让球场
        checkKey(rqMark, key);
        add(state.lb, key);
        // sp
        let arr = item[field].concat();
        arr.splice(rqIndex, 1);
        let min = config.getMinSP
          ? config.getMinSP(item)
          : Math.min.apply({}, arr);
        if (min < minSp) spMark['0']++;
        if (min >= minSp && min < maxSp) spMark['1']++;
        if (min >= maxSp) spMark['2']++;
      } else {
        if (item[field] < 0) {
          lcMark['0']++;
        } else {
          lcMark['1']++;
        }
      }
    }

    // 赛事类别
    if (item.m_t) {
      // 赛事类别
      if (ballMark[item.m_t]) {
        ballMark[item.m_t].count++;
      } else {
        ballMark[item.m_t] = { count: 1, matchs: {} };
      }

      // 各种球类的赛事数量
      if (ballMark[item.m_t].matchs[item.m_id]) {
        ballMark[item.m_t].matchs[item.m_id].count++;
      } else {
        ballMark[item.m_t].matchs[item.m_id] = {
          count: 1,
          name: item.m_s_name
        };
      }

      add(state.at, item.m_t);
    }

    // 联赛
    if (item.m_id) {
      if (matchMark[item.m_id]) {
        matchMark[item.m_id].count++;
      } else {
        matchMark[item.m_id] = {
          count: 1,
          name: item.m_s_name
        };
      }
    }

    add(state.matchs, item.m_id);

    // 日期
    checkKey(dateMark, item.saleDate);
    add(state.date, item.saleDate);

    count++;
    matchs.push(item);
  }

  return {
    rqMark,
    spMark,
    ballMark,
    matchMark,
    dateMark,
    state,
    lcMark,
    count,
    matchs
  };
};

// 过滤赛事
export function filterFinal(data, filter, config) {
  if (!filter) {
    return data;
  }

  let { funcs, spIndex } = config;
  spIndex = spIndex || 0;
  let { date, matchs, lb, sp, at, five, hot, lc } = filter;
  let minSp = 1.5,
    maxSp = 2.0;
  let result = [];
  let check = m => funcs.indexOf(m) >= 0;

  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (config.filter && !config.filter(item)) continue;
    // 过滤时间选择
    if (
      date &&
      date.length > 0 &&
      check(MODULE_FUC.DATE) &&
      date.indexOf(item.saleDate) >= 0
    ) { continue; }
    // 过滤联赛选择
    if (
      matchs &&
      matchs.length > 0 &&
      matchs.indexOf(item.m_id.toString()) >= 0
    ) { continue; }
    // 过滤让球选择
    if (
      lb &&
      lb.length > 0 &&
      config.sp &&
      check(MODULE_FUC.LB) &&
      item[config.sp] &&
      lb.indexOf(item[config.sp][config.spIndex || 0].toString()) >= 0
    ) { continue; }
    // 过滤赔率范围
    if (
      sp &&
      sp.length > 0 &&
      config.sp &&
      item[config.sp] &&
      check(MODULE_FUC.ODDS)
    ) {
      let arr = item[config.sp].concat(),
        spMark;
      arr.splice(spIndex, 1);
      let min = config.getMinSP
        ? config.getMinSP(item)
        : Math.min.apply({}, arr);
      if (min < minSp) spMark = '0';
      if (min >= minSp && min < maxSp) spMark = '1';
      if (min >= maxSp) spMark = '2';
      if (sp.indexOf(spMark) >= 0) continue;
    }
    // 过滤全部类型
    if (
      at &&
      at.length > 0 &&
      check(MODULE_FUC.AT) &&
      at.indexOf(item.m_t.toString()) >= 0
    ) { continue; }
    // 过滤属于五大联赛的
    if (five && (!item.f_l && !item.fiveLeague) && check(MODULE_FUC.FIVE)) { continue; }
    // 过滤属于热门赛事
    if (hot && !item.is_hot && check(MODULE_FUC.HOT)) continue;
    // 过滤属于让分赛事
    if (
      lc &&
      lc.length > 0 &&
      config.sp &&
      item[config.sp] &&
      check(MODULE_FUC.LC)
    ) {
      let spMark = item[config.sp] <= 0 ? '0' : '1';
      if (lc.indexOf(spMark) >= 0) continue;
    }

    result.push(item);
  }

  return result;
}
