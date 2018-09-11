import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import { formatMoney, moneyToCN, setDate } from '@/utils/utils';
import deepAssign from '@/utils/deep-assign';
import { Number } from '@/utils/number';
import cx from 'classnames';
import session from '@/services/session.js';

import '../css/lotto-banner.scss';

export default class LottoBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BallArr: [],
      dotIndex: 0
    };
  }
  // 彩球
  BallArr(id, render) {
    let BallArr = [];
    let arr = [];
    if (id == 215) {
      BallArr = [
        Number.attachZero(Number.getSrand(1, 11, 8)),
        Number.attachZero(Number.getSrand(1, 1, 1))
      ];
    } else {
      if (id == 100) {
        // 双色球
        arr = [33, 6, 16, 1];
      }
      if (id == 102) {
        // 大乐透
        arr = [35, 5, 12, 2];
      }
      BallArr = [
        Number.attachZero(Number.getSrand(1, arr[0], arr[1])),
        Number.attachZero(Number.getSrand(1, arr[2], arr[3]))
      ];
    }
    if (BallArr.length <= 0) {
      return;
    }
    if (render) {
      this.setState({ id: BallArr });
    } else {
      return { [id]: BallArr };
    }
  }
  postLotto(url, BallArr, typeId) {
    // console.log(url);
    //  存放ballArr seesion ballOrder:{red:'',blue:''}
    if (typeId == '215') {
      session.set('sd11x5', {
        balls: BallArr[0].toString(),
        lotteryChildCode: 21508
      });
    } else {
      session.set('ballOrder', {
        red: BallArr[0].toString(),
        blue: BallArr[1].toString()
      });
    }
    window.location = url;
  }
  // 渲染 banner
  renderBanner() {
    let _ = this;
    let dot = this.state.dotIndex;
    let operFastList = this.props.operFastList || [];
    let nowDate = new Date().getDate(); // 当天日期
    let newData = [];
    let BallArr = [];
    operFastList.map((row, index) => {
      if (row.typeId == 100 || row.typeId == 102 || row.typeId == 215) {
        newData.push(row);
      }
      BallArr = deepAssign({}, BallArr, this.BallArr(row.typeId, false));
    });
    // console.log(newData);
    // console.log(dot);
    return (
      <div className="lotto-banner">
        {newData.length > 0 ? (
          <ReactSwipe
            className="carousel"
            swipeOptions={ {
              continuous: false,
              disableScroll: false,
              callback: function(index) {
                _.setState({ dotIndex: index });
              }
            } }
          >
            {newData.map((row, index) => {
              // console.log(index);
              return (
                <div className="lotto-cont" key={ index }>
                  <div className="title">
                    <span className="lotto-name">{row.lotteryName}</span>
                    <span className="session">
                      第<i>{row.issueCode}</i>期
                    </span>
                    <span className="session">
                      {row.typeId == '215' ? '' : '奖池滚存'}
                      <i>
                        {row.jackpotAmount
                          ? moneyToCN(formatMoney(row.jackpotAmount))
                          : ''}
                      </i>
                    </span>
                  </div>
                  <div className="ball">
                    <div className="numble-wrap" key={ index }>
                      <div className="lott-random">
                        {/* <span className="lott-children"></span> */}
                        <span className="fast-ball-red">
                          {BallArr[row.typeId][0].map((rowred, indexred) => {
                            return <span key={ indexred }>{rowred}</span>;
                          })}
                        </span>
                        <span className="fast-ball-blue">
                          {BallArr[row.typeId][1].map((rowblue, indexblue) => {
                            return <span key={ indexblue }>{rowblue}</span>;
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="last">
                    <span className="time">
                      投注截止:{' '}
                      {new Date(
                        setDate.convertTime(row.saleEndTime)
                      ).getDate() == nowDate
                        ? '今天'
                        : setDate.formatDate(row.saleEndTime, 'MM-dd') + ' '}
                      {setDate.formatDate(row.saleEndTime, 'HH:mm')}
                    </span>
                    <span
                      className="post"
                      onClick={ event =>
                        this.postLotto(
                          row.fastUrl,
                          BallArr[row.typeId],
                          row.typeId
                        )
                      }
                    >
                      立即投注
                    </span>
                    <span
                      className="change"
                      onClick={ event => this.BallArr(row.typeId, true) }
                    >
                      换一注
                    </span>
                  </div>
                </div>
              );
            })}
          </ReactSwipe>
        ) : (
          ''
        )}
        <div className="dotted">
          {newData.map((e, i) => {
            return <span className={ cx('dot', dot == i ? 'on' : '') } key={ i } />;
          })}
        </div>
      </div>
    );
  }

  render() {
    // if(!this.state.operLottList) return <div></div>;
    return <div>{this.renderBanner()}</div>;
  }
}
