import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const WDFComponent = props => {
  const selected = props.selected || [];
  const { match } = props;
  const onSelect = data => {
    props.onSelect(Object.assign({}, data, { title: '胜平负', type: 'wdf' }));
  };
  if (match.status_wdf === 4 || (props.single && match.status_wdf !== 1)) {
    return <div className="grid-nosell">未开售</div>;
  }
  return (
    <div className="detail-row">
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(0) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.wdf[0],
            index: 0,
            id: match.id,
            _id: match.id + ':wdf:0',
            label: `胜`,
            value: 3
          });
        } }
      >
        {props.shortened ? (
          match.wdf[0]
        ) : (
          <div>
            <p>
              <sup className="sup-l">
                {match.h_order ? `[${match.h_order.split(',')[0]}]` : ''}
              </sup>
              {match.h_s_name ? match.h_s_name : match.h_f_name}
            </p>
            <p>
              <span>胜</span> <span> {match.wdf[0]}</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(1) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.wdf[1],
            index: 1,
            id: match.id,
            _id: match.id + ':wdf:1',
            label: `平`,
            value: 1
          });
        } }
      >
        {props.shortened ? (
          match.wdf[1]
        ) : (
          <div>
            <p className="draw">平局</p>
            <p>
              <span>{match.wdf[1]}</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(2) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.wdf[2],
            index: 2,
            id: match.id,
            _id: match.id + ':wdf:2',
            label: `负`,
            value: 0
          });
        } }
      >
        {props.shortened ? (
          match.wdf[2]
        ) : (
          <div>
            <p>
              <sup className="sup-r">
                {match.g_order ? `[${match.g_order.split(',')[0]}]` : ''}
              </sup>
              {match.g_s_name ? match.g_s_name : match.g_f_name}
            </p>
            <p>
              <span>胜</span> <span>{match.wdf[2]}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

WDFComponent.propTypes = {
  match: PropTypes.object.isRequired,
  onSelect: PropTypes.func
};

export default WDFComponent;
