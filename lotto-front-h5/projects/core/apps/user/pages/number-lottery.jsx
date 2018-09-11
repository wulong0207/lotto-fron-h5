// /**
//  * Created by manaster
//  * date 2017-03-20
//  * desc:个人中心模块--数字彩子模块
//  */

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import { Link } from 'react-router';
// import http from '@/utils/request';
// import session from '@/services/session';
// import OrderHelper from '../order-helper';
// import NumberHelper from '../number-helper';
// import Message from '@/services/message';
// import Const from '@/utils/const';
// import Navigator from '@/utils/navigator';
// import LotteryContainer from '../lottery-container';

// import '@/scss/user/lottery-container.scss';

// export default class NumberLottery extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lotteryData: {},
//       orderAmount: {}
//     };

//     this.fAPage = 0;
//   }
//   componentDidMount() {
//     this.sendOrderDetail();
//     // this.sendMonneyDetail();
//   }
//   lotteryProgress() {}
//   lotteryDetail() {
//     let { lotteryData } = this.state;
//     let orderBaseInfoBO = lotteryData.orderBaseInfoBO || {};
//     session.set('numberLotteryDetail', orderBaseInfoBO);
//     Navigator.goAddr('#/number-lottery-detail');
//   }

//   /**
//      * 发送订单详情
//      */
//   sendOrderDetail() {
//     let self = this;

//     http
//       .post('/order/queryOrderDetailInfo', {
//         token: session.get('token'),
//         source: '1',
//         orderCode: this.lotteryItem.orderCode
//       })
//       .then(res => {
//         self.fAPage++;
//         self.setState({ lotteryData: res.data || {} });
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   // 发送订单金额信息
//   sendMonneyDetail() {
//     let self = this;

//     http
//       .post('/order/queryOrderAmountDetail', {
//         token: session.get('token'),
//         type: 1,
//         orderCode: this.lotteryItem.orderCode
//       })
//       .then(res => {
//         self.setState({ orderAmount: res.data || {} });
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   // 更多方案
//   showMoreFA() {
//     let self = this;

//     http
//       .post('/order/queryUserNumOrderList', {
//         token: session.get('token'),
//         source: 1,
//         pageIndex: this.fAPage,
//         pageSize: 5,
//         orderCode: this.lotteryItem.orderCode
//       })
//       .then(res => {
//         let { lotteryData } = self.state;
//         lotteryData.userNumPage = lotteryData.userNumPage || {};
//         lotteryData.userNumPage.data = lotteryData.userNumPage.data || [];

//         let resultData = (res || {}).data;
//         let resultDataList = resultData.data || [];
//         lotteryData.userNumPage.data = lotteryData.userNumPage.data.concat(
//           resultDataList
//         );

//         self.setState({ lotteryData: lotteryData });
//         this.fAPage++;
//         // this.setState({lotteryData: res.data || {}});
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   render() {
//     let { lotteryData, orderAmount } = this.state;
//     let orderBaseInfoBO = lotteryData.orderBaseInfoBO || {};
//     let userNumPageData = lotteryData.userNumPage || {};
//     let userNumPage = userNumPageData.data || [];
//     this.lotteryItem = OrderHelper.getLotteryItem();
//     let openWin = orderBaseInfoBO.winningStatus == 1 ? 'gray' : '';
//     let hasMoreCount = (userNumPageData.total || 0) - userNumPage.length;
//     let drawCode = OrderHelper.handleCode(
//       orderBaseInfoBO.drawCode,
//       orderBaseInfoBO.lotteryCode
//     ); // 开奖号码
//     let drawCodeTwo = orderBaseInfoBO.drawCode || ''; // ..开奖号码
//     // 福彩3D,排列3,重庆时时彩：1组三, 2组六, 3豹子。
//     let drawCodeType = orderBaseInfoBO.drawCodeType || ''; // 开奖号码 类型
//     return (
//       <LotteryContainer
//         orderBaseInfoBO={ orderBaseInfoBO }
//         orderAmount={ orderAmount }
//         lotteryProgress={ this.lotteryProgress.bind(this) }
//         userNumPage={ userNumPage }
//       >
//         <div className="lot-item display-flex">
//           <span>开奖号码</span>
//           <em className={ 'lot-item-m flex ' + openWin }>
//             {openWin ? '待开奖' : drawCode}
//           </em>
//           {OrderHelper.getTicket(orderBaseInfoBO)}
//         </div>
//         <section className="plan-section">
//           <div className="plan-list">
//             <div className="plan-item">
//               {userNumPage.map((value, index) => {
//                 // val drawCode
//                 return NumberHelper.getNumberShow(
//                   value,
//                   drawCodeTwo,
//                   drawCodeType
//                 );
//               })}
//             </div>
//           </div>
//           <div
//             className="plan-other"
//             onClick={ this.showMoreFA.bind(this) }
//             style={ { display: hasMoreCount > 0 ? '' : 'none' } }
//           >
//             还有{hasMoreCount}个方案<i className="icon-arrow-d-grey" />
//           </div>
//         </section>
//         {/* 路由调整 */}
//       </LotteryContainer>
//     );
//   }
// }
