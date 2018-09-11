/*
 * @Author: nearxu
 * @Date: 2017-09-30 10:50:18
 * order-help 文件过大， 订单详情 状态抽离到这里
 */
import React, { Component } from 'react';
// 图片模块 路径
import IconOne from '../img/status/cainpin_win@2x.png'; // 待派奖
import IconTwo from '../img/status/icontwo@2x.png'; // 出票中
import IconThree from '../img/status/iconthree@2x.png'; // 待支付
import IconFour from '../img/status/iconfour@2x.png'; // 未支付过期
import IconFive from '../img/status/iconfive@2x.png'; // 支付失败
import IconSix from '../img/status/iconsix@2x.png'; // 出票失败并已退款
import IconSeven from '../img/status/iconseven@2x.png'; // 等待开奖
import IconEight from '../img/status/iconeight@2x.png'; // 已派奖
import IconNine from '../img/status/iconnine@2x.png'; // 追号中
import IconTen from '../img/status/iconten@2x.png'; // 追号结束
import IconEleven from '../img/status/iconeleven@2x.png'; // 中奖停追
import IconTwelve from '../img/status/icontwelve@2x.png'; // 追号撤单
import IconThirteen from '../img/status/iconthirteen@2x.png'; // 未中奖
import IconTicketFail from '../img/status/ticket_failed@2x.png';
import IconTicketSuc from '../img/status/ticket_success@2x.png';
import IconOutTime from '../img/status/outtime@2x.png';
import IconForteen from '../img/status/twelve@2x.png';
import IconCuowu from '../img/status/cuowu@2x.png';

export default {
  handleOrderDetail(data) {
    let openDate = '';
    let openSts = '';
    let openMessage = '';
    let img = '';
    let color = '';

    if (Object.keys(data).length > 0) {
      if (data.orderFlowInfoBO) {
        openDate = data.orderFlowInfoBO.createTime;
        openMessage = data.orderFlowInfoBO.message;
      }
      if (data.buyType === 4) {
        switch (data.addOrderFlowUnionStatus) {
          case 1: // 待支付
            img = IconThree;
            color = 'green';
            break;
          case 2: // 未支付过期
            img = IconFour;
            color = 'red';
            break;
          case 3: // 用户取消
            img = IconForteen;
            color = 'green';
            break;
          case 4: // 支付失败
            img = IconFive;
            color = 'red';
            openMessage = (
              <span className="font-24">
                {openMessage.slice(0, openMessage.indexOf('在线客服'))}
                <a
                  className="blue"
                  target="_blank"
                  href="//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663"
                >
                  {' '}
                  在线客服
                </a>
              </span>
            );
            break;
          case 5: // 追号中
            img = IconNine;
            color = 'green';
            break;
          case 6: // 追号结束
            img = IconTen;
            color = 'green';
            break;
          case 7: // 中奖停追
            img = IconEleven;
            color = 'green';
            break;
          case 8: // 追号撤单
            img = IconTwelve;
            color = 'green';
            break;
          default:
            break;
        }
      } else {
        switch (data.orderFlowUnionStatus) {
          case 1: // 待支付
            img = IconThree;
            color = 'green';
            break;
          case 2: // 未支付过期
            img = IconFour;
            color = 'red';
            break;
          case 3: // 用户取消
            img = IconForteen;
            color = 'green';
            break;
          case 4: // 支付失败
            img = IconFive;
            color = 'red';
            openMessage = (
              <span className="font-24">
                {openMessage.slice(0, openMessage.indexOf('在线客服'))}
                <a
                  className="blue"
                  target="_blank"
                  href="//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663"
                >
                  {' '}
                  在线客服
                </a>
              </span>
            );
            break;
          case 5: // 等待出票
            img = IconTwo;
            color = 'orange';
            break;
          case 6: // :出票中
            img = IconTwo;
            color = 'orange';
            break;
          case 7: // 出票失败
            img = IconTicketFail;
            color = 'orange';
            openMessage = (
              <span className="font-24">
                {openMessage.slice(0, openMessage.indexOf('在线客服'))}
                <a
                  className="blue"
                  target="_blank"
                  href="//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663"
                >
                  {' '}
                  在线客服
                </a>
              </span>
            );
            break;
          case 8: // 已退款 //
            img = IconSix;
            color = 'red';
            openMessage = (
              <span className="font-24">
                {openMessage.slice(0, openMessage.indexOf('在线客服'))}
                <a
                  className="blue"
                  target="_blank"
                  href="//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663"
                >
                  {' '}
                  在线客服
                </a>
              </span>
            );
            break;
          case 9: // 等待开奖
            img = IconTicketSuc;
            color = 'red';
            break;
          case 10: // :未中奖
            img = IconThirteen;
            color = 'green';
            break;
          case 11: // 等待派奖
            img = IconOne;
            color = 'red';
            break;
          case 12: // 已派奖
            img = IconEight;
            color = 'red';
            break;
          default:
            break;
        }
      }
    }

    return {
      img: img, // 显示在方案详情中的图标
      color: color, // 方案详情中，例如未支付时字体为红色
      // openSts: openSts,//显示在方案详情中的状态信息,例如：未支付、出票中...
      openDate: openDate, // 方案详情中支付下的时间出票信息等，目前未启用
      openMessage: openMessage // 方案详情中支付下的时间出票截止时间等，目前未启用
    };
  }
};
