import React, { Component } from 'react';
import Banner from './components/banner.jsx';
import http from '@/utils/request';
import Intro from './components/intro.jsx'; // 两个入口
import Specialist from './components/specialist.jsx'; // 专家推荐
import api from '../../services/api';
import list from '@/component/hoc/list';
import page from '@/component/hoc/page';
import { Link } from 'react-router';
import { Tabs, TabPanel } from '@/component/tabs';
import './css/index.scss';

function DetailList({ data, serviceTime }) {
  // data = [
  //   {
  //     id: 740,
  //     orderCode: 'D17122811302317300085',
  //     orderAmount: 20000000,
  //     maxRoi: '10000000000000',
  //     followNumStr: '100000000000',
  //     isTop: 0,
  //     isRecommend: 0,
  //     recentRecord: '近7场中0场',
  //     hitRate: '14%',
  //     level: 1,
  //     endTime: '12-28 23:50截止',
  //     continueHitDb: 0,
  //     continueHit: '',
  //     orderVisibleType: 2,
  //     createTimeStr: '5小时前',
  //     passway: '',
  //     nickName: '志远',
  //     winStatus: 1,
  //     userIssueId: 70,
  //     endLocalTime: 1514476200000
  //   }
  // ];
  return (
    <div className="transcribeBox_index">
      {data.map((row, index) => {
        let followNumStr = parseInt(row.followNumStr);

        return (
          <div href="#" key={ index }
            className="transcribeMes">
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
              <span className="time">{row.endTime}</span>

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
let BasketballList;

function ListLink({ index }) {
  return (
    <Link to={ `/receipts/?${index}` }>
      <span className="arrow" />
    </Link>
  );
}

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      specialistData: [],
      pageIndex: 0,
      bannerList: [],
      serviceTime: new Date().getTime()
    };
    FootballList = list(this.fetch(300).bind(this), 1, 20, true)(DetailList);
    BasketballList = list(this.fetch(301).bind(this), 1, 20, true)(DetailList);
  }

  componentDidMount() {
    this.getSpecialistData(0, 300).then(res => {
      this.setState({ specialistData: res.data });
    });

    this.getBannerList();
  }

  fetch(lotteryCode) {
    return page => {
      return new Promise((resolve, reject) => {
        api
          .getRecommend(null, lotteryCode, 1, 20, page)
          .then(res => {
            this.setState({ serviceTime: res.serviceTime });
            resolve(res.data);
          })
          .catch(reject);
      });
    };
  }

  getBannerList() {
    http
      .get(' /operate/ad', { params: { menu: 15 } })
      .then(res => {
        this.setState({ bannerList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  tabClick(index) {
    this.setState({ current: index });
  }

  getSpecialistData() {
    let data = {
      pageIndex: 0,
      pageSize: 20,
      queryType: 3
    };
    let url = '/order-copy/listUserIssueInfo';

    return new Promise((resolve, reject) => {
      http
        .post(url, data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  render() {
    const tabs = [{ label: '实单足球' }, { label: '实单篮球' }];
    return (
      <div>
        <div className="yc-cd">
          <section className="operation">
            <Banner bannerList={ this.state.bannerList } />

            <Intro />
          </section>

          {/* 专家推荐 */}
          <Specialist data={ this.state.specialistData } />

          {/* tab */}
          <Tabs className="tabs_index" tabs={ tabs }
            link={ ListLink }>
            <TabPanel>
              <FootballList serviceTime={ this.state.serviceTime } />
            </TabPanel>
            <TabPanel>
              <BasketballList serviceTime={ this.state.serviceTime } />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default page(
  '',
  true,
  () => {
    window.history.go(-1);
  },
  false,
  'header header_index'
)(Index);
