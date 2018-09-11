import React from 'react';
import { render } from 'react-dom';
import lottery from '../../components/hoc/high-frequency/lottery';
import K3Index from './components/index';
import Common from './components/common.js';

function Balls({ balls }) {
  let ball = balls.split(' ');
  let message = [];

  ball.map((item, index) => {
    if (item === '1T') {
      message.push(
        <img src={ require('../../../../lib/img/klpk3/heitao_min.png') } />
      );
    } else if (item === '2T') {
      message.push(
        <img src={ require('../../../../lib/img/klpk3/hongtao_min.png') } />
      );
    } else if (item === '3T') {
      message.push(
        <img src={ require('../../../../lib/img/klpk3/meihua_min.png') } />
      );
    } else if (item === '4T') {
      message.push(
        <img src={ require('../../../../lib/img/klpk3/fangkuai_min.png') } />
      );
    } else {
      message.push(<span>{item} </span>);
    }
  });
  return <div style={ { marginBottom: '10px' } }>{message}</div>;
}

function betCartNoWarp({ balls }) {
  let ball = balls.split(' ');
  let message = [];
  ball.map((item, index) => {
    message.push(
      <span className="ball" key={ index }>
        {item}{' '}
      </span>
    );
  });

  return <div style={ { marginBottom: '10px' } }>{message}</div>;
}

function ballFormat(bet) {
  if (bet.lotteryChildCode !== 22507) {
    return betCartNoWarp;
  }
  return Balls;
}

render(
  React.createElement(
    lottery(
      '/sdpk/info',
      '快乐扑克3',
      null,
      K3Index,
      'k3-app',
      { ballFormat },
      { detail: Common.OrderDetail }
    )
  ),
  document.getElementById('app')
);
