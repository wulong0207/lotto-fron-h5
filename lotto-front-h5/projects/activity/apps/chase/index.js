import React from 'react';
import { Router, hashHistory } from 'react-router';
import { render } from 'react-dom';
import routes from './routes';
import '@/scss/base/base.scss';

render(
  <Router routes={ routes } history={ hashHistory } />,
  document.getElementById('app')
);

