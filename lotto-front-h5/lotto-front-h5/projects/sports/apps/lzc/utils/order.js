import { getToken } from '@/services/auth';

export function generateOrderData(
  bettings,
  courage,
  times,
  betNum,
  lotteryCode,
  lotteryIssue,
  matchIds,
  combinations
) {
  return {
    buyType: 1,
    isDltAdd: 0,
    lotteryCode: lotteryCode,
    lotteryIssue: lotteryIssue,
    multipleNum: times,
    orderAmount: betNum * times * 2, // 目前没有奖金优化金额为注数 * 2
    orderDetailList: [
      orderDetail(bettings, courage, betNum, matchIds, lotteryCode)
    ],
    token: getToken()
  };
}

// function generateOrderDetail(bettings, courage, betNum, matchIds, lotteryCode, combinations) {
//   if (!combinations) {
//     return [orderDetail(bettings, courage, betNum, matchIds, lotteryCode)]
//   }
//   let n;
//   let children = [];
//   while(n=combinations.next()) {
//     const comb = flatten(n);
//     const bets = comb.reduce((acc, c) => {
//       return {
//         ...acc,
//         [c.id]: c.value
//       }
//     }, {});
//     children.push(orderDetail(bets, courage, getChildBetNum(bets), matchIds, lotteryCode));
//   }
//   return children;
// }

// function getChildBetNum(bets) {
//   let combs = [];
//   for (let b in bets) {
//     combs.push(bets[b]);
//   }
//   return Combinatorics.cartesianProduct(...combs).length;
// }

function orderDetail(bettings, courage, betNum, matchIds, lotteryCode) {
  return {
    lotteryChildCode: getLotteryChildCode(lotteryCode, courage),
    buyNumber: betNum,
    multiple: 1,
    amount: betNum * 2,
    codeWay: 1,
    contentType: getContentType(bettings, courage, lotteryCode),
    planContent: generateOrderPlanContent(bettings, matchIds, courage)
  };
}

export function generateOrderPlanContent(bettings, matchIds, courage) {
  let contents = matchIds.map(m =>
    generateMatchContent(bettings[m], courage.indexOf(m) > -1)
  );
  contents = contents.join('');
  const last = contents.slice(-1);
  return last === '#' ? contents : contents.slice(0, -1);
}

function generateMatchContent(bet, courage) {
  if (!bet || !bet.length) return '_|';
  return `${bet.join(',')}${courage ? '#' : '|'}`;
}

function getContentType(bettings, courage, lotteryCode) {
  if (courage && courage.length) return 3;
  for (let b in bettings) {
    if (bettings[b].length > 1) return 2;
  }
  if (lotteryCode === 305 && Object.keys(bettings).length > 9) return 2;
  return 1;
}

function getLotteryChildCode(lotteryCode, courage) {
  if (lotteryCode === 304) return 30401;
  if (courage && courage.length) return 30502;
  return 30501;
}
