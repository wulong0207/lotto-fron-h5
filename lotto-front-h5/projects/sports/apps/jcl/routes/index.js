import Container from '../container.jsx';
import OptimizationContainer from '../containers/optimization-container.jsx';
import FootBall from '../pages/index.jsx';

export default {
  path: '/',
  component: Container,
  indexRoute: {
    component: FootBall
  },
  childRoutes: [
    {
      path: 'optimization',
      component: OptimizationContainer,
      indexRoute: {
        getComponent: (nextState, cb) => {
          import('../pages/optimization.jsx').then(r => {
            cb(null, r.default);
          });
        }
      },
      childRoutes: [
        {
          path: ':type',
          getComponent: (nextState, cb) => {
            import('../pages/combination.jsx').then(r => {
              cb(null, r.default);
            });
          }
        }
      ]
    }
  ]
};
