import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const ListComponent = props => {
  const selected = props.selected || [];
  const { match } = props;
  console.log(match);
  const onSelect = data => {
    props.onSelect(Object.assign({}, data, { title: '列表', type: 'list' }));
  };

  return (
    <div className="detail-row">
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(0) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.g_f_name,
            index: 0,
            id: match.id,
            _id: match.id + ':wdf:0',
            label: `胜`,
            value: 3
          });
        } }
      >
        {props.shortened ? (
          match.g_f_name
        ) : (
          <div>
            <p>{match.h_f_name ? match.h_f_name : match.h_f_name}</p>
            <p>
              <span>{match.m_id}</span> <span> {match.g_f_name}</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(2) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.g_f_name,
            index: 2,
            id: match.id,
            _id: match.id + ':wdf:2',
            label: `负`,
            value: 0
          });
        } }
      >
        {props.shortened ? (
          match.g_f_name
        ) : (
          <div>
            <p>
              <sup className="sup-r">{match.m_f_name}</sup>
              {match.m_f_name ? match.m_f_name : match.g_f_name}
            </p>
            <p>
              <span>胜</span> <span>{match.m_f_name}</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(1) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.g_f_name,
            index: 1,
            id: match.id,
            _id: match.id + ':wdf:1',
            label: `平`,
            value: 1
          });
        } }
      >
        {props.shortened ? (
          match.g_f_name
        ) : (
          <div>
            <p className="draw">平局</p>
            <p>
              <span>{match.h_f_name}</span>
            </p>
          </div>
        )}
      </div>

      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(2) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.g_f_name,
            index: 2,
            id: match.id,
            _id: match.id + ':wdf:2',
            label: `负`,
            value: 0
          });
        } }
      >
        {props.shortened ? (
          match.g_f_name
        ) : (
          <div>
            <p>
              <sup className="sup-r">{match.m_f_name}</sup>
              {match.m_f_name ? match.m_f_name : match.g_f_name}
            </p>
            <p>
              <span>胜</span> <span>{match.m_f_name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ListComponent.propTypes = {
  match: PropTypes.object.isRequired,
  selected: PropTypes.func
};

export default ListComponent;
