import {getMode, getGame, getCurrentMode, getGameById, getCurrentStore} from "./basketball.js";
import {BASKETBALL_BETTING_STORAGE_KEY, BASKETBALL_BETTTING_CALC_STORAGE_KEY} from '../constants.js';
import session from "@/services/session.js";

//获取场次的ID
export function getBetID (gameData) {
    return gameData.week + gameData.num;
}

//生成默认的数据
export function generateDefault(game){
    game = game || {};

    return {
        //胜负
        sf: [], //1为主胜， 2为主负
        //让分胜负
        rfsf: [],//1为主胜， 2为主负
        //大小分
        dxf: [], //1为主胜， 2为主负
        //胜分差
        sfc: [], //主胜"01", "02",主负 "11", "12"
        //混合过关
        mix: {
            sf: [], //1为主胜， 2为主负
            //让分胜负
            rfsf: [],//1为主胜， 2为主负
            //大小分
            dxf: [], //1为主胜， 2为主负
            //胜分差
            sfc: [], //主胜"01", "02",主负 "11", "12"
        },
        //单关投注
        single: {
            sf: [], //1为主胜， 2为主负
            //让分胜负
            rfsf: [],//1为主胜， 2为主负
            //大小分
            dxf: [], //1为主胜， 2为主负
            //胜分差
            sfc: [], //主胜"01", "02",主负 "11", "12"
        },
        id: game.id, //赛事id
        systemCode: game.systemCode, //系统编号
        lotteryIssue: game.issueCode, //彩期
        bravery: { //是否为胆
            sf: false,
            rfsf: false,
            dxf: false,
            sfc: false,
        }
    }
}

//默认的奖金计算数据
export function getDefaultBetCalc(mode){
    let ggType = [], isSingle = false;
    if(mode == "single"){
        ggType.push("1串1");
        isSingle = true;
    }

    return {
        betNum: 0, //投资注数
        maxBonus: 0, //最大奖金
        minBonus: 0, //最小奖金
        multiple: 1, //倍数
        ggType, //过关类型
        isSingle, //是否是单关
    };
}

