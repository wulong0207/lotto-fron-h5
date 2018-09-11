// import React , {Component} from 'react';
// import PropTypes from 'prop-types';
// import http from '../../../../utils/request';
// import JJCHelper from '../../jjc-helper.jsx';
// import session from '../../../../services/session';
// import { getParameter , subInner } from '../../../../utils/utils';
// import Message from '../../../../services/message';
// import { isEmpty } from 'lodash';

// import '../../../../scss/user/lottoDetail/bonus-optimal.scss';

// // 获取比分描述 Q 半全场胜负
// function getScoreDes(gameResult){
//     //gameResult 99 90 09
//     let qReulst = '';
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
//     return qReulst;
// }

// //获取半全场描述
// function getHalfDes(gameResult){
//     let result = "";
//     if(gameResult){
//         result = JJCHelper.getMatchDes(gameResult[0]) + "-" + JJCHelper.getMatchDes(gameResult[1])
//     }
//     return result;
// }

// //获取进球数描述
// function getGoalDes(resultStr){
//     if(parseInt(resultStr[0]) >= 7){
//         resultStr = resultStr.replace(resultStr[0], "7+");
//     }
//     return resultStr ;
// }

// //是否中奖
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

// function handleCodeWin(lotteryChildCode,betGameContent,orderMatchZQBO) {
//     let bet = subInner(betGameContent,'','@');
//     switch (lotteryChildCode) {
//         case 30002://胜平负
//             return bet == orderMatchZQBO.fullSpf
//             break;
//         case 30003://让球胜平负
//             return subInner(betGameContent,'[',']') == orderMatchZQBO.letSpf
//             break;
//         case 30005://总进球
//             return bet == orderMatchZQBO.goalNum
//             break;
//         case 30004://全场比分
//             return bet == orderMatchZQBO.score
//             break;
//         case 30006://半全场胜平负
//             return bet == orderMatchZQBO.hfWdf
//             break;
//         default:
//             break;
//     }
// }

// function getCaiGuo(lotteryChildCode,betGameContent,orderMatchZQBO) {
//     let classnames = '';
//     let result;
//     if(isEmpty(orderMatchZQBO)) {
//         classnames = '';
//     }else {
//         classnames = handleCodeWin(lotteryChildCode,betGameContent,orderMatchZQBO) ? 'red':'';
//     }

//     switch (lotteryChildCode) { // 默认采用 code值
//        case 30001: //混投
//             result = handleMixBet(betGameContent)
//             break;
//         case 30002: //胜平负
//             result = <div>
//                 <span className = {classnames} >
//                     {JJCHelper.getMatchDes(subInner(betGameContent,'(','@'))}
//                 </span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>  
//             break;
//         case 30003: // 让球胜平负
//             result = <div>
//                 <span className = {classnames} >
//                     {JJCHelper.getMatchDes(subInner(betGameContent,'(','@'))}
//                     {`[${subInner(betGameContent,'[',']')}]`}
//                 </span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>   
//             break;
//         case 30004: //比分
//             result = <div>
//                 <span className = {classnames} >{getHalfDes(subInner(betGameContent,'(','@'))}</span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>
//             break;
//         case 30005: //总进球
//             result = <div>
//                 <span className = {classnames} >{getGoalDes(subInner(betGameContent,'(','@'))}球</span>
//                 <span className = {classnames} >{subInner(betGameContent,"@",")")}</span>
//             </div>
//             break;
//         case 30006: //半全场
//             result = <div>
//                 <span className = {classnames} >{getScoreDes(subInner(betGameContent,'(','@'))}</span>
//                 <span className = {classnames} >{subInner(betGameContent,"@",")")}</span>
//             </div>
//             break;
//        default:
//            break;
//     }
//     return result;
// }

// function handleMixBet(betGameContent) {
//     let classnames = '';
//     let kind = subInner(betGameContent,"","(");
//     let result;
//     switch (kind) { //jcz SRZQB
//         case "S":{
//             result = <div>
//                 <span className = {classnames} >
//                     {JJCHelper.getMatchDes(subInner(betGameContent,'(','@'))}
//                 </span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>
//         }break;
//         case "Z":{
//             result = <div>
//                         <span className = {classnames} >{getGoalDes(subInner(betGameContent,"(","@"))}球</span>
//                         <span className = {classnames} >{subInner(betGameContent,"@",")")}</span>
//                     </div>
//         }break;
//         case "Q":{
//             result = <div>
//                         <span className = {classnames} >{getScoreDes(subInner(betGameContent,"(","@"))}</span>
//                         <span className = {classnames} >{subInner(betGameContent,"@",")")}</span>
//                     </div>
//         }break;
//         case "B":{
//             result = <div>
//                         <span className = {classnames} >{getHalfDes(subInner(betGameContent,"(","@"))}</span>
//                         <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//                     </div>
//         }break;
//         default:
//         {
//             if(kind.indexOf('R') > -1) {
//                 let  id= subInner(betGameContent,'(','@');
//                 result = <div>
//                     <span className = {classnames} >
//                         {JJCHelper.getMatchDes(id)}
//                         {`[${subInner(betGameContent,'[',']')}]`}
//                     </span>
//                     <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//                 </div>      
//             } 
//         }break;
//     }
//     return result;
// }

