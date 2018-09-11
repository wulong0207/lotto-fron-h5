// /*
//  * @Author: nearxu
//  * @Date: 2017-10-12 20:23:10 
//  * 竞彩足球 
//  */


// import React , {Component} from 'react';
// import PropTypes from 'prop-types';
// import http from '../../../../utils/request';
// import OrderHelper from '../../order-helper.jsx';
// import { subInner } from '../../../../utils/utils';
// import JJCHelper from '../../jjc-helper.jsx';
// import BonusOptimal from './jcl-bonus.js';
// import { isEmpty } from 'lodash';

// import '../../../../scss/user/lottoDetail/jcz.scss';
// import cx from "classnames";
// import util from '../util/util';


// //投注信息
// function handleResultKind(num,type) {
//     let kind = subInner(num,'','@');
//     switch (kind) {
//         case "3":
//             return type ? num.replace(/3/,"让分主胜") : num.replace(/3/,"主胜")
//             break;
//         case "1":
//             return type ? num.replace(/1/,"让分主平") : num.replace(/1/,"主平")
//             break;
//         case "0":
//             return type ? num.replace(/0/,"让分主负") : num.replace(/0/,"主负")
//             break;
//         default:
//             break;
//     }
// }

// // 让分胜负的彩果
// function getLetWf(val,letWf) {
//     let caiguo = '';
//     let matchKey = subInner(val,'[',']');
//     matchKey = matchKey.match(/\d+(\.\d)?/)
//     if(matchKey) {
//         matchKey = matchKey[0];
//     }
//     let letWfArr = letWf.split(',') ||[];
//     for(var i=0;i<letWfArr.length;i++) {
//         if(letWfArr[i].indexOf(matchKey) > -1) {
//             if(letWfArr[i].split('|')[1] == "3") {
//                 caiguo = "让分主胜";
//             }else {
//                 caiguo = "让分主负";
//             }
//         }
//     }
//     return caiguo;
// }

// // 大小分 彩果
// function getDxf(val,dxfWF) {
//     let caiguo = '';
//     let arr = dxfWF.split(',') ||[];
//     let matchKey = subInner(val,'[',']');
//     matchKey = matchKey.match(/\d+(\.\d)?/)
//     if(matchKey) {
//         matchKey = matchKey[0];
//     }
//     for(var i=0;i<arr.length;i++) {
//         if(arr[i].indexOf(matchKey) > -1) {
//             if(arr[i].split('|')[1] == "99") {
//                 caiguo = "大分";
//             }else {
//                 caiguo = "小分";
//             }
//         }
//     }
//     return caiguo;
// }

// // 胜分差
// function getSfcWF(sfcWF) {
//     let result = "";
//     switch(sfcWF){
//         case "01": result = "主胜1-5";break;
//         case "02": result = "主胜6-10";break;
//         case "03": result = "主胜11-15";break;
//         case "04": result = "主胜16-20";break;
//         case "05": result = "主胜21-25";break;
//         case "06": result = "主胜26+";break;

//         case "11": result = "主负1-5";break;
//         case "12": result = "主负6-10";break;
//         case "13": result = "主负11-15";break;
//         case "14": result = "主负16-20";break;
//         case "15": result = "主负21-25";break;
//         case "16": result = "主负26+";break;
//     }

//     return result;
// }

// /* 竞彩篮球 是否中奖 
//     D 大小分 99 大 00 小
//     C 胜分差 主胜1-5(01)  6-10(02) 11-15(03) 16-20(04) 21-25(05) 26+(06)
//                 客胜 1-5(11)  6-10(12) 11-15(13) 16-20(14)  21-25(15) 26+(16)
//     R 让分胜负 胜(3) 负(0)
//     S 胜负 胜(3) 负(0)
//     orderMatchLQBO:{
//         dxfwf:"148.5|99,149.5|99,150.5|99,151.5|99"  	大小分
//         fullScore:"100:120" 	全场比分
//         fullWf:"3" 全场胜负 3：胜，0：负
//         letWf:"-1.5|3,2.5|3,3.5|3" 	让分胜负 3：胜，0：负
//         胜分差
//         sfcWF:"04"
//             主胜1-5(01)  6-10(02) 11-15(03) 16-20(04) 21-25(05) 26+(06)
//             主负1-5(11)  6-10(12) 11-15(13) 16-20(14) 21-25(15) 26+(16)

