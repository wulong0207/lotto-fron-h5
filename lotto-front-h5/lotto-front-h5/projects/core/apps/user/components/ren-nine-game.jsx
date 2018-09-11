// /**
//  * Created by manaster
//  * date 2017-03-22
//  * desc:个人中心模块--任9比赛信息 子模块
//  */

// import React,{Component} from 'react';
// import FourteenHelper from "./fourteen-helper";
// import "../../scss/user/ren-nine.scss";


// export default class RenNineGame extends Component{
//     constructor(props){
//         super(props);
//         this.state = {

//         }
//     }
//     render() {
//         let {orderMatchInfoBOs, drawCode} = this.props;
//         let self = this;
//         drawCode = drawCode || "";
//         let codeArr = drawCode.split("|");

//         return (
//             <div className="container">
//                 <div className="item-14-h item-header">
//                     <span className="num col1">编号</span>
//                     <span className="col3">主队<em className="grey">vs</em>客队</span>
//                     <span className="col2">比分</span>
//                     <span className="col2">投注内容</span>
//                     <span className="result col1">彩果</span>
//                     <span className="dan col1">胆</span>
//                 </div>
//                 {
//                     orderMatchInfoBOs.map((val, index)=>{
                        
//                         return <div key={index} className="item-14 item-14-h item-content">
//                             <span className="num col col1">{index+1}</span>
//                             <div className="game col3 col">
//                                 <span>{val.homeName}</span>
//                                 <span>VS</span>
//                                 <span>{val.visitiName}</span>
//                             </div>
//                             <span className="game-status col col2">
//                                 {FourteenHelper.getGameStatus(val)}
//                             </span>
//                             <span className="game-result col col2 ">
//                                 {FourteenHelper.getTouZhu(val.betGameContent, codeArr ,index)}
//                             </span>
//                             <span className="result col col1">{FourteenHelper.getGameReuslt(codeArr[index])}</span>
//                             {val.isDan ? <span className="dan col col1"><i className="icon-dan"></i></span>
//                                         : <span className="dan col col1"><i>--</i></span>}
//                         </div>
//                     })
//                 }
//                 {/*<div className="item-14 item-14-h">
//                     <em className="num">1</em>
//                     <span>东京FC<em className="grey">vs</em>FC本田</span>
//                     <span className="game-status">
//                         <i>比赛中<em className="blue">直播</em></i>
//                     </span>
//                     <span className="game-result">
//                         <em className="orange-fill">胜</em>
//                         <em className="orange-fill">平</em>
//                         <em className="orange-fill">负</em>
//                     </span>
//                     <em className="result">胜</em>
//                     <em className="dan"><i className="icon-dan"></i></em>
//                 </div>
//                 <div className="item-14 item-14-h">
//                     <em className="num">2</em>
//                     <span>东京FC<em className="grey">vs</em>FC本田</span>
//                     <span className="game-status">
//                         <i>半：<em className="red">2:1</em></i>
//                         <i>全：<em className="red">5:2</em></i>
//                     </span>
//                     <span className="game-result">
//                         <em className="orange-fill">平</em>
//                         <em className="orange-fill">负</em>
//                     </span>
//                     <em className="result">--</em>
//                     <em className="dan"><i>--</i></em>
//                 </div>
//                 <div className="item-14 item-14-h">
//                     <em className="num">3</em>
//                     <span>东京FC<em className="grey">vs</em>FC本田</span>
//                     <span className="game-status">
//                         <i>07-08 02:00</i>
//                         <i>开赛</i>
//                     </span>
//                     <span className="game-result">
//                         <em className="">平</em>
//                         <em className="">负</em>
//                     </span>
//                     <em className="result">--</em>
//                     <em className="dan"><i>--</i></em>
//                 </div>*/}
//             </div>
//         )
//     }
// }


