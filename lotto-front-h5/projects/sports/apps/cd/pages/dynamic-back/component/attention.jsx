/**
 * 抄单动态列表的我的关注组件
 */
import React, { Component } from 'react';
import http from '@/utils/request';
import Message from '@/services/message';
import '../css/attention.scss';
import { Link } from 'react-router';

export default class Attention extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: []
    };
  }

  componentWillMount() {
    let listData = this.props.listData || [];
    this.setState({ listData });
  }

  

  gettranscribe() {
    return this.state.listData.map((row, index) => {
      return (
        <Link to={ `/receipts/${row.id}` } key={ row.id }
          className="listMes">
          <div className="listBox">
            <div className="box">
              <img src={ row.headUrl? row.headUrl : require("../../../img/default.png") } />
              <div className="attentionBtn">
                <span className="icon_gou" />
                <span
                  className="txt"
                  onClick={ this.attentionClick.bind(this, index) }
                >
                  关注
                </span>
              </div>
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
                    抄单数{row.focusNumStr ? row.focusNumStr : 0}
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
        </Link>
      );
    });
  }

  render() {
    return <div className="list">{this.gettranscribe()}</div>;
  }
}
