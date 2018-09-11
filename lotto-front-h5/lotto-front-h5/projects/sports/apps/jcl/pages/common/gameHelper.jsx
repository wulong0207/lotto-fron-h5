import React from 'react';
import BoxView from '../../components/box-view.jsx';
import { getGameAreaTitle } from '../../utils.js';
import Empty from '../../components/empty.jsx';

// 检查是否处在销售阶段, true有销售的玩法，false无
export function checkSell(mode, sv) {
  switch (mode) {
    // 混合过关
    case 'mix':
      return !(
        sv.statusWf === 4 &&
        sv.statusLetWf === 4 &&
        sv.statusBigSmall === 4 &&
        sv.statusScoreWf === 4
      );
    // 胜负
    case 'sf':
      return sv.statusWf !== 4;
    // 胜分差
    case 'sfc':
      return sv.statusScoreWf !== 4;
    // 大小分
    case 'dxf':
      return sv.statusBigSmall !== 4;
    // 让分胜负
    case 'rfsf':
      return sv.statusLetWf !== 4;
    // 单关
    case 'single': {
      return !(
        (sv.statusWf === 2 || sv.statusWf === 4) &&
        (sv.statusLetWf === 2 || sv.statusLetWf === 4) &&
        (sv.statusBigSmall === 2 || sv.statusBigSmall === 4) &&
        (sv.statusScoreWf === 2 || sv.statusScoreWf === 4)
      );
    }
  }
}

// 生成赛事，并生成包含赛事的容器
export function renderBoxView(mode, data, renderGame) {
  let hasData = false;

  if (data) {
    let result = data.map((val, index) => {
      let subHasData = false;
      let length = 0;
      let subResult = val.matchs.map((sv, si) => {
        if (checkSell(mode, sv)) {
          length++;
          hasData = true;
          subHasData = true;
          return renderGame(sv, si);
        }
      });
      let title = getGameAreaTitle(val.date, length);

      if (subHasData) {
        return (
          <BoxView title={ title } key={ index }>
            {subResult}
          </BoxView>
        );
      }
    });

    return hasData ? result : hasData;
  } else {
    return hasData;
  }
}

// 生成比赛场次
export function renderGames(mode, data, renderGame) {
  let games = renderBoxView(mode, data, renderGame);
  return games || <Empty />;
}
