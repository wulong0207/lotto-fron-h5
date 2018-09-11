import React from 'react';
import analytics from '@/services/analytics';
import PropTypes from 'prop-types';

export default function AnalyticsLink({ id, href, children }) {
  return (
    <a href={ href } onClick={ e => handle(e, id, href) }>
      {children}
    </a>
  );
}

AnalyticsLink.propTypes = {
  id: PropTypes.number.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

function handle(e, id, url) {
  e.preventDefault();
  analytics.send(id, url);
}
