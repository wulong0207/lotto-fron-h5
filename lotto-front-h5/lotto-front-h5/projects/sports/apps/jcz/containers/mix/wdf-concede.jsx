import React, { PureComponent } from 'react';
import WDFComponent from '../../components/mix/wdf-concede.jsx';
import connect from './connect';

export class WDFConcedeContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <WDFComponent { ...this.props } />;
  }
}

export default connect('let_wdf', WDFConcedeContainer);
