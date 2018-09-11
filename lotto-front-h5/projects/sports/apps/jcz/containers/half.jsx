import React, { PureComponent } from 'react';
import HalfWDFComponent from '../components/half.jsx';
import connect from './connect';

export class HalfContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <HalfWDFComponent { ...this.props } />;
  }
}

export default connect('hf', HalfContainer);
