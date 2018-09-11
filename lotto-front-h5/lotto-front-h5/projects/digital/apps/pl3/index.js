import React from 'react';
import { render } from 'react-dom';
import information from '../../components/hoc/information';
import PL3Index from './components/index';

render(
  React.createElement(information('/pl3/info', PL3Index)),
  document.getElementById('app')
);
