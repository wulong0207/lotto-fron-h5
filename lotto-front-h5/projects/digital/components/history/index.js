import React, { Component } from 'react';
import history from '../hoc/history';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Loop from '../loop';
import './history.scss';

function Histories({ histories, table }) {
  if (!table) {
    return (
      <table>
        <tbody>
          {histories.map(h => {
            return (
              <tr key={ h.issue ? h.issue : h.issueCode }>
                <td>{h.issue ? h.issue : h.issueCode}</td>
                <td>{h.drawCode}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  return (
    <table>
      <tbody>
        <tr>
          {table.map((cols, idx) => {
            return (
              <th className={ cx(cols.klass) } key={ idx }>
                {cols.label}
              </th>
            );
          })}
        </tr>
        {histories.map(h => {
          return (
            <tr key={ h.issue ? h.issue : h.issueCode }>
              {table.map((cols, idx) => {
                return (
                  <td key={ idx }>
                    {cols.template
                      ? React.createElement(cols.template, { row: h })
                      : h[cols.field]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Histories.propTypes = {
  histories: PropTypes.array.isRequired,
  table: PropTypes.array
};

let HistoryTable;

export default class LotteryHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHistories: false
    };
    HistoryTable = history(props.url, props.table, Histories);
    this.loopTimes = 0;
  }

  toggleHistories() {
    this.setState({ showHistories: !this.state.showHistories });
  }

  loopHandle() {
    const loopLength = this.props.children.filter(node => Boolean(node)).length;
    this.loopTimes++;
    if (loopLength === 2 && this.loopTimes === 2) {
      this.loop.stop();
    } else if (loopLength.length === 3 && this.loopTimes === 4) {
      this.loop.stop();
    }
  }

  render() {
    return (
      <div className="histories-component">
        <div className="issue-bar" onClick={ this.toggleHistories.bind(this) }>
          {this.props.children ? (
            <Loop
              ref={ loop => (this.loop = loop) }
              onLoop={ this.loopHandle.bind(this) }
              timeout={ 5000 }
            >
              {this.props.children}
            </Loop>
          ) : (
            <div>
              <span>
                第<em>{this.props.latestIssue.issueCode}</em>期
              </span>
              <span>
                开奖号码:{' '}
                {this.props.latestIssue.drawCode &&
                  this.props.latestIssue.drawCode.replace(/\|/g, ' ')}
              </span>
            </div>
          )}
        </div>
        <div
          className="histories"
          onClick={ this.toggleHistories.bind(this) }
          style={ { display: this.state.showHistories ? 'block' : 'none' } }
        >
          <HistoryTable />
        </div>
        <div className="bottom-btn" onClick={ this.toggleHistories.bind(this) } />
      </div>
    );
  }
}

LotteryHistory.propTypes = {
  latestIssue: PropTypes.shape({
    drawCode: PropTypes.string,
    issueCode: PropTypes.string
  }),
  url: PropTypes.string.isRequired,
  table: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      field: PropTypes.string,
      klass: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
      template: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(React.Component),
        PropTypes.instanceOf(React.PureComponent)
      ])
    })
  ),
  children: PropTypes.node
};
