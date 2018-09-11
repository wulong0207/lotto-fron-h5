import React from 'react';
import { render } from 'react-dom';
import information from '../../components/hoc/information';
import SSQIndex from './app.js';

render(
  React.createElement(information('/dlt/info', SSQIndex)),
  document.getElementById('app')
);
