import React, { Component } from 'react';
import '../css/bet_info_list.scss';
import Pic from '../img/touxiang.png';

export default class BetInfoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompetitionSelectIndex: 0,
      CompetitionSelect_isShow: false
    };
  }

  componentwillUmount() {}

  CompetitionSelect_drop(index) {
    this.setState({ CompetitionSelectIndex: index });
  }
  CompetitionSelect_isShow(index) {
    let ele = this.refs['ul' + index];
    ele.style.display = ele.style.display === 'block' ? 'none' : 'block';
  }
  CompetitionSelect(e) {}

  getList() {
    let listData = this.props.listData;
    let dropList = this.props.dropList;

    if (props.matchs.length < 2) {
      throw new Error('至少需要两场比赛');
    }

    return listData.map((row, index) => {
      return (
        <div className="item" key={ index }>
          <div className="competition">
            <div className="adImg">
              <img src={ row.adImg ? row.adImg : require('../img/team.png') } />
            </div>
            <div
              className="dropList"
              onClick={ this.CompetitionSelect_isShow.bind(this, index) }
            >
              <div className="content">请选择</div>
              <ul
                ref={ 'ul' + index }
                className="list"
                style={ { display: 'none' } }
              >
                {dropList.map((c, ind) => {
                  return (
                    <li
                      key={ ind }
                      className="competition"
                      onClick={ this.CompetitionSelect_drop.bind(this, ind) }
                    >
                      <div className="competitionBox">
                        <span className="homeShortName">{c.homeShortName}</span>
                        <span className="txt"> VS </span>
                        <span className="visitiShortName">
                          {c.visitiShortName}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="adImg">
              <img src={ row.adImg2 } />
            </div>
          </div>
          <div className="odds">
            <div
              className="victory odd_count"
              onClick={ this.CompetitionSelect.bind(this) }
            >
              <p className="Name">{row.homeShortName}</p>
              <p className="probability">胜 {row.newestSpWin}</p>
            </div>
            <div
              className="planishing odd_count"
              onClick={ this.CompetitionSelect.bind(this) }
            >
              <p className="Name">VS</p>
              <p className="probability">平 {row.newestSpDraw}</p>
            </div>
            <div
              className="lose odd_count"
              onClick={ this.CompetitionSelect.bind(this) }
            >
              <p className="Name">{row.visitiShortName}</p>
              <p className="probability">负 {row.newestSpFail}</p>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div className="betInfoList">{this.getList()}</div>;
  }
}

BetInfoList.defaultProps = {
  dropList: [
    {
      homeShortName: '巴西',
      visitiShortName: '荷兰'
    },
    {
      homeShortName: '法国',
      visitiShortName: '德国'
    },
    {
      homeShortName: '巴西',
      visitiShortName: '荷兰'
    },
    {
      homeShortName: '法国',
      visitiShortName: '德国'
    }
  ],
  listData: [
    {
      adImg: Pic,
      adImg2: Pic,
      newestSpWin: 1.72,
      newestSpDraw: 8.45,
      newestSpFail: 3.56,
      homeShortName: '巴西',
      visitiShortName: '荷兰'
    },
    {
      adImg: Pic,
      adImg2: Pic,
      newestSpWin: 0.72,
      newestSpDraw: 5.45,
      newestSpFail: 2.56,
      homeShortName: '法国',
      visitiShortName: '德国'
    },
    {
      adImg: Pic,
      adImg2: Pic,
      newestSpWin: 1.72,
      newestSpDraw: 8.45,
      newestSpFail: 3.56,
      homeShortName: '巴西',
      visitiShortName: '荷兰'
    },
    {
      adImg: Pic,
      adImg2: Pic,
      newestSpWin: 0.72,
      newestSpDraw: 5.45,
      newestSpFail: 2.56,
      homeShortName: '法国',
      visitiShortName: '德国'
    }
  ]
};
