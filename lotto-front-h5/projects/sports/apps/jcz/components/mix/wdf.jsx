import React from 'react';
import cx from 'classnames';
import analytics from '@/services/analytics';

const WDFComponent = props => {
  const { match, selected } = props;
  const onSelect = data => {
    analytics.send(21121)
    props.onSelect(Object.assign({}, data, { title: '胜平负', type: 'wdf' }));
  };
  if (match.status_wdf === 4) {
    return <div className="not-sale">未开售</div>;
  }
  return (
    <div className="bet-desc">
      <div className="desc-list">
        <div
          className={ cx('detail-grid', {
            'grid-sel': selected.indexOf(0) > -1
          }) }
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
          <span>{match.h_s_name ? match.h_s_name : match.h_f_name} 胜</span>
          <span>{match.wdf[0]}</span>
        </div>
        <div
          className={ cx('detail-grid', {
            'grid-sel': selected.indexOf(1) > -1
          }) }
          onClick={ e => {
            onSelect({
              sp: match.wdf[1],
              index: 1,
              id: match.id,
              _id: match.id + ':wdf:1',
              label: '平',
              value: 1
            });
          } }
        >
          <span>平局</span>
          <span>{match.wdf[1]}</span>
        </div>
        <div
          className={ cx('detail-grid', {
            'grid-sel': selected.indexOf(2) > -1
          }) }
          onClick={ e => {
            onSelect({
              sp: match.wdf[2],
              index: 2,
              id: match.id,
              _id: match.id + ':wdf:2',
              label: '负',
              value: 0
            });
          } }
        >
          <span>{match.g_s_name ? match.g_s_name : match.g_f_name} 胜</span>
          <span>{match.wdf[2]}</span>
        </div>
      </div>
    </div>
  );
};

export default WDFComponent;
