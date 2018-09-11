import Container from '../container.jsx';
import Match from '../pages/match.jsx';

export default {
  path: '/',
  component: Container,
  indexRoute: {
    component: Match
  },
  childRoutes: [
    {
      path: ':page',
      component: Match
    }
  ]
};
