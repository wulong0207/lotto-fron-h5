import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { generateScoreSize } from '../utils';

const rowLength = 7;
const scoreArr = generateScoreSize()
  .slice(0, 12)
  .concat('胜其他');
const goalData = _.chunk(scoreArr, rowLength);
const scoreArrReverse = generateScoreSize(true)
  .slice(0, 12)
  .concat('负其他');
const scoreDataReverse = _.chunk(scoreArrReverse, rowLength);

const ScoreComponent = props => {
  const selected = props.selected || [];
  const onSelect = data => {
    props.onSelect(Object.assign({}, data, { title: '比分', type: 'score' }));
  };
  const { match } = props;
  if (match.status_score === 4) {
    return <div className="grid-nosell">未开售</div>;
  }
  return (
    <div className={ cx('score-table score-table-component', props.klass) }>
      <table>
        <tbody>
          {goalData.map((row, index) => {
            return (
              <tr key={ index } className="score-table-row">
                {row.map((cell, idx) => {
                  return (
                    <td
                      className={ cx('detail-grid', {
                        'grid-col2':
                          index * rowLength + idx === match.score.w.length - 1,
                        'grid-sel':
                          selected.indexOf(index * rowLength + idx) > -1
                      }) }
                      key={ idx }
                      colSpan={
                        index * rowLength + idx === match.score.w.length - 1
                          ? '2'
                          : '1'
                      }
                      onClick={ e => {
                        onSelect({
                          sp: match.score.w[index * rowLength + idx],
                          index: index * rowLength + idx,
                          id: match.id,
                          section: `w${index * rowLength + idx}`,
                          _id: `${match.id}:score:${index * rowLength + idx}`,
                          label: `${cell}`,
                          value:
                            cell === '胜其他' ? '90' : cell.replace(':', '')
                        });
                      } }
                    >
                      <h5>{cell}</h5>
                      <p className="score-sp-value">
                        {match.score.w[index * rowLength + idx]}
                      </p>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="score-table-row">
            {[0, 1, 2, 3].map((num, idx) => {
              return (
                <td
                  className={ cx('detail-grid', {
                    'grid-sel': selected.indexOf(13 + idx) > -1
                  }) }
                  key={ idx }
                  onClick={ e => {
                    onSelect({
                      sp: match.score.d[idx],
                      index: 13 + idx,
                      id: match.id,
                      section: `d${idx}`,
                      _id: `${match.id}:score:${13 + idx}`,
                      label: `${num}:${num}`,
                      value: `${num}${num}`
                    });
                  } }
                >
                  <h5>{`${num}:${num}`}</h5>
                  <p className="score-sp-value">{match.score.d[idx]}</p>
                </td>
              );
            })}
            <td
              className={ cx('detail-grid grid-col3', {
                'grid-sel': selected.indexOf(17) > -1
              }) }
              colSpan="3"
              onClick={ e => {
                onSelect({
                  sp: match.score.d[4],
                  index: 17,
                  id: match.id,
                  section: 'd4',
                  _id: `${match.id}:score:${17}`,
                  label: `平其他`,
                  value: '99'
                });
              } }
            >
              <h5>平其他</h5>
              <p className="score-sp-value">{match.score.d[4]}</p>
            </td>
          </tr>
          {scoreDataReverse.map((row, index) => {
            return (
              <tr key={ index } className="score-table-row">
                {row.map((cell, idx) => {
                  return (
                    <td
                      className={ cx('detail-grid', {
                        'grid-col2':
                          index * rowLength + idx === match.score.f.length - 1,
                        'grid-sel':
                          selected.indexOf(index * rowLength + idx + 18) > -1
                      }) }
                      key={ idx }
                      colSpan={
                        index * rowLength + idx === match.score.w.length - 1
                          ? '2'
                          : '1'
                      }
                      onClick={ e => {
                        onSelect({
                          sp: match.score.f[index * rowLength + idx],
                          index: index * rowLength + idx + 18,
                          id: match.id,
                          section: `f${index * rowLength + idx}`,
                          _id: `${match.id}:score:${index * rowLength +
                            idx +
                            18}`,
                          label: `${cell}`,
                          value:
                            cell === '负其他' ? '09' : cell.replace(':', '')
                        });
                      } }
                    >
                      <h5>{cell}</h5>
                      <p className="score-sp-value">
                        {match.score.f[index * rowLength + idx]}
                      </p>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreComponent;
