/**
 * Created by 杨利东
 * date 2017-05-02
 * desc:个人中心模块--我的红包子模块--红包子项
 */

import React, { Component } from 'react';
import Navigator from '@/utils/navigator';
// import '../../../scss/user/component/red-packet.scss';
import LotteryCode from '@/utils/lottery-code.js';
import IconJJGQ from '@/img/jjgq@2x.png';
import Message from '@/services/message';
import cx from 'classnames';

export default class RedPacketItem extends Component {
  constructor(props) {
    super(props);
    this.config = {
      /* 红包类型
                1：充值优惠；
                2：消费折扣；
                3：彩金红包；
                4：加奖红包；
                5：大礼包；
                6：随机红包 */
      '1': {
        // 充值
        // bg: "ciel-bg",
        bg: 'peacock-bg',
        btn: 'btn-rp-peacock',
        icon: 'icon-info-peacock',
        hide: 'icon-hide-peacock',
        txt: '去充值'
      },
      '2': {
        // 消费折扣，满减
        // bg: "peacock-bg",
        bg: 'blue-bg',
        btn: 'btn-rp-blue',
        icon: 'icon-info-blue',
        hide: 'icon-hide-blue',
        txt: '立即使用'
      },
      '3': {
        // 彩金红包
        // bg: "orange-bg",
        bg: 'orange-bg',
        btn: 'btn-rp-orange',
        icon: 'icon-info-orange',
        hide: 'icon-hide-orange',
        txt: '立即使用'
      },
      '4': {
        // 加奖
        // bg: "green-bg",
        bg: 'green-bg',
        btn: 'btn-rp-green',
        icon: 'icon-info-green',
        hide: 'icon-hide-green',
        txt: '立即使用'
      },
      '5': {
        // 大礼包
        // bg: "green-bg",
        bg: 'green-bg',
        btn: 'btn-rp-green',
        icon: 'icon-info-green',
        hide: 'icon-hide-green',
        txt: '立即使用'
      },
      '6': {
        // 随机
        // bg: "blue-bg",
        bg: 'blue-bg',
        btn: 'btn-rp-blue',
        icon: 'icon-info-blue',
        hide: 'icon-hide-blue',
        txt: '立即使用'
      },
      gray: {
        root: 'rp-item-grey',
        bg: 'grey-bg',
        icon: 'icon-info-grey',
        hide: 'icon-hide-grey'
      },
      // 红包状态 1：待激活；2：待派发；3：可使用；4：已过期；5：已作废；6：已使用
      iconStatus: [
        '',
        'icon-daijihuo',
        'icon-wait',
        'icon-canuse',
        'icon-outtime',
        'icon-yizuofei',
        'icon-used'
      ]
    };
    this.surportCaizhong = ['100', '215', '300']; // 目前支持的彩种
    this.state = {
      showChild: false
    };
  }

  gotoPage(txt, item) {
    switch (txt) {
      case '去充值':
        // Navigator.goAddr("#/recharge");
        console.log(window.location.href);
        window.location.href =
          '/sc.html?next=' +
          encodeURIComponent(window.location.href) +
          '#/recharge';
        break;
      case '立即使用':
        this.goLottPage(item.operateLotteryId);
        break;
    }
  }

  showChild(sts) {
    this.setState({ showChild: sts });
  }

  // 前往消费明细
  goTransDetail(item) {
    // debugger;
    console.log(window.location.href);
    // Navigator.goAddr('/red-packet-tans/' + item.redCode);
    window.location.href =
      '/sc.html?next=' +
      encodeURIComponent(window.location.href) +
      '#/red-packet-tans/' +
      item.redCode;
  }

  goLottPage(id) {
    let anext = window.location.href;
    console.log(anext);
    // 通过公共的lotteryCode  100: { num: 100, name: '双色球',
    // code: 'ssq', desc: '<em>彩民最爱</em> 2元赢取1000万', href: '/ssq.html' },
    let lottItem;
    if (id) {
      lottItem = LotteryCode[id.split(',')[0]];
    }
    let lottHref = lottItem && lottItem.href;
    if (lottItem) {
      if (lottHref) {
        console.log(lottHref);
        window.location.href = lottHref + '?next=' + encodeURIComponent(anext);
      } else {
        Message.toast('当前彩种未开放，请玩其他彩种！');
      }
    } else {
      window.location.href = '/jczq.html?next=' + encodeURIComponent(anext);
    }
  }

  handleLimitLottery() {
    let { item } = this.props;
    let lotteryCodeArr = []; // 推荐 限制 数组
    if (item.limitLottery == '') {
      lotteryCodeArr = item.operateLotteryId || [];
    } else {
      lotteryCodeArr = item.limitLottery || [];
    }
    if (lotteryCodeArr.length < 1) return null;
    return lotteryCodeArr.split(',').map((row, index) => {
      if (index <= 3 && parseInt(row) > 0) {
        return (
          <span
            className="lottery-name-href"
            onClick={ this.goLottPage.bind(this, item.operateLotteryId) }
            key={ index }
          >
            {index === 0 ? (
              <b> {item.limitLottery == '' ? '推荐' : '限制'} </b>
            ) : (
              ''
            )}
            {LotteryCode[row].name}
          </span>
        );
      }
    });
  }

