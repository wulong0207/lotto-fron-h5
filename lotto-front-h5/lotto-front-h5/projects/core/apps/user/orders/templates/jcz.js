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
// import BonusOptimal from './bonus-optimal.js';
// import { isEmpty } from 'lodash';

// // import '../../../../scss/user/lottoDetail/jcz.scss';
// import '../../../../scss/user/lottoDetail/jjcz.scss';
// import cx from "classnames";
// import util from '../util/util';

// //投注信息
// function handleResultKind(num) {
//     let kind = subInner(num,'','@');
//     switch (kind) {
//         case "3":
//             return num.replace(/3/,"胜")
//             break;
//         case "1":
//             return num.replace(/1/,"平")
//             break;
//         case "0":
//             return num.replace(/0/,"负")
//             break;
//         default:
//             break;
//     }
// }
// // 获取比分描述
// function getScoreDes(gameResult) {
//     let qReulst = '';
//     let classNames = '' ;
//     gameResult = gameResult || "";
//     if(gameResult.length>=2){
//         if(gameResult[0] == gameResult[1] && gameResult[0] == "9"){
//             qReulst = "平其他";
//         }else if(gameResult[0] == "9"){
//             qReulst = "胜其他";
//         }else if(gameResult[1] == "9"){
//             qReulst = "负其他";
//         }else{
//             qReulst = gameResult[0] + ":" + gameResult[1];
//         }
//     }
//     return <span className = {classNames}>{qReulst}</span>;
// }

// //获取进球数描述
// function getGoalDes(resultStr){
//     let classNames = '';
//     if(parseInt(resultStr[0]) >= 7){
//         resultStr = resultStr.replace(resultStr[0], "7+");
//     }
//     return <span className = {classNames}>{resultStr}</span> ;
// }

// //获取半全场描述
// function getHalfDes(gameResult) {
//     let classNames = '';
//     let result = "";
//     if(gameResult){
//         result = JJCHelper.getMatchDes(gameResult[0]) + "-" + JJCHelper.getMatchDes(gameResult[1]);
//     }
//     return <span className = {classNames}>{result}</span>;
// }

// function handleBetWin(kind,code,orderMatchZQBO) {
//     let bet = subInner(code,'','@');
//     switch (kind) {
//         case 'S'://胜平负
//             return bet == orderMatchZQBO.fullSpf
//             break;
//         case 'Z'://总进球
//             return bet == orderMatchZQBO.goalNum
//             break;
//         case 'Q'://全场比分
//             return bet == orderMatchZQBO.score
//             break;
//         case 'B'://半全场胜平负
//             return bet == orderMatchZQBO.hfWdf
//             break;
//         default:
//             if(kind.indexOf('R') > -1) {
//                 return bet == orderMatchZQBO.letSpf
//             }else {
//                 return ;
//             }
//             break;
//     }
// }

// function getMatchBet(kind,code,orderMatchZQBO) {
//     let result ;
//     let className = ""; // 中奖标红处理
//     if(isEmpty(orderMatchZQBO)) {
//         className = '';
//     }else {
//         className = handleBetWin(kind,code,orderMatchZQBO) ? 'orange-fill':'';
//     }
//     if(kind.indexOf("S") >= 0){
//         result = (<span className = {className}>{handleResultKind(code) }</span>);
//     }else if(kind.indexOf("R") >= 0){
//         result = <span className = {className}>
//             { handleResultKind(code) }
//         </span>;
//     }else if(kind.indexOf("Q") >= 0){ //kind: 2:0@5.00
//         let resultStr = subInner(code,'@',')');
//         let qResult = getScoreDes(subInner(code,'','@'));
//         result = (<span className = {className}>{`${qResult}  @ ${resultStr}`}</span>);
//     }else if(kind.indexOf("B") >= 0){ // 平平@8.7
//         let resultStr = subInner(code,'@','');
//         let hResult = getHalfDes(subInner(code,'','@'));
//         result = (<span className = {className}>{`${hResult}  @  ${resultStr}`}</span>);

//     }else if(kind.indexOf("Z") >= 0){
//         let resultStr = getGoalDes(code);
//         result = (<span className = {className}>{resultStr.replace(/@/,'球@')}</span>);
//     }
//     return result;
// }

