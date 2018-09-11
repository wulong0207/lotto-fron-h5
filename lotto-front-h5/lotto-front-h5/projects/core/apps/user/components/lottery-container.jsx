// import React,{Component} from 'react';
// import { formatMoney, copyContent } from '../../utils/utils';
// import session from '../../services/session';
// import OrderHelper from "./order-helper";
// import MessageFn from '../../services/message';
// import { Message } from '../../component/message';
// import Header from '../../component/header';
// import Navigator from "../../utils/navigator";
// import Const from '../../utils/const';
// import http from '../../utils/request';
// import "../../scss/user/lottery-container.scss";
// import Order from "../../component/order";
// import cx from "classnames";

// export default class LotteryContainer extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             orderAmount:{},
//             timeout: 3,
//             ResultBO: {}
//         }
//     }

//     componentDidMount(){

//         if(this.props.reqAmount){
//             //this.sendMonneyDetail();
//         }

//         // this.refs.messageView.setState({visible: false});
//     }

//     lotteryProgress() {
//         let {orderBaseInfoBO, orderAmount} = this.props;

//         if(this.props.lotteryProgress){
//             this.props.lotteryProgress();
//         }

//         Navigator.goAddr("#/number-lottery-progress/" + orderBaseInfoBO.orderCode + "?lotteryChildCode="+orderBaseInfoBO.lotteryChildCode);
//     }

//     //复制订单编号
//     copyOrder(str){
//         copyContent(str);
//         MessageFn.toast("方案订单编号复制成功");
//     }

//     //发送订单金额信息
//     sendMonneyDetail(){
//         http.post('/order/queryOrderAmountDetail', {
//             token: session.get('token'),
//             type:1,
//             orderCode:this.lotteryItem.orderCode
//         }).then(res => {
//             this.setState({orderAmount: res.data || {}});
//         }).catch(err => {
//             MessageFn.toast(err.message);
//         });
//     }

//     /**
//      * 去下单
//      */
//     makeOrder(){
//         let timeout = this.state.timeout;
//         this.timer = setInterval(()=>{
//             timeout--;
//             this.setState({timeout:timeout});
//             if(timeout<=0){
//                 this.setState({timeout:3});
//                 this.messageRightBtnHandler();
//                 clearInterval(this.timer);
//             }
//         },1000);

//         this.refs.messageView.setState({visible: true});
//     }

//     messageOKHandler(){
//         this.setState({timeout: 3});
//         clearInterval(this.timer);
//         this.payHandler();
//     }

//     /**
//      * 获取订单详情
//      */
//     reqOrderDetail(orderBaseInfoBO){


//         if(!orderBaseInfoBO.orderCode){
//             return;
//         }

//         if(orderBaseInfoBO.orderCode == this.orderCode){
//             return;
//         }else{
//             this.orderCode = orderBaseInfoBO.orderCode;
//         }
//     }

//     componentWillReceiveProps(nextProps){
//         let {orderBaseInfoBO} = nextProps;
//         orderBaseInfoBO = orderBaseInfoBO || {};
//         this.reqOrderDetail(orderBaseInfoBO);
//     }

//     messageRightBtnHandler(){
//         let {orderBaseInfoBO} = this.props;
//         OrderHelper.canMakeOrder(orderBaseInfoBO, true);
//         clearInterval(this.timer);
//     }

//     //支付操作
//     payHandler(e){
//         let {orderBaseInfoBO, orderAmount, zhMsg1, zhMsg2} = this.props;
//         if(e){
//             e.stopPropagation();
//         }

//         OrderHelper.goDirectPay(orderBaseInfoBO.orderCode, orderBaseInfoBO.buyType);
//     }
//     render() {
        
//         let {orderBaseInfoBO, orderAmount, zhMsg1, zhMsg2} = this.props;
//         let {timeout,ResultBO} = this.state;
//         let description;
//         if(!orderAmount){
//             orderAmount = this.state.orderAmount;
//         }
        
//         description = OrderHelper.handleOrderDetail(orderBaseInfoBO);
//         let winArea = orderBaseInfoBO.winningStatus == 3 ||
//                         (orderBaseInfoBO.winningStatus == 4 || orderBaseInfoBO.preBonus)?
//                         {display:""}: {display: "none"};
//         let redCodeGet = orderBaseInfoBO.redCodeGet ? "(" + orderBaseInfoBO.redCodeGet + ")": "";
//         let payMoney = (orderBaseInfoBO.orderAmount || 0)-(orderBaseInfoBO.redAmount||0);
//         let infoBOs = orderBaseInfoBO.orderFlowInfoBO || {};
//         let openMessage = (infoBOs.createTime||"") + " " + (infoBOs.message||"");
//         openMessage = description.openMessage;
//         let addStatusView = orderBaseInfoBO.isDltAdd ? "追加投注": "";
//         let btnPay;
//         if(orderBaseInfoBO.payStatus == "1" || orderBaseInfoBO.payStatus == "7"){
//             btnPay = <div className="btn-pay" onClick={this.payHandler.bind(this)}>去支付</div>;
//         }else if(orderBaseInfoBO.payStatus == "4"){
//             btnPay = <div className="btn-pay" onClick={this.payHandler.bind(this)}>重新支付</div>;
//         }

