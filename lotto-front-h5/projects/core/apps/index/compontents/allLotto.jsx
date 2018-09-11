// operLottList

import React, { Component } from 'react';

import '../css/all-lotto.scss';

export default class AllLotto extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  go(url) {
    let next = encodeURIComponent('/index.html');
    window.location = url + '?next=' + next;
  }
  render() {
    let operLottList = this.props.operLottList || [];
    let operIcon = {
      0: '', // 无
      1: require('../images/icon_04.png'), // 新
      2: require('../images/icon_02.png'), // 热
      3: require('../images/icon_01.png'), // 加奖
      4: '' // 其他
    };
    if (operLottList.length < 1) {
      return <div />;
    }
    // console.log(operLottList)
    return (
      <div className="lotto-wrap">
        <p className="all">全部彩种</p>
        {/* <div className="lotto-block">
                    <div className="lotto-icon">
                        <img src={require('../images/x.png')} alt=""/>
                    </div>
                    <p>竞彩足球</p>
                    <p>豪门盛宴</p>
                </div> */}
        {operLottList ? (
          operLottList.map((e, i) => {
            return (
              <div
                className="lotto-block"
                key={ i }
                onClick={ event => this.go(e.typeUrl) }
              >
                <div className="lotto-icon-box">
                  <img className="lotto-icon" src={ operIcon[e.icon] }
                    alt="" />
                  <img className="lotto-img" src={ e.lotteryLogoUrl }
                    alt="" />
                </div>
                <p className="lotto-name">{e.typeAlias}</p>
                <p className="lotto-info">{e.typeKey}</p>
              </div>
            );
          })
        ) : (
          <div />
        )}
      </div>
    );
  }
}
