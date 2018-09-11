import React from 'react';
import PropTypes from 'prop-types';

export default function App({ children }) {
  return <div className="copy-app">{children}</div>;
}

App.propTypes = {
  children: PropTypes.node
};
