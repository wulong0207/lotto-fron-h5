import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import NumberLotto from './pages/main-info.jsx';

const history = hashHistory;

const RouteConfig = (
  <Router history={ history }>
    <Route path="/">
      <IndexRoute component={ NumberLotto } />
    </Route>
  </Router>
);

export default RouteConfig;
