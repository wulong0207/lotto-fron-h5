// /**
//  * Created by manaster
//  * date 2017-03-22
//  * desc:个人中心模块--14场子模块
//  */

// import React, { Component } from 'react';
// import { FtGame } from './../ft-game';
// import RenNineGame from './../ren-nine-game';
// import FourSixGame from './../four-six-game';
// import http from '@/utils/request';
// import { copyContent } from '@/utils/utils';
// import session from '@/services/session';
// import OrderHelper from '../order-helper';
// import Message from '@/services/message';
// import Const from '@/utils/const';
// import Navigator from '@/utils/navigator';
// import LotteryContainer from '../lottery-container';

// export default class FourteenLottery extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lotteryData: {},
//       orderAmount: {}
//     };
//   }
//   componentDidMount() {
//     this.sendOrderDetail();
//     // this.sendMonneyDetail();
//   }
//   lotteryProgress() {}
//   lotteryDetail() {
//     window.location.hash = '#/fourteen-lottery-detail';
//   }

//   /**
//      * 发送订单详情
//      */
//   sendOrderDetail() {
//     http
//       .post('/order/queryOrderDetailInfo', {
//         token: session.get('token'),
//         source: '1',
//         orderCode: this.lotteryItem.orderCode
//       })
//       .then(res => {
//         this.setState({ lotteryData: res.data || {} });
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   // 发送订单金额信息
//   sendMonneyDetail() {
//     http
//       .post('/order/queryOrderAmountDetail', {
//         token: session.get('token'),
//         type: 1,
//         orderCode: this.lotteryItem.orderCode
//       })
//       .then(res => {
//         this.setState({ orderAmount: res.data || {} });
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   // 复制订单编号
//   copyOrder(str) {
//     copyContent(str);
//     Message.toast('已复制');
//   }
//   // lotterySwitch(item){
//   //     debugger;
//   //     switch(item){

//   //         case 302: {//六场半全场
//   //             //lotteryArea = <FourSixGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/>;
//   //             };break;
//   //         case 303: {//四场进球彩
//   //             //lotteryArea = <FourSixGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/>;
//   //             };break;
//   //         case 305: {//九场胜负彩
//   //             return lotteryArea = <RenNineGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/>;
//   //             };break;
//   //         case '304': {//十四场胜负彩
//   //             return lotteryArea = <FtGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/>;
//   //             };break;
//   //     }
//   // }

//   render() {
//     let { lotteryData, orderAmount } = this.state;
//     let orderBaseInfoBO = lotteryData.orderBaseInfoBO || {};
//     let userNumPageData = lotteryData.userNumPage || {};
//     let userNumPage = userNumPageData.data || [];
//     this.lotteryItem = OrderHelper.getLotteryItem();
//     // let description = OrderHelper.getDescription(orderBaseInfoBO);
//     let winArea =
//       orderBaseInfoBO.winningStatus == 3 || orderBaseInfoBO.winningStatus == 4
//         ? { display: 'block' }
//         : { display: 'none' };
//     let openWin =
//       orderBaseInfoBO.winningStatus == 1
//         ? { display: 'none' }
//         : { display: '' };
//     let hasMoreCount = (userNumPageData.total || 0) - userNumPage.length;
//     let orderMatchInfoBOs = lotteryData.orderMatchInfoBOs || [];

//     let lotteryArea;
//     switch (parseInt(this.lotteryItem.lotteryCode)) {
//       case 302:
//         {
//           // 六场半全场
//           // lotteryArea = <FourSixGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/>;
//         }
//         break;
//       case 303:
//         {
//           // 四场进球彩
//           // lotteryArea = <FourSixGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/>;
//         }
//         break;
//       case 305:
//         {
//           // 九场胜负彩
//           lotteryArea = (
//             <RenNineGame
//               orderMatchInfoBOs={ orderMatchInfoBOs }
//               drawCode={ orderBaseInfoBO.drawCode }
//             />
//           );
//         }
//         break;
//       case 304:
//         {
//           // 十四场胜负彩
//           lotteryArea = (
//             <FtGame
//               orderMatchInfoBOs={ orderMatchInfoBOs }
//               drawCode={ orderBaseInfoBO.drawCode }
//             />
//           );
//         }
//         break;
//     }

//     return (
//       <LotteryContainer
//         orderBaseInfoBO={ orderBaseInfoBO }
//         orderAmount={ orderAmount }
//       >
//         <div className="lot-item zh-item" style={ openWin }>
//           <span style={ openWin }>开奖号码</span>
//           <em style={ openWin } className="lot-item-m red">
//             {OrderHelper.getJJShow(orderBaseInfoBO.drawCode, 1)}
//           </em>
//           {/* <em onClick={this.lotteryDetail.bind(this)}>出票明细</em> */}
//         </div>
//         <section className="plan-section margin-t10">
//           {/* {this.lotterySwitch(this.lotteryItem.lotteryCode)}  */}

//           {/* 14场 */}
//           {/* <FtGame orderMatchInfoBOs={orderMatchInfoBOs} drawCode={orderBaseInfoBO.drawCode}/> */}
//           {/* <RenNineGame/> */}
//           {/* <FourSixGame/> */}
//           {lotteryArea}
//         </section>
//       </LotteryContainer>
//     );
//   }
// }
