import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { getSpValueByScore } from '../../utils';

export default class ScoreSliderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      h_score: props.h_score ? props.h_score : 0,
      g_score: props.g_score ? props.g_score : 0
    };
  }

  onChange(value, team) {
    const newState = team === 'h' ? { h_score: value } : { g_score: value };
    this.setState(newState);
  }

  renderScoreSPValue() {
    const score = `${this.state.h_score}:${this.state.g_score}`;
    const sp = getSpValueByScore(score, this.props.match);
    return (
      <div className="score-sp-number">
        <span className="score">{score}</span>
        <h4 className="score-sp">{sp}</h4>
      </div>
    );
  }

  render() {
    const marks = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: '6+'
    };
    const { match } = this.props;
    return (
      <div className="score-slider">
        <div className="sliders">
          <div className="h-slider slider">
            <h4>{match.h_s_name ? match.h_s_name : match.h_f_name}</h4>
            <Slider
              min={ 0 }
              max={ 6 }
              marks={ marks }
              step={ 1 }
              onAfterChange={ value => this.onChange(value, 'h') }
              defaultValue={ this.props.h_score ? this.props.h_score : 0 }
            />
          </div>
          <div className="g-slider slider">
            <h4>{match.g_s_name ? match.g_s_name : match.g_f_name}</h4>
            <Slider
              min={ 0 }
              max={ 6 }
              marks={ marks }
              step={ 1 }
              onAfterChange={ value => this.onChange(value, 'g') }
              defaultValue={ this.props.g_score ? this.props.g_score : 0 }
            />
          </div>
        </div>
        <div className="score-box">{this.renderScoreSPValue()}</div>
      </div>
    );
  }
}

ScoreSliderComponent.propTypes = {
  match: PropTypes.object.isRequired,
  g_score: PropTypes.number,
  h_score: PropTypes.number
};
