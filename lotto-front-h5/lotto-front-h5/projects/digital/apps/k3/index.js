import React from 'react';
import { render } from 'react-dom';
import lottery from '../../components/hoc/high-frequency/lottery';
import K3Index from './components/index';
import { LOTTERY } from './constants';

const lotteryConfig = getLotteryConfig();

render(
  React.createElement(
    lottery(
      `/${lotteryConfig.name}/info`,
      lotteryConfig.label,
      lotteryConfig.socketEventName,
      K3Index,
      'k3-app',
      undefined,
      undefined,
      undefined,
      lotteryConfig
    )
  ),
  document.getElementById('app')
);

function getLotteryConfig() {
  const url = window.location.pathname;
  let lotteryCode;
  switch (url) {
    case '/k3.html':
      lotteryCode = 233;
      break;
    case '/jxk3.html':
      lotteryCode = 234;
      break;
  }
  return LOTTERY[lotteryCode];
}
