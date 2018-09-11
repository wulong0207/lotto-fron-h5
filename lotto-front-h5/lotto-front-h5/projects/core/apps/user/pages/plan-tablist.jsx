// /**
//  * Created by manaster
//  * date 2017-03-06
//  * desc:个人中心模块--方案Tab列表模块
//  */

// import React, { Component } from 'react';
// // import ReactDOM from 'react-dom';
// import { Link } from 'react-router';
// // import iScroll from 'iscroll/build/iscroll-probe';
// // import ReactIScroll from 'react-iscroll';
// import session from '@/services/session';
// import { setDate, formatMoney } from '@/utils/utils';
// import http from '@/utils/request';
// import Message from '@/services/message';
// import Const from '@/utils/const';
// import Navigator from '@/utils/navigator';
// import OrderHelper from './order-helper';
// import NoMsg from '@/component/no-msg';
// import '@/scss/user/plan-tablist.scss';
// import cx from 'classnames';

// export class PlanTabList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       show: false, // 方案的显示与否
//       activeTab: 1, // tab激活
//       activeLi: 5, // 列表按钮激活
//       y: 0, // y轴高度
//       //   iScrollOptions: {
//       //     mouseWheel: false,
//       //     scrollbars: false,
//       //     scrollX: false,
//       //     scrollY: true,
//       //     probeType: 2
//       //   },
//       orderInfoAll: null, // 订单信息
//       orderInfoWin: null,
//       orderInfoPending: null
//     };
//     this.curPage = {
//       '0': {
//         index: 0,
//         max: 0,
//         buyType: 0
//       },
//       '2': {
//         index: 0,
//         max: 0
//       },
//       '3': {
//         index: 0,
//         max: 0
//       }
//     };
//     this.preTabIndex = 1; // 默认上一次tab左右列表
//     this.previouIndex = 5; // 默认上一次tab下拉列表
//     this.orderType = ['', '未推', '已推', '']; // 抄单状态
//   }
//   componentDidMount() {
//     // _this.mySwiper = new Swiper ('.swiper-container', {
//     //     direction: 'horizontal',
//     //     onSlideChangeEnd:function(swiper){
//     //         let swiperIndex = swiper.activeIndex + 1;
//     //         _this.setState({activeTab: swiperIndex});

//     //         _this.sendOrderReq(swiperIndex);
//     //     }
//     // });
//     this.callOrderService(0, this.props.checkDatahandle);
//   }
//   tabClick(e) {
//     let index = +e.currentTarget.getAttribute('data-index');
//     // console.log(index);
//     if (index == 1) {
//       let show = false;
//       if (this.preTabIndex == 1) {
//         show = !this.state.show;
//       }
//       this.setState({
//         show: show,
//         activeTab: index
//       });
//     } else {
//       this.setState({
//         activeTab: index,
//         show: false
//       });
//     }
//     // this.mySwiper.slideTo(index - 1, 500, false);
//     this.sendOrderReq(index);
//     this.preTabIndex = index;
//   }
//   // 发送订单请求
//   sendOrderReq(index) {
//     if (index == 1 && !this.state.orderInfoAll) {
//       this.callOrderService();
//     } else if (index == 2 && !this.state.orderInfoWin) {
//       this.callOrderService(2);
//     } else if (index == 3 && !this.state.orderInfoPending) {
//       this.callOrderService(3);
//     }
//   }
//   gotoLotteryDetail(resultItem) {
//     // Navigator.goLotteryDetail(resultItem);
//     Navigator.handleLotteryDetail(resultItem);
//   }
//   jjcDetail() {
//     Navigator.goAddr('#/jjc-lottery');
//   }
//   ftDetail() {
//     Navigator.goAddr('#/fourteen-lottery');
//   }
//   chaseDetail() {
//     Navigator.goAddr('#/chase-lottery');
//   }
//   checkPlan(index) {
//     if (index == 1) {
//       this.refs.title.innerText = '代购';
//     } else if (index == 2) {
//       this.refs.title.innerText = '追号';
//     } else if (index == 3) {
//       this.refs.title.innerText = '合买';
//     } else if (index == 4) {
//       this.refs.title.innerText = '抄单';
//     } else {
//       this.refs.title.innerText = '全部方案';
//     }
//     if (this.previouIndex == index) {
//       this.setState({ show: false });
//       return;
//     }
//     this.setState({
//       activeLi: index,
//       show: false,
//       orderInfoAll: {}
//     });
//     // 1：代购；2：追号；3：合买 ，全部传0
//     this.curPage[0].buyType = index;
//     this.curPage[0].index = 0;
//     if (index == 5) {
//       this.curPage[0].buyType = 0;
//     }
//     this.callOrderService();
//     this.previouIndex = index;
//   }
//   callOrderService(type = 0, callback) {
//     var date = new Date();
//     var datePre = new Date();
//     setDate.setYears(datePre, -1);
//     let self = this;
//     http
//       .post('/order/orderlist', {
//         beginDate: setDate.formatDate(datePre, 'yyyy-MM-dd'),
//         buyType: this.curPage[type + ''].buyType || 0,
//         lotteryCode: '',
//         endDate: setDate.formatDate(date, 'yyyy-MM-dd'),
//         pageIndex: this.curPage[type + ''].index,
//         pageSize: 10,
//         source: 1,
//         token: session.get('token'),
//         type: type
//       })
//       .then(res => {
//         let field = '';
//         switch (type) {
//           case 0:
//             field = 'orderInfoAll';
//             break;
//           case 2:
//             field = 'orderInfoWin';
//             break;
//           case 3:
//             field = 'orderInfoPending';
//             break;
//         }

