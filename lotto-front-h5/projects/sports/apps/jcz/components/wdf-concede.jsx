import React from 'react';
import cx from 'classnames';

const WDFConcedeComponent = props => {
  const selected = props.selected || [];
  const { match } = props;
  const onSelect = data => {
    props.onSelect(
      Object.assign({}, data, {
        title: `让球胜平负[${match.wdf[3] / 1 > 0 ? '+' : ''}${match.wdf[3]}]`,
        type: 'let_wdf'
      })
    );
  };
  if (
    match.status_letWdf === 4 ||
    (props.single && match.status_letWdf !== 1)
  ) {
    return <div className="grid-nosell">未开售</div>;
  }
  return (
    <div className="detail-row">
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(4) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.wdf[4],
            index: 4,
            id: match.id,
            _id: match.id + ':let_wdf:4',
            label: `胜`,
            value: 3
          });
        } }
      >
        {props.shortened ? (
          <div>
            <sup
              className={ cx(
                'sup-l',
                match.wdf[3] / 1 > 0 ? 'sub-add' : 'sub-sub'
              ) }
            >
              {match.wdf[3] / 1 > 0 ? '+' + match.wdf[3] : match.wdf[3]}
            </sup>
            {match.wdf[4]}
          </div>
        ) : (
          <div>
            <p>
              <sup className="sup-l">
                {match.h_order ? `[${match.h_order.split(',')[0]}]` : ''}
              </sup>
              {match.h_s_name ? match.h_s_name : match.h_f_name}
              <sub className={ match.wdf[3] / 1 > 0 ? 'sub-add' : 'sub-sub' }>
                {match.wdf[3] / 1 > 0 ? '+' + match.wdf[3] : match.wdf[3]}
              </sub>
            </p>
            <p>
              <span>胜</span> <span> {match.wdf[4]}</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(5) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.wdf[5],
            index: 5,
            id: match.id,
            _id: match.id + ':let_wdf:5',
            label: `平`,
            value: 1
          });
        } }
      >
        {props.shortened ? (
          match.wdf[5]
        ) : (
          <div>
            <p className="draw">平局</p>
            <p>
              <span>{match.wdf[5]}</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={ cx('detail-grid', { 'grid-sel': selected.indexOf(6) > -1 }) }
        onClick={ e => {
          onSelect({
            sp: match.wdf[6],
            index: 6,
            id: match.id,
            _id: match.id + ':let_wdf:6',
            label: `负`,
            value: 0
          });
        } }
      >
        {props.shortened ? (
          match.wdf[6]
        ) : (
          <div>
            <p>
              <sup className="sup-r">
                {match.g_order ? `[${match.g_order.split(',')[0]}]` : ''}
              </sup>
              {match.g_s_name ? match.g_s_name : match.g_f_name}
            </p>
            <p>
              <span>胜</span> <span>{match.wdf[6]}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WDFConcedeComponent;
