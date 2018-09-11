import React from 'react';
import { render } from 'react-dom';
import lottery from '../../components/hoc/high-frequency/lottery';
import K3Index from './app.js';
import Common from './components/common.js';

let address = window.location.pathname;

let config = {
  href: '/cqssc/info',
  title: '重庆时时彩'
  // Updata:'gd11x5UpdateData'
};
switch (address) {
  case '/ssc.html':
    break;
}

function setBetOption(page) {
  if (page === 'renqi' || page === 'qianyi' || page === 'qiansanSelect') {
    return {
      disableShake: true
    };
  }

  return {};
}

render(
  React.createElement(
    lottery(
      config.href,
      config.title,
      null,
      K3Index,
      'k3-app',
      {},
      { detail: Common.OrderDetail },
      setBetOption
    )
  ),
  document.getElementById('app')
);