//         self.state[field] = self.state[field] || {};
//         self.state[field].data = self.state[field].data || [];

//         let resultData = (res || {}).data;
//         let resultDataList = resultData.data || [];
//         self.state[field].data = self.state[field].data.concat(resultDataList);

//         let stateObj = {};
//         stateObj[field] = self.state[field];
//         stateObj[field].total = resultData.total;
//         self.setState(stateObj);
//         // console.log(stateObj, 'stateobj');
//         self.curPage[type + ''].max = resultData.total;

//         if (callback) {
//           callback(((res.data || {}).total || 0) > 0);
//         }
//       })
//       .catch(err => {
//         Message.toast(err.message);
//       });
//   }
//   // 加载更多
//   loadMore() {
//     let field = '';
//     let type = '';
//     switch (this.state.activeTab) {
//       case 1:
//         field = 'orderInfoAll';
//         type = 0;
//         break;
//       case 2:
//         field = 'orderInfoWin';
//         type = 2;
//         break;
//       case 3:
//         field = 'orderInfoPending';
//         type = 3;
//         break;
//     }
//     this.state[field] = this.state[field] || {};
//     this.state[field].data = this.state[field].data || [];
//     if (this.state[field].data.length < this.curPage[type + ''].max) {
//       this.curPage[type + ''].index++;
//       this.callOrderService(type);
//     }
//   }
//   /**
//      * 获取列表子项
//      */
//   getScrollItem(data, buyType, winningStatus, log) {
//     let result = [];
//     let items = data.data;
//     if (items && items.length > 0) {
//       for (let i = 0; i < items.length; i++) {
//         // let item = items[i];
//         let resultItem = null;
//         resultItem = items[i];

//         // if(winningStatus != null){
//         //     if(winningStatus == item.winningStatus){
//         //         resultItem = item;
//         //     }
//         // }else if(buyType != null){
//         //     if(buyType == 4 || buyType == item.buyType || (buyType==2 && item.buyType == 4)){
//         //         resultItem = item;
//         //     }
//         // }else{
//         //     resultItem = item;
//         // }

//         if (resultItem) {
//           let {
//             message,
//             date,
//             noListColor,
//             nowLottery
//           } = OrderHelper.getUnionDescription(resultItem);
//           let riclassName = 'red';
//           if (noListColor) {
//             riclassName = '';
//           }
//           let copyStyle = '';
//           if (resultItem.orderType) {
//             switch (resultItem.orderType) {
//               case 1: // 未推
//                 copyStyle = 'copy-red';
//                 break;
//               case 2: // 已推单
//               case 3: // 已跟单
//                 copyStyle = 'copy-grey';
//                 break;
//               default:
//                 break;
//             }
//           }
//           let itemCtr = (
//             <div
//               key={ i }
//               className="tab-item"
//               onClick={ this.gotoLotteryDetail.bind(this, resultItem) }
//             >
//               {/* <div className="tab-item-l nw">
//                             <span>{resultItem.lotteryName}{" "}{formatMoney(resultItem.lotteryIssue)}期</span>
//                             <i>{Const.getBuyType(resultItem.buyType)}<em>{formatMoney(resultItem.orderAmount)}</em>元</i>
//                         </div>
//                         <div className="tab-item-r">
//                             <span className={riclassName}>{message}</span>
//                             <i>{date}</i>
//                         </div> */}
//               {/* 样式不一导致一直提样式bug  改变dom 结构  */}
//               <div className="tab-item-top">
//                 <span className="title">
//                   <span>{resultItem.lotteryName}</span>
//                   <span className="title-issue">
//                     {resultItem.lotteryIssue}期
//                   </span>
//                   {resultItem.orderType === 1 || resultItem.orderType === 2 ? (
//                     <b className={ copyStyle }>
//                       {' '}
//                       {this.orderType[resultItem.orderType]}{' '}
//                     </b>
//                   ) : (
//                     ''
//                   )}
//                 </span>
//                 <span className={ riclassName }>{message}</span>
//                 {nowLottery ? (
//                   <img
//                     className="nowLottery"
//                     src={ require('@/img/dangqian@2x.png') }
//                     alt=""
//                   />
//                 ) : (
//                   ''
//                 )}
//               </div>
//               <div className="tab-item-bottom">
//                 <span>
//                   {resultItem.orderType === 3
//                     ? '抄单'
//                     : Const.getBuyType(resultItem.buyType)}
//                   <em className="red">{formatMoney(resultItem.orderAmount)}</em>
//                   元
//                 </span>
//                 <span className="grey">{date}</span>
//               </div>
//             </div>
//           );

