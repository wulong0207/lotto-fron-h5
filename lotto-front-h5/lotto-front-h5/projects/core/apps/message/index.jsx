import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Index, MsgCenter, MsgDetail } from './msg.jsx';

const history = hashHistory;
const RouteConfig = (
  <Router history={ history }>
    <Route path="/msg">
      <IndexRoute component={ MsgCenter } />
      <Route path="/" component={ Index }>
        <IndexRoute component={ MsgCenter } />
        <Route path="msgdetail" component={ MsgDetail } />
      </Route>
    </Route>
  </Router>
);

export default RouteConfig;
