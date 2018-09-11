// import React , {Component} from 'react';
// import PropTypes from 'prop-types';
// import http from '../../../../utils/request';
// import JJCHelper from '../../jjc-helper.jsx';
// import session from '../../../../services/session';
// import { getParameter , subInner } from '../../../../utils/utils';
// import Message from '../../../../services/message';
// import { isEmpty } from 'lodash';

// import '../../../../scss/user/lottoDetail/bonus-optimal.scss';

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

// function getDxf(val) {
//     if(val == '99') {
//         return '大分';
//     }else if(val == '00'){
//         return '小分';
//     }
// }

// function getCaiGuo(lotteryChildCode,betGameContent) {
//     let classnames = '';
//     let result;
//     switch (lotteryChildCode) { // 默认采用 code值
//        case 30102: //r
//             result = <div>
//                 <span>
//                     让分主
//                     {JJCHelper.getMatchDes(subInner(betGameContent,'(','@'))}
//                 </span>
//                 <span className = {classnames} >
//                     {`[${subInner(betGameContent,'[',']')}]`}
//                 </span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>    
//            break;
//         case 30103: //d
//             result = <div>
//                 <span className = {classnames}>
//                     {getDxf(subInner(betGameContent,'(','@'))}
//                 </span>
//                 <span className = {classnames}>
//                     {`[${subInner(betGameContent,'[',']')}]`}
//                 </span>
//                 <span className = {classnames}>
//                     {subInner(betGameContent,'@',')')}
//                 </span>
//             </div>
//             break;
//         case 30104: // c
//             result = <div>
//                 <span className = {classnames} >{ getSfcWF(subInner(betGameContent,"(","@"))}</span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>
//             break;
//         case 30105: //混合投法
//             result = handleMixBet(betGameContent);
//             break;
//        default:
//            break;
//     }
//     return result;
// }
// // 混合玩法 根据 sp 值 判断
// function handleMixBet(betGameContent) {
//     let classnames = '';
//     let kind = subInner(betGameContent,"","(");
//     let result;
//     switch (kind) { //jcz SRZQB
//         case "S":{
//             result = <div>
//                 <span className = {classnames} >
//                     主{JJCHelper.getMatchDes(subInner(betGameContent,'(','@'))}
//                 </span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>
//         }break;
//         case "C":{
//             result = <div>
//                 <span className = {classnames} >{ getSfcWF(subInner(betGameContent,"(","@"))}</span>
//                 <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//             </div>
//         }break;
//         default:
//         {
//             if(kind.indexOf('R') > -1) {
//                 result = <div>
//                     <span>
//                         让分主
//                         {JJCHelper.getMatchDes(subInner(betGameContent,'(','@'))}
//                     </span>
//                     <span className = {classnames} >
//                         {`[${subInner(betGameContent,'[',']')}]`}
//                     </span>
//                     <span className = {classnames} >{subInner(betGameContent,'@',')')}</span>
//                 </div>      
//             }else if(kind.indexOf('D') > -1) {
//                 result = <div>
//                     <span className = {classnames}>
//                         { getDxf(subInner(betGameContent,'(','@'))}
//                     </span>
//                     <span className = {classnames}>
//                         {`[${subInner(betGameContent,'[',']')}]`}
//                     </span>
//                     <span className = {classnames}>
//                         {subInner(betGameContent,'@',')')}
//                     </span>
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
//                     let matchKind = JJCHelper.BasketBall.getMatchKind(code);                                                                                                                                                                                 
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
//                                         isEmpty(val.orderMatchLQBO) ?
//                                         '--'
//                                         :
//                                         val.orderMatchLQBO.fullScore
//                                     }
//                                 </span>                                                                                                  
//                             </div>
//                         </div>
//                         <div className="tou col6">
//                                 <div className="result">{ getCaiGuo(lotteryChildCode,val.betGameContent) }</div>                                                 
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