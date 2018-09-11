/*
 * @Author: nearxu 
 * @Date: 2017-11-14 20:43:50 
 * 竞彩足球公共方法
 */



export default {
    //获取胜负结果
    getMatchDes(code){
        switch(code){
            case "3": return "胜";
            case "1": return "平";
            case "0": return "负";
        }
        return "";
    },
    // 获取比分描述
    getScoreDes(gameResult) {
        let qReulst = '';
        gameResult = gameResult || "";
        if(gameResult.length>=2){
            if(gameResult[0] == gameResult[1] && gameResult[0] == "9"){
                qReulst = "平其他";
            }else if(gameResult[0] == "9"){
                qReulst = "胜其他";
            }else if(gameResult[1] == "9"){
                qReulst = "负其他";
            }else{
                qReulst = gameResult[0] + ":" + gameResult[1];
            }
        }
        return qReulst;
    },

    //获取进球数描述
    getGoalDes(resultStr){
        console.log(resultStr,'resultStr');
        let classNames = '';
        if(parseInt(resultStr) >= 7){
            return resultStr.replace(resultStr[0], "7+");
        }
        return resultStr;
    },

    //获取半全场描述
    getHalfDes(gameResult) {
        let result = "";
        if(gameResult){
            result = this.getMatchDes(gameResult[0]) + "-" + this.getMatchDes(gameResult[1]);
        }
        return result;
    }

}
