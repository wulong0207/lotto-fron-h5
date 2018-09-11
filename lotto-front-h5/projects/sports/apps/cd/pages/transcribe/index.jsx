import React, { Component } from 'react';
import Screen from './components/screen.jsx';
import api from '../../services/api';
import list from '@/component/hoc/list';
import page from '@/component/hoc/page';
import { Link } from 'react-router';
import './css/index.scss';

function DetailList({ data, serviceTime }) {
  return (
    <div className="transcribeBox">
      {data.map((row, index) => {
        let followNumStr = parseInt(row.followNumStr);

        return (
          <div key={ index } className="transcribeMes">
            <div className="transcribe_index">
              <div className="box">
                <Link to={ `/experts/${row.userIssueId}` }>
                  <img
                    src={
                      row.headUrl
                        ? row.headUrl
                        : require('../../img/default.png')
                    }
                  />
                </Link>
                <Link to={ `/receipts/${row.id}` }>
                  <div className="contentBox">
                    <div className="nameBox">
                      <span className="name">{row.nickName}</span>
                      {row.level ? <span className="icon-zhuan">专</span> : ''}
                      {row.isRecommend ? (
                        <span className="icon-jian">荐</span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="message">
                      预计回报<em>{row.maxRoi ? row.maxRoi : 0}倍</em>
                      <i className="icon_dot" />
                      {followNumStr ? '抄单数' + followNumStr : ''}
                      {followNumStr ? <i className="icon_dot" /> : ''}
                      金额￥{row.orderAmount ? row.orderAmount : 0}
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
                </Link>
              </div>
            </div>
            <div className="buttonBox">
              <span className="icon_clock" />
              <span className="time">{row.endTime ? row.endTime : ''}</span>
              {serviceTime < row.endLocalTime ? (
                <Link to={ `/receipts/${row.id}` }>
                  <button className="btn">立即抄单</button>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

let FootballList;

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcribeData: [],
      tabListIndex: [1, 0, 0],
      requestObj: {
        level: '',
        lottoryCode: '',
        sortCondition: 1
      },
      serviceTime: new Date().getTime()
    };

    FootballList = list(this.fetch.bind(this), 1, 20, true)(DetailList);
  }

  componentDidMount() {}
  componentWillUpdate(nextProps, nextState) {}

  fetch(page) {
    let tabListIndex = this.state.tabListIndex;
    let level = tabListIndex[1] > 0 ? (tabListIndex[1] === 1 ? 1 : 0) : '';
    let lotteryCode =
      tabListIndex[0] > 0 ? (tabListIndex[0] === 1 ? 300 : 301) : '';
    let sortCondition =
      tabListIndex[2] > 0 ? (tabListIndex[2] === 1 ? 2 : 3) : 1;
    return new Promise((resolve, reject) => {
      api
        .getTranscribe(level, lotteryCode, 2, 20, page, sortCondition)
        .then(res => {
          resolve(res.data);
          this.setSate({ serviceTime: res.serviceTime });
        })
        .catch(reject);
    });
  }

  onTabChange(tabListIndex) {
    this.state.tabListIndex = tabListIndex;
    this.setState({ tabListIndex });
    FootballList = list(this.fetch.bind(this), 1, 20, true)(DetailList);
  }

  onPageIndexChange(index) {}

  render() {
    return (
      <div>
        <FootballList serviceTime={ this.state.serviceTime } />
        <Screen
          ref={ screen => (this.screen = screen) }
          onTabChange={ this.onTabChange.bind(this) }
        />
      </div>
    );
  }
}

export default page('实单抄单')(Index);
