import React from 'react';
import PropTypes from 'prop-types';

export const ReactComponent = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.instanceOf(React.Component),
  PropTypes.instanceOf(React.PureComponent)
]);

export const Klass = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);
