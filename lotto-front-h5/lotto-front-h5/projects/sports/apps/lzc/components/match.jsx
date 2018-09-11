import React from 'react';
import { connect } from 'react-redux';
import { bettingToggle, courageToggle } from '../actions/betting';
import cx from 'classnames';
import alert from '@/services/alert';
import toast from '@/services/toast';

const CourageButton = props => {
  const toggle = id => {
    if (!props.bettings[id] || props.bettings[id].length === 0) {
      return toast.toast('请选择至少选择一个彩果后再选胆');
    } else if (props.courage.indexOf(id) < 0 && props.courage.length >= 8) {
      return alert.alert('最多只能设置8个胆');
    } else if (Object.keys(props.bettings).length < 10) {
      return toast.toast('选择场次必须大于9场才能设胆');
    }
    return props.toggle(props.id);
  };
  return (
    <div
      className={ cx('match-betting-courege-button', {
        selected: props.courage.indexOf(props.id) > -1
      }) }
      onClick={ () => toggle(props.id) }
    >
      胆
    </div>
  );
};

const mapCourageStateToProps = state => {
  return {
    courage: state.bettingCourage,
    bettings: state.bettings
  };
};

const mapCourageDispatchToProps = dispatch => {
  return {
    toggle(id) {
      dispatch(courageToggle(id));
    }
  };
};

const Courage = connect(
  mapCourageStateToProps,
  mapCourageDispatchToProps,
  null,
  { pure: true }
)(CourageButton);

const MatchDetail = props => {
  return (
    <div className="match-detail">
      <h4>{props.m_s_name ? props.m_s_name : props.m_f_name}</h4>
      <span>{('0' + props.order).slice(-2)}</span>
      <span>
        {props.saleEndDate.replace(/-/g, '/').slice(5) +
          ' ' +
          props.saleEndTime}
      </span>
    </div>
  );
};

const MatchBetting = props => {
  const { match, toggle } = props;
  const selected = props.selected || [];
  return (
    <div className="match-betting-container">
      <div
        className={ cx('betting-cell win', {
          selected: selected.indexOf(3) > -1
        }) }
        onClick={ () => toggle(match.id, 3) }
      >
        <sup>{match.h_order ? `[${match.h_order.split(',')[0]}]` : ''}</sup>
        <h4>{match.h_s_name ? match.h_s_name : match.h_f_name}</h4>
        <span>
          胜 <em>{match.spWin ? match.spWin : '-'}</em>
        </span>
      </div>
      <div
        className={ cx('betting-cell draw', {
          selected: selected.indexOf(1) > -1
        }) }
        onClick={ () => toggle(match.id, 1) }
      >
        <h4>平局</h4>
        <span>
          <em>{match.spDraw ? match.spDraw : '-'}</em>
        </span>
      </div>
      <div
        className={ cx('betting-cell fail', {
          selected: selected.indexOf(0) > -1
        }) }
        onClick={ () => toggle(match.id, 0) }
      >
        <sup>{match.g_order ? `[${match.g_order.split(',')[0]}]` : ''}</sup>
        <h4>{match.g_s_name ? match.g_s_name : match.g_f_name}</h4>
        <span>
          胜 <em>{match.spFail ? match.spFail : '-'}</em>
        </span>
      </div>
    </div>
  );
};

const Match = props => {
  return (
    <div className="match">
      <MatchDetail { ...props.match } order={ props.order } />
      <div className="match-betting-box">
        <MatchBetting { ...props } />
        {props.showCourage ? <Courage id={ props.match.id } /> : ''}
      </div>
    </div>
  );
};

const mapStateToProps = (_, initProps) => {
  const id = initProps.match.id;
  return state => {
    const { bettings } = state;
    return {
      selected: bettings[id]
    };
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle(id, value) {
      dispatch(bettingToggle(id, value));
    }
  };
};

const MatchComponent = connect(mapStateToProps, mapDispatchToProps, null, {
  pure: true
})(Match);

const MatchListComponent = props => {
  return (
    <div className="match-list">
      {props.matchs.map((m, index) => {
        return (
          <MatchComponent
            key={ m.id }
            order={ index + 1 }
            match={ m }
            showCourage={ props.showCourage }
          />
        );
      })}
    </div>
  );
};

export default MatchListComponent;
