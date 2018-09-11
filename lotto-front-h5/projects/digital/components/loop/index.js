import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Loop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0
    };
    this.loopInstance = null;
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  loop() {
    const length = this.props.children.filter(node => Boolean(node)).length;
    this.loopNode.classList.add('active');
    setTimeout(() => {
      this.setState(
        {
          currentIndex:
            this.state.currentIndex === length - 1
              ? 0
              : this.state.currentIndex + 1
        },
        () => {
          this.loopNode.classList.remove('active');
          this.props.onLoop && this.props.onLoop(this.state.currentIndex);
        }
      );
    }, 200);
  }

  start() {
    if (!Array.isArray(this.props.children)) return undefined;
    this.loopInstance = setInterval(() => this.loop(), this.props.timeout);
  }

  stop() {
    if (this.loopInstance) {
      clearInterval(this.loopInstance);
      this.loopInstance = null;
    }
  }

  render() {
    const children = Array.isArray(this.props.children)
      ? this.props.children.filter(node => Boolean(node))
      : [this.props.children];
    const length = children.length;
    const node = children[this.state.currentIndex];
    const nextIndex = this.state.currentIndex + 1;
    const nextNode =
      length > 1 ? children[nextIndex === length ? 0 : nextIndex] : null;
    return (
      <div className="text-loop" ref={ node => (this.loopNode = node) }>
        <div className="current-node node">{node}</div>
        {nextNode && <div className="next-node node">{nextNode}</div>}
      </div>
    );
  }
}

Loop.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired,
  timeout: PropTypes.number,
  onLoop: PropTypes.func
};

Loop.defaultProps = {
  timeout: 3000
};
