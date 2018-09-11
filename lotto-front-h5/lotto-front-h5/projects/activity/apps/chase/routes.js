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
      path: 'pick',
      getComponent(nextState, cb) {
        import('./pages/pick').then(component => cb(null, component.default));
      }
    },
    {
      path: 'my-chase',
      getComponent(nextState, cb) {
        import('./pages/my-chase').then(component =>
          cb(null, component.default)
        );
      }
    }
  ]
};
