/*
 * @Author: zouyuting
 * @Date: 2017-12-01 16:05:12
 * @Desc: 路由配置
 */

import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Index from './index.jsx';
import { Login } from './pages/login'; // 登录
import { Register } from './pages/register'; // 注册
import { FindPwd } from './pages/find-pwd'; // 找回密码
import { FindWay } from './pages/find-way'; // 找回方式
import { PhoneWay } from './pages/phone-way'; // 找回密码----手机号
import { BkCardWay } from './pages/bkcard-way'; // 找回密码----银行卡号
import { EmailWay } from './pages/email-way'; // 找回密码----邮箱号
import { ResetPwd } from './pages/reset-pwd'; // 密码重置
import { ResetSec } from './pages/reset-sec'; // 密码重置成功
import { CreateAcc } from './pages/create-acc'; // 创建账号和密码
import { Identity } from './pages/identity'; // 实名认证
import { RegSec } from './pages/reg-sec'; // 注册成功
import { VerifyLogin } from './pages/verify-login'; // 验证码登录

const history = hashHistory;

const RouteConfig = (
  <Router history={ history }>
    <Route path="/" component={ Index }>
      <IndexRoute component={ Login } />
      <Route path="/login" component={ Login } />
      <Route path="/register" component={ Register } />
      <Route path="/findpwd" component={ FindPwd } />
      <Route path="/findway" component={ FindWay } />
      <Route path="/phoneway" component={ PhoneWay } />
      <Route path="/bkcardway" component={ BkCardWay } />
      <Route path="/emailway" component={ EmailWay } />
      <Route path="/resetpwd" component={ ResetPwd } />
      <Route path="/resetsec" component={ ResetSec } />
      <Route path="/createacc" component={ CreateAcc } />
      <Route path="/identity" component={ Identity } />
      <Route path="/regsec" component={ RegSec } />
      <Route path="/verifylogin" component={ VerifyLogin } />
    </Route>
  </Router>
);
export default RouteConfig;
