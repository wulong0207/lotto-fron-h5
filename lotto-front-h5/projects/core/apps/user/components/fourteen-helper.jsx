/**
 * Created by 杨利东
 * date 2017-5-8
 * desc:个人中心模块--十四场帮助类
 */
import React,{Component} from 'react';

let FourteenHelper = {
    //1：等待比赛；2：比赛中；3：已完场；4：延期；5：取消
    // 其它竞技彩赛事状态：6：暂定赛程；7：未开售；8：预售中；9：销售中； 10：暂停销售；
    //11：销售截止；12：比赛进行中；13：延期；14：取消；15：已开奖；
    // 16：已派奖；17：已审核
    sts : ["", "等待比赛", "比赛中", "已完场", "延期", "取消",
               "暂定赛程", "未开售", "预售中", "销售中", "暂停销售",
               "销售截止", "比赛进行中", "延期", "取消", "已开奖",
               "已派奖", "已审核"],

    //获取投注内容
    //开奖结果
    getTouZhu(content, codeArr, currentIndex){
        
        let arr = content.split(",");
        return arr.map((val, index)=>{
            let txt="", className="";
            switch(val){
                case "3": txt="胜";break;
                case "1": txt="平";break;
                case "0": txt="负";break;
            }
            if(codeArr[currentIndex] == val){ // 已完场
                className = "orange-fill";
            }
            // // 彩果 ==投注内容
            // if(content===item){
            //      className = "orange-active";
            // }

            return <em key={index} className={className}>{txt}</em>;
        });
    },

    //彩果
    getGameReuslt(result){
        if(result == undefined|| result == ""){
            return "-";
        }else{
            let txt;
            switch(result){
                case "3": txt="胜";break;
                case "1": txt="平";break;
                case "0": txt="负";break;
                default : txt = result;
            }

            return txt;
        }
    },

    //获取比赛状态
    getGameStatus(item){
        let resultItems = [];

        if(item.matchStatus == 1){//等待比赛
            let date = "", time;
            if(item.date){
                date = item.date.substring(item.date.indexOf("-") + 1);
            }
            if(item.time){
                // time = item.time.substring(0, item.time.lastIndexOf(":"));
                time = item.time;
            }
            resultItems.push(<i key={1}>{date + " " +(time||"")}</i>);
            resultItems.push(<i key={2}>开赛</i>);
        }else if(item.matchStatus == 2){//比赛中
            resultItems.push(<i key={1}>比赛中<em className="blue">直播</em></i>);
        }else if(item.matchStatus == 3){
            if(item.orderMatchLZCBO){
                resultItems.push(<i key={1}>半：<em className="red">{item.orderMatchLZCBO.halfScore}</em></i>);
                resultItems.push(<i key={2}>全：<em className="red">{item.orderMatchLZCBO.fullScore}</em></i>);
            }
        }else{
            resultItems.push(<i key={1}>{this.sts[item.matchStatus]}</i>);
        }

        return <span className="game-list">
            {resultItems}
        </span>
    },
}

export default FourteenHelper;