/**
 * Created by 杨利东
 * date 2017-5-8
 * desc:个人中心模块--订单处理
 */
import React,{Component} from 'react';
import Const from '@/utils/const';
import { setDate, getParameter,formatMoney, browser } from '@/utils/utils';
import Interaction from "@/utils/interaction";
import Session from '@/services/session';
// import IconOne from '../../img/iconone@2x.png';//待派奖

import Message from "@/services/message";
import Order from "@/component/order";
import session from "@/services/session";
import Navigator from "@/utils/navigator";
import cx from "classnames";

export default {
    //1：等待比赛；2：比赛中；3：已完场；4：延期；5：取消
    // 其它竞技彩赛事状态：6：暂定赛程；7：未开售；8：预售中；9：销售中； 10：暂停销售；
    //11：销售截止；12：比赛进行中；13：延期；14：取消；15：已开奖；
    // 16：已派奖；17：已审核
    sts : ["", "等待比赛", "比赛中", "已完场", "延期", "取消",
               "暂定赛程", "未开售", "预售中", "销售中", "暂停销售",
               "销售截止", "比赛进行中", "延期", "取消", "已开奖",
               "已派奖", "已审核"],
    contentTypeArr : ["", "单式", "复式", "胆拖","","","和值"],   //1：单式；2：复式；3：胆拖
    
   
    //获取时间的值
    getTimeVal(timeStr){
        let result = 0;

        if(!timeStr){
            let time = new Date();
            return time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
        }

        let arr = timeStr.split(":");
        let hourSec = parseInt(arr[0]) * 60 * 60;
        let minteSec = parseInt(arr[1]) * 60;
        result = hourSec + minteSec;

        return result;
    },

    //获取时间
    getFullTime(date){
        let result;
        let reDate = new Date(date);
        if(isNaN(reDate.getTime())){
            if(date){
                reDate = new Date(date.replace(/-/g,"\/"));
                if(isNaN(reDate.getTime())){
                    return date;
                }
            }else{
                return date;
            }
        }

        if(date){
            result = setDate.formatDate(reDate, 'MM-dd HH:mm:ss ');
        }

        return result;
    },

    //获取竞技彩截止时间
    getJjcEndTime(issueOfficialTimeBO){
        let result;
        let current = new Date();
        if(issueOfficialTimeBO.lastOfficialEndTime){
            let lastTime = new Date(issueOfficialTimeBO.lastOfficialEndTime);

            if(current.getTime() < lastTime.getTime()){
                result = this.getFullTime(issueOfficialTimeBO.lastOfficialEndTime);
                result += "截止";
            }
        }

        if(!result && issueOfficialTimeBO.officialEndTime){
            let time = new Date(issueOfficialTimeBO.officialEndTime);

            if(current.getTime() < time.getTime()){
                result = this.getFullTime(issueOfficialTimeBO.officialEndTime);
                result += "截止";
            }
        }

        if(!result && issueOfficialTimeBO.officialStartTime){
            result = this.getFullTime(issueOfficialTimeBO.officialStartTime);
            result += "出票";
        }

        return result;
    },

    getFATime(resultItem){ 
        let time = new Date();
        let start = ""; //出票
        let end = ""; //销售截止时间
        if(resultItem && resultItem.issueOfficialTimeBO){
            let issueOfficialTimeBO = resultItem.issueOfficialTimeBO;

            if(issueOfficialTimeBO.officialEndTimeStr || resultItem.lotteryType == 1){//低频，高频（数字彩）
                let dateStr;
                if(this.getTimeVal() > this.getTimeVal(issueOfficialTimeBO.officialEndTimeStr) ||
                   this.getTimeVal() < this.getTimeVal(issueOfficialTimeBO.officialStartTimeStr)){
                    //不在出票时间内
                    setDate.setDays(time, 1);
                    dateStr = setDate.formatDate(time, 'MM.dd');
                    start = dateStr + " " + issueOfficialTimeBO.officialStartTimeStr;
                    end = dateStr + issueOfficialTimeBO.officialEndTimeStr;
                }else{
                    dateStr = setDate.formatDate(time, 'MM.dd');
                    start = dateStr + " " + issueOfficialTimeBO.officialEndTimeStr;
                    end = dateStr  + " " + issueOfficialTimeBO.officialEndTimeStr;
                }
            }else if(resultItem.lotteryType == 2 || resultItem.lotteryType == 3){// 2.竞技彩（竟足，竟篮，北京单场，胜负过关）
                if(issueOfficialTimeBO.lastOfficialEndTime){
                    let lastTime = new Date(issueOfficialTimeBO.lastOfficialEndTime);

                    if(time.getTime() < lastTime.getTime()){
                        end = issueOfficialTimeBO.lastOfficialEndTime;
                    }
                }

                if(!end && issueOfficialTimeBO.officialEndTime){
                    let time = new Date(issueOfficialTimeBO.officialEndTime);

                    if(time.getTime() < time.getTime()){
                        end = issueOfficialTimeBO.officialEndTime;
                    }
                }

                if(issueOfficialTimeBO.officialStartTime){
                    start = issueOfficialTimeBO.officialStartTime;
                }

            }else{
                start = issueOfficialTimeBO.officialStartTimeStr;
                end = issueOfficialTimeBO.officialEndTimeStr;
            }
        }

        return {
            start: start,
            end: end
        }
    },

    //获取统一的描述信息
    getUnionDescription(resultItem){
        //1:待支付，2:未支付过期，3:支付失败,4,等待出票,5,出票中
        //6,投注失败并已退款,7,等待开奖,8,未中奖,9,等待派奖,10,已派奖;
        let buyTypeArr = ["", "代购", "追号代购", "合买", "追号计划"];//1：代购；2：追号代购；3：合买4：追号计划
        //1：追号成功；2：追号失败；3：系统撤单；4：用户撤单；5：等待追号;6撤单中，7停追撤单中，8用户撤单中
        let lastAddIssueStatus = ["", "追号成功", "追号失败", "系统撤单", "用户撤单", "等待追号", "撤单中", "停追撤单中", "用户撤单中"];
        //1：追号中；2：中奖停追；3：追号结束；4：用户撤单；5：系统撤单；
        let addStatus = ["", "追号中", "中奖停追", "追号结束", "用户撤单", "系统撤单"];

        let result = "";
        let message = "", date="", img, color="",
            openSts="", openDate="", openMessage="", noListColor = false;
        let nowLottery = false;
        let addUnit = (str, unit)=>{
            if(str||str==0){
                return str+unit;
            }
            return str;
        };
        if(resultItem){
            let fatime = this.getFATime(resultItem);
            let index;
          
            if(resultItem.buyType == 4){
                index = resultItem.addOrderUnionStatus;
                openDate = "";
                openMessage = "";
                noListColor = true;
                //1:待支付，2:未支付过期，3:支付失败,4:追号中,5:追号结束,6:中奖停追,7:,追号撤单
                switch(resultItem.addOrderUnionStatus){
                    case 1:{
                        // message = "待支付";
                        noListColor = false;
                        message=resultItem.addOrderUnionStatusText;
                        date = this.getFullTime(resultItem.endSaleTime)+"截止";
                
                    }break;
                    case 2:{                       
                        // message="未支付过期";                      
                        message=resultItem.addOrderUnionStatusText;
                        if(resultItem.winningStatus===3 && resultItem.winningStatus===4){
                            if(resultItem.remark){
                                message=resultItem.preBonus;
                                date="未支付过期";
                                noListColor =false;     
                            }
                        }                      
                    }break;
                    case 3: {//追号中
                        message=resultItem.addOrderUnionStatusText;
                        date = resultItem.hadIssue + "/" +resultItem.totalIssue;
                       
                    };break;
                    case 4: {//"追号结束"
                        message=resultItem.addOrderUnionStatusText;
                        date = resultItem.preBonus;
                    };break;
                    case 5: { //"中奖停追"
                        message=resultItem.addOrderUnionStatusText;
                        date = resultItem.preBonus;
                
                    };break;
                    case 6: {//追号撤单
                        message=resultItem.addOrderUnionStatusText;                   
                        date = resultItem.remark;                      
                    };break;
                    case 7: {//投注失败
                        message=resultItem.addOrderUnionStatusText;                     
                        if(resultItem.winningStatus===1 && resultItem.winningStatus===2){
                            date=resultItem.remark;
                        }else if(resultItem.winningStatus ===3 && resultItem.winningStatus ===4){
                            message=resultItem.preBonus;
                            date="投注失败";
                        }
                    };break;
                }
                if(resultItem.addStatus!=1 && date!=null){
                    date = date == 0 ? '': date + '元';
                    // date += "元";
                }
            }else{
                noListColor = true;
                index = resultItem.orderUnionStatus;
                switch(index){
                    case 1:{
                        noListColor = false;
                        // message = "待支付";
                        message=resultItem.orderUnionStatusText;
                        date = this.getFullTime(resultItem.endSaleTime)+"截止";
                    }break;
                    case 2:{
                        // message="未支付过期";
                        message=resultItem.orderUnionStatusText;                                       
                        // 已开奖且中奖
                        if(resultItem.winningStatus===3 && resultItem.winningStatus===4){
                            if(resultItem.remark){
                                message=resultItem.preBonus;
                                date="未支付过期";                              
                            }
                        }                   
                    }break;
                    case 3:{
                        // message = "等待出票"; 低频彩 竞技彩 区分
                        message=resultItem.orderUnionStatusText;
                        date = 
                            resultItem.issueOfficialTimeBO ? 
                            resultItem.issueOfficialTimeBO.officialStartTimeStr ?
                            <i className="grey">出票时间: {resultItem.issueOfficialTimeBO.officialStartTimeStr}- 
                                {resultItem.issueOfficialTimeBO.officialEndTimeStr}
                            </i>
                            :
                            <i className="grey">出票时间: {setDate.formatDate(resultItem.issueOfficialTimeBO.officialStartTime, 'HH:mm')}--
                                {setDate.formatDate(resultItem.issueOfficialTimeBO.officialEndTime,'HH:mm')}
                            </i>  
                            :
                            "";  
                                             
                    };break;
                    case 4:{
                        // message = "出票中";
                        message=resultItem.orderUnionStatusText;
            
                    }break;
                    case 5:{
                        // message = "投注失败";
                        message=resultItem.orderUnionStatusText;
                        date=resultItem.remark;
                        if(resultItem.winningStatus===1 && resultItem.winningStatus===2){
                            date=resultItem.remark;
                        }else if(resultItem.winningStatus ===3 || resultItem.winningStatus ===4){
                            message=formatMoney(resultItem.preBonus) + "元";
                            date="投注失败";
                            noListColor = false;
                        }
                      
                    }break;
                    case 6:{
                        // message = "投注成功";  
                        if(resultItem.payStatus===2){
                            if(resultItem.orderStatus===6){
                                switch (resultItem.winningStatus) {
                                    case 1:      // 未开奖            
                                        message="待开奖";
                                        date = resultItem.lotteryTime? resultItem.lotteryTime+"开奖": '';
                                        break;
                                    case 2:     //未中奖           
                                        // date="";
                                        message="未中奖";
                                        break;
                                    case 3: //已中奖
                                        noListColor = false;                                  
                                        message = resultItem.preBonus == 0? resultItem.winningText: formatMoney(resultItem.preBonus)+'元';
                                        // <i>
                                        //     {
                                        //         resultItem.preBonus ==0 ?
                                        //         resultItem.winningText
                                        //         :
                                        //         formatMoney(resultItem.preBonus)+'元'
                                        //     }
                                        // </i>
                                        // formatMoney(resultItem.preBonus)+'元';
                                        date = resultItem.throwTime+"派奖";                      
                                        break;
                                    case 4: //已派奖
                                        noListColor = false;                                  
                                        message= formatMoney(resultItem.preBonus)+'元';
                                        date="已派奖";
                                    
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        
                    }break;
                    
                    default:{
                        message = "未知";
                        openSts = message;
                        // img = IconCuowu;
                    }
                }
                if(resultItem.buyType ==2){
                    if(resultItem.period){
                        nowLottery = true;
                    }
                }
            }   
        }

        return {
            nowLottery:nowLottery, // 添加 当前期
            noListColor: noListColor, //false 控制字体颜色
            message: message, //显示在首页列表中的状态信息,例如：未支付、出票中...
            date: date, //显示在首页列表中的时间信息
            // img: img, //显示在方案详情中的图标
            // color: color, //方案详情中，例如未支付时字体为红色
            // openSts: openSts,//显示在方案详情中的状态信息,例如：未支付、出票中...
            // openDate: openDate, //方案详情中支付下的时间出票信息等，目前未启用
            // openMessage: openMessage,//方案详情中支付下的时间出票截止时间等，目前未启用
        };
    },


    //获取竞技投注展示
    getJJShow: function(planContent, contentType, dataDetail){
        planContent = planContent || "";
        return planContent.replace(/\|/g, " ");
    },


    //支付操作
    // cureParams{orderBaseInfoBO, userNumPage, addOrderDetailBOs}
    goToPay: function(curParams){
        let {orderBaseInfoBO, userNumPage, addOrderDetailBOs} = curParams;
        if(orderBaseInfoBO.buyType == 4){
            orderBaseInfoBO.buyType = 1;
        }
        let params = {
            buyScreen: "", //选择投注的赛事编号
            buyType: orderBaseInfoBO.buyType, // 购买类型    number  必填。1：代购 ； 2：追号；3：合买
            isDltAdd: orderBaseInfoBO.isDltAdd, //    是否大乐透追号 number  必填。是：1 ； 否：0
            lotteryCode: orderBaseInfoBO.lotteryCode, // 彩种ID    number  必填。竞技彩传子玩法，其它彩种传大彩种
            lotteryIssue: orderBaseInfoBO.lotteryIssue, //    彩期  string  必填。竞技彩，如出现多个彩期，那么lotteryIssue传参为最早那个彩期
            multipleNum: orderBaseInfoBO.multipleNum, // 订单总倍数   number  必填。
            orderAmount: orderBaseInfoBO.orderAmount, // 订单总额    number  必填。
            orderDetailList: [], // 订单详情
            token: session.get("token")
        };

        if(userNumPage){
            params.orderDetailList = userNumPage.map((val, i)=>{
                return {
                    amount: val.amount, //  单个方案投注金额    number  必填。
                    buyNumber: val.buyNumber, //   单个方案投注注数    number  必填。
                    codeWay: 1, // 投注方式    number  必填。1：手选；2：机选；3：上传
                    contentType: val.contentType, // 玩法  number  必填。如竞彩，1：单式；2：复式；3：胆拖；
                    lotteryChildCode: val.lotteryChildCode, //    子玩法ID   number  必选。
                    multiple: val.multiple, //    单个方案投注倍数    number  必填。
                    planContent: val.planContent, // 投注内容    string
                }
            });
        }

        if(addOrderDetailBOs){
            params.orderDetailList = addOrderDetailBOs.map((val, i)=>{
                return {
                    amount: val.amount, //  单个方案投注金额    number  必填。
                    buyNumber: val.buyNumber, //   单个方案投注注数    number  必填。
                    codeWay: 1, // 投注方式    number  必填。1：手选；2：机选；3：上传
                    contentType: val.contentType, // 玩法  number  必填。如竞彩，1：单式；2：复式；3：胆拖；
                    lotteryChildCode: val.lotteryChildCode, //    子玩法ID   number  必选。
                    multiple: val.multiple, //    单个方案投注倍数    number  必填。
                    planContent: val.planContent, // 投注内容    string
                }
            });
        }

        if(orderBaseInfoBO.jcPlanContent){
            params.orderDetailList = orderBaseInfoBO.jcPlanContent.map((val, i)=>{
                return {
                    amount: orderBaseInfoBO.orderAmount, //  单个方案投注金额    number  必填。
                    buyNumber: orderBaseInfoBO.betNum, //   单个方案投注注数    number  必填。
                    codeWay: 1, // 投注方式    number  必填。1：手选；2：机选；3：上传
                    contentType: orderBaseInfoBO.contentType, // 玩法  number  必填。如竞彩，1：单式；2：复式；3：胆拖；
                    lotteryChildCode: orderBaseInfoBO.lotteryChildCode, //    子玩法ID   number  必选。
                    multiple: orderBaseInfoBO.multipleNum, //    单个方案投注倍数    number  必填。
                    planContent: val, // 投注内容    string
                }
            });
        }

        Order(params, (res)=>{
            Message.toast(res.message);
        });
    },

    //前往支付
    goDirectPay(orderId, buyType){
        if (browser.yicaiApp) {
            return Interaction.sendInteraction('toPay', [JSON.stringify([{oc: orderId, bt: buyType, token: session.get('token')}])]);
        } else {
            return location.href = `/pay.html?orderCode=${orderId}&buyType=${buyType}&token=${session.get('token')}`;
        }
    },

    //当前是否支持该彩种下单
    canMakeOrder: function(orderBaseInfoBO, shouldGo){
        let result = false;
        let condition;
        if(typeof orderBaseInfoBO == "string"){
            condition = orderBaseInfoBO.substring(0,3);
        }else{
            if(!orderBaseInfoBO || !orderBaseInfoBO.lotteryChildCode){
                return result;
            }

            condition = orderBaseInfoBO.lotteryChildCode.toString().substring(0,3);
        }
        switch(condition){
            case "300": {//竞技彩足彩
                result = true;
                if(shouldGo){
                    Navigator.goJCZ();
                }
            };break;
            case "301":{//竞彩篮球
            };break;
            case "302": //六场半全场
            case "303": //四场进球彩
            case "305": //九场胜负彩
            case "304": {//十四场胜负彩
            };break;
            case "100":{//双色球
                result = true;
                if(shouldGo){
                    Navigator.goSSQ();
                }
            }break;
            case "210"://广东11选5
            case "211"://湖北11选5
            case "212"://江苏11选5
            case "213"://江西11选5
            case "214"://辽宁11选5
            case "215":{//山东11选5
                result = true;
                if(shouldGo){
                    Navigator.goSD11x5();
                }
            }break;
            default:{

            } break;
        }

        return result;
    },

    //根据当前的路径或session中的存储获取彩期数据
    getLotteryItem(){
        let lotteryItem = Session.get("lotteryItem") || {};
        let orderCode = getParameter("orderCode");
        let lotteryCode = getParameter("lotteryCode");
        let lotteryChildCode = getParameter("lotteryChildCode") || lotteryCode;
        let buyType = getParameter("buyType");

        lotteryItem.orderCode = orderCode;
        lotteryItem.lotteryCode = lotteryCode;
        lotteryItem.lotteryChildCode = lotteryChildCode;
        lotteryItem.buyType = buyType;

        return lotteryItem;
    },

    //获取出票区域
    getTicket(orderBaseInfoBO){
        //出票成功
        //TODO: 暂未上线，屏蔽出票明细
        if(orderBaseInfoBO.orderUnionStatus == 6){
            return <em className="ticket-label" onClick={Navigator.goTicket.bind(Navigator, orderBaseInfoBO.orderCode)}>出票明细</em>
        }

        return "";
    },
}