//         let canMakeOrder = false;//OrderHelper.canMakeOrder(orderBaseInfoBO);
//         let makeview;
//         if(canMakeOrder){
//             makeview = <div className="menu-item margin-t10" onClick={this.makeOrder.bind(this)}>
//                 <span>{orderBaseInfoBO.lotteryName}</span>
//                 <div className="flex des gray">{orderBaseInfoBO.lotteryIssue}期-{Const.getBuyType(orderBaseInfoBO.buyType)} {addStatusView}</div>
//                 <div className="icon-arrow-r"></div>
//             </div>
//         }else{
//             makeview = <div className="menu-item margin-t10">
//                 <span>{orderBaseInfoBO.lotteryName}</span>
//                 <div className="flex des gray">{orderBaseInfoBO.lotteryIssue}期-{Const.getBuyType(orderBaseInfoBO.buyType)} {addStatusView}</div>
//             </div>
//         }

//         return <div>
//             <div className="pt-header sc-lc lottery-container">
//                 {/* <Header title="方案详情" back={this.goTo.bind(this)}/> */}
//                 <Header title="方案详情" back={()=>{ location.href='/sc.html#/' }} />
//                 <div className="xq-header menu-item">
//                 {/* <div className="xq-header menu-item" onClick={this.lotteryProgress.bind(this)}> */}
//                     <img className="icon-ten" src={description.img}></img> 
//                     <div className={"lot-status-m "+ description.color}>
//                         <span>{orderBaseInfoBO.orderFlowUnionStatusText ? orderBaseInfoBO.orderFlowUnionStatusText : orderBaseInfoBO.addOrderFlowUnionStatusText}{btnPay}</span>
//                         {/* <em>{description.openDate}</em> */}
//                         <em>{description.openMessage}</em> 
                        
//                     </div>
//                     {/* <div className="icon-arrow-r"></div> */}
//                  </div> 
//                 <div className="pay-area" style={winArea}>
//                     <div className="pa-item">
//                         <div className="item-left">税前奖金</div>
//                         <div className={cx('item-right', orderBaseInfoBO.aftBonus ? 'red':'')}>
//                             &yen;{formatMoney(orderBaseInfoBO.preBonus)}
//                         </div>
//                     </div>
//                     <div className="pa-item">
//                         <div className="item-left">税后奖金</div>
//                         <div className="item-right red">&yen;{formatMoney(orderBaseInfoBO.aftBonus)}</div>
//                     </div>
//                     <div className="pa-item last-item" style={{display : orderBaseInfoBO.getRedAmount ? " " : "none"}}>
//                         <div className="item-left">加奖奖金<div className="gray">{orderBaseInfoBO.redNameGet}{redCodeGet}</div></div>
//                         <div className="item-right">&yen;{formatMoney(orderBaseInfoBO.getRedAmount)}</div>
//                     </div>
//                 </div>
//                 {makeview}
//                 {this.props.children}
//                 <section className="plan-info-section">
//                     <div className="pay-area showflex">
//                         <div className="flex">
//                             <div className="fadd">方案订单编号:{" "}{orderBaseInfoBO.orderCode}</div>
//                             {/*<em>方案订单支付流水号:D16712587963214789233</em>*/}
//                         </div>
//                         <div className="flex ar" onClick={this.copyOrder.bind(this, orderBaseInfoBO.orderCode)} className="btn-round-blue">复制</div>
//                     </div>
//                     <div className="pay-area">
//                         <div className="pa-item">
//                             <div className="item-left">方案订单总额</div>
//                             <div className="item-right">&yen;{formatMoney(orderBaseInfoBO.orderAmount)}</div>
//                         </div>
//                         <div className="pa-item" style={{display:orderBaseInfoBO.buyType=='4'?"none":""}}>
//                             <div className="item-left">方案总倍数</div>
//                             <div className="item-right red">{orderBaseInfoBO.multipleNum}</div>
//                         </div>
//                         <div className="pa-item last-item" style={{display:orderBaseInfoBO.redCode?"":"none"}}>
//                             <div className="item-left">方案订单优惠
//                                 <div className="gray direction-clumn" style={{display:orderBaseInfoBO.redCode?"":"none"}}>
//                                     <span>{orderBaseInfoBO.redName}</span>
//                                     <span>({orderBaseInfoBO.redCode})</span>
//                                 </div>
//                             </div>
//                             <div className="item-right">&yen;{formatMoney(orderBaseInfoBO.redAmount)}</div>
//                         </div>
//                     </div>
//                     <div className="pay-area showflex">
//                         <div className="flex">实际支付金额</div>
//                         <div className="flex ar red">&yen;{formatMoney(payMoney)}</div>
//                     </div>
//                 </section>
//                 {/* 路由调整 */}
//             </div>
//             <Message ref="messageView"
//                 params={{
//                     title: `${timeout} 秒后自动选择“自选号投注”`,
//                     btnTxt: ['继续投注该号码', '自选号投注'],
//                     btnFn: [()=>{this.messageOKHandler.bind(this)}, ()=>{this.messageRightBtnHandler.bind(this)}]
//                 }}>
//             </Message>
//         </div>
//     }
// }
