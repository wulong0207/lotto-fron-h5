import React from 'react';
import session from '@/services/session.js';
import PropTypes from 'prop-types';

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           token token
 */
window.initializeApp = function(params) {
  // alert(JSON.stringify(params));
  let curParams = {};
  try {
    curParams = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
};

export default function App({ children }) {
  return <div>{children}</div>;
}

App.propTypes = {
  children: PropTypes.node.isRequired
};
