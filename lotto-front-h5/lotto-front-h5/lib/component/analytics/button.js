import React from 'react';
import analytics from '@/services/analytics';
import PropTypes from 'prop-types';

export default function AnalyticsButton({ id, callback, children }) {
  return <button onClick={ e => handle(e, id, callback) }>{children}</button>;
}

AnalyticsButton.propTypes = {
  id: PropTypes.number.isRequired,
  callback: PropTypes.func,
  children: PropTypes.node.isRequired
};

AnalyticsButton.defaultProps = {
  callback: function() {}
};

function handle(e, id, callback) {
  e.preventDefault();
  analytics.send(id).then(callback);
}
