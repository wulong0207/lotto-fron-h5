/*
 * @Author: nearxu
 * @Date: 2017-10-28 17:27:46 
 */
import React from 'react';
import OrderHelper from '../../components/order-helper';
export default {
  getLotteryIssue(lotteryCode, lotteryIssue) {
    switch (lotteryCode) {
      case 300:
      case 301:
      case 306:
      case 307: // 竞技彩 返回空
        return '';
        break;
      default:
        return lotteryIssue + '期';
    }
  },
  // 子玩法类型
  getLotteryChild(lotterychildcode) {
    let result;
    switch (lotterychildcode) {
      case 30001:
        result = '混投';
        break; // 竞彩足球混投
      case 30002:
        result = '胜平负';
        break; // 竞彩足球胜平负
      case 30003:
        result = '让球胜平负';
        break; // 竞彩足球让球胜平负
      case 30004:
        result = '全场比分';
        break; // 竞彩足球全场比分
      case 30005:
        result = '总进球数';
        break; // 竞彩足球总进球数
      case 30006:
        result = '半全场胜平负';
        break; // 竞彩足球半全场胜平负

      case 30101:
        result = '胜负';
        break; // 竞彩篮球胜负
      case 30102:
        result = '让分胜负';
        break; // 竞彩篮球让球胜负
      case 30103:
        result = '大小分';
        break; // 竞彩篮球大小分
      case 30104:
        result = '胜分差';
        break; // 竞彩篮球胜分差
      case 30105:
        result = '混投';
        break; // 竞彩篮球混投

      case 30601:
        result = '胜负';
        break; // 北京单场胜负
      case 30602:
        result = '上下单双';
        break; // 北京单场上下单双
      case 30603:
        result = '总进球';
        break; // 北京单场总进球
      case 30604:
        result = '全场比分';
        break; // 北京单场全场比分
      case 30605:
        result = '半全场';
        break; // 北京单场半全场
      case 30701:
        result = '胜负过关';
        break; // 北京单场胜负过关

      default:
        result = ' ';
        break;
    }

    return result;
  },
  // 获取比赛信息
  getMathInfo: function(matchInfo) {
    let result;
    const orderMatchZQBO = matchInfo.orderMatchZQBO || {};
    const orderMatchLQBO = matchInfo.orderMatchLQBO || {};
    // 1：等待比赛；2：比赛中；3：已完场；4：延期；5：取消
    // 其它竞技彩赛事状态：6：暂定赛程；7：未开售；8：预售中；9：销售中；
    // 10：暂停销售；11：销售截止；12：比赛进行中；13：延期；14：取消；
    // 15：已开奖； 16：已派奖；17：已审核
    switch (matchInfo.matchStatus) {
      case 1: // 等待比赛
      case 7: // 未开售
      case 8: // 预售中
      case 9: // 销售中
      case 10: // 暂停销售
      case 11: // 销售截止
      case 17:
        {
          // 已审核
          let date = '';
          let time = '';
          if (matchInfo.date) {
            date = matchInfo.date.substring(matchInfo.date.indexOf('-') + 1);
          }
          if (matchInfo.time) {
            time = matchInfo.time.substring(0, matchInfo.time.lastIndexOf(':'));
          }
          result = (
            <em>
              <em className="blue">
                {date} {matchInfo.time}
              </em>
            </em>
          );
          if (!matchInfo.date || !matchInfo.time) {
            result = (
              <em className="grey">{OrderHelper.sts[matchInfo.matchStatus]}</em>
            );
          }

          if (orderMatchZQBO.halfScore) {
            // 足球
            return (result = (
              <div className="half-full">
                <span>
                  半:<i>{orderMatchZQBO.halfScore}</i>
                </span>{' '}
                <span className="grey">全:{orderMatchZQBO.fullScore}</span>
              </div>
            ));
          }
        }
        break;
      case 13: // 延期
      case 4:
        result = (
          <em>
            <em className="grey">延期</em> {/* <em className="blue">直播</em> */}
          </em>
        );

        break;
      case 5: // 取消
      case 14:
        result = (
          <em>
            <em className="grey">取消</em> {/* <em className="blue">直播</em> */}
          </em>
        );

        break;
      case 2: // 比赛中
      case 12:
        result = (
          <em>
            <em className="grey">比赛中</em> {/* <em className="blue">直播</em> */}
          </em>
        );

        break;
      case 3:
      case 15: // 已开奖
      case 16:
        if (orderMatchZQBO.halfScore) {
          // 足球
          return (result = (
            <div className="half-full">
              <span>
                半:<i>{orderMatchZQBO.halfScore}</i>
              </span>{' '}
              <span className="grey">全:{orderMatchZQBO.fullScore}</span>
            </div>
          ));
        }

        if (orderMatchLQBO.fullScore) {
          // 篮球
          return (result = (
            <span>
              {'比分: '} {orderMatchLQBO.fullScore}
            </span>
          ));
        }

        break;
      default:
        result = (
          <span className="grey">{OrderHelper.sts[matchInfo.matchStatus]}</span>
        );
        break;
    }
    return result;
  },

  getContentType: function(num) {
    const contentTypeArr = ['', '单式', '复式', '胆拖', '', '', '和值'];
    return contentTypeArr[num];
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
  // 把字符串 sp = >  按顺序 返回 字符串
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
  // 竞技彩玩法
  getMatchKind(code) {
    let result = '';
    if (code.indexOf('S') >= 0) {
      result = '胜平负';
    } else if (code.indexOf('R') >= 0) {
      result = '让球胜平负';
    } else if (code.indexOf('Q') >= 0) {
      result = '全场比分';
    } else if (code.indexOf('B') >= 0) {
      result = '半全场';
    } else if (code.indexOf('Z') >= 0) {
      result = '总进球数';
    } else {
      result = '';
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
    return '';
  }
};
