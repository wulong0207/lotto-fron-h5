import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from './list';
import { connect } from 'react-redux';
import cx from 'classnames';
import { toggleBetting } from '../actions/betting';

const MatchComponent = props => {
  const selected = props.selected || [];
  const onSelect = data => {
    props.onSelect(
      Object.assign({}, data, { title: '2选1', category: 'alternative' })
    );
  };
  return (
    <div className="jjc-list">
      <div className="match">
        <h4>{props.m_s_name ? props.m_s_name : props.m_f_name}</h4>
        <p>{props.num}</p>
        <p>
          <span>{props.saleEndTime}截止</span>
        </p>
      </div>
      <div className="match-detail">
        <div>
          <div
            className={ cx('detail-grid', {
              'grid-sel': selected.indexOf(0) > -1
            }) }
            onClick={ e => {
              onSelect({
                sp: props.wdf[3] / 1 === 1 ? props.wdf[4] : props.wdf[0],
                index: 0,
                id: props.id,
                _id: props.id + ':alternative:0',
                label: props.wdf[3] / 1 === 1 ? '主不败' : '主胜',
                value: 3,
                type: props.wdf[3] / 1 === 1 ? 'let_wdf' : 'wdf'
              });
            } }
          >
            <p>
              <sup className="sup-l">
                {props.h_order ? `[${props.h_order.split(',')[0]}]` : ''}
              </sup>
              {props.h_s_name ? props.h_s_name : props.h_f_name}
            </p>
            {props.wdf[3] / 1 === 1 ? (
              <p>
                <span>主不败</span> <span>{props.wdf[4]}</span>
              </p>
            ) : (
              <p>
                <span>主胜</span> <span>{props.wdf[0]}</span>
              </p>
            )}
          </div>
          <div
            className={ cx('detail-grid', {
              'grid-sel': selected.indexOf(1) > -1
            }) }
            onClick={ e => {
              onSelect({
                sp: props.wdf[3] / 1 === 1 ? props.wdf[2] : props.wdf[6],
                index: 1,
                id: props.id,
                _id: props.id + ':alternative:1',
                label: props.wdf[3] / 1 === 1 ? '客胜' : '客不败',
                value: 0,
                type: props.wdf[3] / 1 === 1 ? 'wdf' : 'let_wdf'
              });
            } }
          >
            <p>
              <sup className="sup-r">
                {props.g_order ? `[${props.g_order.split(',')[0]}]` : ''}
              </sup>
              {props.g_s_name ? props.g_s_name : props.g_f_name}
            </p>
            {props.wdf[3] / 1 === 1 ? (
              <p>
                <span>客胜</span> <span>{props.wdf[2]}</span>
              </p>
            ) : (
              <p>
                <span>客不败</span> <span>{props.wdf[6]}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (_, initialProps) => state => {
  const { id } = initialProps;
  return {
    selected: state.footballBettingSelected.alternative[id]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelect(data) {
      dispatch(toggleBetting(data));
    }
  };
};

const Match = connect(mapStateToProps, mapDispatchToProps)(MatchComponent);

const Header = props => {
  return (
    <div className="date">
      <span>{props.date + ' ' + props.week}</span>
      <span>{props.num}场比赛可投注</span>
    </div>
  );
};

const AlternativeListComponent = props => {
  const headerElement = (
    <Header
      date={ props.date }
      week={ props.matchs[0].week }
      num={ props.matchs.length }
    />
  );
  return (
    <FootballPageList header={ headerElement }>
      <section className="jjc-con">
        {props.matchs.map(m => {
          return <Match key={ m.id } { ...m } />;
        })}
      </section>
    </FootballPageList>
  );
};

AlternativeListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default AlternativeListComponent;
