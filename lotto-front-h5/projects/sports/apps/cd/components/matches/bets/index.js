import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BETS_CONFIG } from '../../../constants/bets';
import { Match, WinningStatus } from '../../../types';

export default class Bets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null
    };
  }

  static propTypes = {
    lotteryCode: PropTypes.number.isRequired,
    match: Match,
    winningStatus: WinningStatus.isRequired,
    reverse: PropTypes.bool
  };

  componentWillMount() {
    const { lotteryCode } = this.props;
    const template = BETS_CONFIG.find(b => b.lotteryCode === lotteryCode);
    if (!template) throw new Error('未实现投注信息模板');
    template.getComponent().then(({ default: component }) => {
      this.setState({
        component: React.createElement(component, { ...this.props })
      });
    });
  }

  render() {
    if (!this.state.component) return null;
    return <div>{this.state.component}</div>;
  }
}
