/**
 * 抄单动态列表的与我相关组件
 */
import React, { Component } from 'react';
import '../css/relevant.scss';
import { Link } from 'react-router';

export default class Relevant extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onAttentionClick() {}
  getListStatus(status) {
    switch (status) {
      case 1:
        return (
          <button className="btn" onClick={ this.onAttentionClick.bind(this) }>
            立即抄单
          </button>
        );
      case 2:
        return <div className="openIssue weizhong" />;
      case 3:
        return <div className="openIssue" />;
      case 4:
        return '';
    }
  }

  gettranscribe() {
    let listData = this.props.listData || [];
    return listData.map((row, index) => {
      return (
        <Link to={ `/receipts/${row.id}` } key={ row.id }
          className="relevantMes">
          <div className="relevantBox">
            <div className="box">
              <img src={ row.headUrl? row.headUrl : require("../../../img/default.png") } />
              <div className="contentBox">
                <div className="nameBox">
                  <span className="name">{row.nickName}</span>
                  {row.level ? <span className="icon-zhuan">专</span> : ''}
                  {row.isRecommend ? <span className="icon-jian">荐</span> : ''}
                </div>
                <div className="message">
                  <span className="predict">
                    预计回报<em>{row.maxRoi ? row.maxRoi + '%' : 0}</em>
                  </span>
                  <i className="icon_dot" />
                  <span className="transcribe_num">
                    抄单数{row.followNumStr ? row.followNumStr : 0}
                  </span>
                  <i className="icon_dot" />
                  <span className="money">
                    金额￥{row.orderAmount ? row.orderAmount : 0}
                  </span>
                </div>
                <div className="item-data">
                  <span className="probability">
                    {row.recentRecord ? row.recentRecord : ''}
                  </span>
                  <span className="continuous">
                    {row.continueHit ? row.continueHit : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="buttonBox">
            <span className="icon_clock" />
            <span className="time">{row.endTime}</span>
            {this.getListStatus(row.winStatus)}
          </div>
        </Link>
      );
    });
  }

  render() {
    return <div className="list">{this.gettranscribe()}</div>;
  }
}
