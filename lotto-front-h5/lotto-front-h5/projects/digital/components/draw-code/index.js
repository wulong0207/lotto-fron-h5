import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/component/countdown.jsx';
import './draw-code.scss';

export default class DrawCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remaining: props.remaining || 60
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.drawCode && this.props.drawCode) {
      const newRemaining = nextProps.remaining || 60;
      this.setState({ remaining: newRemaining });
    }
  }

  timeoutHandle() {
    if (!this.props.drawCode) {
      this.setState({ remaining: 60 });
    }
  }

  render() {
    const { drawCode } = this.props;
    const { remaining } = this.state;
    return (
      <span className="draw-code-component">
        {!drawCode ? (
          <span className="draw-code-timer">
            开奖中
            <em>
              <Countdown
                remaining={ remaining }
                timeout={ this.timeoutHandle.bind(this) }
              />
            </em>
          </span>
        ) : (
          <span>
            开奖号码：
            {this.props.template
              ? React.createElement(this.props.template, { drawCode })
              : drawCode}
          </span>
        )}
      </span>
    );
  }
}

DrawCode.propTypes = {
  remaining: PropTypes.number,
  drawCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  template: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
    PropTypes.instanceOf(React.PureComponent)
  ])
};

DrawCode.defaultProps = {
  remaining: 0
};
