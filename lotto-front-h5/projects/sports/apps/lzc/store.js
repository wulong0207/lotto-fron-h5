import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import footballApp from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // for redux devtool

const store = createStore(
  footballApp,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
