import React from 'react';
import { render } from 'react-dom';
import information from '../../components/hoc/information';
import F3dIndex from './components/index';

render(
  React.createElement(information('/f3d/info', F3dIndex)),
  document.getElementById('app')
);
