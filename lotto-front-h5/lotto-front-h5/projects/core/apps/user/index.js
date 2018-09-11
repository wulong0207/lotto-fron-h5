/*
 * @Author: nearxu
 * @Date: 2017-12-23 10:26:35
 */

import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';

render(
  <Router routes={ routes } history={ hashHistory } />,
  document.getElementById('app')
);
