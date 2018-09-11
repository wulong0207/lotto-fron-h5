import React from 'react';
import { render } from 'react-dom';
import information from '../../components/hoc/information';
import QLCIndex from './components/index';

render(
  React.createElement(information('/qlc/info', QLCIndex)),
  document.getElementById('app')
);