  render() {
    let { item } = this.props;
    let { showChild } = this.state;
    let child;
    let hasChild;
    let cRoot = '';
    let cBg = '';
    let cBtn = '';
    let cWaring = '';
    let cIcon = '';
    let btnTxt = '';
    let Hide = ''; // 各个css class的定义
    let cActiveText = '';
    let cResult = this.config[item.redType];
    let cHide;
    // 红包状态
    switch (item.redStatus) {
      case 3:
        // 可使用
        if (cResult) {
          cRoot = cResult.root || '';
          cBg = cResult.bg;
          cBtn = cResult.btn;
          btnTxt = cResult.txt;
          cIcon = cResult.icon;
          cHide = cResult.hide;
          // console.log(cRoot, cBg, cBtn, btnTxt, cIcon, cHide)
        }
        break;
      case 1:
        // 待激活
        if (cResult) {
          cRoot = this.config.gray.root;
          cBg = cResult.bg;
          cIcon = this.config.gray.icon;
          cHide = cResult.hide;
          cActiveText = '激活时间：';
          cWaring = this.config.iconStatus[item.redStatus];
        }
        break;
      case 2:
        // 待派发
        if (cResult) {
          cRoot = this.config.gray.root;
          cBg = cResult.bg;
          cIcon = this.config.gray.icon;
          cHide = cResult.hide;
          cWaring = this.config.iconStatus[item.redStatus];
          console.log(cRoot, cBg, cBtn, btnTxt, cIcon, cHide);
        }

        break;
      case 4: // 已过期
      case 5: // 已作废
      case 6:
        // 已使用
        cRoot = this.config.gray.root;
        cBg = this.config.gray.bg;
        cIcon = this.config.gray.icon;
        cHide = this.config.gray.hide;
        cWaring = this.config.iconStatus[item.redStatus];

        break;
    }
    let childResult = []; // 子结果
    let subItem = []; // 二级项目
    let surportFistOne = ''; //
    let showLen = 2;
    for (let j = 0; j < this.surportCaizhong.length; j++) {
      let czItem = this.surportCaizhong[j]; // 彩种
      if (item.limitLottery.indexOf(czItem) > -1) {
        subItem.push(
          <span onClick={ this.gotoPage.bind(this, '立即使用', czItem) } key={ j }>
            {LotteryCode[czItem].name}
          </span>
        );
      }
      if (subItem.length == showLen) {
        childResult.push(<div key={ j + 'd' }>{subItem}</div>);
        subItem = [];
      }
    }

    if (subItem.length > 0 && subItem.length != showLen) {
      childResult.push(<div key={ 'ex' }>{subItem}</div>);
    }
    let curShowChild = showChild;
    let showValue = item.redValue;
    let redName = item.redName;
    let redRemark = item.redRemark;
    if (curShowChild) {
      let needDetial;
      if (item.redType == 3) {
        // 彩金红包
        needDetial = (
          <span onClick={ this.goTransDetail.bind(this, item) }>
            消费明细
            <div className="costdown" />
          </span>
        );
        showValue = item.redBalance;
      }

      child = (
        <div className="rp-item-detail">
          {/* <div className="rp-item-cz">
                            {childResult}
                        </div> */}
          <div
            className="limit-lottery color-blue"
            style={ {
              display: [item.limitLottery.split(',')].length > 0 ? '' : 'none'
            } }
          >
            {this.handleLimitLottery()}
          </div>
          <div className="yc-red-detail showflex">
            <span className="flex">红包ID：{item.redCode}</span>
            <div className="mx-div">{needDetial}</div>
          </div>
          <div className="l-circle" />
          <div className="r-circle" />
        </div>
      );
    }

    if (item.redType == 3) {
      // 彩金红包
      showValue = item.redBalance;
      item.redOverdueTime = '';
      // redName = "彩金红包: 购彩可用，总额"+ item.redValue +"元";
    }

    return (
      <div className={ 'yc-rp rp-item ' + cRoot }>
        <div className="rp-item-show">
          <div className={ 'rp-item-l ' + cBg }>
            <span>
              ￥<em>{showValue}</em>
            </span>
            <em className="new-fresh">{item.redLabel}</em>
          </div>
          <div className="rp-item-r">
            <div className="rp-item-t">
              {item.overTimeStatus == 1 && item.redStatus == 3 ? (
                <img className="img-label" src={ IconJJGQ } />
              ) : (
                ''
              )}
              <div className="rp-item-desc">
                <span>{redName}</span>
                <span className="remark">
                  {redRemark == '' ? '' : redRemark}
                </span>
                <em>{item.useRule}</em>
              </div>
              <span className="rp-item-op">
                <i
                  onClick={ this.gotoPage.bind(
                    this,
                    btnTxt,
                    item,
                    surportFistOne
                  ) }
                  className={ cBtn || cWaring }
                >
                  {btnTxt}
                </i>
              </span>
            </div>
            <div className="rp-item-b">
              <span>
                {item.redOverdueTime ? '有效期：' + item.redOverdueTime : ''}
                <span className="red" />
              </span>
              {curShowChild ? (
                <i
                  onClick={ this.showChild.bind(this, !showChild) }
                  className={ cHide }
                />
              ) : (
                <i
                  onClick={ this.showChild.bind(this, !showChild) }
                  className={ cIcon }
                />
              )}
            </div>
          </div>
        </div>
        {child}
      </div>
    );
  }
}
