/**
 * @author wangzhiyong
 * @createTime 2017/3/30
 * @description 竞彩足球
 *    TODO 由后端同事写的，后期要干掉，重写
 
 *    子彩种id,查阅，具体请与后端同事沟通 TODO
 *      JCZQLotteryIds: {
      HT: 30001,//混投
      SPF: 30002,//胜平负
      RSPF: 30003,//让球胜平负
      BF: 30004,//比分
      ZJQ: 30005,//总进球
      BQC: 30006//半全场
    },
 JCLQLotteryIds: {
      SF: 30101,//篮球胜负
      RSF: 30102,//让分
      DXF: 30103,//大小分
      SFC: 30104,//胜分差
      HT: 30105//混合过关
    },
 *
 *   足球  实例：
 *
 let Bet=require("./bet/Bet");
 let football=new Bet("Football");
 var opts = [],ggType = [],bs = 0,lotteryId=30001;
 opts[0] = "周一001^spf-3#4.50|rspf-3@1#2.12,rspf-1@1#3.35,rspf-0@1#2.80|bf-00#13.00,bf-11#7.00|jqs-0#13.00,jqs-1#5.00,jqs-2#3.35|bqc-11#5.50";//玩法和玩法之间用|分隔  如果是定胆的话在单场的赛事内容后面加上D
 opts[1] = "周一002^spf-3#2.98,spf-1#3.35|rspf-3@1#1.60|bf-10#9.50,bf-00#11.00|jqs-0#11.00,jqs-2#3.45|bqc-33#4.80,bqc-11#5.20";
 opts[2] = "周一003^spf-3#3.00,spf-1#3.30,spf-0#2.03";
 ggType[0] = "2*1";
 ggType[1] = "3*1";
 let result=football.calc({bets:opts,type:ggType,times:1,lotteryId:lotteryId});

 console.log("足球",result);
 
 
 *   篮球  实例：
 *
 opts[0] = "周一001^sf-1#1.30,sf-2#2.64|rfsf-2@-5.5#1.82|dxf-2#1.75";
 opts[1] = "周一001^sf-1#1.18,sf-2#3.35|rfsf-2@-7.5#1.75|dxf-1#1.75,dxf-2#1.75";
 opts[2] = "周一001^sf-2#3.15|rfsf-1@-6.5#1.75|dxf-1#1.75";
 lotteryId = 30101;
 
 result=football.calc({bets:opts,type:ggType,times:1,lotteryId:lotteryId});
 console.log("篮球",result);
 
 */
let lotteryMap = {
    '301': 'jclq',
    '300': 'jczq'
};
// let footballHelper = require("./football-helper");
import footballHelper from './football-helper';
class Football {
  constructor() {
    /*投注内容，
     
     格式： 赛事编号^玩法-投注内容@让球数#sp值|玩法-投注内容#sp值D (D表示该场比赛定胆),
     
     赛事编号与投注内容之间用^ 区别
     胜负平之间用逗号分隔
     玩法和玩法之间用|分隔
     一行记录代表一场代表，暂时不区分场号
     
     玩法代号：
     竞彩足球 ： spf：胜平负,rspf:让球胜平负,bf:比分，jqs：总进球，bqc：半全场
     竞彩篮球  sf:胜负,rfsf:让分胜负,dxf:大小分，sfc:胜分差
     
     例子：
     bets[0]=" 周一001^spf-3#1.45|rspf-3@-1#2.55,spf-1@-1#3.25,spf-0@-1#2.33";
     bets[1]=" 周一001^spf-3#1.45|rspf-3@-1#2.55,spf-1@-1#3.25,spf-0@-1#2.33";
     */
    this.bets = [];
    
    /*
     过关方式:1*1,串1，2*1代表2串1，
     一行记录一种方式
     */
    this.type = null;
    this.times = 1;//倍数,
    this.lotteryId = null;//子彩种id

    ///返回的结果格式
    this.reslutObj = {//返回的结果格式
      betNum: 0,//注数
      minBonus: 0,//最小奖金
      maxBonus: 0,//最大奖金
      detail: null,//详情
    }
  }
  
