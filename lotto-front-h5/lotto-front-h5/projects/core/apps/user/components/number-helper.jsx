// /**
//  * Created by 杨利东
//  * date 2017-5-10
//  * desc:个人中心模块--数字彩订单处理
//  */
// import React,{Component} from 'react';
// import OrderHelper from "./order-helper";
// import cx from "classnames";
// // import "../../scss/user/lottery-container.scss";

// export default {
//     //1：追号中；2：中奖停追；3：追号结束；4：用户撤单；5：系统撤单；
//     addStatus: ["", "追号中", "中奖停追", "追号结束", "用户撤单", "系统撤单"],
//     //1：追号成功；2：追号失败；3：系统撤单；4：用户撤单；5：等待追号;6撤单中，7停追撤单中，8用户撤单中
//     addFAStatus: ["", "追号成功", "追号失败", "系统撤单", "用户撤单", "等待追号", "撤单中","停追撤单中","用户撤单中"],

//     /**
//      * 获取双色球胆拖 大乐透 ：01,02#03,04,05,06,07,08|11,12
//      */
//     showSsqDanDetail(dataDetail,drawCode){
//         // drawCode  01,02,03,04,05,06|07
//         drawCode = drawCode ||'';
//         let drawArr = [ ];
//         drawArr = drawCode.split('|');
//         drawArr[0] = drawArr[0] ||''; //redBall
//         drawArr[1] = drawArr[1] ||''; //blueabll
//         let planContent = dataDetail.planContent || "";
//         let arr = planContent.split("|");
//         arr[0] = arr[0] || "";arr[1] = arr[1] || "";
//         let dantuo = arr[0].split("#");
//         console.log(dantuo,"dantuo")
//         console.log(drawArr,"drawArr")
//         dantuo[0] = dantuo[0] || "";dantuo[1] = dantuo[1] || "";
//         dataDetail = dataDetail || {};
//         let childName = OrderHelper.getChildName(dataDetail);

//         return <div key={this.showKey} className="plan-item-f">
//             <div className="plan-item-f-w">
//                 <i className="grey">[{childName}]</i>
//                 <em className="green">[前区胆码]</em>
//                 <span>{OrderHelper.handleSsqDanRed(dantuo[0],drawArr[0])}</span>
//             </div>
//             <div className="plan-item-f-w">
//                 <div className="cm-hidden"><span style={{visibility:"hidden"}}>[{childName}]</span></div>
//                 <em>[前区拖码]</em>
//                 <span>{OrderHelper.handleSsqDanRed(dantuo[1],drawArr[0])}</span>
//             </div>
//             <div className="plan-item-f-w">
//                 <div className="cm-hidden"><span style={{visibility:"hidden"}}>[{childName}]</span></div>
//                 <em>[后区号码]</em>
//                 <span>{OrderHelper.handleSsqDanRed(arr[1],drawArr[1],true)}</span>
//             </div>
//             <div className="plan-item-f-w">
//                 <div className="cm-hidden"><span style={{visibility:"hidden"}}>[{childName}][投注信息]{" "}</span></div>
//                 <span className="orange">[{dataDetail.buyNumber}注 * {dataDetail.multiple}倍 = {dataDetail.amount}元]</span>
//             </div>
//         </div>
//     },

