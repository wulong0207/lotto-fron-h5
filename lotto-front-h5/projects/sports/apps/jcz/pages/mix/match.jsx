import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ToggleComponent from '../../components/toggle.jsx';
import HalfContainer from '../../containers/mix/half.jsx';
import GoalContainer from '../../containers/mix/goal.jsx';
import WDFContainer from '../../containers/mix/wdf.jsx';
import WDFConcedeContainer from '../../containers/mix/wdf-concede.jsx';
import ScoreContainer from '../../containers/mix/score.jsx';
import ScoreSliderComponent from '../../components/mix/scoreslider.jsx';
import PopUpComponent from '../../components/popup.jsx';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  toggleMatchDetail,
  singleBettingClear,
  singleBettingSubmit
} from '../../actions/mix';
import { toggleBetting, removeBettingMatch } from '../../actions/betting';
import analytics from '@/services/analytics';

class MatchDetailPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scoreFormat: 'slider',
      id: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this.toggle();
    }
  }

  open(id) {
    this.props.toggle(id);
    this.popup.open();
  }

  toggle() {
    this.popup.toggle();
  }

  submit() {
    // const selected = this.props.selected.concat();
    // if (!this.props.selected.length) return this.toggle();
    analytics.send(21127);
    this.props.submit(this.props.selected);
    // this.toggle();
    // this.props.clear(this.props.match.id);
  }

  renderMatchSummary(match) {
    return (
      <div className="match-summary">
        {/* <div className="match-schedule">
          {
            match.m_s_name || match.m_f_name ?
            <div className="match-schedule-step">{ match.m_s_name ? match.m_s_name : match.m_f_name }</div>
            :
            ''
          }
          <div className="match-schedule-step">淘汰赛</div>
          <div className="match-schedule-step">决赛</div>
        </div> */}
        <div className="match-teams">
          <div className="match-team home-team">
            <img
              src={
                match.h_logo
                  ? match.h_logo
                  : require('@/img/public/icon/redteam@2x.png')
              }
            />
            <p>{match.h_s_name ? match.h_s_name : match.h_f_name}</p>
          </div>
          <div className="match-team guest-team">
            <img
              src={
                match.g_logo
                  ? match.g_logo
                  : require('@/img/public/icon/blueteam@2x.png')
              }
            />
            <p>{match.g_s_name ? match.g_s_name : match.g_f_name}</p>
          </div>
        </div>
        <div className="match-status">
          <p>{match.week + ' ' + match.num + ' ' + match.time}</p>
          {match.weather ? (
            <div>
              <p>{match.weather.split(',')[1]}</p>
              <p>{match.weather.split(',')[0]}</p>
            </div>
          ) : (
            <p>暂无天气信息</p>
          )}
        </div>
      </div>
    );
  }

  toggleScoreFormat() {
    const scoreFormat = this.scoreFormat === 'table' ? 'slider' : 'table';
    this.setState({ scoreFormat });
  }

  renderWDF(match) {
    const headerElement = (
      <div className="bet-tab">
        <span>胜平负</span>
        {match.status_wdf === 1 ? <span className="single-icon" /> : ''}
      </div>
    );
    return (
      <ToggleComponent header={ headerElement } klass={ ['bet-item'] }>
        <WDFContainer match={ match } />
      </ToggleComponent>
    );
  }

  renderConcede(match) {
    const headerElement = (
      <div className="bet-tab">
        <span>
          让球胜平负 让球{' '}
          {match.wdf[3] / 1 > 0 ? `+${match.wdf[3]}` : match.wdf[3]}
        </span>
        {match.status_letWdf === 1 ? <span className="single-icon" /> : ''}
      </div>
    );
    return (
      <ToggleComponent header={ headerElement }>
        <WDFConcedeContainer match={ match } />
      </ToggleComponent>
    );
  }

  renderScore(match) {
    const headerElement = <div className="bet-tab">全场比分</div>;
    return (
      <ToggleComponent
        header={ headerElement }
        klass={ ['bet-item', 'score-section'] }
      >
        <div>
          <div
            className="bet-desc"
            style={ {
              display: this.state.scoreFormat === 'table' ? 'block' : 'block'
            } }
          >
            {this.renderScoreTable(match)}
          </div>
          {/* <div className="bet-desc" style={{ 'display': this.state.scoreFormat === 'slider' ? 'block' : 'none'}}>
            { this.renderScoreSlider(match) }
          </div> */}
        </div>
      </ToggleComponent>
    );
  }

  renderScoreTable(match) {
    return (
      <div className="bet-desc">
        <ScoreContainer match={ match } />
      </div>
    );
  }

  renderScoreSlider(match) {
    return (
      <div className="bet-desc">
        <ScoreSliderComponent match={ match } />
      </div>
    );
  }

  renderHalfWDF(match) {
    const headerElement = <div className="bet-tab">半全场胜平负</div>;
    return (
      <ToggleComponent
        header={ headerElement }
        klass={ ['bet-item', 'halfwdf-section'] }
      >
        <div className="bet-desc">
          <HalfContainer match={ match } />
        </div>
      </ToggleComponent>
    );
  }

  renderGoal(match) {
    const headerElement = <div className="bet-tab">总进球数</div>;
    return (
      <ToggleComponent
        header={ headerElement }
        klass={ ['bet-item', 'goal-section'] }
      >
        <div className="bet-desc">
          <GoalContainer match={ match } klass={ ['bet-table'] } />
        </div>
      </ToggleComponent>
    );
  }

  render() {
    const match = this.props.match || {};
    return (
      <PopUpComponent ref={ page => (this.popup = page) }>
        {_.isEmpty(match) ? (
          <div />
        ) : (
          <div className="popPage match-detail-page">
            <div
              className="main"
              style={ {
                height: window.innerHeight
              } }
            >
              <div className="selBetTab operate-box">
                <div className="match-header">
                  <span className="back-btn" onClick={ this.toggle.bind(this) }>
                    <img
                      src={ require('@/img/jcz/icon_detail_back@2x.png') }
                      className="detail-back"
                    />
                  </span>
                  <div className="match-date">
                    <h4>选择投注</h4>
                    <span>投注截至时间</span>
                    <time>{match.saleDate + ' ' + match.saleEndTime}</time>
                  </div>
                </div>
                {this.renderMatchSummary(match)}
                {this.renderWDF(match)}
                {this.renderConcede(match)}
                {this.renderScore(match)}
                {this.renderHalfWDF(match)}
                {this.renderGoal(match)}
              </div>
            </div>
            <footer className="popFooter">
              <div
                className="del"
                onClick={ this.props.clear.bind(this, match.id) }
              >
                <p>
                  <img src={ require('@/img/public/icon_del@2x.png') } />
                </p>
                <p>删除</p>
              </div>
              <div className="num-basket" onClick={ this.submit.bind(this) }>
                加入号码篮<sup>{this.props.selected.length}</sup>
              </div>
            </footer>
          </div>
        )}
      </PopUpComponent>
    );
  }
}

MatchDetailPage.propTypes = {
  match: PropTypes.object.isRequired
};

const matchDetailSelector = state => state.footballMix.detailMatchId;
const matchsSelector = state => state.football.data;
const selectSelector = state => state.footballMixSingleData;

const getMatchDetail = createSelector(
  [matchDetailSelector, matchsSelector],
  (matchId, matchs) => {
    return matchs.filter(m => m.id === matchId)[0] || {};
  }
);

const getCurrentSelected = createSelector(
  [matchDetailSelector, selectSelector],
  (id, selected) => {
    return selected.filter(i => i.id === id);
  }
);

const mapStateToProps = state => {
  return {
    match: getMatchDetail(state),
    show: state.footballMix.showMatchDetail,
    selected: getCurrentSelected(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle(matchId) {
      dispatch(toggleMatchDetail(matchId));
    },
    onSelect: data => {
      dispatch(toggleBetting(data));
    },
    clear(id) {
      analytics.send(21126);
      dispatch(singleBettingClear(id));
      dispatch(removeBettingMatch('mix', id));
    },
    submit(data) {
      dispatch(singleBettingSubmit(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(MatchDetailPage);
