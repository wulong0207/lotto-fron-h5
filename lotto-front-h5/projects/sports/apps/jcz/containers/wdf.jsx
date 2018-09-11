import React, { PureComponent } from 'react';
import WDFComponent from '../components/wdf.jsx';
import connect from './connect';

export class WDFContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <WDFComponent { ...this.props } />;
  }
}

export default connect('wdf', WDFContainer);
