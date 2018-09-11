import React, { PureComponent } from 'react';
import http from '@/utils/request';
import BetCalc from './bet_calc';
import Football from './football';

export default class FootballWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchs: [],
      lastEndSaleTime: ''
    };
    this.football = undefined;
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
  onMatchChange(betNum, max, lastEndSaleTime) {
    if (lastEndSaleTime) {
      let t = new Date(lastEndSaleTime);
      let seconds = t.getSeconds() < 9 ? '0' + t.getSeconds() : t.getSeconds();
      let Time =
        t.getFullYear() +
        '-' +
        (t.getMonth() + 1) +
        '-' +
        t.getDate() +
        ' ' +
        t.getHours() +
        ':' +
        t.getMinutes() +
        ':' +
        seconds;
      this.setState({ lastEndSaleTime: Time });
    }
  }
  getFootball() {
    return this.football;
  }
  render() {
    let { matchs } = this.state;
    if (!matchs || matchs.length < 2) {
      return (
        <div>
          <div className="matchs">
            <div className="noGame">
              <img src={ require('../img/no-game.png') } alt="" />
              <span>目前暂无可投注的赛事</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Football
          { ...this.props }
          ref={ football => (this.football = football) }
          matchs={ matchs }
          onMatchChange={ this.onMatchChange.bind(this) }
        />
        <BetCalc
          changeShowDialog={ this.props.changeShowDialog }
          getFootball={ this.getFootball.bind(this) }
          matchs={ matchs }
        />
      </div>
    );
  }
}
