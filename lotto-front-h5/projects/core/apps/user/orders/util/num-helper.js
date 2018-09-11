import React, { Component } from 'react';

export default {
  // 和值玩法
  handleSumRed: function(plan, drawSum) {
    let planArr = plan.split(',') || [];
    return planArr.map((m, i) => {
      if (drawSum.toString() === m) {
        return (
          <i key={ i } className="red">
            {m}
          </i>
        );
      } else {
        return (
          <i key={ i } className="grey">
            {m}
          </i>
        );
      }
    });
  },

  // 直选 玩法 个十百 投注段必须区分
  handleZhiXuan: function(planArr, drawArr, type) {
    console.log(planArr, 'planArr', drawArr, 'drawArr', type);
    return planArr.map((m, k) => {
      let mArr = m.split(',') || [];
      let className = 'grey';
      return mArr.map((val, i) => {
        if (drawArr[k].indexOf(val) > -1) {
          className = '';
        }
        return (
          <i key={ i } className={ className }>
            {val}
            {// 添加 |
              type && k != planArr.length - 1 ? (
                i == mArr.length - 1 ? (
                  <b className="grey"> {'|'}</b>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
          </i>
        );
      });
    });
  },

  // 检查号码相同标红
  handleCodeRed: function(planContentArr, drawContentArr, type) {
    // planContentArr = [] 投注内容  drawContentArr = [] 开奖号码
    let className = '';
    return planContentArr.map((m, i) => {
      if (drawContentArr.indexOf(m) > -1) {
        className = 'red';
      } else {
        className = 'grey';
      }
      return (
        <i key={ i } className={ className }>
          {m}
          {// 添加 |
            i == planContentArr.length - 1 && type ? (
              <b className="grey"> {'|'}</b>
            ) : (
              ''
            )}
        </i>
      );
    });
  },

  // 处理胆拖 标红
  handleDanTuo: function(planArr, drawArr) {
    return (
      <div>
        <span>({this.handleCodeRed(planArr[0].split(','), drawArr)})</span>
        <span>{this.handleCodeRed(planArr[1].split(','), drawArr)}</span>
      </div>
    );
  }
};
