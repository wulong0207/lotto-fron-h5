import React from 'react';
import cx from 'classnames';
import _ from 'lodash';

const mapValueToLabel = value => {
  return value
    .split('')
    .map(i => {
      let t;
      const number = parseInt(i);
      if (number === 0) {
        t = '负';
      } else if (number === 1) {
        t = '平';
      } else if (number === 3) {
        t = '胜';
      }
      return t;
    })
    .join('');
};

const rowLength = 3;
const halfDFWArr = ['33', '31', '30', '13', '11', '10', '03', '01', '00'];
const halfData = _.chunk(halfDFWArr, rowLength);

const HalfWDFComponent = props => {
  const selected = props.selected || [];
  const onSelect = data => {
    props.onSelect(Object.assign({}, data, { title: '半全场', type: 'hf' }));
  };
  const { match } = props;
  if (match.status_hfWdf === 4) {
    return <div className="grid-nosell">未开售</div>;
  }
  return (
    <div className={ cx('halfwdf-table-component', props.klass) }>
      {halfData.map((row, index) => {
        return (
          <div key={ index } className="table-row hf-table-row">
            {row.map((cell, idx) => {
              return (
                <div
                  className={ cx('detail-grid', {
                    'grid-sel': selected.indexOf(index * rowLength + idx) > -1
                  }) }
                  key={ idx }
                  onClick={ e => {
                    onSelect({
                      sp: match.hf[index * rowLength + idx],
                      index: index * rowLength + idx,
                      id: match.id,
                      _id: `${match.id}:hf:${index * rowLength + idx}`,
                      label: `${mapValueToLabel(cell)}`,
                      value: cell
                    });
                  } }
                >
                  <p>
                    <span>{mapValueToLabel(cell)}</span>
                    <span>{match.hf[index * rowLength + idx]}</span>
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default HalfWDFComponent;
