import React from 'react';
import { render } from 'react-dom';
import lottery from '../../components/hoc/high-frequency/lottery';
import K3Index from './app.js';
import Common from './components/common.js';

let address = window.location.pathname;

let config = {
  href: '/gd11x5/info',
  title: '广东11选5',
  Updata: 'gd11x5UpdateData'
};
switch (address) {
  case '/gd11x5.html':
    break;
  case '/sd11x5.html':
    config = {
      href: '/sd11x5/info',
      title: '山东11选5',
      Updata: 'sd11x5UpdateData'
    };
    break;
  case '/jx11x5.html':
    config = {
      href: '/jx11x5/info',
      title: '江西11选5',
      Updata: 'jx11x5UpdateData'
    };
    break;
  case '/xj11x5.html':
    config = {
      href: '/xj11x5/info',
      title: '新疆11选5',
      Updata: 'xj11x5UpdateData'
    };
    break;
}

render(
  React.createElement(
    lottery(
      config.href,
      config.title,
      config.Updata,
      K3Index,
      'k3-app',
      {},
      { detail: Common.OrderDetail }
    )
  ),
  document.getElementById('app')
);
