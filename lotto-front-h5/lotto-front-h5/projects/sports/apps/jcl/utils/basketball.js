import Bet from '@/bet/lottery/jclq.js';
import { groupArrayByKey, isSingleMatch, contains, getSelectedMatchs, getSingleMatchs, getAlternativeMatchs } from '../utils';
import { MODES, PAGES } from '../constants';
import { FOOTBALL_BETTTING_SELECTED_STORAGE_KEY } from '../constants';
import storage from '@/services/storage';
import { generateScoreSize } from '../utils';
import session from '@/services/session';
import store from '../store';

const basketball = new Bet();


// 计算最大奖金及奖金明细
/**
 * {
    "passObj": {
        "list": [
            "4串1",
            "3串1"
        ]
    },
    "orderObj": {
        "5140": {
            "name": "周五301",
            "bravery": true,  //是否是胆
            "betObj": {
                "list": [
                    "sf-1",
                    "sf-2",
                    "rfsf-1",
                    "rfsf-2",
                    "dxf-1",
                    "dxf-2",
                    "sfc-01",
                    "sfc-02",
                    "sfc-03",
                    "sfc-04",
                    "sfc-05",
                    "sfc-06",
                    "sfc-11",
                    "sfc-12",
                    "sfc-13",
                    "sfc-14",
                    "sfc-15",
                    "sfc-16"
                ],
                "sf-1": "1.24",
                "letScore": "-6.50",
                "sf-2": "2.92",
                "rfsf-1": "1.81",
                "rfsf-2": "1.69",
                "dxf-1": "1.70",
                "dxf-2": "1.80",
                "sfc-01": "4.10",
                "sfc-02": "3.50",
                "sfc-03": "4.55",
                "sfc-04": "8.00",
                "sfc-05": "14.50",
                "sfc-06": "18.00",
                "sfc-11": "5.90",
                "sfc-12": "6.45",
                "sfc-13": "13.50",
                "sfc-14": "29.00",
                "sfc-15": "70.00",
                "sfc-16": "82.00"
            }
        },
        "list": [
            5140
        ]
    },
    "multiple": 2,
    "isMix": true
}
 */

// 计算注数和最大奖金
export function calcBet (betting) {
    basketball.calcBet(betting);

    return basketball;
}

// 计算奖金明细
export function calcProfitDetail (betting) {
    basketball.calcDetail(betting);

    return basketball;
}

/*获取投注的选择
                sf: [1, 2], //1为主胜， 2为主负
                //让分胜负
                rfsf: [1],//1为主胜， 2为主负
                //大小分
                dxf: [2], //1为主胜， 2为主负
                //胜分差
                sfc: ["01", "02", "11", "12"], //主胜"01", "02",主负 "11", "12"

         =====转化为===>

                "list": [
                    "sf-1",
                    "sf-2",
                    "rfsf-1",
                    "rfsf-2",
                    "dxf-1",
                    "dxf-2",
                    "sfc-01",
                    "sfc-02",
                    "sfc-03",
                    "sfc-04",
                    "sfc-05",
                    "sfc-06",
                    "sfc-11",
                    "sfc-12",
                    "sfc-13",
                    "sfc-14",
                    "sfc-15",
                    "sfc-16"
                ],
*/
export function getSelectBet(bet, field){
    let list = [];

    if(field == "mix" || field == "single"){
        for(let subField in bet[field]){
            for (let i = 0; i < bet[field][subField].length; i++) {
                let subItem = bet[field][subField][i];
                list.push(subField + "-" + subItem);
            };
        }
    }else{
        for (let i = 0; i < bet[field].length; i++) {
            let subItem = bet[field][i];
            list.push(field + "-" + subItem);
        };
    }

    return list;
}

//根据id获取比赛
export function getGame(games, id){
    let game = {}, find = false;
    for (let i = 0; i < games.length; i++) {
        if(games[i].id == id){
            game = games[i];
            find = true;
            break;
        }
    };

    return {
        game, find
    }
}

//根据ID获取比赛信息
export function getGameById(id){
    let games = getCurrentStore("basketball").data;

    return getGame(games, id);
}

//获取SP值
export function getSP(games, id, selectList){
    let {game,find} = getGame(games, id);

    let current = {
        "sf-2": game.l,
        "sf-1": game.w,
        "letScore": game.let_score,
        "rfsf-2": game.let_l,
        "rfsf-1": game.let_w,
        "dxf-2": game.b,
        "dxf-1": game.s,
        "sfc-11": game.L15,
        "sfc-12": game.L610,
        "sfc-13": game.L1115,
        "sfc-14": game.L1620,
        "sfc-15": game.L2125,
        "sfc-16": game.L26,
        "sfc-01": game.w15,
        "sfc-02": game.w610,
        "sfc-03": game.w1115,
        "sfc-04": game.w1620,
        "sfc-05": game.w2125,
        "sfc-06": game.w26
    }

    return current;
}

