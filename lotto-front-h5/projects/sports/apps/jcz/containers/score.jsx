import React, { PureComponent } from 'react';
import ScoreTableComponent from '../components/score.jsx';
import connect from './connect';

export class ScoreContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <ScoreTableComponent { ...this.props } />;
  }
}

export default connect('score', ScoreContainer);