// function getCaiguo(orderMatchZQBO,val) {
//     // console.log(val,'val',orderMatchZQBO)
//     let result;
//     if(isEmpty(orderMatchZQBO)) {
//         result = '--'
//     }else {
//         let kind = subInner(val,'','(');
//         switch (kind) {
//             case 'S'://胜平负
//                 result = JJCHelper.getMatchDes(orderMatchZQBO.fullSpf);
//                 break;
//             case 'Z'://总进球
//                 result = getGoalDes(orderMatchZQBO.goalNum);
//                 break;
//             case 'Q'://全场比分
//                 result = getScoreDes(orderMatchZQBO.score);
//                 break;
//             case 'B'://半全场胜平负
//                 result = getHalfDes(orderMatchZQBO.hfWdf);
//                 break;
//             default:
//                 if(kind.indexOf('R') > -1) {
//                     result = JJCHelper.getMatchDes(orderMatchZQBO.fullSpf);
//                 }else {
//                     return ;
//                 }
//                 break;
//         }
//     }
//     console.log(result,'result')
//     return result;
// }

// function Results({val,orderMatchZQBO}) {
//     let content = subInner(val,'(',')').split(',') ||[];
//     let kind = subInner(val,'','(');
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
//                             { getMatchBet(kind,m,orderMatchZQBO) }
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     );
// }

// function MixContent({betGameContent,orderMatchZQBO}) {
//     betGameContent = JJCHelper.spSort(betGameContent,["S","R","Z","Q","B"]); // 竞彩足球 胜平负 让 总 半全场 顺序
//     return (
//         <div>
//             {
//                betGameContent.split('_').map((val,i) => {
//                 let matchKind = JJCHelper.FootBall.getMatchKind(val);
//                 return <div key={i} className="jjc-item-b">
//                         <span className="jjc-item-b-l">{matchKind.txt}</span>
//                         <div className="jjc-item-b-m">
//                             <Results
//                                 val = { val }
//                                 orderMatchZQBO = {orderMatchZQBO}
//                             />
//                         </div>
//                         <div className="jjc-item-b-r">
//                             { getCaiguo(orderMatchZQBO,val)}
//                         </div>
//                     </div>
//                })
//             }
//         </div>
//     )
// }

// // spf
// function FullSpfContnet({betGameContent,orderMatchZQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let className = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>胜平负</b>
//             </span>

//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         if(!orderMatchZQBO.fullSpf) {
//                             className = '';
//                         }else {
//                             className = subInner(m,'','@') == orderMatchZQBO.fullSpf ? 'orange-fill':'';
//                         }
//                         return <div className = {className} key = {i}>
//                             {handleResultKind(m)}
//                         </div>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 {
//                     orderMatchZQBO.fullSpf ?
//                     handleResultKind(orderMatchZQBO.fullSpf)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // letspf
// function LetSpfContnet({betGameContent,orderMatchZQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let className = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>让分胜平负</b>
//             </span>

//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         if(!orderMatchZQBO.letSpf) {
//                             className = '';
//                         }else {
//                             className = subInner(betGameContent,'','@') == orderMatchZQBO.letSpf ? 'orange-fill':'';
//                         }
//                         return <div className = {className} key = {i}>
//                             让分{handleResultKind(m)}
//                         </div>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 {
//                     orderMatchZQBO.letSpf ?
//                     handleResultKind(orderMatchZQBO.letSpf)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // fullscore
// function FullScoreContnet({betGameContent,orderMatchZQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let className = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>全场比分</b>
//             </span>

//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         if(!orderMatchZQBO.score) {
//                             className = '';
//                         }else {
//                             className = subInner(betGameContent,'','@') == orderMatchZQBO.score ? 'orange-fill':'';
//                         }

//                         return <div className = {className} key = {i}>
//                             {getScoreDes(m)}@{subInner(m,'@','')}
//                         </div>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 {
//                     orderMatchZQBO.score ?
//                     getScoreDes(orderMatchZQBO.score)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // goalnum
// function GoalNumContnet({betGameContent,orderMatchZQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let className = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>总进球</b>
//             </span>

//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         if(!orderMatchZQBO.goalNum) {
//                             className = '';
//                         }else {
//                             className = subInner(betGameContent,'','@') == orderMatchZQBO.goalNum ? 'orange-fill':'';
//                         }
//                         return <div className = {className} key = {i}>
//                             {getGoalDes(m)}
//                         </div>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 {
//                     orderMatchZQBO.goalNum ?
//                     getGoalDes(orderMatchZQBO.goalNum)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// // hfwd
// function HfWdfContnet({betGameContent,orderMatchZQBO}) {
//     let betArr = subInner(betGameContent,'(',')').split(',') || [];
//     let className = '';
//     return (
//         <div className="jjc-item-b">
//             <span className="jjc-item-b-l">
//                 <b>半全场</b>
//             </span>

