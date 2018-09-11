import React from 'react';
import CombinationsContainer from '../containers/combination.jsx';
import { TYPES } from '../constants/optimization';
import FootballPageNavigator from '../components/navigator.jsx';

export default props => {
  const { type } = props.routeParams;
  if (TYPES.map(i => i.name).indexOf(type) < 0) {
    return (
      <div>invalid url</div>
    )
  }
  return (
    <div className="combinations-app">
      <FootballPageNavigator
        title="奖金优化"
        onBack={ () => history.go(-1) }
      />
      <CombinationsContainer
        type={type}
      />
    </div>
  )
}