/**
 * 获取当前的玩法
 */
export function getCurrentMode(basketball, basketballMix){
    if(basketball == null || basketballMix == null){
        let state = store.getState();
        basketballMix = state.basketballMix;
        basketball = state.basketball;
    }

    const { page } = basketball;
    const { mode } = basketballMix || {};

    return getMode(page, mode);
}

//获取玩法
export function getMode(page, subpage){
    let currentMode = "";

    if(page == 'mix'){
        currentMode = subpage == "mi" ? "mix": subpage;
    }else if(page == 'single'){
        currentMode = page;
    }

    return currentMode;
}

/**
 * 获取当前库
 */
export function getCurrentStore(field){
    let result = store.getState();

    return field ? result[field]: result;
}

/**
 * 深拷贝
 * @return {[type]} [description]
 */
export function deepClone(data){
    return JSON.parse(JSON.stringify(data));
}

/**
 * 更新state
 */
export function updateField(state, field){
    if(!field){
        return Object.assign({}, state);
    }

    let obj = {};
    obj[field] = deepClone(state[field]);

    return Object.assign({}, state, obj);
}

//检查是否是混合过关或者单关投注
export function checkIsMixSingle(mode){
    return mode == "mix" || mode == "single";
}

//获取彩种编号
export function getLotteryCode(mode){
    let codes = {
        sf: 30101,//篮球胜负
        rfsf: 30102,//让分
        dxf: 30103,//大小分
        sfc: 30104,//胜分差
        mix: 30105,//混合过关
    }

    return codes[mode];
}

/***********************************************/

// 计算单关的最大金额
export function getMatchBettingTypes(bettings) {
  return bettings.reduce((acc, b) => {
    if (acc.indexOf(b.type) < 0) {
      return acc.concat([b.type]);
    }
    return acc.concat();
  }, []);
}

// 获取比赛截至销售时间戳
export function getEndSaleTimeStamp(match) {
    return new Date(`${('2017' + match.saleDate).replace(/-/, '/')} ${match.saleEndTime}`).getTime();
}

//判断当前彩期是否正常销售
//true 为暂停销售
export function isSaleout(rules) {
    return rules.curIssue.saleStatus === 0;
}

//判断子玩法是否正常销售
//true 为暂停销售
export function checkisSaleout(mode, rules) {
    const children = rules.lotChildList;
    let code;
    try {
        code = MODES.filter(m => m.name === mode)[0].code;
    } catch(e) {
        console.error('错误的玩法 name, 必须为[' + MODES.map(m => m.name).join(',') + ']之一' );
        return true;
    }
    const child = children.filter(c => c.lotteryChildCode === code);
    return Boolean(child.length && child[0].saleStatus !== 1);
}

export function getNextNormalSaleLottery(mode, rules) {
    const modes = MODES.filter(m => m.name !== mode);
    for (let i=0, l=modes.length; i<l; i++) {
        const name = modes[i].name
        if(!checkisSaleout(name, rules)) {
            return name;
        }
    }
    return '';
}

export function getNextOpenDateTime(serverTime) {
    const hour = serverTime.getHours();
    const date = serverTime.getDate();
    const isNextDay = hour >= 9;
    const nextDate = new Date(serverTime.getTime());
    nextDate.setHours(9, 0, 0, 0, 0);
    if(isNextDay) nextDate.setDate(date + 1);
    return nextDate;
}

export function getPageData(data, name) {
    // if (name === 'single') {
    //   return data.filter(m => Boolean(m.status_letWdf === 1 || m.status_wdf === 1));
    // } else if (name === 'alternative') {
    //   return data.filter(m => Boolean(Math.abs(m.wdf[3] / 1) === 1 && m.status_letWdf !== 4));
    // }
    return data;
}

// 是否为合法的 page name
export function isValidPage(name) {
    const pages = PAGES.concat(MODES);
    return pages.map(i => i.name).indexOf(name) >= 0;
}

// page name 是否为混合里的玩法
export function isInMixPage(name) {
    return MODES.map(i => i.name).indexOf(name) >= 0;
}

export function setHistoryState(page) {
    let url = `${location.origin}${location.pathname}`;
    if (page !== 'mi') {
        url = `${url}?page=${page}`;
    }
    history.replaceState({}, null, url);
}

export function getMatchSaleEndTimestamp(match) {
    return new Date(match.saleEndDate.replace(/-/g, '/') + ' ' + match.saleEndTime).getTime()
}

export function getMatchStartTimestamp(match) {
    return new Date(match.date.replace(/-/g, '/') + ' ' + match.time).getTime()
}

//删除最后一个字符串
export function removeLast(str){
    return str.substring(0, str.length-1)
}
