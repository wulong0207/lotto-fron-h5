import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import '@/scss/jcz/index.scss';
import session from '@/services/session';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import './services/keyboard';

render(
  <Provider store={ store }>
    <Router routes={ routes } history={ hashHistory } />
  </Provider>,
  document.getElementById('app')
);

window.initializeApp = function({ token }) {
  session.set('token', token);
};
