import React, { Component } from 'react';
import { Link } from 'react-router';

import '../css/problem-cont.scss';
import http from '@/utils/request';
import Message from '@/services/message';
import MusicPlayer from './musicplayer';
import { browser } from '@/utils/utils';
import Interaction from '@/utils/interaction';

export default class ProblemCont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      essay: {},
      problemlist: [],
      phone: '',
      essayCont: ''
    };
    this.timer = null;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      essay: nextProps.essay,
      problemlist: nextProps.problemlist
    });
  }
  componentWillMount() {
    this.phone();
    // this.problemlistRender()
  }
  componentDidMount() {
    // this.problemlistRender()
  }
  problemlistRender() {
    // let id = this.state.id;
    // let typeCode = this.state.typeCode;
    // let params = {
    //     outHelpId: id,
    //     pageIndex: 0,
    //     pageSize: 5,i
    //     typeCode: typeCode
    // }
    // http.get('/common/help/article', {params}).then(res => {
    //     this.setState({problemlist: res.data.data});
    // }).catch(err => {
    //     Message.toast(err.message);
    // });
  }
  phone() {
    http
      .get('/member/customertel', {})
      .then(res => {
        // console.log(res.data);
        this.setState({ phone: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  onlineserv() {
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toOnLineServcie', []);
    } else {
      window.open('//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663');
    }
  }
  article(e, id, typecode) {
    debugger;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(event => {
      let params = {
        helpId: id
      };
      http
        .get('/help/detail', { params })
        .then(res => {
          this.setState({ essay: res.data });
        })
        .catch(err => {
          Message.toast(err.message);
        });

      let params2 = {
        outHelpId: id,
        pageIndex: 0,
        pageSize: 5,
        typeCode: typecode
      };
      http
        .get('/help/detail', { params: params2 })
        .then(res => {
          this.setState({ problemlist: res.data.data });
        })
        .catch(err => {
          Message.toast(err.message);
        });
    }, 500);
  }
  call(e, phone) {
    if (browser.yicaiApp && browser.android) {
      e.preventDefault();
      // 调APP登录
      Interaction.sendInteraction('callPhone', [phone]);
    }
  }

  render() {
    let essay = this.state.essay;
    let problemList = this.state.problemlist || [];
    let html = { __html: essay.content };
    let phone = this.state.phone;
    return (
      <div className="problem-detail">
        <div className="main-cont">
          <p className="question-title">{essay.title}</p>
          {/* 音频播放 */}
          {essay.audio ? <MusicPlayer audio={ essay.audio } /> : ''}
          <div className="result" dangerouslySetInnerHTML={ html } />
        </div>
        <div className="else-question">
          <p className="else-title">你可能遇到的问题</p>
          <ul className="question-list">
            {problemList.length < 1 ? (
              <div />
            ) : (
              problemList.splice(0, 5).map((e, i) => {
                return (
                  <Link
                    onClick={ event => this.article(event, e.id, essay.typeCode) }
                    key={ i }
                  >
                    <li className="question-name" key={ i }>
                      {e.title}
                    </li>
                  </Link>
                );
              })
            )}
          </ul>
        </div>
        <div className="footer">
          <sapn className="btn" onClick={ event => this.onlineserv(event) }>
            在线客服
          </sapn>
          <a
            className="btn"
            onClick={ event => this.call(event, phone) }
            href={ 'tel:' + phone }
          >
            <sapn>客服电话</sapn>
          </a>
        </div>
      </div>
    );
  }
}