//     }
// */ 
// //orderMatchLQBO 竞彩篮球 各彩种 开奖信息
// function handleBetWin(code,item,orderMatchLQBO) {
//     let id = code.substring(0,1);
//     switch (id) {
//         case "D": //大小分
//             {
//                 let val = item.substring(0,2) || '';
//                 let dxfArr = orderMatchLQBO.dxfWF.split(',') ||[]; // ["148.5|99","149.5|99"]
//                 let drawVal = subInner(code,"[",']')
//                 drawVal = drawVal.match(/\d+(\.\d)?/); //'150.23' => 150.2
//                 if(drawVal) {
//                     drawVal = drawVal[0];
//                 }     
//                 for(var i=0;i<dxfArr.length;i++){
//                     if(dxfArr[i].split('|')[0].indexOf(drawVal) > -1){
//                         return dxfArr[i].split('|')[1] == val;                          
//                     }
//                 }
//             }
//             break;
//         case "R": //让分胜负
//             {
//                 let val = item.substring(0,1) || '';
//                 let letWfArr = orderMatchLQBO.letWf.split(',') ||[]; // ["1.5|3","2.5|0"]
//                 let drawVal = subInner(code,"[",']')
//                 drawVal = drawVal.match(/\d+(\.\d)?/);
//                 if(drawVal) {
//                     drawVal = drawVal[0];
//                 }                  
//                 for(var i=0;i<letWfArr.length;i++){
//                     if(letWfArr[i].split('|')[0].indexOf(drawVal) > -1){
//                         return letWfArr[i].split('|')[1] == val;                          
//                     }
//                 }
//             }
//             break;
//         case "S": //胜负
//         case "C": //胜分差
//             {
//                 let cId = parseInt(item.split('@')[0]); //数字 item == 04@2.3
//                 let val = 0;
//                 if(id =="S"){
//                     val = parseInt(orderMatchLQBO.fullWf);
//                 }else {
//                     val = parseInt(orderMatchLQBO.sfcWF);
//                 }
//                 if(val == cId){
//                     return val == cId;
//                 }
//             }
//             break;
//         default:
//             break;
//     }
// }

// function getMatchBet(val,code,orderMatchLQBO) {
//     let result ;
//     let className = ""; // 中奖标红处理
//     let kind = subInner(val,'','(');
//     if(isEmpty(orderMatchLQBO)) {
//         className = '';
//     }else {
//         className = handleBetWin(val,code,orderMatchLQBO) ? 'orange-fill':'';
//     }
//     if(kind.indexOf("S") >= 0){
//         result = <span className = {className}>
//             {handleResultKind(code) }
//         </span>;
//     }else if(kind.indexOf("R") >= 0){
//         result = <span className = {className}>
//             { handleResultKind(code,true) }
//         </span>;
//     }else if(kind.indexOf("D") >= 0){ //大小分
//         //  小分@1.50  ==>  小分[126.00]1.55
//         result = <span className={className}>
//             {JJCHelper.BasketBall.getDxDes(code)}
//         </span>;
//     }else if(kind.indexOf("C") >= 0){ // 胜分差 
//         result = <span className = {className}>
//             { JJCHelper.BasketBall.getSfcDes(subInner(code,'','@')) }
//             @{subInner(code,'@','')}
//         </span>;
//     }    
//     return result;
// }

// function getCaiguo(orderMatchLQBO,val) {
//     let result;
//     if(isEmpty(orderMatchLQBO)) {
//         result = '--'
//     }else {
//         let kind = subInner(val,'','(');
//         switch (kind) {
//             case 'S'://胜平负
//                 result = '主' + JJCHelper.getMatchDes(orderMatchLQBO.fullWf);
//                 break;
//             case 'C'://胜分差
//                 result = getSfcWF(orderMatchLQBO.sfcWF);
//                 break;
//             default:
//                 if(kind.indexOf('R') > -1) {
//                     result = getLetWf(val,orderMatchLQBO.letWf);
//                 }else if(kind.indexOf('D') > -1) {
//                     result = getDxf(val,orderMatchLQBO.dxfWF);
//                 }
//                 break;
//         }
//     }
//     return result;
// }

// function Results({val,orderMatchLQBO}) {
//     let content = subInner(val,'(',')').split(',') ||[];
//     let rContent = '';
//     if(val.indexOf('R') > -1) {
//         rContent = subInner(val,'[',']');
//     } 
//     return (
//         <div>
//             {
//                 content.map((m,i) => {
//                     return (
//                         <div key={i}>                               
//                             { getMatchBet(val,m,orderMatchLQBO) }
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     );
// }

// function MixContent({betGameContent,orderMatchLQBO}) {
//     betGameContent = JJCHelper.spSort(betGameContent,["S","R","D","C"]); // 竞彩篮球 胜负 让分胜负 大小分 胜分差 
//     return (
//         <div>
//             {
//                betGameContent.split('_').map((val,i) => { 
//                 let matchKind = JJCHelper.BasketBall.getMatchKind(val);
//                 return <div key={i} className="jjc-item-b">
//                         <span className="jjc-item-b-l">{matchKind.txt}</span>
//                         <div className="jjc-item-b-m">
//                             <Results
//                                 val = { val }
//                                 orderMatchLQBO = {orderMatchLQBO} 
//                             />
//                         </div>
//                         <div className="jjc-item-b-r">
//                             { getCaiguo(orderMatchLQBO,val)}
//                         </div>
//                     </div> 
//                }) 
//             }
//         </div> 
//     )
// }

// // 让分
// function LetSFContnet({betGameContent,orderMatchLQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let classNames = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>让分胜负</b>
//                 <b>{subInner(betGameContent,'[',']')}</b>
//             </span>
              
