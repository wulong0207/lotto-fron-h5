import App from './app';

export default {
  path: '/',
  component: App,
  indexRoute: {
    getComponent(nextState, cb) {
      import('./pages/index').then(component => cb(null, component.default));
    }
  },
  childRoutes: [
    {
      path: 'about-us',
      getComponent(nextState, cb) {
        import('./pages/about-us').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'account-notice',
      getComponent(nextState, cb) {
        import('./pages/account-notice').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'add-bank',
      getComponent(nextState, cb) {
        import('./pages/add-bank').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'advice-feed-back',
      getComponent(nextState, cb) {
        import('./pages/advice-feed-back').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'bank-info',
      getComponent(nextState, cb) {
        import('./pages/bank-info').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'bank-query',
      getComponent(nextState, cb) {
        import('./pages/bank-query').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'buy-notice',
      getComponent(nextState, cb) {
        import('./pages/buy-notice').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'change-pwd',
      getComponent(nextState, cb) {
        import('./pages/change-pwd').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'comfirm-draw-money-ok',
      getComponent(nextState, cb) {
        import('./pages/comfirm-draw-money-ok').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'comfirm-draw-money',
      getComponent(nextState, cb) {
        import('./pages/comfirm-draw-money').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'cz-trade-detail/:transCode',
      getComponent(nextState, cb) {
        import('./pages/cz-trade-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'devote-recorde',
      getComponent(nextState, cb) {
        import('./pages/devote-recorde').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'draw-list',
      getComponent(nextState, cb) {
        import('./pages/draw-list').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'draw-money-branch',
      getComponent(nextState, cb) {
        import('./pages/draw-money-branch').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'draw-money',
      getComponent(nextState, cb) {
        import('./pages/draw-money').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'fourteen-lottery-detail',
      getComponent(nextState, cb) {
        import('./pages/fourteen-lottery-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'fourteen-lottery',
      getComponent(nextState, cb) {
        import('./pages/fourteen-lottery').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'jjc-lottery-detail',
      getComponent(nextState, cb) {
        import('./pages/jjc-lottery-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'lottery-notice',
      getComponent(nextState, cb) {
        import('./pages/lottery-notice').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'mail-info/:em/:em_log/:em_sts',
      getComponent(nextState, cb) {
        import('./pages/mail-info').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'modify-nick-name',
      getComponent(nextState, cb) {
        import('./pages/modify-nick-name').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'modify-user-name',
      getComponent(nextState, cb) {
        import('./pages/modify-user-name').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'msg-center',
      getComponent(nextState, cb) {
        import('./pages/msg-center').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'my-bank',
      getComponent(nextState, cb) {
        import('./pages/my-bank').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'no-bother-notice',
      getComponent(nextState, cb) {
        import('./pages/no-bother-notice').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'notice-setting',
      getComponent(nextState, cb) {
        import('./pages/notice-setting').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'number-lottery-detail',
      getComponent(nextState, cb) {
        import('./pages/number-lottery-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'number-lottery-progress/:orderCode',
      getComponent(nextState, cb) {
        import('./pages/number-lottery-progress').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'other-notice',
      getComponent(nextState, cb) {
        import('./pages/other-notice').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'phone-info/:mob/:mob_log/:mob_sts',
      getComponent(nextState, cb) {
        import('./pages/phone-info').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'question-detail',
      getComponent(nextState, cb) {
        import('./pages/question-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'question-detail',
      getComponent(nextState, cb) {
        import('./pages/question-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'real-name-again',
      getComponent(nextState, cb) {
        import('./pages/real-name-again').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'real-name',
      getComponent(nextState, cb) {
        import('./pages/real-name').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'recharge-result',
      getComponent(nextState, cb) {
        import('./pages/recharge-result').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'recharge',
      getComponent(nextState, cb) {
        import('./pages/recharge').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'red-packet-item',
      getComponent(nextState, cb) {
        import('./pages/red-packet-item').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'red-packet-tans/:redCode',
      getComponent(nextState, cb) {
        import('./pages/red-packet-tans').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'red-packet',
      getComponent(nextState, cb) {
        import('./pages/red-packet').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'register-bank/:bankNo',
      getComponent(nextState, cb) {
        import('./pages/register-bank').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'register-mail',
      getComponent(nextState, cb) {
        import('./pages/register-mail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'register-phone',
      getComponent(nextState, cb) {
        import('./pages/register-phone').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'register-proxy',
      getComponent(nextState, cb) {
        import('./pages/register-proxy').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'safe-account',
      getComponent(nextState, cb) {
        import('./pages/safe-account').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'service-hall',
      getComponent(nextState, cb) {
        import('./pages/service-hall').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'set-password',
      getComponent(nextState, cb) {
        import('./pages/set-password').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'setting',
      getComponent(nextState, cb) {
        import('./pages/setting').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'tk-trade-detail/:transCode',
      getComponent(nextState, cb) {
        import('./pages/tk-trade-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'trade-detail/:transCode',
      getComponent(nextState, cb) {
        import('./pages/trade-detail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'trade-info',
      getComponent(nextState, cb) {
        import('./pages/trade-info').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'trade-notice',
      getComponent(nextState, cb) {
        import('./pages/trade-notice').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'user-info',
      getComponent(nextState, cb) {
        import('./pages/user-info').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'verify-mail/:em(/:update)',
      getComponent(nextState, cb) {
        import('./pages/verify-mail').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'verify-phone/:mob(/:update)',
      getComponent(nextState, cb) {
        import('./pages/verify-phone').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'orders/:order',
      getComponent(nextState, cb) {
        import('./orders/components').then(component =>
          cb(null, component.default)
        );
      }
    }
  ]
};