// function getMatchStatus(index,listData,orderBaseInfoBO) {
//     let returnResult;
//     let isResult= orderBaseInfoBO["winningStatus"] || {};
//     let bonus='';
//     if(isResult=="1"){
//         return returnResult=<span>未开奖</span>
//     }
//     if(isResult=="2"){
//         return returnResult=<span>未中奖</span>
//     }
//     if(isResult=="3" || isResult=="4"){
//         if(listData[index].preBonus){
//             bonus=listData[index].preBonus;
//         }else{
//             bonus='未中奖';
//         }
        
       
//     }
//     return returnResult=<span>{bonus}</span>
    
// }

// function Column({vsData,lotteryChildCode}) {
//     return (
//         <div>
//             {
//                 vsData.map((val,i)=>{                                
//                     let code=val.betGameContent;
//                     let matchKind = JJCHelper.FootBall.getMatchKind(code);                                                                                                                                                                                 
//                     return <div className="list" key={i}>                                        
//                         <div className="list-vs col5">
//                             <div className="top">
//                                 <span>{ val.homeName } <em className="c999"> vs </em> { val.visitiName }</span>
//                             </div>
//                             <div className="top">
//                                 {/* 单场致胜 奖金优化 彩果修改 现在统一 
//                                     半：1:0 全 2:0
//                                 */}
//                                 <span>
//                                     {
//                                         isEmpty(val.orderMatchZQBO) ?
//                                         '--'
//                                         :
//                                         '半：'+val.orderMatchZQBO.halfScore +' 全:'+val.orderMatchZQBO.fullScore
//                                     }
//                                 </span>                                                                                                  
//                             </div>
//                         </div>
//                         <div className="tou col6">
//                                 <div className="result">{ getCaiGuo(lotteryChildCode,val.betGameContent,val.orderMatchZQBO) }</div>                                                 
//                         </div>
                                                                    
//                     </div>
//                 })
//             } 
//         </div>
//     );
// }

// function Table({listData,orderBaseInfoBO}) {
//     return (
//         <div className="table-data">
//             {
//                 listData.map((item,index) => {   
//                     return (
//                         <div key={index} className="content">                               
//                             <div className="pass-way col1">
//                                 <span>{JJCHelper.getPassStyle(item.passway)}</span>
//                             </div>
//                             <div className="order-list col4">
//                                 <Column 
//                                     vsData = {item.orderMatchInfoBOList}
//                                     lotteryChildCode = {item.lotteryChildCode}
//                                 />
//                             </div>
//                             <div className="timer col3">
//                                 <span>{item.multiple}</span>
//                             </div>
//                             <div className="status col1">
//                                     <span>{getMatchStatus(index,listData,orderBaseInfoBO)}</span> 
//                             </div>
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     );
// }

// export default class BonusOptimal extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             resultBoData:{}
//         };
//         this.page = 0 ;
        
//     }
//     componentDidMount() {
//         this.getSportOrderList();
//     }
//     getSportOrderList(isMore){
//         let {orderCode} = this.props;
//         http.post('/order/queryUserSportOrderList', {
//             token: session.get('token'),
//             pageIndex:this.page,
//             pageSize:3,
//             orderCode:orderCode
//         }).then(res => {  
//             let  resultBoData = res.data || {};            
//             this.setState({resultBoData});    
//         }).catch(err => {
//             Message.toast(err.message);
//         });
//     }
//     showMoreZh() {
//         let {orderCode} = this.props;
//         this.page++;
//         http.post('/order/queryUserSportOrderList', {
//             token: session.get('token'),
//             pageIndex: this.page,
//             pageSize:3,
//             orderCode:orderCode
//         }).then(res => {
//             let {resultBoData} = this.state;
//             let resultData = res.data;
//             let resultDataList = resultData.data ||[];
//             resultBoData.data = resultBoData.data.concat(resultDataList);
//             this.setState({resultBoData: resultBoData});
            
//         }).catch(err => {
//             Message.toast(err.message);
//         });
//     }
//     render() {
//         let {resultBoData} = this.state;
//         let listData = resultBoData.data || [];
//         let { orderBaseInfoBO , orderCode } = this.props;
//         let hasMoreCount2 = parseInt(resultBoData.total - listData.length); //还有多少个方案
//         return <div className="result-content">
//             <div className="header">
//                 <span className="col1">过关方式</span>
//                 <span className="col7">赛果</span>
//                 <span className="col8">投注内容</span>
//                 <span className="col3">倍数</span>
//                 <span className="col1">状态</span>
//             </div>
//             <Table 
//                 listData = {listData}
//                 orderBaseInfoBO = {orderBaseInfoBO}
//             />
//             <div 
//                 className="plan-other"
//                 onClick={this.showMoreZh.bind(this)}  
//                 style={{display : (hasMoreCount2 > 0) ? "" : "none"}}
//             >
//                 还有{hasMoreCount2}个追号方案 
//                 <i className="icon-arrow-d-grey"></i>
//             </div> 
//         </div>
//     }
// }

// BonusOptimal.propTypes = {
//     orderCode: PropTypes.string
// };