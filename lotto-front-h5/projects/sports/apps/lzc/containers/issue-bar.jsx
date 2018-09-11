import React, { PureComponent } from 'react';
import IssueBarComponent from '../components/issue-bar.jsx';
import http from '@/utils/request';
import { changeIssue } from '../actions/football';
import { connect } from 'react-redux';
import { bettingReset } from '../actions/betting';

class IssueBarContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      issues: []
    };
  }

  changeIssue(issue) {
    this.props.bettingReset();
    this.props.changeIssue(this.props.lotteryCode, issue);
  }

  componentDidMount() {
    this.fetchIssues(this.props.lotteryCode);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.lotteryCode &&
      nextProps.lotteryCode !== this.props.lotteryCode
    ) {
      this.fetchIssues(nextProps.lotteryCode);
    }
  }

  fetchIssues(lotteryCode) {
    http
      .get('/jc/oldLotteryIssue', { params: { lotteryCode: lotteryCode } })
      .then(res => {
        this.setState({ issues: res.data.currentIssue });
        const currentIssue = res.data.currentIssue.filter(
          c => c.currentIssue === 1
        )[0];
        if (!currentIssue) return undefined;
        this.changeIssue(currentIssue);
      });
  }

  render() {
    return (
      <div className="football-status-bar">
        <div />
        <IssueBarComponent
          issues={ this.state.issues }
          currentIssue={ this.props.currentIssue }
          changeIssue={ this.changeIssue.bind(this) }
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    currentIssue: state.currentIssue[props.lotteryCode] || {}
  };
};

const mapDispatchToProps = dispath => {
  return {
    changeIssue(lotteryCode, data) {
      dispath(changeIssue(lotteryCode, data));
    },
    bettingReset() {
      dispath(bettingReset());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueBarContainer);
