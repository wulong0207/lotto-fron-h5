import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@/component/dialog';
import './empty-tip.scss';
import cx from 'classnames';
import { Klass } from '@/types/common';

export default class NumberEmptyTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: []
    };
    this.resolveHandle = undefined;
  }

  open() {
    return new Promise((resolve, reject) => {
      this.dialog.open();
      this.setState({ balls: this.props.random() });
      this.resolveHandle = resolve;
    });
  }

  okHandle() {
    this.resolveHandle(this.state.balls);
    this.dialog.close();
  }

  changeHandle() {
    this.setState({ balls: this.props.random() });
  }

  render() {
    let balls = this.state.balls.concat();
    return (
      <Dialog
        ref={ dialog => (this.dialog = dialog) }
        showClose={ false }
        title={ '' }
        klass="number-lottery-empty-dialog"
      >
        <div className={ cx('number-lottery-empty-tip', this.props.klass) }>
          <p>你还没有选择号码，系统给你随机来一注</p>
          {this.props.template ? (
            React.createElement(this.props.template, {
              balls
            })
          ) : (
            <div className="balls">
              {balls.map((b, index) => (
                <span className="ball" key={ index }>
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
        <footer>
          <button onClick={ this.changeHandle.bind(this) }>换一注</button>
          <button onClick={ this.okHandle.bind(this) }>确定</button>
        </footer>
      </Dialog>
    );
  }
}

NumberEmptyTip.propTypes = {
  random: PropTypes.func.isRequired,
  template: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
    PropTypes.instanceOf(React.PureComponent)
  ]),
  sort: PropTypes.bool,
  klass: Klass
};

NumberEmptyTip.defaultProps = {
  sort: true
};
