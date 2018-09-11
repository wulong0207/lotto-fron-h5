import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import http from '@/utils/request';
import MatchListComponent from '../components/match.jsx';
import PropTypes from 'prop-types';
import { bettingReset } from '../actions/betting';
import { setMatchIds } from '../actions/football';

class MatchContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchs: []
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.issueCode && newProps.issueCode !== this.props.issueCode) {
      this.getMatchs(newProps.issueCode);
    }
    if (newProps.lotteryCode !== this.props.lotteryCode) {
      this.props.reset();
    }
  }

  getMatchs(issueCode) {
    http.get('/jc/sfc', { params: { issueCode: issueCode } }).then(res => {
      this.setState({ matchs: res.data });
      this.props.setMatchIds(res.data.map(d => d.id));
    });
  }

  render() {
    if (!this.props.issueCode || !this.state.matchs.length) {
      return <div />;
    }
    return (
      <div>
        <MatchListComponent
          matchs={ this.state.matchs }
          showCourage={ this.props.lotteryCode === 305 }
        />
      </div>
    );
  }
}

MatchContainer.propTypes = {
  lotteryCode: PropTypes.number.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    issueCode: state.currentIssue[props.lotteryCode]
      ? state.currentIssue[props.lotteryCode].issueCode
      : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reset() {
      dispatch(bettingReset());
    },
    setMatchIds(ids) {
      dispatch(setMatchIds(ids));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchContainer);
