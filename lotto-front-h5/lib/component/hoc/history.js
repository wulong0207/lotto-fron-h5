import React, { Component } from 'react';
import http from '../../utils/request';

export default function history(url, table, WrapperComponent) {

  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        histories: []
      }
    }

    componentDidMount() {
      http.get(url).then(res => {
        this.setState({ histories: res.data });
      })
    }

    render() {
      const { histories } = this.state;
      if (!histories.length) return (<div />);
      return (
        <WrapperComponent
          histories={ this.state.histories }
          table={ table }
        />
      );
    }
  }
}