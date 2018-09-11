/**
 * Created by harry on 25/7/2017.
 */
export const LZC_SET_CURRENT_ISSUES = 'LZC_SET_CURRENT_ISSUES';
export const LZC_SET_SERVER_TIME = 'LZC_SET_SERVER_TIME';
export const LZC_SET_MATCH_IDS = 'LZC_SET_MATCH_IDS';

export function changeIssue(lotteryCode, data) {
  return {
    type: 'LZC_SET_CURRENT_ISSUES',
    lotteryCode,
    data
  };
}

export function setServerTime(time) {
  return {
    time,
    type: LZC_SET_SERVER_TIME
  };
}

export function setMatchIds(ids) {
  return {
    ids,
    type: LZC_SET_MATCH_IDS
  };
}
