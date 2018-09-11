import App from './app';
import Index from './pages/index';

export default {
  path: '/',
  component: App,
  indexRoute: {
    component: Index
  },
  childRoutes: [
    {
      path: 'create',
      getComponent(nextState, cb) {
        import('./pages/create').then(component => cb(null, component.default));
      }
    },
    {
      path: 'follows',
      getComponent(nextState, cb) {
        import('./pages/dynamic').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'experts',
      getComponent(nextState, cb) {
        import('./pages/special-list').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'receipts',
      getComponent(nextState, cb) {
        import('./pages/transcribe').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'receipts/:id',
      getComponent(nextState, cb) {
        import('./pages/receipt').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'experts/:id',
      getComponent(nextState, cb) {
        import('./pages/expert').then(component => cb(null, component.default));
      }
    },
    {
      path: 'follow/:code',
      getComponent(nextState, cb) {
        import('./pages/follow').then(component => cb(null, component.default));
      }
    },
    {
      path: 'dashboard',
      getComponent(nextState, cb) {
        import('./pages/dashboard').then(component =>
          cb(null, component.default)
        );
      }
    },
    {
      path: 'rebate/:code',
      getComponent(nextState, cb) {
        import('./pages/rebate').then(component => cb(null, component.default));
      }
    }
  ]
};
