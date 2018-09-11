import React from 'react';
import analytics from '@/services/analytics';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

export default function AnalyticsRouterLink({ id, to, children }) {
  const RouteLink = ({ router, wrappedComponentRef }) => {
    return (
      <a
        href={ to }
        onClick={ e => handle(e, id, to, router) }
        ref={ wrappedComponentRef }
      >
        {children}
      </a>
    );
  };
  RouteLink.propTypes = {
    router: PropTypes.object.isRequired,
    wrappedComponentRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  };
  return React.createElement(withRouter(RouteLink));
}

AnalyticsRouterLink.propTypes = {
  id: PropTypes.number.isRequired,
  to: PropTypes.string.isRequired,
  children: PropTypes.node
};

function handle(e, id, to, router) {
  e.preventDefault();
  analytics.send(id, () => {
    router.push(to);
  });
}