  /************************************竞彩足球*****************************************/
  jczq = {
    bets: {},
    award: {
      range: []
    },
    bet: {
      reObj: {betNum: 0, min: 0, max: 0},
      //计算注数
      count: function (bets, type) {
        var delSame = false; //去除单一玩法 - 暂不用到，默认false
        return footballHelper.Es.jczq.getCodesCount(bets, type, delSame);
      },
      //清空
      clear: function () {
        this.jczq.bet.reObj.betNum = 0;
        this.jczq.bet.reObj.min = 0;
        this.jczq.bet.reObj.max = 0;
        return jczq.bet.reObj;
      }
    }
    
  };
  /************************************竞彩篮球*****************************************/
  jclq = {
    
    award: {
      range: []
    },
    bet: {
      reObj: {betNum: 0, min: 0, max: 0},
      //计算注数
      count: function (bets, type) {
        var delSame = false; //去除单一玩法 - 暂不用到，默认false
        return footballHelper.Es.jclq.getCodesCount(bets, type, delSame);
      },
      //清空
      clear: function () {
        this.jclq.bet.reObj.betNum = 0;
        this.jclq.bet.reObj.min = 0;
        this.jclq.bet.reObj.max = 0;
        return jclq.bet.reObj;
      }
    }
    
  };
  /************************************北京单场*****************************************/
  bjdc = {
    award: {
      range: []
    },
    bet: {
      reObj: {betNum: 0, min: 0, max: 0},
      //计算注数
      count: function (opts, ggType) {
        var delSame = false; //去除单一玩法 - 暂不用到，默认false
        return Es.jczq.getCodesCount(opts, ggType, delSame);
      },
      //清空
      clear: function () {
        bjdc.bet.reObj.betNum = 0;
        bjdc.bet.reObj.min = 0;
        bjdc.bet.reObj.max = 0;
        return bjdc.bet.reObj;
      }
    }
  };
  /************************************详情公共参数*****************************************/
  common = {
    opts: [],
    ggType: [],
    bs: 1,
    lotteryId: 0,
    freeTypes: []
  };
  
  calc(betInfo) {
    let result = "";
    if (!betInfo.bets instanceof Array) {
      return "投注信息必须是数组";
    }
    else {
      this.bets = betInfo.bets;
    }
    if (!betInfo.type instanceof Array) {
      return "过关方式必须是数组";
    }
    else {
      this.type = betInfo.type;
    }
    if (betInfo.times && typeof  betInfo.times === "number") {
      this.times = betInfo.times;
    }
    if (!betInfo.lotteryId) {
      return "子彩种id不能空";
    }
    else {
      this.lotteryId = betInfo.lotteryId;
    }
    
    this.reslutObj = this.countRange(betInfo.bets, betInfo.type, betInfo.times, betInfo.lotteryId);
    
    return this.reslutObj;
    
  }
  
  calcDetail(betInfo) {//计算明细
    let result = "";
    if (!betInfo.bets instanceof Array) {
      return "投注信息必须是数组";
    }
    else {
      this.bets = betInfo.bets;
    }
    if (!betInfo.type instanceof Array) {
      return "过关方式必须是数组";
    }
    else {
      this.type = betInfo.type;
    }
    if (betInfo.times && typeof  betInfo.times === "number") {
      this.times = betInfo.times;
    }
    return this.rangeDetail(betInfo.bets, betInfo.type, betInfo.times);
  }
  
  
  //奖金范围
  countRange(opts, ggType, bs, lotteryId) {
    this.common.opts = opts;
    this.common.ggType = ggType;
    this.common.bs = bs;
    this.common.lotteryId = lotteryId;
    if (footballHelper.footballLotteryId.checkIsJczqLotteryId(lotteryId)) {
      footballHelper.Es.jczq.init();
      footballHelper.Es.algo.range = footballHelper.Es.jczq.getBonusRange(opts, ggType, false, bs);
      this.reslutObj.betNum = this.jczq.bet.count(opts, ggType);
    }
    else if (footballHelper.footballLotteryId.checkIsJclqLotteryId(lotteryId)) {
      footballHelper.Es.jclq.init();
      footballHelper.Es.algo.range = footballHelper.Es.jclq.getBonusRange(opts, ggType, false, bs);
      this.reslutObj.betNum = this.jclq.bet.count(opts, ggType);
    }
    else if (lotteryId === footballHelper.footballLotteryId.ZCLotteryIds.ZC6) {
      footballHelper.Es.bjdc.init();
      footballHelper.Es.algo.range = footballHelper.Es.jczq.getBonusRange(opts, ggType, false, bs);
      this.reslutObj.betNum = this.jczq.bet.count(opts, ggType);
    }
    else if (lotteryId === footballHelper.footballLotteryId.ZCLotteryIds.JQ4) {
      
    }
    else if (lotteryId === footballHelper.footballLotteryId.ZCLotteryIds.SFC) {
      
    }
    else if (lotteryId === footballHelper.footballLotteryId.ZCLotteryIds.ZCNINE) {
      
    }
    else if (lotteryId === footballHelper.footballLotteryId.BDLotteryIds.BJDC) {
      footballHelper.Es.bjdc.init();
      footballHelper.Es.algo.range = footballHelper.Es.jczq.getBonusRange(opts, ggType, false, bs);
      this.reslutObj.betNum = this.jczq.bet.count(opts, ggType);
    }
    else if (lotteryId === footballHelper.footballLotteryId.BDLotteryIds.SFGG) {
      
    }
    this.reslutObj.minBonus = footballHelper.Es.algo.range[0];
    this.reslutObj.maxBonus = footballHelper.Es.algo.range[1];
    return this.reslutObj;
  }



  rangeDetail(opts, ggType, bs) {
    //  根据玩法状态判断彩票种类
    var type = (this.lotteryId +'').substring(0, 3),
    lotteryMap = {
        '300': 'jczq',
        '301': 'jclq'
    };
    var info = footballHelper.Es[lotteryMap[type]].getHitDetailList(opts, ggType);
    return info;
  }
}
export default Football;