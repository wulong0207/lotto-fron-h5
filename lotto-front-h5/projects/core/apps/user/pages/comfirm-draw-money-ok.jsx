/**
 * Created by manaster
 * date 2017-03-16
 * desc:个人中心模块--提款申请成功子模块
 */

import React, { Component } from 'react';
import { getParameter, formatMoney, browser } from '@/utils/utils';
import session from '@/services/session';
import Header from '@/component/header';
import Navigator from '@/utils/navigator'; // 页面跳转
import Interaction from '@/utils/interaction';

import '../css/comfirm-draw-money-ok.scss';

export default class ComfirmDrawMoneyOk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false
    };
  }

  gotoXQ() {
    if (browser.yicaiApp) {
      // 调APP登录
      // Interaction.sendInteraction('toDealDetailDrawingInfo', []);
      window.location.href = '/sctkqrlist.html';
    } else {
      window.location.hash = '#/draw-list?tc';
    }
  }
  render() {
    let drawMoneyitem = session.get('totalBalance');
    let headStyle = { paddingTop: '10px' };
    if (!browser.yicaiApp) {
      headStyle = {};
    }

    return (
      <div className="pt-header comfirm-draw-money-ok" style={ headStyle }>
        <Header title="提款申请成功" />
        <div className="comfirm-ok">
          <i className="icon-moneyback" />
          <p>提款申请成功!</p>
          <p>
            提款后余额：<em>{formatMoney(drawMoneyitem)}元</em>
          </p>
          <span className="go-detail" onClick={ this.gotoXQ.bind(this) }>
            查看明细>>
          </span>
        </div>
      </div>
    );
  }
}