//             <div className="jjc-item-b-m">
//                 {
//                     betArr.map((m,i)=>{
//                         if(!orderMatchZQBO.hfWdf) {
//                             className = '';
//                         }else {
//                             className = subInner(betGameContent,'','@') == orderMatchZQBO.hfWdf ? 'orange-fill':'';
//                         }
//                         return <div className = {className} key = {i}>
//                             {getHalfDes(m)}
//                         </div>
//                     })
//                 }
//             </div>
//             <div className="jjc-item-b-r">
//                 {
//                     orderMatchZQBO.hfWdf ?
//                     getHalfDes(orderMatchZQBO.hfWdf)
//                     :
//                     '--'
//                 }
//             </div>
//         </div>
//     )
// }

// function MatchContent({lotteryChildCode,betGameContent,orderMatchZQBO}) {
//     switch (lotteryChildCode) {
//         case 30001:
//             return <MixContent
//                         orderMatchZQBO = {orderMatchZQBO}
//                         betGameContent = {betGameContent}
//                     />
//             break;
//         case 30002: // 胜平负
//             return <FullSpfContnet
//                         orderMatchZQBO = {orderMatchZQBO}
//                         betGameContent = {betGameContent}
//                     />
//             break;
//         case 30003: // 让球胜平负
//             return <LetSpfContnet
//                         orderMatchZQBO = {orderMatchZQBO}
//                         betGameContent = {betGameContent}
//                     />
//             break;
//         case 30004: //比分
//             return <FullScoreContnet
//                     orderMatchZQBO = {orderMatchZQBO}
//                     betGameContent = {betGameContent}
//                 />
//             break;
//         case 30005: //总进球
//             return <GoalNumContnet
//                     orderMatchZQBO = {orderMatchZQBO}
//                     betGameContent = {betGameContent}
//                 />
//             break;
//         case 30006: //半全场
//             return <HfWdfContnet
//                     orderMatchZQBO = {orderMatchZQBO}
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
//                             orderMatchZQBO = {val.orderMatchZQBO}
//                             lotteryChildCode = {lotteryChildCode}
//                         />

//                     </div>
//                 })
//             }

//         </div>
//     )
// }



// function Content({orderMatchInfoBOs,lotteryChildCode}) {
//     return (
//         <div className="plan-content">
//             <div className="plan-header">方案内容</div>
//             <div className="plan-col">
//                 <span className="col15">场次</span>
//                 <span className="col20">主队 VS 客队</span>
//                 <span className="col20">子玩法</span>
//                 <span className="col20">投注</span>
//                 <span className="col15">赛果</span>
//                 <span className="col10">胆</span>
//             </div>
//             <div className="plan-list">
//                 {
//                     orderMatchInfoBOs.map((m,i)=>{
//                         console.log(m,i)
//                         return (
//                             <div key={i} className="order-list">
//                                 <div className="col col15">
//                                     <span>{m.officalMatchCode.substring(0,2)}</span>
//                                     <span>{m.officalMatchCode.slice(2)}</span>
//                                     <span>{m.matchShortName}</span>
//                                 </div>
//                                 <div className="col col20">
//                                     <span>{m.homeName}</span>
//                                     <span>{m.date}</span>
//                                     <span>{m.visitiName}</span>
//                                 </div>
//                                 <div className="col col55">

//                                 </div>
//                                 <div className="col col10"></div>
//                             </div>
//                         )

//                     })
//                 }
//             </div>
//         </div>
//     )
// }

// export default function JCZTemplate({ order }) {
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
//                 { OrderHelper.getTicket(orderBaseInfoBO) }
//             </div>
//             <section className="jjc-section">
//             {
//                 bonusOptimal ?
//                 <BonusOptimal
//                     orderCode = {orderCode}
//                     orderBaseInfoBO = {orderBaseInfoBO}
//                 />
//                 :
//                 <Content
//                     orderMatchInfoBOs = {orderMatchInfoBOs}
//                     lotteryChildCode = {orderBaseInfoBO.lotteryChildCode}
//                 />
//             }
//             </section>
//         </div>
//     );
// }

// JCZTemplate.propTypes = {
//   order: PropTypes.object
// };
