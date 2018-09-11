import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import basketballApp from './redux/reducers';
// import ball from './middleware/ball.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // for redux devtool

const store = createStore(
  basketballApp,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
