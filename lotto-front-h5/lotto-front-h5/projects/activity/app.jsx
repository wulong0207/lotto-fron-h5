import { render } from 'react-dom';
import Routes from './index.jsx';
import session from '@/services/session.js';

render(Routes, document.getElementById('app'));

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           token token
 */
window.initializeApp = function(params) {
  // alert(JSON.stringify(params));
  var curParams = {};
  try {
    curParam = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
};

// tokenExpires token失效后出发这个方法，让app重新登录获取token
