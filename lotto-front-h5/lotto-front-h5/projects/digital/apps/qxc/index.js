import React from 'react';
import { render } from 'react-dom';
import information from '../../components/hoc/information';
import QXCIndex from './components/index';

render(
  React.createElement(information('/qxc/info', QXCIndex)),
  document.getElementById('app')
);
