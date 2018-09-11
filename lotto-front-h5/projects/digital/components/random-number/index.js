import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './random-number.scss';

export default class RandomNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.range[0],
      showList: false
    };
  }

  toggleList() {
    this.setState({ showList: !this.state.showList });
  }

  changHandle(number) {
    this.toggleList();
    if (this.state.number === number) return undefined;
    this.setState({ number });
  }

  randomHandle() {
    this.props.onRandom(this.state.number);
  }

  render() {
    return (
      <div className="number-random-number-component">
        <div className="random-number-box">
          <div className="number-input" onClick={ this.toggleList.bind(this) }>
            {this.state.number}
          </div>
          <button
            onClick={ this.randomHandle.bind(this) }
            style={ {
              backgroundColor: this.props.color ? this.props.color : '#ed1c24'
            } }
          >
            机选
          </button>
        </div>
        <div
          className="random-number-range"
          style={ { display: !this.state.showList ? 'none' : '' } }
        >
          {this.props.range.map(i => {
            return (
              <div
                key={ i }
                onClick={ this.changHandle.bind(this, i) }
                className="range-item"
              >
                {i}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

RandomNumber.propTypes = {
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  onRandom: PropTypes.func.isRequired,
  color: PropTypes.string
};
