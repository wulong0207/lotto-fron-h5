import React, { PureComponent } from 'react';
import WDFConcedeComponent from '../components/wdf-concede.jsx';
import connect from './connect';

export class WDFConcedeContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <WDFConcedeComponent { ...this.props } />;
  }
}

export default connect('let_wdf', WDFConcedeContainer);
