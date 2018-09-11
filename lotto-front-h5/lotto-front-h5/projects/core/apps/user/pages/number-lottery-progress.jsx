// /**
//  * Created by manaster
//  * date 2017-03-20
//  * desc:个人中心模块-订单进度信息详情子模块
//  */

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import Header from '@/component/header';
// import http from '@/utils/request';
// import session from '@/services/session';
// import Message from '@/services/message';
// import OrderHelper from '../order-helper';

// import { getParameter } from '@/utils/utils';

// import '@/scss/user/lottery-container.scss';

// export default class NumberLotteryProgress extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ResultBO: {}
//     };
//   }

//   componentDidMount() {
//     this.reqOrderDetail();
//   }

//   /**
//      * 获取订单详情
//      */
//   reqOrderDetail() {
//     http
//       .post('/order/queryOrderFlowInfoList', {
//         token: session.get('token'),
//         orderCode: this.props.params.orderCode
//       })
//       .then(res => {
//         this.setState({ ResultBO: res.data || {} });
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   // 前往支付
//   goToPay() {
//     // this.sendOrderDetail();
//     OrderHelper.canMakeOrder(getParameter('lotteryChildCode'), true);
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
//         orderCode: this.props.params.orderCode
//       })
//       .then(res => {
//         let lotteryData = res.data || {};
//         let orderBaseInfoBO = lotteryData.orderBaseInfoBO || {};
//         let userNumPageData = lotteryData.userNumPage || {};
//         let userNumPage = userNumPageData.data;
//         let addOrderDetailBOs = lotteryData.addOrderDetailBOs;

//         OrderHelper.goToPay({
//           orderBaseInfoBO: orderBaseInfoBO,
//           userNumPage: userNumPage,
//           addOrderDetailBOs: addOrderDetailBOs
//         });
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }

//   goTo() {
//     location.href = '#/number-lottery';
//   }

//   render() {
//     let ResultBOData = this.state.ResultBO || {};
//     let orderFlowInfoBOs = ResultBOData.orderFlowInfoBOs || [];

//     let buyArea;
//     if (OrderHelper.canMakeOrder(getParameter('lotteryChildCode'))) {
//       buyArea = (
//         <i className="btn-round-blue" onClick={ this.goToPay.bind(this) }>
//           再次购买
//         </i>
//       );
//     }

//     return (
//       <div className="pt-header sc-lp number-lottery-progress">
//         {/* <PageHeader url="#/number-lottery" title="订单进度信息详情"/> */}
//         <Header title="订单进度信息详情" back={ this.goTo.bind(this) } />
//         <div className="p-item showflex ">
//           <div className="p-item-div">
//             <div className="lp-des">彩种名称：{ResultBOData.lotteryName}</div>
//             <div className="lp-des">彩期编号：{ResultBOData.lotteryIssue}期</div>
//             <div className="lp-des last-item">
//               方案编号：{this.props.params.orderCode}
//             </div>
//           </div>
//           {buyArea}
//         </div>
//         <section className="trade-express">
//           {orderFlowInfoBOs.map((value, index) => {
//             let className = '';
//             if (index == 0) {
//               className = 'active';
//             }

//             return (
//               <div key={ index } className="express-item">
//                 <div className="express-item-l">
//                   <i className="top" />
//                   <span className={ className } />
//                   <i className="bottom" />
//                 </div>
//                 <div className="express-item-r">
//                   <span>{value.message}</span>
//                   <div>{value.createTime}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </section>
//         {/* 路由跳转 */}
//       </div>
//     );
//   }
// }