//     // 一般普通胆拖
//     showDanDetail(dataDetail,drawCode,drawCodeType){
//         let planContent = dataDetail.planContent || "";
//         let dantuo = planContent.split("#");
//         dantuo[0] = dantuo[0] || "";dantuo[1] = dantuo[1] || "";
//         dataDetail = dataDetail || {};
//         let childName = OrderHelper.getChildName(dataDetail);
//         return <div key={this.showKey} className="plan-item-f">
//             <div className="plan-item-f-w">
//                 <div className="name">
//                     <i className="grey">[{childName}]</i>
//                     <em className="green">[胆码]</em>
//                 </div>
//                 <span>
//                     {
//                         // 未开奖 状态
//                         drawCode == "" ?
//                         <i>{ dantuo[0].replace(/,/g," ") }</i>
//                         :
//                         OrderHelper.handleDanTuoRed(dataDetail,dantuo[0],drawCode,drawCodeType)
//                     }
//                 </span>
//                 {/* <span>{ OrderHelper.handleDanTuoRed(dataDetail,dantuo[0],drawCode,drawCodeType) }</span> */}
//             </div>
//             <div className="plan-item-f-w">
//                 <div className="name">
//                     <span style={{visibility:"hidden"}}>[{childName}]</span>
//                     <em>[拖码]</em>
//                 </div>
//                 <span>
//                     { // 未开奖 状态
//                         drawCode == "" ?
//                         <i>{ dantuo[1].replace(/,/g," ") }</i>
//                         :
//                         OrderHelper.handleDanTuoRed(dataDetail,dantuo[1],drawCode,drawCodeType)
//                     }
//                 </span>
//                 {/* <span>{ OrderHelper.handleDanTuoRed(dataDetail,dantuo[1],drawCode,drawCodeType) }</span> */}
//             </div>
//             <div className="plan-item-f-w">
//                 <div className="cm-hidden "><span style={{visibility:"hidden"}}>[{childName}胆拖][投注]{" "}</span></div>
//                 <span className="orange">[{dataDetail.buyNumber}注 * {dataDetail.multiple}倍 = {dataDetail.amount}元]</span>
//             </div>
//         </div>
//     },

//     // 方案详情投注内容 开奖号码标红 单复式
//     showMulDetail(dataDetail,drawCode,drawType){
//         let result;
//         let childName = OrderHelper.getChildName(dataDetail);
//         let num ; // 投注内容
//         if(drawCode != "") {
//             num = OrderHelper.handleOpenCodeRed(dataDetail,drawCode,drawType);
//         }else {
//             num = OrderHelper.handleNumContent(dataDetail,drawType);
//         }
//         let touzhu = <span className="orange">
//             {   //注数太大 出现换行问题 投注金额小于100 不换行
//                 parseInt(dataDetail.amount) < 100 ?
//                 '['+dataDetail.buyNumber + '注 *'+ dataDetail.multiple+'倍 =' + dataDetail.amount+'元]'
//                 :
//                 <span>[{dataDetail.buyNumber}注 * {dataDetail.multiple}倍<br />
//                 = {dataDetail.amount} 元] </span>
//             }
//         </span>;
//         if(dataDetail){
//             result = <div key={this.showKey} className="plan-item-h sd11x5">
//                         <div className="name">[{childName}] [{OrderHelper.contentTypeArr[dataDetail.contentType]}]</div>
//                         <div className={cx("draw",drawCode != "" ? "":"red")}>{num}</div>
//                         <div className="tou">{touzhu}</div>
//                     </div>
//         }else{
//             result = num;
//         }
//         return result;
//     },
//     /**
//      * 获取投注展示
//      */
//     getNumberShow: function(dataDetail,drawCode,drawCodeType){
//         let contentType = dataDetail.contentType; //类型
//         let lotteryCode = dataDetail.lotteryChildCode.toString().substring(0,3) || "";
//         let result;
//         this.showKey = (this.showKey || 1) + 1;
//         switch (contentType) {
//             case 1: //单式 1注
//             case 2: //复式 多注
//             case 6: //和值
//                 {
//                     result = this.showMulDetail(dataDetail,drawCode,drawCodeType);
//                 }break;
//             case 3: //胆拖
//                 {
//                     switch (lotteryCode) {
//                         case "100": //ssq
//                         case "102": //dlt
//                             {
//                                 result = this.showSsqDanDetail(dataDetail,drawCode);
//                             }break;
//                         default:
//                             result = this.showDanDetail(dataDetail,drawCode,drawCodeType);
//                             break;
//                     }
//                 }break;

//             default:
//                 break;
//         }
//         return result;
//     }
// }
