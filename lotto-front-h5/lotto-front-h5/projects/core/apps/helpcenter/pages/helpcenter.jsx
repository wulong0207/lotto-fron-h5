import React, { Component } from 'react';
import { Link } from 'react-router';

import '../css/helpcenter.scss';
import Header from '@/component/header';
import http from '@/utils/request';
import Message from '@/services/message';
import cx from 'classnames';
// import ProblemCont from '../components/problem_cont';
import session from '@/services/session';
import storage from '@/services/storage';
import { browser } from '@/utils/utils';
import Interaction from '@/utils/interaction';

const HELP_SEARCH_HISTORY = 'HELP_SEARCH_HISTORY';

export class HelpCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      head: false,
      list: true,
      prolist: [],
      prodetail: [],
      hotwords: [],
      essay: {},
      essaydetail: false,
      findhistory: [],
      showhistory: false,
      phone: '',
      proDetailtotalpage: 0,
      proListtotalpage: 0,
      histotries: storage.get(HELP_SEARCH_HISTORY) || [],
      problemlist: []
    };
    this.timer = null;
    this.dpage = 0;
    this.lpage = 0;
  }
  componentWillMount() {
    http
      .get('/member/customertel', {})
      .then(res => {
        this.setState({ phone: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  search(e) {
    // debugger;
    this.setState({ search: e.target.value });
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (e.target.value === '') {
      this.setState({ prolist: [], list: true, prodetail: [] });
    } else {
      this.searchlist(e.target.value);
      // this.timer = setTimeout(() => {
      //   this.searchlist(this.state.search);
      // }, 500);
    }
  }
  searchlist(value) {
    // 搜索框输入空格
    if (!value.trim().length) return undefined;
    let params = {
      keyword: value,
      loading: false
    };
    http
      .get('/help/keywords', { params })
      .then(res => {
        this.setState({ prolist: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  hotWords() {
    let params = {
      num: ''
    };
    http
      .get('/help/hotwords', { params })
      .then(res => {
        this.setState({ hotwords: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  changeBox(event) {
    this.hotWords();
    this.setState({ head: true });
    this.searchHistoryList();
  }
  changeBox2(event) {
    this.setState({ head: false, list: true, search: '' });
  }
  // 不包含详细信息
  toProDetail(e, txt) {
    let params = {
      keyword: txt,
      pageIndex: this.dpage,
      pageSize: 6
    };

    // 搜索历史记录
    let histotries = this.state.histotries.concat();
    histotries.unshift(txt);
    this.setState({ histotries });
    storage.set(HELP_SEARCH_HISTORY, histotries);

    // storage.set('txt'+txt, txt);
    session.set('prodetailtxt', txt);
    http
      .get('/help/search', { params })
      .then(res => {
        // console.log(res.data);
        this.setState({
          search: txt,
          list: false,
          prodetail: res.data.data,
          proDetailtotalpage: Math.ceil(
            res.data.total / params.pageSize <= 1
              ? undefined
              : res.data.total / params.pageSize
          )
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  toEssay(e, id, typecode) {
    // let params = {
    //   helpId: id
    // };
    // http
    //   .get('/help/detail', { params })
    //   .then(res => {
    //     this.setState({ essay: res.data, essaydetail: true });
    //   })
    //   .catch(err => {
    //     Message.toast(err.message);
    //   });

    // let params2 = {
    //   outHelpId: id,
    //   pageIndex: 0,
    //   pageSize: 5,
    //   typeCode: typecode
    // };
    // http
    //   .get('/help/list', { params: params2 })
    //   .then(res => {
    //     this.setState({ problemlist: res.data.data });
    //   })
    //   .catch(err => {
    //     Message.toast(err.message);
    //   });
    window.location.hash = '/answer?helpId=' + id;
  }
  feedBack(e) {
    // let next = encodeURIComponent(window.location.href);
    window.location.hash = '/feedback';
  }
  selfserv(e) {
    if (browser.yicaiApp) {
      // 调APP登录
      Interaction.sendInteraction('toMyselfService', []);
    } else {
      // let next = encodeURIComponent(window.location.href);
      window.location.hash = '/selfserv';
    }
  }
  // 显示搜索历史
  searchHistoryList() {
    let find_history = storage.get(HELP_SEARCH_HISTORY);
    if (find_history) {
      if (find_history.length > 1) {
        find_history = this.unique(find_history);
      }
    }
    this.setState({ findhistory: find_history });
  }
  unique(arr) {
    var res = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
      var repeat = false;
      for (var j = 0; j < res.length; j++) {
        if (arr[i] === res[j]) {
          repeat = true;
          break;
        }
      }
      if (!repeat) {
        res.push(arr[i]);
      }
    }
    return res;
  }
  hotwords(e, words) {
    // console.log(words);
    this.setState({ search: words });
    this.searchlist(words);
    this.toProDetail(e, words);
    // console.log(this.state.prodetail);
  }
  onHistory(e, words) {
    this.setState({ search: words });
    this.searchlist(words);
    this.toProDetail(e, words);
  }
  clearallhistory(e) {
    this.setState({ histotries: [], findhistory: [] });
    storage.clear(HELP_SEARCH_HISTORY);
  }
  clearonehistory(e, words) {
    let find_history_list = this.state.findhistory;
    // console.log(find_history_list);
    let len = find_history_list.length;
    for (var i = 0; i < len; i++) {
      if (find_history_list[i] === words) {
        find_history_list.splice(i, 1);
      }
    }
    this.setState({ findhistory: find_history_list });
    storage.set(HELP_SEARCH_HISTORY, find_history_list);
  }
  online(e) {
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toOnLineServcie', []);
    } else {
      window.open('//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663');
    }
  }
  call(e, phone) {
    if (browser.yicaiApp && browser.android) {
      e.preventDefault();
      // 调APP登录
      Interaction.sendInteraction('callPhone', [phone]);
    }
  }
  // 相关内容
  proListloadMore() {
    this.lpage++;
  }
  // 相关内容
  proDetailloadMore() {
    this.dpage++;
    let params = {
      keyword: session.get('prodetailtxt'),
      pageIndex: this.dpage,
      pageSize: 6
    };
    // storage.set('txt'+txt,txt);
    http
      .get('/help/search', { params })
      .then(res => {
        // console.log(res.data);
        // this.setState({list: false, prodetail: res.data.data})
        let prodetail = res.data.data;
        prodetail = this.state.prodetail.concat(prodetail);
        this.setState({ prodetail });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  findend(e) {
    if (e.keyCode === '13') {
      storage.set('txt' + e.target.value, e.target.value);
      this.searchlist(e.target.value);
      this.toProDetail(e, e.target.value);
    }
  }
  summary(summary) {
    let search = this.state.search;
    let keyWordReg = new RegExp(search, 'g');
    if (summary) {
      summary = summary
        ? summary.replace(
          keyWordReg,
          '<span style="color:#06bf04">' + search + '</span>'
        )
        : summary;
      let html = { __html: summary };
      return <span className="result" dangerouslySetInnerHTML={ html } />;
    } else {
      return summary;
    }
  }
  render() {
    let search = this.state.search;
    let head = this.state.head;
    let list = this.state.list;
    let proList = this.state.prolist;
    let hotWords = this.state.hotwords;
    let proDetail = this.state.prodetail;
    // let essay = this.state.essay;
    // let essayDetail = this.state.essaydetail;
    let findHistory = this.state.findhistory || [];
    let phone = this.state.phone;
    // 关于页面加载
    let proDetailTotalPage = this.state.proDetailtotalpage;
    // let proListTotalPage = this.state.proListtotalpage;
    let problemlist = [
      {
        imgSrc: require('../img/question@2x.png'),
        txt: '热点问题',
        tag: '/problem',
        typeCode: '1.1'
      },
      {
        imgSrc: require('../img/pay@2x.png'),
        txt: '注册登录',
        tag: '/problem',
        typeCode: '1.3.1'
      },
      {
        imgSrc: require('../img/buytic@2x.png'),
        txt: '购买彩票',
        tag: '/problem',
        typeCode: '1.3.2'
      },
      {
        imgSrc: require('../img/award@2x.png'),
        txt: '中奖兑奖',
        tag: '/problem',
        typeCode: '1.3.3'
      },
      {
        imgSrc: require('../img/casafe@2x.png'),
        txt: '购彩安全',
        tag: '/problem',
        typeCode: '1.3.5'
      },
      {
        imgSrc: require('../img/helpmore@2x.png'),
        txt: '更多帮助',
        tag: '/problem',
        typeCode: ''
      }
    ];
    return (
      <div className="help">
        <div className={ cx(head ? 'hide' : '') }>
          <Header title="帮助中心" />
        </div>
        <div className="help-cont">
          <div className={ cx(head ? 'search-part-click' : 'search-part') }>
            <div className="search-box">
              <span className="icon_find" />
              <input
                className="search"
                ref="search"
                type="search"
                placeholder="搜索"
                value={ search }
                onChange={ event => this.search(event) }
                onFocus={ event => this.changeBox(event) }
                onKeyDown={ event => this.findend(event) }
              />
            </div>
            <span className="cancel" onClick={ event => this.changeBox2(event) }>
              取消
            </span>
          </div>
          <div className={ cx(head ? 'problem-list-click' : 'problem-list') }>
            {search === '' ? (
              <div className="pro-box">
                <div className="hot-cont">
                  <p className="hotfind">热门搜索</p>
                  {hotWords.map((e, i) => {
                    return (
                      <span
                        className="hot-btn"
                        key={ i }
                        onClick={ event => this.hotwords(event, e) }
                      >
                        {e}
                      </span>
                    );
                  })}
                </div>
                {findHistory.length < 1 ? (
                  <div />
                ) : (
                  findHistory.slice(0, 6).map((e, i) => {
                    return (
                      <div className="history-cont" key={ i }>
                        <div className="findhistorylist">
                          <img
                            className="clock"
                            src={ require('../img/clock.png') }
                            alt=""
                          />
                          <p
                            className="txt"
                            onClick={ event => this.onHistory(event, e) }
                          >
                            {e}
                          </p>
                          <img
                            onClick={ event => this.clearonehistory(event, e) }
                            className="close"
                            src={ require('../img/close.png') }
                            alt=""
                          />
                        </div>
                      </div>
                    );
                  })
                )}
                {findHistory.length < 1 ? (
                  <div />
                ) : (
                  <div
                    className="clear"
                    onClick={ event => this.clearallhistory(event) }
                  >
                    <p className="clearhistory">清除搜索记录</p>
                  </div>
                )}
              </div>
            ) : proList.length > 0 ? (
              <div className="pro-box">
                {list ? (
                  <div className="box-cont">
                    <p className="about">相关问题</p>
                    <ul className="problem-txt">
                      {proList.map((e, i) => {
                        return (
                          <li
                            onClick={ event => this.toProDetail(event, e) }
                            className="pro-txt"
                            key={ i }
                          >
                            {this.summary(e)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="box-cont">
                    <p className="about">相关内容</p>
                    <ul className="problem-txt">
                      {proDetail.map((e, i) => {
                        return (
                          <li
                            className="pro-list"
                            onClick={ event =>
                              this.toEssay(event, e.id, e.typeCode)
                            }
                            key={ i }
                          >
                            <div className="list-cont">
                              <p className="title">{this.summary(e.title)}</p>
                              <p className="summary">
                                {this.summary(e.summary)}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {proDetail.length > 0 ? (
                      proDetailTotalPage > this.dpage ? (
                        <div
                          className="load-more"
                          key={ 'li' }
                          onClick={ event => this.proDetailloadMore(event) }
                        >
                          点击加载更多
                        </div>
                      ) : (
                        <div className="load-more" key={ 'li' }>
                          没有更多了
                        </div>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="pro-box">
                <div className="pro-cont">
                  <p className="msg">
                    没有搜索到关于<span>{search}</span>的内容
                  </p>
                  <p className="msg">
                    请重新搜索或联系<a onClick={ event => this.online(event) }>
                      在线客服
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="problem-part">
            {problemlist.map((e, i) => {
              return (
                <Link
                  to={ e.tag + '?typecode=' + e.typeCode }
                  className="path"
                  key={ i }
                >
                  <div className="problem-block">
                    <img className="img" src={ e.imgSrc } />
                    <span className="txt">{e.txt}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="service">
            <div className="title" onClick={ event => this.online(event) }>
              <span className="txt">在线客服</span>
              <span className="icon_tou" />
            </div>
            <ul className="service_content">
              <li>
                <span className="infomation">客服电话</span>
                <span className="content">
                  <a
                    onClick={ event => this.call(event, phone) }
                    href={ 'tel:' + phone }
                  >
                    {phone}
                  </a>
                </span>
              </li>
              <li onClick={ event => this.selfserv(event) }>
                <span className="infomation">自助服务</span>
                <span className="content" />
              </li>
              <li onClick={ event => this.feedBack(event) }>
                <span className="infomation">意见反馈</span>
                <span className="content" />
              </li>
            </ul>
          </div>
          <div className={ cx(head ? 'copyright-click' : 'copyright') }>
            <div className="right-cont">
              <p className="item">@2017益彩网版权所有</p>
              <p className="item">深圳益彩网络技术有限公司</p>
            </div>
          </div>
        </div>
        {/* <div className={ cx(essayDetail ? 'essay-cont' : 'essay-cont-hide') }>
          <Header
            title="问题内容"
            back={ () => {
              this.setState({ essaydetail: false });
            } }
          />
          <ProblemCont
            essay={ this.state.essay }
            problemlist={ this.state.problemlist }
          />
        </div> */}
      </div>
    );
  }
}

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           token token
 */
window.initializeApp = function(params) {
  // alert(JSON.stringify(params));
  var curParams = {};
  try {
    curParam = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
};
