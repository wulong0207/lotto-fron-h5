//import { PAGES, MODES } from './constants';

/*
格式化对阵数据，以 saleDate 为分组数据, 例如:
[{saleDate: 2017-06-09, ...}, {saleDate: 2017-06-09, ...}, {saleDate: 2017-06-10, ...}, {saleDate: 2017-06-10, ...}]
=>
[{date: 2017-06-09, matchs: [...]}, {date: 2017-06-10, matchs: [...]}]
*/
export function formatMatchData(data) {
  if (!data || !data.length) return [];
  return data.reduce((acc, d) => {
    let arr = acc.concat();
    const exsitIndex = getArrIndexByKey(arr, 'date', d.saleDate);
    if ( exsitIndex < 0) {
      arr.push({
        date: d.saleDate,
        matchs: [d]
      });
    } else {
      arr[exsitIndex].matchs.push(d);
    }
    return arr;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getArrIndexByKey(arr, key, value) {
  let index = -1;
  arr.forEach((a, idx) => {
    if (a[key] === value) index = idx;
  });
  return index;
}

export function getSingleMatchs(data) {
  return data.reduce((acc, d) => {
    let arr = acc.concat();
    const singleMatchs = d.matchs.filter(m => Boolean(m.status_letWdf === 1 || m.status_wdf === 1));
    if (singleMatchs.length) {
      arr.push({
        date: d.date,
        matchs: singleMatchs
      });
    }
    return arr;
  }, []);
}

export function getAlternativeMatchs(data) {
  return data.reduce((acc, d) => {
    let arr = acc.concat();
    const singleMatchs = d.matchs.filter(m => Boolean(Math.abs(m.wdf[3] / 1) === 1 && m.status_letWdf !== 4));
    if (singleMatchs.length) {
      arr.push({
        date: d.date,
        matchs: singleMatchs
      });
    }
    return arr;
  }, []);
}

export const getSinglewinMatchs = getAlternativeMatchs;

export function generateScoreSize(reverse, size=5) {
  let scoreRange = [];
  for(let i=1; i<=size; i++) {
    scoreRange.push(i);
  }
  const data = scoreRange.reduce((acc, s) => {
    const scoreArr = [];
    for (let i=0, max= s<3 ? s : 3; i<max; i++) {
      if(!reverse) {
        scoreArr.push(`${s}:${i}`);
      } else {
        scoreArr.push(`${i}:${s}`);
      }
    }
    return acc.concat(scoreArr);
  }, []);
  return data;
}

export function generateAllScoreData(match) {
  const wScorespArr = match.score.w;
  const wScoreArr = generateScoreSize().concat().map((score, i) => {
    let data = {
      score: score
    };
    if( i < wScorespArr.length) {
      data.sp = wScorespArr[i];
    } else {
      data.sp = wScorespArr[wScorespArr.length - 1];
    }
    return data;
  });
  const fScorespArr = match.score.f;
  const fScoreArr = generateScoreSize(true).map((score, i) => {
    let data = {
      score: score
    };
    if( i < wScorespArr.length) {
      data.sp = wScorespArr[i];
    } else {
      data.sp = wScorespArr[wScorespArr.length - 1];
    }
    return data;
  });
  const dScorespArr = match.score.d;
  const drawScoreData = [0, 1, 2, 3].map((num, i) => {
    let data = {
      score: `${num}:${num}`
    };
    if (i < dScorespArr.length) {
      data.sp = dScorespArr[i];
    } else {
      data.sp = dScorespArr[dScorespArr.length - 1];
    }
    return data;
  })
  return wScoreArr.concat(fScoreArr).concat(drawScoreData);
}

export function getSpValueByScore(score, match) {
  const wScorespArr = match.score.w;
  const fScorespArr = match.score.f;
  const dScorespArr = match.score.d;
  const [h_score, g_score] = score.split(':').map(i => parseInt(i));
  if (h_score === g_score && h_score > 3) {
    return dScorespArr[dScorespArr.length - 1];
  } else if (h_score > 5) {
    return wScorespArr[wScorespArr.length - 1];
  } else if (g_score > 5) {
    return dScorespArr[dScorespArr - 1];
  } else if (h_score > g_score && g_score > 2) {
    return wScorespArr[wScorespArr.length - 1];
  } else if( g_score > h_score && h_score > 2) {
    return dScorespArr[dScorespArr.length - 1];
  }
  const allScoreData = generateAllScoreData(match);
  const scoreItem = allScoreData.filter(s => s.score === score);
  if (scoreItem.length) return scoreItem[0].sp;
  return null;
}

export function formatShortDateStr(dateStr) {
  const date = getDateFromDateValue(dateStr);
  const month = formatDateUnitValue(date.getMonth() + 1);
  const dateDay = formatDateUnitValue(date.getDate());
  const weekDay = getChineseWeekName(date);
  return `${month}-${dateDay} ${weekDay}${isToday(date) ? '' : ''}`
}

export function getChineseWeekName(date) {
  const chineseWeekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return chineseWeekDays[date.getDay()];
}

export function fixDate(date){
    let reDate = new Date(date);

    if(isNaN(reDate.getTime())){
        if(date){
            reDate = new Date(date.replace(/-/g,"\/"));
            if(isNaN(reDate.getTime())){
                return reDate;
            }
        }
    }

    return reDate
}

export function getGameAreaTitle(date, count){
    let title = getChineseWeekName(fixDate(date));

    return `${title} ${date} ${count}场可投注`;
}

export function isToday(date) {
  const now = new Date();
  if(now.getFullYear() !== date.getFullYear()) return false;
  if(now.getMonth() !== date.getMonth()) return false;
  if(now.getDate() !== date.getDate()) return false;
  return true;
}

export function getDateFromDateValue(value) {
  let dateObj;
  if(Object.prototype.toString.call(value) === '[object Date]') {
    dateObj = value;
  } else {
    dateObj = new Date(value);
    if (isNaN(dateObj.getTime())) throw new Error('invalid Date value');
  }
  return dateObj;
}

export function formatDateUnitValue(value) {
  return `0${value}`.slice(-2);
}

export function getAllMatchs(data) {
  return data.reduce((acc, d) => {
    const matchs = acc.concat();
    const matchedIndex = getArrIndexByKey(matchs, 'm_id', d.m_id);
    if(matchedIndex < 0) {
      matchs.push({
        name: d.m_s_name ? d.m_s_name : d.m_f_name,
        num: 1,
        m_id: d.m_id,
        fiveLeague: d.fiveLeague,
        is_hot: d.is_hot
      })
    } else {
      matchs[matchedIndex].num += 1;
    }
    return matchs;
  }, []);
}

export function groupArrayByKey(arrData, key) {
  return arrData.reduce((acc, d) => {
    let arr = acc.concat();
    const exsitIndex = getArrIndexByKey(arr, key, d[key]);
    if ( exsitIndex < 0) {
      const data = {};
      data[key] = d[key];
      data.data = [d];
      arr.push(data);
    } else {
      arr[exsitIndex].data.push(d);
    }
    return arr;
  }, []);
}

export function isSelected(selected, id, index) {
  const _id = `${id}:${index}`;
  return selected.indexOf(_id) > -1;
}

export function getSelectedMatchs(selected) {
  return selected.reduce((acc, s) => {
    if (acc.indexOf(s.id) < 0) {
      return acc.concat([s.id]);
    }
    return acc.concat();
  }, []);
}

export function getMatchBettingTypes(bettings) {
  return bettings.reduce((acc, b) => {
    if (acc.indexOf(b.type) < 0) {
      return acc.concat([b.type]);
    }
    return acc.concat();
  }, []);
}

export function getMaxProfit(betting) {
  const selected = betting.selected;
  const matchs = getSelectedMatchs(selected);
  const maxSP = matchs.reduce((acc, m) => {
    const matchBettingList = selected.filter(s => s.id === m);
    const bettingTypes = getMatchBettingTypes(matchBettingList);
    const maxBettingSPList = bettingTypes.map(type => {
      const bettingList = matchBettingList.filter(m => m.type === type);
      return bettingList.sort((a, b) => b.sp - a.sp)[0];
    })
    const matchMaxSPValue = maxBettingSPList.reduce((acc, betting) => {
      return acc + Math.round(betting.sp * 100 * betting.times);
    }, 0)
    return acc + matchMaxSPValue;
  }, 0);
  return ((maxSP * 2) / 100) * betting.times;
}

export function isSingleMatch(selected) {
  for (let i=0,l=selected.length; i<l; i++) {
    if(!isSingle(selected[i].match, selected[i].type)) return false;
  }
  return true;
}

export function isSingle(match, type) {
  switch (type) {
    case 'wdf':
      return match.status_wdf === 1;
    case 'let_wdf':
      return match.status_letWdf === 1;
    case 'hf':
      return match.status_hfWdf === 1;
    case 'goal':
      return match.status_goal === 1;
    case 'score':
      return match.status_score === 1;
    default:
      return false
  }
}

export function contains(list, key, value) {
  for (let i=0, l=list.length; i<l; i++) {
    if (list[i][key] === value) return true;
  }
  return false;
}


export function toggle(list, value, key) {
  let dataList = list.concat();
  if(isPlainArray(list) && typeof value !== 'object') {
    if(dataList.indexOf(value) < 0) {
      dataList.push(value);
    } else {
      dataList = dataList.filter(d => d !== value);
    }
  } else {
    const idx = getArrIndexByKey(dataList, key, value[key]);
    if(idx < 0) {
      dataList.push(value);
    } else {
      dataList = dataList.filter(d => d[key] !== value[key]);
    }
  }
  return dataList;
}

export function isPlainArray(arr) {
  for (let i=0, l=arr.length; i<l; i++) {
    if(typeof arr[i] === 'object') return false;
  }
  return true;
}

export function isValidPage(name) {
  const pages = PAGES.concat(MODES);
  return pages.indexOf(name) >= 0;
}

export function isInMixPage(name) {
  return MODES.indexOf(name) >= 0;
}
