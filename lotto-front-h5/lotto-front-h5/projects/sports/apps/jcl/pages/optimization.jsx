import React, { PureComponent } from 'react';
import OptimizationContainer from '../containers/optimiztion.jsx';
import FootballPageNavigator from '../components/navigator.jsx';

export default class Optimization extends PureComponent {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="football-optimization">
        <FootballPageNavigator
          title="奖金优化"
          onBack={ () => history.go(-1) }
        />
        <OptimizationContainer />
      </div>
    )
  }
}
