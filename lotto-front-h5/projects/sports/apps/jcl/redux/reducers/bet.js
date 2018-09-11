import {
  BET_SIMPLE_SELECT,
  BET_SFC_SELECT,
  BET_SELECT_CLEAR,
  BET_CALC,
  BET_MUL,
  BET_REMOVE_BET,
  SET_MAX_INFO,
  TOGGLE_DAN,
  SET_BETTING_DAN,
  TOGGLE_GGTYPE,
  SET_BETTING_GGTYPE,
  TOGGLE_KEYBOARD,
  TOGGLE_BONUS_CAL
} from '../actions/bet.js';
import {
  getBetID,
  selectSimple,
  selectSFC,
  generateDefault,
  getDefaultBetCalc,
  getDefaultGGType,
  loopBets,
  getMinGG,
  updateGG,
  checkHasSelect,
  checkSingle,
  selectGameCout,
  getSavedBets,
  saveBets
} from '../../utils/bet.js';

import {
  calcBet,
  calcProfitDetail,
  getSelectBet,
  getSP,
  getCurrentMode,
  getCurrentStore,
  updateField,
  checkIsMixSingle
} from '../../utils/basketball.js';

import Alert from '@/services/message.js';

const savedData = getSavedBets();
const defaultState = {
  bets:
    savedData.bets ||
    {
      // "周四301": {
      //     //胜负
      //     sf: [1, 2], //1为主胜， 2为主负
      //     //让分胜负
      //     rfsf: [1],//1为主胜， 2为主负
      //     //大小分
      //     dxf: [2], //1为主胜， 2为主负
      //     //胜分差
      //     sfc: ["01", "02", "11", "12"], //主胜"01", "02",主负 "11", "12"
      //     //混合过关
      //     mix: {
      //         sf: [1, 2], //1为主胜， 2为主负
      //         //让分胜负
      //         rfsf: [1],//1为主胜， 2为主负
      //         //大小分
      //         dxf: [2], //1为主胜， 2为主负
      //         //胜分差
      //         sfc: ["01", "02", "11", "12"], //主胜"01", "02",主负 "11", "12"
      //     },
      //     //单关投注
      //     single: {
      //         sf: [1, 2], //1为主胜， 2为主负
      //         //让分胜负
      //         rfsf: [1],//1为主胜， 2为主负
      //         //大小分
      //         dxf: [2], //1为主胜， 2为主负
      //         //胜分差
      //         sfc: ["01", "02", "11", "12"], //主胜"01", "02",主负 "11", "12"
      //     }
      //     id: 5001,
      //     systemCode: game.systemCode, //系统编号
      //     lotteryIssue: game.lotteryIssue, //彩期
      //     bravery: { //是否为胆
      //          sf: false,
      //          rfsf: false,
      //          dxf: false,
      //          sfc: false,
      //     }
      // }
    },

  // 计算投注注数奖金等
  betCalc: savedData.betCalc || {
    // 胜负
    sf: getDefaultBetCalc(),
    // 让分胜负
    rfsf: getDefaultBetCalc(),
    // 大小分
    dxf: getDefaultBetCalc(),
    // 胜分差
    sfc: getDefaultBetCalc('sfc'),
    // 混合过关
    mix: getDefaultBetCalc(),
    // 单关投注
    single: getDefaultBetCalc('single')
  },

  // 展现过关面板
  showGGPanel: false,
  // 展现胆面板
  showDanPanel: false,
  // 展现键盘
  keyboardShow: false,
  // 显示或隐藏奖金计算器
  showBonusCal: false,
  // 最大投注和最大倍数信息
  maxInfo: {
    betNum: 0,
    multiple: 0
  }
};

// 选择的场次是否达到了场数限制
function isMatchLimitReached(state, max = 15) {
  let gameCount = selectGameCout(state.bets, getCurrentMode());
  if (gameCount.count > max) {
    Alert.alert({ msg: '选择场次不得大于' + max + '场' });
    return true;
  }

  return false;
}

// 奖金计算
function calc(state) {
  let gameDatas = getCurrentStore('basketball').data;
  let mode = getCurrentMode();
  let curBetCalc = state.betCalc[mode];
  let ggFS;
  if (mode === 'single') {
    ggFS = ['1串1'];
  } else {
    ggFS =
      curBetCalc.ggType.length > 0
        ? curBetCalc.ggType
        : getDefaultGGType(state.bets, mode).ggList;
  }
  let params = {
    passObj: {
      list: ggFS
    },
    orderObj: { list: [] },
    multiple: curBetCalc.multiple,
    isMix: mode === 'single' || mode === 'mix'
  };

  // 获取最小的过关值
  let maxDan = getMinGG(params.passObj.list);
  let danCount = 0;
  let updateDan = false;
  // 得到所有玩法投注内容
  loopBets(
    state.bets,
    (item, field) => {
      let selectList = getSelectBet(item, mode);
      // 获取SP值
      let betObj = getSP(gameDatas, item.id, selectList);
      // 获取单关的投注内容
      betObj.list = selectList;

      // 判断胆个总个数是否已经超过了最小过关值，如果超过了，则将当前的胆设置为false
      if (item.bravery[mode]) {
        if (danCount >= maxDan - 1) {
          item.bravery[mode] = false;
          updateDan = true; // 已经更新了胆了，需要更新state
        } else {
          danCount++;
        }
      }

      params.orderObj[item.id] = {
        name: field,
        bravery: item.bravery[mode] || false,
        betObj
      };

      // 将每场比赛的id加入数组中
      params.orderObj.list.push(item.id);
    },
    true
  );

  // 单关投注检查
  let isSingle = checkSingle(params, gameDatas);
  // 开始计算
  let result =
    params.orderObj.list.length == 0
      ? { betNum: 0, maxBonus: 0 }
      : calcProfitDetail(params);

  curBetCalc.betNum = result.betNum;
  curBetCalc.maxBonus = result.maxBonus;
  curBetCalc.minBonus = result.maxBonus;
  curBetCalc.isSingle = isSingle;
  curBetCalc.hitObj = result.hitObj;

  if (updateDan) {
    // 更新投注内容
    state = updateField(state, 'bets');
  }

  return updateField(state, 'betCalc');
}

