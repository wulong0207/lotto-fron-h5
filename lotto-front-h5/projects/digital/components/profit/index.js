import React from 'react';
import PropTypes from 'prop-types';
import './profit.scss';
import cx from 'classnames';

export default function Profit({ money, showLabel }) {
  if (money.length === 1) {
    const isLoss = money[0] < 0;
    return (
      <span className="profit-money">
        {showLabel && <span>{isLoss ? '亏损' : '盈利'}</span>}
        <MoneyRange money={ money } isLoss={ isLoss } />
      </span>
    );
  }
  const isLoss = money[0] < 0 && money[1] < 0;
  return (
    <span className="profit-money">
      {showLabel && <span>{isLoss ? '亏损' : '盈利'}</span>}
      <MoneyRange money={ money } isLoss={ isLoss } />
    </span>
  );
}

Profit.propTypes = {
  money: PropTypes.arrayOf(PropTypes.number),
  showLabel: PropTypes.bool
};

export function MoneyRange({ money, isLoss }) {
  if (money.length === 1) {
    return (
      <span className={ cx({ loss: isLoss }) }>
        <em>{Math.abs(money[0])}</em>
      </span>
    );
  }
  return (
    <span className={ cx({ loss: isLoss }) }>
      <em>{Math.abs(money[0])}</em>~<em>{Math.abs(money[1])}</em>
    </span>
  );
}

MoneyRange.propTypes = {
  money: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  isLoss: PropTypes.bool
};
