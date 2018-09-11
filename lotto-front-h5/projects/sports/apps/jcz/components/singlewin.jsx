import React from 'react';
import PropTypes from 'prop-types';
import FootballPageList from './list';
import { connect } from 'react-redux';
import cx from 'classnames';
import { toggleBetting } from '../actions/betting';

const MatchComponent = props => {
  const selected = props.selected || [];
  const onSelect = data => {
    props.onSelect(Object.assign({}, data, { title: '单场致胜' }));
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
                sp: props.wdf[0],
                index: 0,
                id: props.id,
                _id: props.id + ':singlewin:0',
                label: '胜',
                value: 3,
                type: 'wdf'
              });
            } }
          >
            <p>
              <sup className="sup-l">
                {props.h_order ? `[${props.h_order.split(',')[0]}]` : ''}
              </sup>
              {props.h_s_name ? props.h_s_name : props.h_f_name}
            </p>
            <p>
              <span>胜</span> <span> {props.wdf[0]}</span>
            </p>
          </div>
          <div
            className={ cx('detail-grid', {
              'grid-sel': selected.indexOf(1) > -1
            }) }
            onClick={ e => {
              onSelect({
                sp: props.wdf[1],
                index: 1,
                id: props.id,
                _id: props.id + ':singlewin:1',
                label: '平',
                value: 1,
                type: 'wdf'
              });
            } }
          >
            <p className="draw">平局</p>
            <p>
              <span>{props.wdf[1]}</span>
            </p>
          </div>
          <div
            className={ cx('detail-grid', {
              'grid-sel': selected.indexOf(2) > -1
            }) }
            onClick={ e => {
              onSelect({
                sp: props.wdf[2],
                index: 2,
                id: props.id,
                _id: props.id + ':singlewin:2',
                label: '负',
                value: 0,
                type: 'wdf'
              });
            } }
          >
            <p>
              <sup className="sup-r">
                {props.g_order ? `[${props.g_order.split(',')[0]}]` : ''}
              </sup>
              {props.g_s_name ? props.g_s_name : props.g_f_name}
            </p>
            <p>
              <span>胜</span> <span>{props.wdf[2]}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (_, initialProps) => state => {
  const { id } = initialProps;
  return {
    selected: state.footballBettingSelected.singlewin[id]
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

// 比赛胜平负列表组件
const SinglewinListComponent = props => {
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

SinglewinListComponent.propTypes = {
  date: PropTypes.string.isRequired,
  matchs: PropTypes.array.isRequired
};

export default SinglewinListComponent;