//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         return <span className = {classNames} key = {i}> 
//                             {handleResultKind(m)}
//                         </span>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 { 
//                     orderMatchLQBO.letWf ?
//                     getLetWf(betGameContent,orderMatchLQBO.letWf)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // 大小分
// function DxfWFContnet({betGameContent,orderMatchLQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let classNames = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>大小分</b>
//                 <b>[{subInner(betGameContent,'[',']')}]</b>
//             </span>
              
//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         return <span className = {classNames} key = {i}> 
//                             { JJCHelper.BasketBall.getDxDes(m) }
//                         </span>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 { 
//                     orderMatchLQBO.dxfWF ?
//                     getDxf(betGameContent,orderMatchLQBO.dxfWF)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // 胜分差
// function SFCContnet({betGameContent,orderMatchLQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let classNames = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>胜分差</b>
//             </span>
              
//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         return <span className = {classNames} key = {i}> 
//                             { JJCHelper.BasketBall.getSfcDes(subInner(m,'','@')) }
//                             @{subInner(m,'@','')}
//                         </span>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 { 
//                     orderMatchLQBO.sfcWF ?
//                     getSfcWF(orderMatchLQBO.sfcWF)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // 胜负
// function FullWfContnet({betGameContent,orderMatchLQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let classNames = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>胜负</b>
//             </span>
              
//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         return <span className = {classNames} key = {i}> 
//                             {handleResultKind(m)}
//                         </span>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 { 
//                     orderMatchLQBO.fullWf ?
//                     handleResultKind(orderMatchLQBO.fullWf)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// function MatchContent({lotteryChildCode,betGameContent,orderMatchLQBO}) {
//     switch (lotteryChildCode) {
//         case 30105:
//             return <MixContent 
//                         orderMatchLQBO = {orderMatchLQBO}
//                         betGameContent = {betGameContent}
//                     />
//             break;
//         case 30101: // 胜负
//             return <FullWfContnet 
//                         orderMatchLQBO = {orderMatchLQBO}
//                         betGameContent = {betGameContent}
//                     />
//             break;
//         case 30102: // letSf
//             return <LetSFContnet 
//                         orderMatchLQBO = {orderMatchLQBO}
//                         betGameContent = {betGameContent}
//                     />
//             break;
//         case 30103: //大小分
//             return <DxfWFContnet 
//                     orderMatchLQBO = {orderMatchLQBO}
//                     betGameContent = {betGameContent}
//                 />
//             break;
//         case 30104: //胜分差
//             return <SFCContnet 
//                     orderMatchLQBO = {orderMatchLQBO}
//                     betGameContent = {betGameContent}
//                 />
//             break;
//         default:
//             break;
//     }
// }

// function Match({orderMatchInfoBOs,lotteryChildCode}) {
//     return ( 
//         <div>
//             {
//                 orderMatchInfoBOs.map((val,j) =>{
//                     return <div key={j} className="jjc-item">
//                         <div className="jjc-item-h">
//                             <span>{val.officalMatchCode} {val.matchShortName}</span>   
//                             <span>{val.homeName} <em className="c999">vs</em> {val.visitiName}</span>
//                             <span className="text-right">{ util.getMathInfo(val) }</span>
//                         </div>

//                         <MatchContent 
//                             betGameContent = { val.betGameContent }
//                             orderMatchLQBO = {val.orderMatchLQBO}
//                             lotteryChildCode = {lotteryChildCode}
//                         />
                        
//                     </div>
//                 })
//             }
        
//         </div>    
//     )
// }

// // jcl
// export default function JCLTemplate({ order }) {
//     let orderBaseInfoBO = order.orderBaseInfoBO || {}; //	订单基本信息
//     let orderMatchInfoBOs = order.orderMatchInfoBOs || []; //竞技彩方案详情结果集
//     let bonusOptimal = false; // 默认不是奖金优化
//     // 投注类型  2:单场制胜; 3:奖金优化
//     let orderCode = orderBaseInfoBO.orderCode;
//     if(orderBaseInfoBO.categoryId == 2 || orderBaseInfoBO.categoryId == 3) {
//             bonusOptimal = true;
//     }
//     return (
//         <div> 
//             <div className={cx('lot-item zh-item',(orderBaseInfoBO.categoryId == 2 || orderBaseInfoBO.categoryId == 3) ? "cxHide" : "")}>
//                 <span>过关方式</span>
//                 <em className="lot-item-m c333">{JJCHelper.getPassStyle(orderBaseInfoBO.bunchStr)}</em>
//                 {/*<em onClick={this.lotteryDetail.bind(this)}>出票明细</em>*/}
//             </div>
//             <section className="plan-section">
//             {
//                 bonusOptimal ?
//                 <BonusOptimal
//                     orderCode = {orderCode}
//                     orderBaseInfoBO = {orderBaseInfoBO}
//                 />
//                 :
//                 <Match 
//                     orderMatchInfoBOs = {orderMatchInfoBOs}
//                     lotteryChildCode = {orderBaseInfoBO.lotteryChildCode}
//                 />
//             } 
//             </section>
//         </div>
//     );
// }

// JCLTemplate.propTypes = {
//   order: PropTypes.object
// };