//根据选择的结果返回选择的适用于组件的状态
//例如将[1,2]转化为{left: true, right: true}
export function getSelected (bets, game, mainBetKind, subMainKind) {
    let result = {left: false, right: false};
    let betID = getBetID(game);

    if(betID && bets[betID]){
        let arr = bets[betID][mainBetKind];

        //胜分差直接返回
        if(mainBetKind == "sfc"){
            return arr;
        }

        //混合过关则继续处理
        if(mainBetKind == "mix" || mainBetKind == "single"){
            arr = arr[subMainKind];

            //胜分差直接返回
            if(subMainKind == "sfc"){
                return arr;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            if(arr[i] == 2){
                result.left = true;
            }else if(arr[i] == 1){
                result.right = true;
            }
        };
    }else if(mainBetKind == "sfc" || subMainKind == "sfc"){
        return [];
    }

    return result;
}

//选择或取消选择，更新胆信息，如果没有投注内容，则取消设置当前胆
export function updateDan(bet, mode){
    if(!checkHasSelect(bet, mode).hasSelect){
        bet.bravery[mode] = false;
    }
}

//选择或取消选择，更新过关信息，如果没有投注内容，则判断过关是否满足条件
export function updateGG(state, mode){
    let betCalcItem = state.betCalc[mode];
    if(betCalcItem.ggType.length > 0){
        let gameCount = selectGameCout(state.bets, mode);
        let result = [];
        betCalcItem.ggType.map((val, i)=>{
            let count = gameCount.count >4 && gameCount.hasSFC ? 4 :gameCount.count;
            if(parseInt(val) <= count){
                result.push(val);
            }
        });

        betCalcItem.ggType = result;
    }
}

//胜负, 让分胜负,大小分,通用选择
export function selectSimple (stateData, action) {
    let field = action.mainBetKind,
        gameData = action.data, selection = action.selection,
        subField = action.subBetKind;
    let targetField = getBetID(gameData);

    if(!stateData.bets[targetField]){
        stateData.bets[targetField] = generateDefault(gameData);
    }

    if(field == "mix" || field == "single"){ //混合过关
        stateData.bets[targetField][field][subField] = [];
        if(selection.left){stateData.bets[targetField][field][subField].push(2);}
        if(selection.right){stateData.bets[targetField][field][subField].push(1);}
    }else{
        stateData.bets[targetField][field] = [];
        if(selection.left){stateData.bets[targetField][field].push(2);}
        if(selection.right){stateData.bets[targetField][field].push(1);}
    }

    if(field != "single"){
        //选择或取消选择，更新胆信息，如果没有投注内容，则取消设置当前胆
        updateDan(stateData.bets[targetField], field);
        //选择或取消选择，更新过关信息，如果没有投注内容，则判断过关是否满足条件
        updateGG(stateData, field);
    }
}

//胜分差选择
export function selectSFC(stateData, action){
    let {
        data, //投注的基础数据
        itemMark, //选择的项
        add, // 操作，增加还是删除。 true： 增加， false:删除
        betKind, //混合过关时传
    } = action;

    let targetField = getBetID(data);
    if(!stateData.bets[targetField]){
        stateData.bets[targetField] = generateDefault(data);
    }

    let arr = stateData.bets[targetField]["sfc"];
    if(betKind == "mix" || betKind == "single"){ //混合过关
        arr = stateData.bets[targetField][betKind]["sfc"];
    }

    let index = arr.indexOf(itemMark);
    if(index < 0){
        arr.push(itemMark);
    }else{
        arr.splice(index, 1);
    }

    if(betKind != "single"){
        //选择或取消选择，更新胆信息，如果没有投注内容，则取消设置当前胆
        updateDan(stateData.bets[targetField], betKind);
        //选择或取消选择，更新过关信息，如果没有投注内容，则判断过关是否满足条件
        updateGG(stateData, betKind);
    }
}

/**
 * 选择的比赛场数
 */
export function selectGameCout(bets, mode){
    let count = 0;
    let hasSFC = false;

    if(bets){
        loopBets(bets, (item)=>{
            let sels = checkHasSelect(item, mode);

            if(sels.hasSelect){ count++; }
            if(sels.hasSFC){ hasSFC = true; }
        });
    }

    return {
        hasSFC, count
    };
}

/**
 * 获取默认的过关方式
 */
export function getDefaultGGType(bets, mode){
    let gameCount = selectGameCout(bets, mode);
    let count = gameCount.count;
    if(count > 4){ //默认串关最大为4串1
        count = 4;
    }else if(mode != "single" && count < 2){
        count = 2;
    }

    return {
        gg: count,
        ggStr: count + "串" + 1,
        ggList: [count + "串" + 1]
    }
}

//获取数组中的最小过关值
export function getMinGG(arr){
    let min = parseInt(arr[0]||0);
    for (let i = 0; i < arr.length; i++) {
        let num = parseInt(arr[i]);
        if(min > num) min = num;
    };

    return min;
}

/**
 * 检查投注是否有投注数据
 */
export function checkHasSelect(bet, mode){
    let data = bet;
    let result = { hasSelect: false, hasSFC: false}

    if(mode == "single" || mode == "mix"){
        let sf = data[mode].sf.length;
        let rfsf = data[mode].rfsf.length;
        let dxf = data[mode].dxf.length;
        let sfc = data[mode].sfc.length;
        if(sf > 0 || rfsf > 0 || dxf > 0 || sfc > 0){
            result.hasSelect = true;
            if(sfc > 0){ result.hasSFC = true;}
        }
    }else{
        if(data[mode].length > 0){
            result.hasSelect = true;
            if(mode == "sfc"){ result.hasSFC = true; }
        }
    }

    return result;
}

//获取投注的标示：例如 主胜[+11.5]
export function getLabel(sp, title, signed){
    let result = sp;
    if(signed) result = sp >0 ? "+" + sp: sp;
    title = title || "";
    return `${title}[${result}]`
}

//获取投注的基本信息
export function getBetDetail(){
    let getTitle = () => {

    }
    return {
        sf: {title: "胜负", 2: "主负", 1: "主胜", "2val": "l", "1val": "w", getTitle: ()=>"胜负"},
        rfsf: {title: "让分胜负", 2: "让分主负", 1: "让分主胜", "2val": "let_l", "1val": "let_w",
                getTitle: (gameSP, title)=>{return getLabel(gameSP.let_score, "让分胜负", true);},
                getLabel: (gameSP, title) => {return getLabel(gameSP.let_score, title.replace("让分", ""), true)},
                getScore: gameSP => (gameSP.let_score >0 ? "+" + gameSP.let_score: gameSP.let_score)
            },
        dxf: {title: "大小分", 2: "大分", 1: "小分", "2val": "b", "1val": "s", getTitle: ()=>"大小分",
            getScore: gameSP => gameSP.p_score,
            getLabel: (gameSP, title) => {return getLabel(gameSP.p_score, title, false)},
        },
        sfc: {
            title: "胜分差", getTitle: ()=>"胜分差",
            "11":"主负1-5", "12":"主负6-10", "13":"主负11-15",
            "14":"主负16-20", "15":"主负21-25", "16":"主负26+",
            "01":"主胜1-5", "02":"主胜6-10", "03":"主胜11-15",
            "04":"主胜16-20", "05":"主胜21-25", "06":"主胜26+",

            "11val": "L15", "12val": "L610", "13val": "L1115",
            "14val": "L1620", "15val": "L2125", "16val": "L26",
            "01val": "w15", "02val": "w610", "03val": "w1115",
            "04val": "w1620", "05val": "w2125", "06val": "w26",
        },
        //获取key值
        getKey(key){
            return key + "val";
        }
    }
}

//获取胆个数
export function getDanCount(bets, mode){
    let count = 0;
    loopBets(bets, (item)=>{
        if(item.bravery[mode]){
            count++;
        }
    });

    return count;
}

//遍历投注内容
export function loopBets(bets, handler, checkSelect){
    let mode = getCurrentMode();
    for (let field in bets) {
        if(handler){
            if(!checkSelect || checkHasSelect(bets[field], mode).hasSelect){
                handler(bets[field], field);
            }
        }
    }
}

//混合投注的单关检查，并将只有单关且只有一场比赛的转为单关投注
export function checkSingle(params, gameSrc){
    let {orderObj, passObj} = params;
    let dg = "1串1";
    if(passObj.list.length == 0 && passObj.list[0] ==dg){
        return true;
    }

    let isSingle = false;
    //只有一场比赛
    if(orderObj.list.length == 1){
        let game = getGame(gameSrc, orderObj.list[0]).game || {};
        let betList = orderObj[orderObj.list[0]].betObj.list;
        isSingle = (betList.length > 0);
        for (let i = 0; i < betList.length; i++) {
            let item = betList[i];
            if((item.indexOf("sf-") >= 0 && game.statusWf != 1)||
                (item.indexOf("rfsf-") >= 0 && game.statusLetWf != 1)||
                (item.indexOf("dxf-") >= 0 && game.statusBigSmall != 1)||
                (item.indexOf("sfc-") >= 0 && game.statusScoreWf != 1)){
                isSingle = false;
                break;
            }
        };
    }

    //是单关投注
    if(isSingle){
        passObj.list = [dg];
    }

    return isSingle;
}

//获取选择的投注信息
export function getSelectedBets(){
    let result = [];
    let dan = [];
    let mode = getCurrentMode();
    let betDetail = getBetDetail();
    let {bets, betCalc} = getCurrentStore("betSelected");

    //遍历选号
    loopBets(bets, (bet, field)=>{
        let match = getGameById(bet.id).game;
        if(bet.bravery[mode]){
            dan.push(bet.id);
        }

        if(mode == "mix" || mode == "single"){
            for(let subField in bet[mode]){
                for (let i = 0; i < bet[mode][subField].length; i++) {
                    let sel = bet[mode][subField][i];
                    let arrItem = {
                        category: mode,
                        id: bet.id,
                        index: result.length,
                        match,
                        single: false,
                        sp: match[betDetail[subField][sel+"val"]],
                        type: subField,
                        title: betDetail[subField].getTitle(match),
                        value: sel,
                        label: betDetail[subField].getLabel?
                             betDetail[subField].getLabel(match, betDetail[subField][sel]):
                             betDetail[subField][sel],
                        times: betCalc[mode].multiple,
                        score: betDetail[subField].getScore?betDetail[subField].getScore(match):"",
                    };

                    result.push(arrItem);
                };
            }
        }else{
            for (let i = 0; i < bet[mode].length; i++) {
                let sel = bet[mode][i];
                let arrItem = {
                    category: mode,
                    id: bet.id,
                    index: result.length,
                    match,
                    single: false,
                    sp: match[betDetail[mode][sel+"val"]],
                    type: mode,
                    title: betDetail[mode].getTitle(match),
                    value: sel,
                    label: betDetail[mode].getLabel?
                        betDetail[mode].getLabel(match, betDetail[mode][sel]):
                        betDetail[mode][sel],
                    times: betCalc[mode].multiple,
                    score: betDetail[mode].getScore?betDetail[mode].getScore(match):"",
                };

                result.push(arrItem);
            };
        }
    }, true)

    return {
        bets: result,
        dan
    };
}

//获取存储的投注信息
export function getSavedBets(){
    return {
        bets: session.get(BASKETBALL_BETTING_STORAGE_KEY),
        betCalc: session.get(BASKETBALL_BETTTING_CALC_STORAGE_KEY)
    }
}

//存储投注信息
export function saveBets(betSelected){
    betSelected = betSelected || getCurrentStore("betSelected");
    session.set(BASKETBALL_BETTING_STORAGE_KEY, betSelected.bets);
    session.set(BASKETBALL_BETTTING_CALC_STORAGE_KEY, betSelected.betCalc);
}

//清除存储信息
export function clearBetsStorage(){
    session.clear(BASKETBALL_BETTING_STORAGE_KEY);
    session.clear(BASKETBALL_BETTTING_CALC_STORAGE_KEY);
}
