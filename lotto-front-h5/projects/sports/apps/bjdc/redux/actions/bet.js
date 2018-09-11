// 胜负, 让分胜负,大小分,通用选择
export const BET_SIMPLE_SELECT = 'BET_SIMPLE_SELECT';
// 胜分差选择
export const BET_SFC_SELECT = 'BET_SFC_SELECT';
// 清除购物篮功能
export const BET_SELECT_CLEAR = 'BET_SELECT_CLEAR';
// 投注投注注数和最大奖金计算
export const BET_CALC = 'BET_CALC';
// 更改投注倍数
export const BET_MUL = 'BET_MUL';
// 设置胆
export const SET_BETTING_DAN = 'SET_BETTING_DAN';
// 打开或关闭过关设置
export const TOGGLE_GGTYPE = 'TOGGLE_GGTYPE';
// 设置过关方式
export const SET_BETTING_GGTYPE = 'SET_BETTING_GGTYPE';
// 打开或关闭胆设置
export const TOGGLE_DAN = 'TOGGLE_DAN';
// 删除投注
export const BET_REMOVE_BET = 'BET_REMOVE_BET';
// 控制键盘显示或隐藏
export const TOGGLE_KEYBOARD = 'TOGGLE_KEYBOARD';
// 设置最大倍数信息和投注信息
export const SET_MAX_INFO = 'SET_MAX_INFO';
// 显示或隐藏奖金计算器
export const TOGGLE_BONUS_CAL = 'TOGGLE_BONUS_CAL';

// 选择
export function select(selection, data, mainBetKind, subBetKind) {
  return {
    type: BET_SIMPLE_SELECT,
    data, // 投注的基础数据
    selection, // 选择的项
    mainBetKind, // 投注的主要玩法
    subBetKind // 投注的子玩法 混合过关里才有
  };
}

// 胜分差选择
export function selectSFC(data, itemMark, betKind, add) {
  return {
    type: BET_SFC_SELECT,
    data, // 投注的基础数据
    itemMark, // 选择的项
    betKind, // 子玩法标识
    add // 操作，增加还是删除。 true： 增加， false:删除
  };
}

// 清除购物篮功能
export function clearCart(mode) {
  return {
    type: BET_SELECT_CLEAR,
    mode
  };
}
let timer;
// 投注发生更改，计算奖金，和更改底部投注栏
export function calcBet() {
  calc();
}
// 计算奖金
export function calc() {
  clearTimeout(timer);
  let calcingDOM = document.getElementById('calcing');
  if (calcingDOM) {
    calcingDOM.style.display = 'block';
  }

  return dispatch => {
    timer = setTimeout(() => {
      dispatch({ type: BET_CALC });
    }, 200);
  };
}

// 更改投注倍数
export function changMul(mul) {
  return {
    type: BET_MUL,
    mul
  };
}

// 打开或关闭胆设置
export const toggleDan = () => {
  return {
    type: TOGGLE_DAN
  };
};

// 设置胆
export const setBettingDan = id => {
  return {
    type: SET_BETTING_DAN,
    id
  };
};

// 打开或关闭过关设置
export const toggleGGType = () => {
  return {
    type: TOGGLE_GGTYPE
  };
};

// 设置过关方式
export const setBettingGGtype = (types, mode) => {
  return {
    type: SET_BETTING_GGTYPE,
    types,
    mode
  };
};

// 删除投注
export const removeBet = id => {
  return {
    type: BET_REMOVE_BET,
    id
  };
};

// 控制键盘显示或隐藏
export function toggleKeyboard() {
  return {
    type: TOGGLE_KEYBOARD
  };
}

// 设置最大倍数信息和投注信息
export function setMaxInfo(maxInfo) {
  return {
    type: SET_MAX_INFO,
    maxInfo
  };
}

// 显示或隐藏奖金计算器
export function toggleBonusCal() {
  return {
    type: TOGGLE_BONUS_CAL
  };
}
