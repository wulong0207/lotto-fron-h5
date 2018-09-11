/**
 * Created by 杨利东
 * date 2017-5-10
 * desc:个人中心模块--竞技彩订单处理
 */
import React, { Component } from 'react';
import OrderHelper from './order-helper';
import { subInner } from '@/utils/utils';

const JJCHelper = {
  // 把字符串 sp = >  按顺序 返回 字符串
  // jcz SRZQB  jcl SRDC
  spSort(planContent, sortArr) {
    planContent = planContent || '';
    let hash = {};
    let planArr = planContent.split('_') || [];
    planArr.forEach(function(v) {
      hash[v[0]] = v;
    });
    planArr = [];
    sortArr.forEach(function(m) {
      if (hash[m]) planArr.push(hash[m]);
    });
    return planArr.join('_');
  },

  // 获取过关方式如：2_1,3_1
  getPassStyle(str) {
    let result = '';

    if (str) {
      let arr = str.split(',');
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (parseInt(arr[j][0]) > parseInt(arr[j + 1][0])) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }

      str = arr.join(',');

      result = str
        .replace(/,/g, ' ')
        .replace(/_/g, '串')
        .replace(/1串1/g, '单关');
    }

    return result;
  },

  // 获取胜负结果
  getMatchDes(code) {
    switch (code) {
      case '3':
        return '胜';
      case '1':
        return '平';
      case '0':
        return '负';
    }
    return ' -- ';
  },

  // 获取所有投注类型
  getKindByCode(lotterychildcode) {
    let result = '';

    switch (lotterychildcode + '') {
      case '30001':
        result = '';
        break; // 竞彩足球混投
      case '30002':
        result = 'S';
        break; // 竞彩足球胜平负
      case '30003':
        result = 'R';
        break; // 竞彩足球让球胜平负
      case '30004':
        result = 'Q';
        break; // 竞彩足球全场比分
      case '30005':
        result = 'Z';
        break; // 竞彩足球总进球数
      case '30006':
        result = 'B';
        break; // 竞彩足球半全场胜平负

      case '30101':
        result = 'S';
        break; // 竞彩篮球胜负
      case '30102':
        result = 'R';
        break; // 竞彩篮球让球胜负
      case '30103':
        result = 'D';
        break; // 竞彩篮球大小分
      case '30104':
        result = 'C';
        break; // 竞彩篮球胜分差
      case '30105':
        result = '';
        break; // 竞彩篮球混投

      default:
        result = 'S';
        break;
    }

    return result;
  },

  // 获取比赛的彩果  由于服务器的SB结构，不得不加的SB函数
  // 足球调试数据
  // orderBaseInfoBO.drawCode = "[0:0,1:0](S_3,R@+1_3,Q_11,Z_7,B_33)|*";
  // 篮球调试数据
  // orderBaseInfoBO.drawCode = "[102:108](S_0,R@+11.5_3@+10.5_3,C_01,D@204.5_99@205.5_99)|*";
  getGameResultsFromObj(orderMatchInfoBOs, orderBaseInfoBO) {
    let resultCode = '';
    for (let i = 0; i < orderMatchInfoBOs.length; i++) {
      let item = orderMatchInfoBOs[i];
      let has = false;
      let jg = item.orderMatchZQBO; // 赛果信息
      if (jg && jg.halfScore) {
        has = true;
        jg.letNum = jg.letNum.indexOf('-') >= 0 ? jg.letNum : '+' + jg.letNum;
        let goalNum = parseInt(jg.goalNum) >= 7 ? '7' : jg.goalNum;
        let score = '';
        let arr = jg.fullScore.split(':');
        let n1 = parseInt(arr[0]);
        let n2 = parseInt(arr[1]);
        if (n1 + n2 > 7) {
          if (n1 > n2) {
            score = '90';
          } else if (n2 > n1) {
            score = '09';
          } else if (n2 == n1) {
            score = '99';
          }
        } else {
          score = jg.score;
        }

        resultCode += `[${jg.halfScore},${jg.fullScore}](S_${jg.fullSpf},R@${
          jg.letNum
        }_${jg.letSpf},Q_${score},Z_${goalNum},B_${jg.hfWdf})`;
      }

      if (!has) {
        jg = item.orderMatchLQBO;
      }

      if (jg && jg.dxfWF) {
        // 竟篮的投注内容
        resultCode += `[${jg.fullScore}](S_${jg.fullWf}-R_${jg.letWf}-C_${
          jg.sfcWF
        }-D_${jg.dxfWF})`;
      }

      if (!has) {
        if (item.matchStatus == 4 || item.matchStatus == 13) {
          resultCode += '*';
        } else {
          resultCode += '';
        }
      }

      if (i != orderMatchInfoBOs.length - 1) {
        resultCode += '|';
      }
    }
    return this.getGameResults(resultCode);
  },
  /* 获取比赛彩果
        胜平负：S ; 让球胜平负：R ; 全场比分：Q ; 总进球数：Z ; 半全场胜平负：B ;

    */
  getGameResults(drawCode) {
    drawCode = drawCode || '';
    let arrResult = [];
    // "[102:108](S_0,R@+11.5_3@+10.5_3,C_01,D@204.5_99@205.5_99)|*"
    // ["[80:120](S_3,R_-10.5", "3,-11.5", "3,-12.5", "3,-13.5", "3,C_06,D_163.5", "99,164.5", "99)"]
    let codeArr = drawCode.split('|');
    for (let j = 0; j < codeArr.length; j++) {
      let codeArrItem = codeArr[j];
      let result = JJCHelper.getDefaultResult();

      // 赛事取消用“*”表示；
      // [102:108](S_0,R@+11.5_3@+10.5_3,C_10,D@204.5_99@205.5_99)
      if (codeArrItem && codeArrItem != '*') {
        // 获取比分
        // if(scroes.length == 1){
        //     result.score = scroes[0] || "";
        // }else{
        //     result.halfScore = scroes[0] || "";
        //     result.score = scroes[1] || "";
        // }
        // 全场比分  score [0:1,0:1] ==> [0,1]
        let scores = subInner(codeArrItem, '[', ']').split(',');
        if (scores.length == 2) {
          result.score = scores[1];
        }

        let other = subInner(codeArrItem, '(', ')').split(',');
        for (let i = 0; i < other.length; i++) {
          let otherItem = other[i];
          if (otherItem.indexOf('@') >= 0) {
            // 解析这种格式R@+11.5_3@+10.5_3
            let jg = subInner(otherItem, '@'); // 获取+11.5_3@+10.5_3
            let jgs = jg.split('@');
            for (let ij = 0; ij < jgs.length; ij++) {
              let jgItem = jgs[ij];
              let jgItemArr = jgItem.split('_');
              result[otherItem[0] + '[' + jgItemArr[0] + ']'] = jgItemArr[1]; // 生成R[+11.5]:3
            }
          } else {
            // 解析这种格式S_0
            let itemArr = otherItem.split('_');
            result[itemArr[0][0]] = itemArr[1];
          }
        }
      } else if (codeArrItem == '*') {
        result.cancel = true;
      }

      arrResult.push(result);
    }
    return arrResult;
  },

  /**
   * 检查是否中奖，中奖则返回true，否则返回0
   * gameResult 中奖结果 {B:"33",C:"",D:""
   *                      Q:"11",R:""
   *                      R[+1]:"3",S:"1",Z:"7"
   *                      cancel:false,
   *                      halfScore:"0:0",
   *                      score:"1:0"}
   * code 投注片段 R[+1](3@1.57,0@2.27)
   * subCode 投注子片段 3@1.57
   */
  checkDraw(gameResult, code, subCode) {
    let filed = subInner(code, '', '(') || '';
    let val = subInner(subCode, '', '@');
    return gameResult[filed] == val;
  },

  // 足球彩
  FootBall: {
    /**
     * 获取比赛方式
     */
    getMatchKind(code) {
      let result = { kind: '', txt: '' };
      let codeResult = subInner(code || '', '', '(');

      if (codeResult.indexOf('S') >= 0) {
        result.txt = codeResult.replace(/S/g, '胜平负');
        result.kind = 'S';
      } else if (codeResult.indexOf('R') >= 0) {
        result.txt = codeResult.replace(/R/g, '让球胜平负');
        result.kind = 'R';
      } else if (codeResult.indexOf('Q') >= 0) {
        result.txt = codeResult.replace(/Q/g, '全场比分');
        result.kind = 'Q';
      } else if (codeResult.indexOf('B') >= 0) {
        result.txt = codeResult.replace(/B/g, '半全场');
        result.kind = 'B';
      } else if (codeResult.indexOf('Z') >= 0) {
        result.txt = codeResult.replace(/Z/g, '总进球数');
        result.kind = 'Z';
      } else {
        result.txt = '--';
        result.kind = '';
      }

      return result;
    }
  },

  // 获取默认结果
  getDefaultResult() {
    return {
      halfScore: '', // 半场比分
      score: '', // 全场比分
      S: '', // 胜平负
      R: '', // 让球胜平负
      B: '', // 半全场
      Q: '', // 全场比分
      Z: '', // 总进球数
      C: '', // 篮球胜分差
      D: '', // 篮球 大小分
      cancel: false // 是否取消
    };
  },

  // 篮球
  BasketBall: {
    /**
     * 获取比赛方式
     */
    getMatchKind(code) {
      let result = { kind: '', txt: '' };
      let codeResult = subInner(code || '', '', '(');

      if (codeResult.indexOf('S') >= 0) {
        result.txt = codeResult.replace(/S/g, '胜负');
        result.kind = 'S';
      } else if (codeResult.indexOf('R') >= 0) {
        result.txt = codeResult.replace(/R/g, '让分胜负');
        result.kind = 'R';
      } else if (codeResult.indexOf('C') >= 0) {
        result.txt = codeResult.replace(/C/g, '胜分差');
        result.kind = 'C';
      } else if (codeResult.indexOf('D') >= 0) {
        result.txt = codeResult.replace(/D/g, '大小分');
        result.kind = 'D';
      } else {
        result.txt = '--';
        result.kind = '';
      }

      return result;
    },

    // 获取大小分描述
    getDxDes(code) {
      code = code || '';
      if (code.indexOf('99') >= 0) {
        return code.replace(/99/, '大分');
      } else if (code.indexOf('00') >= 0) {
        return code.replace(/00/, '小分');
      }

      return code;
    },

    // 获取胜分差   主胜1-5(01)  6-10(02) 11-15(03) 16-20(04) 21-25(05) 26+(06)
    //             客胜 1-5(11)  6-10(12) 11-15(13) 16-20(14) 21-25(15) 26+(16)
    getSfcDes(code) {
      let result = '';
      switch (code) {
        case '01':
          result = '主胜1-5';
          break;
        case '02':
          result = '主胜6-10';
          break;
        case '03':
          result = '主胜11-15';
          break;
        case '04':
          result = '主胜16-20';
          break;
        case '05':
          result = '主胜21-25';
          break;
        case '06':
          result = '主胜26+';
          break;

        case '11':
          result = '主负1-5';
          break;
        case '12':
          result = '主负6-10';
          break;
        case '13':
          result = '主负11-15';
          break;
        case '14':
          result = '主负16-20';
          break;
        case '15':
          result = '主负21-25';
          break;
        case '16':
          result = '主负26+';
          break;
      }

      return result;
    }
  }
};

export default JJCHelper;
