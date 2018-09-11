import React from 'react';
import { render } from 'react-dom';
import information from '../../components/hoc/information';
import PL5Index from './components/index';

render(
  React.createElement(information('/pl5/info', PL5Index)),
  document.getElementById('app')
);
