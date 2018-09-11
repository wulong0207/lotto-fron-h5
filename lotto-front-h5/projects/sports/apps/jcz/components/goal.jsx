import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';

const GoalComponenet = props => {
  const { match } = props;
  if (match.status_goal === 4) {
    return <div className="grid-nosell">未开售</div>;
  }
  const selected = props.selected || [];
  const onSelect = data => {
    props.onSelect(
      Object.assign({}, data, { title: '总进球数', type: 'goal' })
    );
  };
  const rowLength = 4;
  const goalNumber = [0, 1, 2, 3, 4, 5, 6, 7];
  const goalData = _.chunk(goalNumber, rowLength);
  return (
    <div className={ cx('goal-table-component', props.klass) }>
      {goalData.map((row, index) => {
        return (
          <div key={ row } className="table-row goal-table-row">
            {row.map((cell, idx) => {
              return (
                <div
                  className={ cx('detail-grid', {
                    'grid-sel': selected.indexOf(index * rowLength + idx) > -1
                  }) }
                  key={ cell }
                  onClick={ e => {
                    onSelect({
                      sp: match.goal[index * rowLength + idx],
                      index: index * rowLength + idx,
                      id: match.id,
                      _id: `${match.id}:goal:${index * rowLength + idx}`,
                      label: `${cell === 7 ? '7+' : cell}`,
                      value: cell
                    });
                  } }
                >
                  <h5>{cell === 7 ? '7+' : cell}球</h5>
                  <p className="goal-sp-value">
                    {match.goal[index * rowLength + idx]}
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

GoalComponenet.propTypes = {
  match: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  klass: PropTypes.array
};

export default GoalComponenet;
