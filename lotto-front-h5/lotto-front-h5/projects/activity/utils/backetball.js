import Combinatorics from 'js-combinatorics';
import session from '@/services/session';
import Decimal from 'decimal.js';
import Message from '@/services/message'; // 弹窗

// 获取默认显示的赛事
export function getDefaultDisplayMatch(allMatch) {
  // 获取五大联赛的赛事
  const fiveMatchs = allMatch.filter(m => m.five);
  let matchs = [];
  if (fiveMatchs.length >= 2) {
    matchs = fiveMatchs.slice(0, 2);
  } else if (fiveMatchs.length === 1) {
    matchs = fiveMatchs.concat([allMatch.filter(m => !m.five)[0]]);
  } else {
    matchs = allMatch.slice(0, 2);
  }
  return matchs.map(m => m.id);
}

// 获取赛事 胜平负中 sp 最小的彩果
export function getSmallestSpBetting(match) {
  const values = [
    {
      type: 3,
      value: match.newestSpWin
    },
    // {
    //   type: 1,
    //   value: match.newestSpDraw
    // },
    {
      type: 0,
      value: match.newestSpFail
    }
  ];
  const smallestValue = values.reduce((acc, v) => {
    if (acc.value > v.value) {
      return v;
    }
    return acc;
  }, values[0]);
  console.log(smallestValue, 'smallestValue');
  return smallestValue.type;
}

export function calculateBetNumAndMaxProfit(bettings, times) {
  // const values = bettings.map(b => b.value);
  let betNum;
  let values = bettings.map(function(item) {
    if (item.value.length > 0) {
      return item.value;
    } else {
      betNum = 0;
      return betNum;
    }
  });

  if (betNum != 0) {
    betNum = Combinatorics.cartesianProduct(...values).length;
    const maxValues = values.map(v => {
      // console.log(v);
      return Math.max(...v.map(i => parseFloat(i.split('@')[1])));
    });
    return {
      betNum,
      max: maxValues
        .reduce((acc, m) => acc.times(m), new Decimal(1))
        .times(times)
        .times(2)
        .toFixed(2)
    };
  } else {
    Message.toast('2串1 最少要选两场比赛');
    return {
      betNum: 0,
      max: 0
    };
  }
}

export function generateOrderData(bettings, matchs, times, betNum) {
  return {
    activityCode: 'JLHD20171015001',
    buyScreen: matchs.map(m => m.systemCode).join(','),
    buyType: 1,
    channelId: 6,
    isDltAdd: 0,
    lotteryCode: 30101,
    lotteryIssue: matchs[0].issueCode,
    multipleNum: times,
    orderAmount: betNum * 2 * times,
    orderDetailList: [
      {
        amount: betNum * 2,
        buyNumber: betNum,
        codeWay: 1,
        contentType: getContentType(bettings),
        lotteryChildCode: 30101,
        multiple: 1,
        planContent: generatePlanContent(bettings)
      }
    ],
    platform: 2,
    tabType: 1,
    token: session.get('token')
  };
}

export function getCurrentBettings(bettings, matchs, allMatchs) {
  return matchs.map(m => {
    const match = allMatchs.filter(i => i.id === m)[0];
    const value = bettings[m]
      ? bettings[m].map(i => `${i}@${getSpValue(match, i)}`)
      : [];
    return {
      value,
      id: m,
      systemCode: match.systemCode
    };
  });
}

function getSpValue(match, type) {
  switch (type) {
    case 3:
      return match.newestSpWin;
    // case 1:
    //   return match.newestSpDraw;
    case 0:
      return match.newestSpFail;
    default:
      return 1;
  }
}

// bettings => [{id: number, value: [string(type@sp)]}]
// 1709133302(0@1.12)|1710135301(3@1.48)|1710135302(0@3.00)^2_1^1
function generatePlanContent(bettings) {
  const content = bettings
    .map(m => {
      return `${m.systemCode}(${m.value.join(',')})`;
    })
    .join('|');
  return `${content}^2_1^1`;
}

function getContentType(betting) {
  for (let i = 0; i < betting.length; i++) {
    if (betting[i].value.length > 1) {
      return 2;
    }
  }
  return 1;
}
