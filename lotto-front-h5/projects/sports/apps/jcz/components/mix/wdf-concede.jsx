import React from 'react';
import cx from 'classnames';

const WDFConcedeComponent = props => {
  const { match, selected } = props;
  const onSelect = data => {
    props.onSelect(
      Object.assign({}, data, { title: '让球胜平负', type: 'let_wdf' })
    );
  };
  if (match.status_letWdf === 4) {
    return <div className="not-sale">未开售</div>;
  }
  return (
    <div className="bet-desc">
      <div className="desc-list">
        <div
          className={ cx('detail-grid', {
            'grid-sel': selected.indexOf(4) > -1
          }) }
          onClick={ e => {
            onSelect({
              sp: match.wdf[4],
              index: 4,
              id: match.id,
              _id: match.id + ':let_wdf:4',
              label: '胜',
              value: 3
            });
          } }
        >
          <span>{match.h_s_name ? match.h_s_name : match.h_f_name} 胜</span>
          <span>{match.wdf[4]}</span>
        </div>
        <div
          className={ cx('detail-grid', {
            'grid-sel': selected.indexOf(5) > -1
          }) }
          onClick={ e => {
            onSelect({
              sp: match.wdf[5],
              index: 5,
              id: match.id,
              _id: match.id + ':let_wdf:5',
              label: '平',
              value: 1
            });
          } }
        >
          <span>平局</span>
          <span>{match.wdf[5]}</span>
        </div>
        <div
          className={ cx('detail-grid', {
            'grid-sel': selected.indexOf(6) > -1
          }) }
          onClick={ e => {
            onSelect({
              sp: match.wdf[6],
              index: 6,
              id: match.id,
              _id: match.id + ':let_wdf:6',
              label: '负',
              value: 0
            });
          } }
        >
          <span>{match.g_s_name ? match.g_s_name : match.g_f_name} 胜</span>
          <span>{match.wdf[6]}</span>
        </div>
      </div>
    </div>
  );
};

export default WDFConcedeComponent;