export const betSelected = (state = defaultState, action) => {
  switch (action.type) {
    // 胜负, 让分胜负,大小分,通用选择
    case BET_SIMPLE_SELECT: {
      let result = updateField(state, 'bets');
      selectSimple(result, action);

      return isMatchLimitReached(result) ? updateField(state) : calc(result);
    }
    // 胜分差
    case BET_SFC_SELECT: {
      let result = updateField(state, 'bets');
      selectSFC(result, action);

      return isMatchLimitReached(result) ? updateField(state) : calc(result);
    }
    // 清除购物篮功能
    case BET_SELECT_CLEAR: {
      let mode = getCurrentMode();

      loopBets(state.bets, (item, field) => {
        if (checkIsMixSingle(mode)) {
          state.bets[field][mode] = {
            sf: [], // 1为主胜， 2为主负
            // 让分胜负
            rfsf: [], // 1为主胜， 2为主负
            // 大小分
            dxf: [], // 1为主胜， 2为主负
            // 胜分差
            sfc: [] // 主胜"01", "02",主负 "11", "12"
          };
        } else {
          state.bets[field][mode] = [];
        }

        state.bets[field].bravery[mode] = false;
      });

      state.betCalc[mode] = getDefaultBetCalc();

      let updatedBet = updateField(state, 'betCalc');
      saveBets(updatedBet);

      return updatedBet;
    }
    // 投注发生更改，计算奖金，和更改底部投注栏
    case BET_CALC:
      return calc(state);
    // 更改投注倍数
    case BET_MUL: {
      let mode = getCurrentMode();
      let curentBet = state.betCalc[mode];

      curentBet.maxBonus = curentBet.maxBonus / curentBet.multiple * action.mul;
      if (isNaN(curentBet.maxBonus)) {
        curentBet.maxBonus = 0;
      }

      curentBet.maxBonus = parseFloat(curentBet.maxBonus.toFixed(2));

      curentBet.multiple = action.mul;

      return updateField(state, 'betCalc');
    }
    // 打开或关闭过关设置
    case TOGGLE_GGTYPE: {
      state.showGGPanel = !state.showGGPanel;

      return updateField(state);
    }
    // 设置过关方式
    case SET_BETTING_GGTYPE: {
      let mode = getCurrentMode();
      let curentBet = state.betCalc[mode];
      curentBet.ggType = action.types;

      return calc(state);
    }
    // 打开或关闭胆设置
    case TOGGLE_DAN: {
      state.showDanPanel = !state.showDanPanel;

      return updateField(state);
    }
    // 删除投注
    case BET_REMOVE_BET: {
      let mode = getCurrentMode();
      if (state.bets[action.id]) {
        state.bets[action.id][mode] = checkIsMixSingle(mode)
          ? generateDefault()[mode]
          : [];
      }

      // 胆设置为false
      state.bets[action.id].bravery[mode] = false;
      updateGG(state, mode);

      return calc(state);
    }
    // 设置胆
    case SET_BETTING_DAN: {
      let mode = getCurrentMode();
      if (action.id instanceof Array) {
        for (let i = 0; i < action.id.length; i++) {
          let item = action.id[i];
          state.bets[item].bravery[mode] = !state.bets[item].bravery[mode];
        }
      } else {
        if (state.bets[action.id]) {
          state.bets[action.id].bravery[mode] = !state.bets[action.id].bravery[
            mode
          ];
        }
      }

      return updateField(state);
    }
    // 控制键盘显示或隐藏
    case TOGGLE_KEYBOARD: {
      state.keyboardShow = !state.keyboardShow;

      return updateField(state);
    }
    // 设置最大倍数信息和投注信息
    case SET_MAX_INFO: {
      state.maxInfo = action.maxInfo;

      return updateField(state, 'maxInfo');
    }
    // 显示或隐藏奖金计算器
    case TOGGLE_BONUS_CAL:
      {
        state.showBonusCal = !state.showBonusCal;

        return updateField(state);
      }
      break;
    default:
      return state;
  }
};
