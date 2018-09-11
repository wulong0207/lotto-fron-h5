import React, { Component } from 'react';
import '../css/hint.scss';

export default class Hint extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let message = this.props.HintMessage;
    if (!message) return <div />;
    return (
      <div className="Hint">
        <div className="title">友情提示:</div>
        <div className="content">
          {message.map((row, ind) => {
            return (
              <p className="txt" key={ ind }>
                {row}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

Hint.defaultPops = {};
