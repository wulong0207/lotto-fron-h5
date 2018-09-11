import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import footballApp from './reducers';
import football from './middleware/football';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // for redux devtool

const store = createStore(
  footballApp,
  composeEnhancers(applyMiddleware(thunk, football))
);

export default store;
