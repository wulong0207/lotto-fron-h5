import React from 'react';
import { Router, hashHistory } from 'react-router';
import { render } from 'react-dom';
import routes from './routes';

render(
  <Router routes={ routes } history={ hashHistory } />,
  document.getElementById('app')
);
