/**
 * Created by manaster
 * date 2017-03-15
 * desc:个人中心模块--我的红包子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import http from '@/utils/request';
import Message from '@/services/message';
import session from '@/services/session';
import RedPacketItem from './red-packet-item';
import NoMsg from '@/component/no-msg';
// import '../../../scss/user/component/red-packet.scss';
import Header from '@/component/header';

import '../css/red-packet.scss';

export default class RedPacket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      activeNav: 1,
      rpUseShow: false, // 红包使用tab
      rpTypeShow: false, // 红包类型tab
      rpSortShow: false, // 红包排序tab
      myPacketCount: this.getInitialCount(),
      packets: [], // 红包数据
      // packets1: [], //红包种类等数据
      redTypes: [], // 红包类型
      // noUseShow:true ,//显示即将 最优惠 新到账
      rpUseActiveLi: 1, // 红包状态默认未使用
      rpTypeActiveLi: 1, // 红包类型默认全部红包
      rpSortActiveLi: 1, // 红包排序默认即将过期
      redType: 0, // 类别 全部
      redClass: 3, // 最优惠
      redStatus: 3 // 使用状态
    };
    // this.myselect = 3;
    this.rpUseArr = ['未使用', '已使用', '已过期', '待派发', '待激活'];
    this.rpTypeArr = [
      '全部红包',
      '彩金红包',
      '满减红包',
      '充值红包',
      '加奖红包',
      '随机红包'
    ];
    this.rpSortArr = ['即将过期', '最优惠', '新到账'];
    // 默认首次加载
    this.pageIndex = 0;
    this.pageSize = 9;
  }
  componentDidMount() {
    let _this = this;
    this.reqRedMenu(); // 使用情况
    // 默认情况是 未使用 全部 即将过期
    this.reqRedType(3); // 未使用
    this.reqRedData();
  }
  // 获取默认数据
  getInitialCount() {
    return {
      use: {
        unuse: 0, // 未使用
        used: 0, // 已使用
        outtime: 0, // 过期
        pending: 0, // 待发
        active: 0 // 激活
      },
      all: {
        all: 0,
        cj: 0, // 彩金
        mj: 0, // 满减
        cz: 0, // 充值
        jj: 0, // 加奖
        dlb: 0, // 大礼包
        random: 0 // 随机
      }
    };
  }
  // 根据条件获取红包
  getRedPackets() {
    let { packets } = this.state;
    let curPackets = packets;
    let result = [];
    for (var i = 0; i < curPackets.length; i++) {
      let item = curPackets[i];
      result.push(<RedPacketItem key={ i } item={ item } />);
    }
    return result.length ? result : <NoMsg msg={ '没有红包！' } />;
  }
  // 生成各项菜单的计量统计
  generateMenuCout() {
    let data = this.getInitialCount();
    data.all.all = this.state.packets.length;
    for (var i = 0; i < this.state.packets.length; i++) {
      let item = this.state.packets[i];
      switch (item.redStatus) {
        case 2:
          data.use.pending++; // 待派发

          break;
        case 3:
          data.use.unuse++; // 可使用

          break;
        case 4:
          data.use.outtime++; // 已过期

          break;
        case 6:
          data.use.used++; // 已使用

          break;
        case 1:
          data.use.active++; // 已激活

          break;
      }
      switch (item.redType) {
        case 1:
          data.all.cz++; // 充值

          break;
        case 2:
          data.all.mj++; // 满减

          break;
        case 3:
          data.all.cj++; // 彩金

          break;
        case 4:
          data.all.jj++; // 加奖

          break;
        case 6:
          data.all.random++; // 随机

          break;
      }
    }
    return data;
  }
  // 红包状态下拉框tab操作
  reqRedMenu() {
    let self = this;
    http
      .post('/coupon/group/', {
        limitPlatform: 2,
        token: session.get('token')
      })
      .then(res => {
        let data = res.data || {};
        let redTypes = data.redTypes || [];
        let statues = data.statues || [];
        let countAll = 0;
        let myPacketCount = self.state.myPacketCount;

        for (let i = 0; i < statues.length; i++) {
          let item = statues[i];
          switch (item.type) {
            case 3:
              // 可使用 ==>未使用
              myPacketCount.use.unuse = item.total;

              break;
            case 6:
              // 已使用
              myPacketCount.use.used = item.total;

              break;
            case 4:
              // 已过期
              myPacketCount.use.outtime = item.total;

              break;
            case 2:
              // 待派发
              myPacketCount.use.pending = item.total;

              break;
            case 1:
              // 待激活
              myPacketCount.use.active = item.total;

              break;
          }
        }
        self.setState({ myPacketCount: myPacketCount });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 礼品数据接口
  reqRedData() {
    let { redClass, redStatus, redType } = this.state;
    let self = this;
    http
      .post('/coupon/list/', {
        limitPlatform: 2,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        redClass: redClass,
        redStatus: redStatus,
        redType: redType,
        token: session.get('token')
      })
      .then(res => {
        let resultData = (res.data || {}).data || [];
        let currentArray = resultData;
        if (this.pageIndex > 0) {
          currentArray = self.state.packets.concat(resultData);
        }
        currentArray.total = (res.data || {}).total;
        self.setState({ packets: currentArray });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 优惠券类型统计
  reqRedType(val) {
    http
      .post('/coupon/typeGroup', {
        redStatus: val,
        limitPlatform: 2,
        token: session.get('token')
      })
      .then(res => {
        let redTypes = res.data || [];
        // 红包类型用新的接口
        for (let i = 0; i < redTypes.length; i++) {
          let item = redTypes[i];
          switch (item.type) {
            case 0:
              redTypes.all = item.total;

              break;
            case 1:
              redTypes.cz = item.total;

              break;
            case 2:
              redTypes.mj = item.total;

              break;
            case 3:
              redTypes.cj = item.total;

              break;
            case 4:
              redTypes.jj = item.total;

              break;
            // case 5:{
            //     myPacketCount.all.dlb = item.total;
            // } break;
            case 6:
              redTypes.random = item.total;

              break;
          }
        }
        this.setState({ redTypes });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  loadMore() {
    this.pageIndex++;
    this.reqRedData();
  }
  tapTab(e) {
    let index = +e.currentTarget.getAttribute('data-index');
    if (index == 1) {
      this.setState({
        activeTab: index,
        rpUseShow: !this.state.rpUseShow,
        rpTypeShow: false
      });
    } else if (index == 2) {
      this.setState({
        activeTab: index,
        rpTypeShow: !this.state.rpTypeShow,
        rpUseShow: false
      });
    }
  }
  // 即将过期 最优惠 新到账
  tapNav(e) {
    // debugger;
    let { redStatus, redType } = this.state;
    let index = +e.currentTarget.getAttribute('data-index');
    let val = +e.currentTarget.getAttribute('data-value');
    this.setState({
      activeNav: index,
      rpTypeShow: false,
      rpUseShow: false
    });
    // this.params.pageIndex = 0;
    // this.params.redStatus = 3;
    // this.params.redType = this.state.redType;
    // this.params.redClass = val;
    this.pageIndex = 0;
    this.setState({
      redClass: val,
      redStatus: 3,
      redType
    });
    this.reqRedData();
    document.body.scrollTop = 0;
  }
  liTap(e) {
    // li 点击事件
    let { redStatus, redType } = this.state;
    let type = +e.currentTarget.getAttribute('data-type'); // 表示第几个li type
    let val = +e.currentTarget.getAttribute('data-value'); // 表示第几个li status
    let index = +e.currentTarget.getAttribute('data-index'); // 表示第几个tab
    let shouldReq = true;
    this.pageIndex = 0;
    if (index == 1) {
      this.reqRedType(val);
      this.setState({
        redStatus: val,
        rpUseActiveLi: type,
        rpUseShow: false
      });
      this.state.redStatus = val;
      this.state.redType = redType;
      // this.params.pageIndex = 0;
      // this.params.redStatus = val;
      // this.params.redType=this.state.redType;
      // 防止异步事件
      this.reqRedData();
      document.body.scrollTop = 0;
    } else if (index == 2) {
      this.setState({
        redType: val,
        rpTypeActiveLi: type,
        rpTypeShow: false
      });
      // this.params.pageIndex = 0;
      this.state.redType = val;
      this.reqRedData();
      document.body.scrollTop = 0;
    }
  }
  showRpDetail(e) {
    // 点击展示红包详细信息
    let index = +e.currentTarget.getAttribute('data-index');
  }
  goTo() {
    location.href = '/sc.html';
  }
  render() {
    let {
      activeTab, // 1
      rpUseShow, // 红包未使用总tab
      rpTypeShow, // 红包类型tab
      rpSortShow, // 红包排序tab
      rpUseActiveLi, // 红包状态默认未使用
      rpTypeActiveLi, // 红包类型默认全部红包
      rpSortActiveLi, // 红包排序默认即将过期
      myPacketCount, // 获取默认数据
      activeNav, // 1
      redTypes, // 红包类型
      redStatus, // 使用状态
      packets, // 红包数据
      redClass, // 最优惠
      noUseShow // 显示即将 最优惠 新到账
    } = this.state;
    let rpTabBtn = [
      {
        index: 1,
        tabCont: this.rpUseArr[rpUseActiveLi - 1]
      },
      {
        index: 2,
        tabCont: this.rpTypeArr[rpTypeActiveLi - 1]
      }
    ];
    let rpTabBtn2 = [
      {
        index: 1,
        value: 3
      },
      {
        index: 2,
        value: 1
      },
      {
        index: 3,
        value: 2
      }
    ];
    let redPacket = [
      {
        rpUseActiveLi: 1,
        value: 3,
        status: myPacketCount.use.unuse
      },
      {
        rpUseActiveLi: 2,
        value: 6,
        status: myPacketCount.use.used
      },
      {
        rpUseActiveLi: 3,
        value: 4,
        status: myPacketCount.use.outtime
      },
      {
        rpUseActiveLi: 4,
        value: 2,
        status: myPacketCount.use.pending
      },
      {
        rpUseActiveLi: 5,
        value: 1,
        status: myPacketCount.use.active
      }
    ];
    let redPacketType = [
      {
        rpTypeActiveLi: 1,
        value: 0,
        redType: redTypes.all
      },
      {
        rpTypeActiveLi: 2,
        value: 3,
        redType: redTypes.cj
      },
      {
        rpTypeActiveLi: 3,
        value: 2,
        redType: redTypes.mj
      },
      {
        rpTypeActiveLi: 4,
        value: 1,
        redType: redTypes.cz
      },
      {
        rpTypeActiveLi: 5,
        value: 4,
        redType: redTypes.jj
      },
      {
        rpTypeActiveLi: 6,
        value: 6,
        redType: redTypes.random
      }
    ];
    // let myPacketCount = this.generateMenuCout();
    return (
      <div className="pt-header yc-rp red-packet">
        <Header title="我的红包" back={ this.goTo.bind(this) } />
        {/* 有红包界面 */}
        <section className="rp-tab-header" style={ { display: '' } }>
          {rpTabBtn.map((e, i) => {
            return (
              <span
                key={ i }
                data-index={ e.index }
                className={ activeTab == e.index ? 'active' : '' }
                onClick={ this.tapTab.bind(this) }
              >
                <em>{e.tabCont}</em>
                <i
                  className={
                    activeTab == e.index
                      ? 'icon-arrow-d-mini-white'
                      : 'icon-arrow-d-mini-grey'
                  }
                />
              </span>
            );
          })}
        </section>
        <section
          className="rp-tab-nav"
          style={ { display: redStatus === 3 ? '' : 'none' } }
        >
          {rpTabBtn2.map((e, i) => {
            return (
              <span
                key={ i }
                data-index={ e.index }
                className={ activeNav == e.index ? 'active' : '' }
                onClick={ this.tapNav.bind(this) }
                data-value={ e.value }
              >
                {this.rpSortArr[i]}
              </span>
            );
          })}
        </section>
        {/* 红包状态选择项 */}
        <section
          className="rp-choice"
          style={ { display: rpUseShow ? '' : 'none' } }
        >
          <ul className="rp-use">
            {redPacket.map((e, i) => {
              return (
                <li
                  key={ i }
                  className={ rpUseActiveLi == e.rpUseActiveLi ? 'active' : '' }
                  data-index={ 1 }
                  data-type={ e.rpUseActiveLi }
                  data-value={ e.value }
                  onClick={ this.liTap.bind(this) }
                >
                  <div>
                    {this.rpUseArr[i]}({e.status})
                  </div>
                  <div
                    className={
                      rpUseActiveLi == e.rpUseActiveLi ? 'icon-choice' : ''
                    }
                  />
                </li>
              );
            })}
          </ul>
        </section>
        {/* 红包类型选择项 */}
        <section
          className="rp-choice"
          style={ { display: rpTypeShow ? '' : 'none' } }
        >
          <ul className="rp-use">
            {redPacketType.map((e, i) => {
              return (
                <li
                  key={ i }
                  className={ rpTypeActiveLi == e.rpTypeActiveLi ? 'active' : '' }
                  data-index={ 2 }
                  data-type={ e.rpTypeActiveLi }
                  data-value={ e.value }
                  onClick={ this.liTap.bind(this) }
                >
                  <div>
                    {this.rpTypeArr[i]}({e.redType})
                  </div>
                  <div
                    className={
                      rpTypeActiveLi == e.rpTypeActiveLi ? 'icon-choice' : ''
                    }
                  />
                </li>
              );
            })}
          </ul>
        </section>
        <div ref="rootdiv" className="rp-section">
          {
            <div className="no-swiper">
              {this.getRedPackets()}
              {packets.total > packets.length ? (
                <div className="load-more" onClick={ this.loadMore.bind(this) }>
                  点击加载更多
                </div>
              ) : (
                ''
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}
