import React, { Component } from 'react';
import Message from '@/services/message';
import '../css/transcribe.scss';
import { Link } from 'react-router';

export default class Transcribe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onTranscribeClick(index) {
    Message.toast(
      this.props.transcribeData[index].nickName + ' 抄单成功',
      2000
    );
  }

  gettranscribe() {
    let transcribe = this.props.transcribeData || [];

    transcribe.map((row, index) => {
      if (row.isTop) {
        transcribe.unshift(row);
      }
    });

    return transcribe.map((row, index) => {
      return (
        <div href="#" key={ index }
          className="transcribeMes">
          <div className="transcribe_index">
            <div className="box">
              <Link to={ `/experts/${row.id}` }>
                <img
                  src={
                    row.headUrl
                      ? row.headUrl
                      : require('../../../img/default.png')
                  }
                />
              </Link>

              <div className="contentBox">
                <div className="nameBox">
                  <span className="name">{row.nickName}</span>
                  {row.level ? <span className="icon-zhuan">专</span> : ''}
                  {row.isRecommend ? <span className="icon-jian">荐</span> : ''}
                </div>
                <div className="message">
                  <span className="predict">
                    预计回报<em>{row.maxRoi ? row.maxRoi : 0}</em>
                  </span>
                  <i className="icon_dot" />
                  <span className="transcribe_num">
                    抄单数{row.followNumStr ? row.followNumStr : '0'}
                  </span>
                  <i className="icon_dot" />
                  <span className="money">
                    金额￥{row.orderAmount ? row.orderAmount : 0}
                  </span>
                </div>
                <div className="item-data">
                  <span className="probability">
                    {row.hitRate ? row.hitRate : ''}
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
            <Link to={ `/receipt/${row.id}` }>
              <button className="btn">立即抄单</button>
            </Link>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div className="transcribeBox_index">{this.gettranscribe()}</div>;
  }
}
