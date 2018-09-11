import { browser } from '../utils/utils';
import interaction from '../utils/interaction';

export function gotoPay(orderCode, buyType = 1) {
  if (browser.yicaiApp) {
    return interaction.sendInteraction('toPay', [
      JSON.stringify([{ oc: orderCode }])
    ]);
  } else {
    return (window.location.href = `/pay.html?orderCode=${orderCode}&buyType=${buyType}}`);
  }
}
