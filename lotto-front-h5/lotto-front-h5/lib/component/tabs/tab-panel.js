import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default function TabPanel({ children, active, index }) {
  return (
    <div
      className={ cx('tab-panel', `panel-${index}`, { active }) }
      style={ { display: !active ? 'none' : '' } }
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  index: PropTypes.number
};
