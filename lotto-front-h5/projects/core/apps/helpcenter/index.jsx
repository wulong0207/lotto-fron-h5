import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Index from './app.jsx';
import { HelpCenter } from './pages/helpcenter';
import { ProblemIndex } from './pages/problem-index';
import { SelfServ } from './pages/selfserv';
import { FeedBack } from './pages/feedback';
import { Answer } from './pages/answer';
import Problem from './pages/problem';
const history = hashHistory;
const RouteConfig = (
  <Router history={ history }>
    <Route path="/" component={ Index }>
      <IndexRoute component={ HelpCenter } />
      <Route path="/problem" component={ Problem }>
        <IndexRoute component={ ProblemIndex } />
        <Route path="/answer" component={ Answer } />
      </Route>
      <Route path="/selfserv" component={ SelfServ } />
      <Route path="/feedback" component={ FeedBack } />
    </Route>
  </Router>
);
export default RouteConfig;
