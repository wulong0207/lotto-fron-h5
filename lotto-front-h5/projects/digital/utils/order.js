import session from '@/services/session';

export function generateOrderData(
  bettings,
  lotteryCode,
  times,
  lotteryIssue,
  isDltAdd
) {
  return {
    buyType: 1,
    isDltAdd: isDltAdd ? 1 : 0,
    lotteryCode: lotteryCode,
    lotteryIssue: lotteryIssue,
    multipleNum: times,
    orderAmount:
      bettings.reduce(
        (acc, b) => acc + b.betNum * getBetPrice(b, isDltAdd),
        0
      ) * times,
    orderDetailList: bettings.map(b => {
      return {
        amount: b.betNum * getBetPrice(b, isDltAdd),
        buyNumber: b.betNum,
        codeWay: b.manual ? 1 : 2,
        contentType: b.contentType,
        lotteryChildCode: b.lotteryChildCode,
        multiple: 1,
        planContent: b.content
      };
    }),
    token: session.get('token')
  };
}

export function generateChaseOrderData(
  bettings,
  lotteryCode,
  times,
  lotteryIssue,
  chaseNum,
  isDltAdd
) {
  const orderData = generateOrderData(
    bettings,
    lotteryCode,
    times,
    lotteryIssue,
    isDltAdd
  );
  let data = {
    ...orderData,
    orderAddContentList: orderData.orderDetailList,
    addAmount: orderData.orderAmount * chaseNum,
    addCount: bettings.reduce((acc, b) => acc + b.betNum, 0),
    addIssues: chaseNum,
    addMultiples: times,
    addType: 1,
    multipleNum: times * chaseNum,
    stopType: 3,
    issueCode: lotteryIssue
  };
  delete data.orderDetailList;
  return data;
}

function getBetPrice(bet, isDltAdd) {
  if (bet.price) return bet.price;
  if (isDltAdd) return 3;
  return 2;
}