//           result.push(itemCtr);
//         }
//       }
//       if (result.length > 0) {
//         if (data.total > result.length) {
//           result.push(
//             <div
//               key={ 'lm' }
//               className="load-more"
//               onClick={ this.loadMore.bind(this, this.params2) }
//             >
//               点击加载更多
//             </div>
//           );
//         }
//         return result;
//       }
//     }
//     return <NoMsg style={ { marginTop: 20 } } msg={ '没有方案！' } />;
//   }
//   render() {
//     // console.log(this.state.orderInfoAll, 'orderAll');
//     let { show, activeTab, activeLi } = this.state;
//     return (
//       <div className="tab-list yc-pt">
//         <section className="tab-header">
//           <div
//             data-index={ 1 }
//             className={ activeTab == 1 ? 'tab-active' : '' }
//             onClick={ this.tabClick.bind(this) }
//           >
//             <span ref="title">全部方案</span>
//             <i
//               className={
//                 activeTab == 1
//                   ? show ? 'icon-arrow-u-blue' : 'icon-arrow-d-blue'
//                   : 'icon-arrow-d'
//               }
//             />
//           </div>
//           <div
//             className={ activeTab == 2 ? 'tab-active' : '' }
//             data-index={ 2 }
//             onClick={ this.tabClick.bind(this) }
//           >
//             中奖方案
//           </div>
//           <div
//             className={ activeTab == 3 ? 'tab-active' : '' }
//             data-index={ 3 }
//             onClick={ this.tabClick.bind(this) }
//           >
//             待开奖方案
//           </div>
//         </section>
//         {/* 点击全部方案下拉列表 */}
//         <section className={ cx('all-plan', show ? '' : 'cxHide') }>
//           <ul>
//             <li onClick={ this.checkPlan.bind(this, 1) }>
//               <div className={ activeLi == 1 ? 'blue flex' : 'flex' }>代购</div>
//               <div className={ activeLi == 1 ? 'icon-choice' : '' } />
//             </li>
//             <li onClick={ this.checkPlan.bind(this, 2) }>
//               <div className={ activeLi == 2 ? 'blue flex' : 'flex' }>追号</div>
//               <div className={ activeLi == 2 ? 'icon-choice' : '' } />
//             </li>
//             <li onClick={ this.checkPlan.bind(this, 3) }>
//               <div className={ activeLi == 3 ? 'blue flex' : 'flex' }>合买</div>
//               <div className={ activeLi == 3 ? 'icon-choice' : '' } />
//             </li>
//             <li
//               className="showflex align-items"
//               onClick={ this.checkPlan.bind(this, 4) }
//             >
//               <div className={ activeLi == 4 ? 'blue flex' : 'flex' }>抄单</div>
//               <div className={ activeLi == 4 ? 'icon-choice' : '' } />
//             </li>

//             <li
//               className="showflex align-items"
//               onClick={ this.checkPlan.bind(this, 5) }
//             >
//               <div className={ activeLi == 5 ? 'blue flex' : 'flex' }>全部购买类型</div>
//               <div className={ activeLi == 5 ? 'icon-choice' : '' } />
//             </li>
//           </ul>
//         </section>
//         <div className="sc-swiper">
//           <div className="wrapper">
//             {/* <div className="pull-down">下拉刷新...</div> */}
//             <div className="swiper-container">
//               <div className="swiper-wrapper">
//                 <div className="swiper-slide">
//                   {this.getScrollItem(this.state.orderInfoAll || {}, activeLi)}
//                 </div>
//                 <div className="swiper-slide">
//                   {this.getScrollItem(this.state.orderInfoWin || {})}
//                 </div>
//                 <div className="swiper-slide">
//                   {this.getScrollItem(this.state.orderInfoPending || {})}
//                 </div>
//               </div>
//             </div>
//             {/* <div className="pull-up">上拉加载...</div> */}
//           </div>
//         </div>
//         {/* 路由跳转 */}
//         <Link to="/numberLottery" ref="numberLottery" />
//       </div>
//     );
//   }
// }
