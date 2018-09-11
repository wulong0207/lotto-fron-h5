import React, { PureComponent } from 'react';
import GoalComponent from '../components/goal.jsx';
import connect from './connect';

export class GoalContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <GoalComponent { ...this.props } />;
  }
}

export default connect('goal', GoalContainer);
