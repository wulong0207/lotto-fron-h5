// /**
//  * Created by manaster
//  * date 2017-03-22
//  * desc:个人中心模块--14场比赛信息 子模块
//  */

// import React,{Component} from 'react';
// import FourteenHelper from "./fourteen-helper"
// import "@/scss/user/fourteen-lottery.scss"

// export class FtGame extends Component{
//     constructor(props){
//         super(props);
//         this.state = {

//         };
//     }

//     render() {
//         let {orderMatchInfoBOs, drawCode} = this.props;
//         let self = this;
//         drawCode = drawCode || "";
//         //drawCode = "3|1|0|0|0|1|1|3|3|3|0|1|0|3";
//         let codeArr = drawCode.split("|");

//         return (
//             <div className="container">
//                 <div className="item-14-h item-header">
//                     <span className="num col1">编号</span>
//                     <span className="col3">主队<em className="grey">vs</em>客队</span>
//                     <span className="col2">比分</span>
//                     <span className="col4">投注内容</span>
//                     <span className="result col4">彩果</span>
//                 </div>
//                 {
//                     orderMatchInfoBOs.map((val, index)=>{
//                         return <div key={index} className="item-14 item-14-h item-content">
//                             <span className="col1 col">{index+1}</span>
//                             <div className="game col3 col">
//                                 <span>{val.homeName}</span>
//                                 <span>VS</span>
//                                 <span>{val.visitiName}</span>

//                             </div>
//                             <span className="game-status col2 col">
//                                 {FourteenHelper.getGameStatus(val)}
//                             </span>
//                             <span className="game-result col4 col">
//                                 {FourteenHelper.getTouZhu(val.betGameContent, codeArr, index)}
//                             </span>
//                             <span className="result col4 col">{FourteenHelper.getGameReuslt(codeArr[index])}</span>
//                         </div>
//                     })
//                 }
//             </div>
//         )
//     }
// }
