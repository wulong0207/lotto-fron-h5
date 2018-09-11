export default {
  path: '/',
  indexRoute: {
    getComponent(nextState, cb) {
      import('./pages/index').then(component => cb(null, component.default));
    }
  },
  childRoutes: [
    {
      path: 'show',
      getComponent(nextState, cb) {
        import('./pages/show').then(component => cb(null, component.default));
      }
    }
  ]
};
