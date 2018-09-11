import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WDFMixListComponent from './mix.jsx';
import WDFListComponent from '../wdf.jsx';
import WDFConcedeListComponent from '../wdf-concede.jsx';
import GoalListComponent from '../goal.jsx';
import ScoreListComponent from '../score.jsx';
import HalfListComponent from '../half.jsx';
import MatchDetailPage from './match.jsx';
import { MODES } from '../../constants';
import equal from 'deep-equal';
import { connect } from 'react-redux';
import alert from '@/services/alert';
import { getNextNormalSaleLottery } from '../../utils/football';
import { changeMode } from '../../actions/mix';
import EmptyComponent from '../../components/empty.jsx';

class Content extends PureComponent {
  viewMatchDetail(matchId) {
    this.detailPage.getWrappedInstance().open(matchId);
  }

  // shouldComponentUpdate(nextProps) {
  //   return (
  //     !equal(nextProps.data, this.props.data) ||
  //     equal(nextProps.selected, this.props.selected)
  //   );
  // }

  render() {
    const { mode, data } = this.props;
    if (!data.length) return <EmptyComponent />;
    if (mode === 'mi') {
      return (
        <div>
          <div className="mix">
            {data.map(d => {
              return (
                <WDFMixListComponent
                  onViewDetail={ this.viewMatchDetail.bind(this) }
                  date={ d.date }
                  key={ d.date }
                  matchs={ d.matchs }
                />
              );
            })}
          </div>
          <div>
            <MatchDetailPage ref={ page => (this.detailPage = page) } />
          </div>
        </div>
      );
    } else if (mode === 'wdf') {
      return (
        <div className="wdf-filter-page singleWin">
          {data.map(d => {
            return (
              <WDFListComponent date={ d.date } key={ d.date }
                matchs={ d.matchs } />
            );
          })}
        </div>
      );
    } else if (mode === 'let_wdf') {
      return (
        <div className="concede-filter-page singleWin">
          {data.map(d => {
            return (
              <WDFConcedeListComponent
                date={ d.date }
                key={ d.date }
                matchs={ d.matchs }
              />
            );
          })}
        </div>
      );
    } else if (mode === 'goal') {
      return (
        <div className="allGoals">
          {data.map(d => {
            return (
              <GoalListComponent date={ d.date } key={ d.date }
                matchs={ d.matchs } />
            );
          })}
        </div>
      );
    } else if (mode === 'score') {
      return (
        <div className="allScore">
          {data.map(d => {
            return (
              <ScoreListComponent
                date={ d.date }
                key={ d.date }
                matchs={ d.matchs }
              />
            );
          })}
        </div>
      );
    } else if (mode === 'hf') {
      return (
        <div className="semi">
          {data.map(d => {
            return (
              <HalfListComponent date={ d.date } key={ d.date }
                matchs={ d.matchs } />
            );
          })}
        </div>
      );
    }
  }
}

Content.propTypes = {
  mode: PropTypes.oneOf(MODES.map(m => m.name)).isRequired,
  data: PropTypes.array.isRequired
};

class MixPageContent extends PureComponent {
  componentDidMount() {
    const { saleStatus } = this.props;
    if (!saleStatus.mi) {
      const nextMode = getNextNormalSaleLottery('mi', this.props.rules);
      if (nextMode) this.props.changeMode(nextMode);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mode, saleStatus } = nextProps;
    if (mode !== this.props.mode) {
      if (!saleStatus[mode]) {
        alert.alert('当前玩法暂停销售！').then(() => {
          const nextMode = getNextNormalSaleLottery(mode, this.props.rules);
          if (nextMode) this.props.changeMode(nextMode);
        });
      }
    }
  }

  render() {
    const { selectedData, mode, saleStatus, data } = this.props;
    if (!saleStatus[mode]) return <div />;
    return (
      <div key={ mode } className={ `${mode}-mode-page ${mode}` }>
        <Content mode={ mode } data={ data } />
      </div>
    );
  }
}

MixPageContent.propTypes = {
  data: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(MODES.map(m => m.name)).isRequired,
  saleStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    mode: state.footballMix.mode,
    saleStatus: state.footballRules.saleStatus,
    rules: state.footballRules.rules
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeMode(mode) {
      dispatch(changeMode(mode));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MixPageContent);
