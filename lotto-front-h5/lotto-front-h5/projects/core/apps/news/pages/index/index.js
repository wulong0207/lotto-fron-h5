import React, { Component } from 'react';

import Header from '@/component/header';
import Tab from '../../components/tab';
import Swiper from '../../components/swiper';
import List from '../../components/list';
import Sd11x5 from '../../components/sd11x5';
import NumLott from '../../components/num-lott';
// import Jjc from '../../component/jjc.js';

import { Message } from '@/component/message';
import UserIcon from '../../components/user-icon'; // 用户头像
import http from '@/utils/request';

import './index.scss';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: [], // 头部类型
      article: [], // 文章列表
      currentIndex: 0, // tab 0
      bannerList: [], // 广告轮播
      articleList: [], // 文章列表
      fastBet: [], // 快投信息
      serviceTime: '' // 现在时间
    };
    this.page = 1;
  }
  componentDidMount() {
    this.getRefresh();
  }
  getRefresh() {
    this.getNewType()
      .then(this.getOperate.bind(this))
      .then(this.getArticletop.bind(this))
      .then(this.getFastBet.bind(this))
      .then(this.getServiceTime.bind(this))
      .catch(err => console.log(err));
  }
  getServiceTime() {
    http
      .get('/home/servicetime', {})
      .then(res => {
        this.setState({ serviceTime: res.data || [] });
        console.log(res.data, 'res.data');
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }
  getFastBet() {
    http
      .get('/operate/fast', {
        params: {
          position: 2
        }
      })
      .then(res => {
        this.setState({ fastBet: res.data || [] });
        console.log(res.data, 'res.data');
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }
  getArticletop() {
    const { currentIndex, type } = this.state;
    http
      .get('/news/articletop', {
        params: {
          endRow: 10,
          startRow: 1,
          isComple: 0,
          typeCode: type[currentIndex].typeCode
        }
      })
      .then(res => {
        this.setState({ articleList: res.data || [] });
        console.log(res.data, 'res.data');
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }
  getOperate() {
    // 广告轮播
    const { currentIndex } = this.state;
    http
      .get('/operate/ad', {
        params: {
          menu: 11,
          typeCode: this.state.type[currentIndex].typeCode
        }
      })
      .then(res => {
        let { bannerList } = this.state;
        bannerList = res.data;
        this.setState({ bannerList });
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }

  getNewType() {
    // 资讯头部
    return new Promise((resolve, reject) => {
      http
        .get('/news/newtype', {
          params: { platform: 2 }
        })
        .then(res => {
          let { type } = this.state;
          type = res.data[0] || {};
          this.setState({ type: type.childNode });
          resolve();
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  onChangeTab(index) {
    this.state.currentIndex = index;
    this.setState({ currentIndex: index });
    this.getRefresh();
  }
  loadMore(e) {
    this.page++;
    const { type, currentIndex } = this.state;
    http
      .get('/news/articletop', {
        params: {
          typeCode: +type[currentIndex].typeCode,
          startRow: (this.page - 1) * 10,
          platform: 2,
          isComple: 0,
          endRow: 10 * this.page,
          compleCode: 2
        }
      })
      .then(res => {
        let { articleList } = this.state;
        articleList = articleList.concat(res.data);
        this.setState({
          articleList
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    const {
      type,
      currentIndex,
      bannerList,
      articleList,
      fastBet,
      serviceTime
    } = this.state;
    let bet11x5;
    let ssq;
    let dlt;
    if (fastBet.length > 1) {
      bet11x5 = fastBet.filter(m => m.typeId == 215)[0] || {};
      ssq = fastBet.filter(m => m.typeId == 100)[0] || {};
      dlt = fastBet.filter(m => m.typeId == 102)[0] || {};
      // const jjc = fastBet.filter(m => m.typeId == 300)[0] || {};
    }
    let typeCodeId;
    if (type.length > 0) {
      typeCodeId = type[currentIndex].typeCode || '';
    } else {
      return <div />;
    }
    return (
      <div className="news">
        <Header title="2N彩票资讯">
          {/* 用户头像 */}
          <UserIcon />
        </Header>

        <Tab
          color="#fff"
          ref="tab"
          tabs={ type }
          index={ currentIndex }
          showSwitch={ true }
          onChangeTab={ this.onChangeTab.bind(this) }
        />
        <div className="news-content">
          <Swiper bannerList={ bannerList } />
          <List
            articleList={ articleList.slice(0, 5) }
            loadMore={ this.loadMore.bind(this) }
          />
          {typeCodeId == 2.3 ? (
            <div>
              <NumLott data={ dlt } serviceTime={ serviceTime } />
              <NumLott data={ ssq } serviceTime={ serviceTime } />
              <Sd11x5 bet11x5={ bet11x5 } serviceTime={ serviceTime } />
            </div>
          ) : (
            ''
          )}
          <List
            articleList={ articleList.slice(5) }
            loadMore={ this.loadMore.bind(this) }
          />
        </div>
        <div className="load-more" onClick={ this.loadMore.bind(this) }>
          <img src={ require('./img/bt_refresh@2x.png') } />
          <span>点击加载更多</span>
        </div>
      </div>
    );
  }
}

export default Index;
