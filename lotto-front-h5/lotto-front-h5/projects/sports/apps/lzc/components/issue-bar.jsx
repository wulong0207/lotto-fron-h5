import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { mapSaleStatusText } from '../utils/utils';
import cx from 'classnames';

function formatTenThousand(amount, fixed = true) {
  if (amount < 10000) return amount;
  if (fixed) return `${(amount / 10000).toFixed(2)}万`;
  return `${Math.round(amount / 10000)}万`;
}

function formatAmount(amount) {
  const aHundredMillion = 100000000; // 亿
  if (amount > aHundredMillion) {
    const hundredMillion = parseInt(amount / aHundredMillion);
    const resetAmount = amount % aHundredMillion;
    return `${hundredMillion}亿${formatTenThousand(resetAmount, false)}`;
  }
  return formatTenThousand(amount);
}

function formatIssueDateTime(dateTime) {
  if (!dateTime) return '';
  return dateTime.slice(2).replace(/-/g, '/');
}

const IssueList = ({ issues, changeIssue, currentIssue, show, toggle }) => {
  return (
    <div
      className="issue-list-container"
      style={ { display: show ? 'block' : 'none' } }
    >
      <div className="issue-list-mask" onClick={ toggle } />
      <ul className="issue-list">
        {issues.map(i => {
          return (
            <li
              key={ i.issueCode }
              className={ cx({ active: i.issueCode === currentIssue.issueCode }) }
              onClick={ () => changeIssue(i) }
            >
              <span>{i.issueCode}期</span>
              <span>
                截止时间: {formatIssueDateTime(i.saleEndTime)}({mapSaleStatusText(
                  i.saleStatus
                )})
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default class IssueBarComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showList: false
    };
  }

  toggle() {
    this.setState({ showList: !this.state.showList });
  }

  changeIssue(issue) {
    this.toggle();
    this.props.changeIssue(issue);
  }

  render() {
    const { currentIssue } = this.props;
    return (
      <div className="issue-bar">
        <div className="bar" onClick={ this.toggle.bind(this) }>
          <span className="issue-code">{currentIssue.issueCode}期</span>
          <span>截止时间：{formatIssueDateTime(currentIssue.saleEndTime)}</span>
          <span>
            {currentIssue.jackpotAmount ? (
              <span>奖池滚存 {formatAmount(currentIssue.jackpotAmount)}</span>
            ) : (
              `(${mapSaleStatusText(currentIssue.saleStatus)})`
            )}
          </span>
        </div>
        <div className="arrow-container">
          <span className={ cx('arrow', { open: this.state.showList }) } />
        </div>
        <IssueList
          { ...this.props }
          show={ this.state.showList }
          toggle={ this.toggle.bind(this) }
          changeIssue={ this.changeIssue.bind(this) }
        />
      </div>
    );
  }
}

IssueBarComponent.propTypes = {
  issues: PropTypes.array.isRequired,
  currentIssue: PropTypes.object.isRequired,
  changeIssue: PropTypes.func.isRequired
};
