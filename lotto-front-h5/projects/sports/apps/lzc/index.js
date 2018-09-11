import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './css/index.scss';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import '../jcz/services/keyboard';

render(
  <Provider store={ store }>
    <Router routes={ routes } history={ hashHistory } />
  </Provider>,
  document.getElementById('app')
);
