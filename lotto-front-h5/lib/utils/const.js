export default {
    //方案类型
    getBuyType(index){
        let result = "";
        switch(index){
            case 1: result = "代购";break;
            case 2: result = "追号代购";break;
            case 3: result = "合买";break;
            case 4: result = "追号计划";break;
        }

        return result;
    },

    //追号：追号状态
    getAddStatus(index){
        let result = "";
        switch(index){
            case 1: result = "追号中";break;
            case 2: result = "中奖停追";break;
            case 3: result = "追号结束";break;
            case 4: result = "用户撤单";break;
            case 5: result = "系统撤单";break;
        }

        return result;
    },

    //订单状态
    getOrderStatus(index){
        let result = "";
        switch(index){
            case 1: result = "待上传";break;
            case 2: result = "待拆票";break;
            case 3: result = "拆票中";break;
            case 4: result = "待出票";break;
            case 5: result = "出票中";break;

            case 6: result = "出票";break;
            case 7: result = "出票失败";break;
            case 8: result = "已撤单";break;
            case 9: result = "拆票失败";break;
        }

        return result;
    },

    //  支付状态
    getPayStatus(index){
        let result = "";
        switch(index){
            case 1: result = "待支付";break;
            case 2: result = "支付成功";break;
            case 3: result = "未支付过期";break;
            case 4: result = "支付失败";break;
            case 5: result = "用户取消";break;

            case 6: result = "退款";break;
        }

        return result;
    },

    //  开奖状态
    getWinningStatus(index){
        let result = "";
        switch(index){
            case 1: result = "待开奖";break;
            case 2: result = "未中奖";break;
            case 3: result = "已中奖";break;
            case 4: result = "已派奖";break;
        }

        return result;
    },

    //普通代购订单统一状态
    getOrderUnionStatus(index){
        let result = "";
        switch(index){
            case 1: result = "待支付";break;
            case 2: result = "未支付过期";break;
            case 3: result = "支付失败";break;
            case 4: result = "等待出票";break;
            case 5: result = "出票中";break;

            case 6: result = "投注失败并已退款";break;
            case 7: result = "等待开奖";break;
            case 8: result = "未中奖";break;
            case 9: result = "等待派奖";break;
            case 9: result = "已派奖";break;
        }

        return result;
    },

    //追号计划订单统一状态。
    getAddOrderUnionStatus(index){
        let result = "";
        switch(index){
            case 1: result = "待支付";break;
            case 2: result = "未支付过期";break;
            case 3: result = "支付失败";break;
            case 4: result = "追号中";break;
            case 5: result = "追号结束";break;

            case 6: result = "中奖停追";break;
            case 7: result = "追号撤单";break;
        }

        return result;
    },
}