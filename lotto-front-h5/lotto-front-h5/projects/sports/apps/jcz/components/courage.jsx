import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import cx from 'classnames';
import { groupArrayByKey } from '../utils';
import {
  toggleCourage,
  removeBettingMatch,
  clearBettings,
  setBettingGGtype
} from '../actions/betting';
import Modal from './modal.jsx';
import { getEndSaleTimeStamp } from '../utils/football';
import Alert from '@/services/message';
import { MODES } from '../constants';
import dateFormat from 'dateformat';
import analytics from '@/services/analytics';

class FootballCourageComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.leftTime = props.leftTime;
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.leftTime !== this.props.leftTime) {
      this.leftTime = nextProps.leftTime;
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.leftTime--;
    if (this.leftTime === 0) {
      clearInterval(this.timer);
    }
  }

  timeout() {
    console.log('timeout');
  }

  toggle() {
    this.pop.toggle();
    this.forceUpdate();
  }

  setTypes(number, matchId) {
    const { courage, name, ggType } = this.props.betting;
    const types = ggType.filter(i => parseInt(i.split('*')[0]) > number);
    this.props.setBettingGGtype(name, types);
    this.props.toggleCourage(name, matchId);
  }

  toggleCourage(matchId, disabled) {
    if (disabled) return undefined;
    const { courage, name, ggType } = this.props.betting;
    if (!ggType.length) return this.props.toggleCourage(name, matchId);
    // 添加胆码时，判断过关条件
    if (courage.indexOf(matchId) < 0) {
      ggType.sort((a, b) => a.split('*')[0] - b.split('*')[0]);
      const smallestGGnumber = ggType[0].split('*')[0] / 1;
      if (courage.length + 1 >= smallestGGnumber) {
        const content = (
          <div>
            <p>你选择的过关方式中包含了{smallestGGnumber}串1</p>
            <p>胆码最多只可以设置{smallestGGnumber - 1}场比赛</p>
          </div>
        );
        const btnTxt = ['取消', `去掉${smallestGGnumber}串1过关方式`];
        const btnFn = [
          null,
          this.setTypes.bind(this, courage.length + 1, matchId)
        ];
        return Alert.alert({ children: content, btnTxt, btnFn });
      }
    }
    this.props.toggleCourage(name, matchId);
  }

  clear() {
    Alert.pconfirm({ msg: '你确认清空列表内容' })
      .then(() => {
        this.pop.toggle();
        return this.props.clear(this.props.betting.name);
      })
      .catch(() => {});
  }

  remove(name, matchId) {
    Alert.pconfirm({ msg: '你确认删除本场赛事' })
      .then(() => {
        const selected = this.props.betting.selected;
        const matchs = groupArrayByKey(selected, 'id');
        if (matchs.length === 1) this.pop.toggle();
        this.props.remove(name, matchId);
      })
      .catch(() => {});
  }

  renderBetting(betting) {
    const data = betting.data.sort((a, b) => a.index - b.index);
    const dataTable = _.chunk(data, 4);
    return (
      <div className="data-item" key={ betting.type }>
        <div>
          <span>{data[0].title}</span>
        </div>
        <div>
          {dataTable.map((row, index) => {
            return (
              <p key={ index }>
                {row.map((cell, idx) => {
                  return <span key={ idx }>{cell.label + '@' + cell.sp}</span>;
                })}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  renderMatch(match, len, max) {
    const data = match.match;
    const bettings = groupArrayByKey(match.data, 'type');
    bettings.sort(
      (a, b) =>
        MODES.filter(m => m.name === a.type)[0].sort -
        MODES.filter(m => m.name === b.type)[0].sort
    );
    const { courage, ggType } = this.props.betting;
    const maxSelectedGGType =
      ggType.length && ggType.length === 1
        ? parseInt(ggType[0].split('*')[0])
        : 0;
    const disabled =
      (courage.length >= len - 1 ||
        courage.length >= max - 1 ||
        (ggType.length === 1 && courage.length >= maxSelectedGGType - 1)) &&
      courage.indexOf(match.id) < 0;
    return (
      <div className="area-content" key={ data.id }>
        <section className="area-data">
          <section className="title-sub">
            <div onClick={ this.toggleCourage.bind(this, match.id, disabled) }>
              <span
                className={ cx(
                  courage.indexOf(match.id) < 0 ? 'not-selected' : 'selected',
                  { disabled: disabled }
                ) }
              />
              <span className="set-text">设胆</span>
            </div>
            <div>
              {`${data.week} ${data.num} ${
                data.m_s_name ? data.m_s_name : data.m_f_name
              } ${data.h_s_name ? data.h_s_name : data.h_f_name} vs ${
                data.g_s_name ? data.g_s_name : data.g_f_name
              }`}
              <span
                className="close"
                onClick={ this.remove.bind(
                  this,
                  this.props.betting.name,
                  match.id
                ) }
              />
            </div>
          </section>
          <section className="data-list">
            {bettings.map(b => this.renderBetting(b))}
          </section>
        </section>
      </div>
    );
  }

  renderContent() {
    const { betting } = this.props;
    const { selected, maxGGTypes } = betting;
    let matchs = groupArrayByKey(selected, 'id').map(m => {
      return Object.assign({}, m, {
        match: this.props.data.filter(d => d.id === m.id)[0]
      });
    });
    matchs.sort((a, b) => parseInt(a.match.num) - parseInt(b.match.num));
    return (
      <section className="courage-area">
        <div className="area-header" />
        <div className="area-extender">
          {matchs.map(m => this.renderMatch(m, matchs.length, maxGGTypes))}
          <div className="area-footer" />
        </div>
      </section>
    );
  }

  closeHandle() {
    const { courage } = this.props.betting;
    analytics.send(courage.map(() => 211309));
  }

  render() {
    let endTime = '';
    const selected = this.props.betting.selected.sort(
      (a, b) => getEndSaleTimeStamp(a.match) - getEndSaleTimeStamp(b.match)
    );
    if (selected.length) {
      const firstEndsaleMatch = selected[0].match;
      endTime = `${firstEndsaleMatch.saleDate} ${
        firstEndsaleMatch.saleEndTime
      }`;
    }
    return (
      <Modal
        ref={ pop => (this.pop = pop) }
        klass={ ['football-courage-popup'] }
        modal={ true }
        onClose={ this.closeHandle.bind(this) }
      >
        <div className="set-courage">
          <div className="set-courage-layer">
            <div className="courage">
              <div className="bet-endtime">
                <div className="endtime">
                  投注截止时间:
                  <span>
                    {dateFormat(
                      this.props.latestEndSaleDateTime,
                      'yyyy-mm-dd HH:MM:ss'
                    )}
                  </span>
                </div>
              </div>
              <section className="oper">
                <div onClick={ this.toggle.bind(this) }>
                  继续选比赛<span>
                    （已选{
                      groupArrayByKey(this.props.betting.selected, 'id').length
                    }场）
                  </span>
                </div>
                <div onClick={ this.clear.bind(this) }>清空列表</div>
              </section>
              {this.renderContent()}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

FootballCourageComponent.propTypes = {
  betting: PropTypes.object.isRequired,
  leftTime: PropTypes.number
};

const mapStateToProps = state => {
  return {
    data: state.football.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleCourage(name, matchId) {
      dispatch(toggleCourage(name, matchId));
    },
    remove(name, matchId) {
      dispatch(removeBettingMatch(name, matchId));
    },
    clear(name) {
      dispatch(clearBettings(name));
    },
    setBettingGGtype(name, ggType) {
      dispatch(setBettingGGtype(name, ggType));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(FootballCourageComponent);
