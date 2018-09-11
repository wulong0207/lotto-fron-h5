import http from '@/utils/request';

export const SP_HISTORY_MODE = 'SP_HISTORY_MODE'; // sp 历史信息显示切换
export const SP_HISTORY_DATA = 'SP_HISTORY_DATA'; // sp 历史信息数据

// 获取sp值历史值
// betKind: sf胜负 rfsf让分胜负  dxf大小分
export function fetchSP(matchId, betKind) {
  return dispatch => {
    let url = '';
    switch (betKind) {
      case 'sf':
        url = `/jc/basketball/wfSp/history/${matchId}/1`;
        break;
      case 'rfsf':
        url = `/jc/basketball/wfSp/history/${matchId}/2`;
        break;
      case 'dxf':
        url = `/jc/basketball/bsSp/history/${matchId}`;
        break;
    }

    http
      .get(url, {})
      .then(res => {
        const data = res.data;
        dispatch({
          type: SP_HISTORY_DATA,
          data
        });
      })
      .catch(error => {
        dispatch({
          type: SP_HISTORY_DATA
        });
      });
  };
}

// sp 历史信息显示切换
export function toggle(selectData, betKind) {
  return {
    type: SP_HISTORY_MODE,
    selectData, // 标题等数据
    betKind // 投注类型 0胜负,1让分胜负，2大小分
  };
}

// sp 历史信息数据
export function setData(data) {
  return {
    type: SP_HISTORY_DATA,
    data // 数据
  };
}
