import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './css/index.scss';
import './css/optimiztion.scss';
import session from '@/services/session';
import { Router, hashHistory } from 'react-router';
import Container from './container';
import Basketball from "./pages/index.jsx";
import OptimizationContainer from './containers/optimization-container.jsx';

const routes = {
  path: '/',
  component: Container,
  indexRoute: {
    component: Basketball
  },
  childRoutes: [
    {
      path: 'optimization',
      component: OptimizationContainer,
      indexRoute: {
        getComponent: (nextState, cb) => {
          import('./pages/optimization.jsx').then(r => {
            cb(null, r.default);
          });
        }
      },
      childRoutes: [
        {
          path: ':type',
          getComponent: (nextState, cb) => {
            import('./pages/combination.jsx').then(r => {
              cb(null, r.default);
            });
          }
        }
      ]
    }
  ]
}

render(
  <Provider store={store}>
    <Router routes={ routes } history={ hashHistory } />
  </Provider>
  ,
  document.getElementById('app')
);

window.initializeApp = function({ token }) {
  session.set('token', token);
};

window.onload = function(){
    setTimeout(() => {document.body.scrollTop = 0;}, 30)
}
