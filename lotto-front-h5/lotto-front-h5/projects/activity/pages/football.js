import React, { PureComponent } from 'react';
import FootballWidget from '../components/football';
import http from '@/utils/request';

export default class Football extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchs: []
    };
  }

  componentDidMount() {
    http
      .get('/jc/fbRecom')
      .then(res => {
        this.setState({ matchs: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (!this.state.matchs.length) return <div />;
    return (
      <div>
        <FootballWidget matchs={ this.state.matchs } />
      </div>
    );
  }
}
