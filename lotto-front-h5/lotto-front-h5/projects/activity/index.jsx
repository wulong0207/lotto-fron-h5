import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
// import { Firact } from './pages/yfq.jsx';
import { Secact } from './pages/jjc.jsx';
import { Thiact } from './pages/tge.jsx';
import { Foract } from './pages/jcl.jsx';
import { Fivact } from './pages/cjs.jsx';
import Football from './pages/football';
import { CrazyPrize } from './pages/crazyp.jsx';
const history = hashHistory;

const RouteConfig = (
  <Router path="/" history={ history }>
    {/* <Route path="firact" component={ Firact } /> */}
    <Route path="secact" component={ Secact } />
    <Route path="thiact" component={ Thiact } />
    <Route path="foract" component={ Foract } />
    <Route path="fivact" component={ Fivact } />
    <Route path="football" component={ Football } />
    <Route path="creazyprize" component={ CrazyPrize } />
  </Router>
);

export default RouteConfig;
