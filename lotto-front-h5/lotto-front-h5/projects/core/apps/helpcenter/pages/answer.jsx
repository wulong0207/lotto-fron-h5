import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '@/component/header';
import http from '@/utils/request';
import Message from '@/services/message';
import { browser, getParameter } from '@/utils/utils';
import Interaction from '@/utils/interaction';
import session from '@/services/session';
import MusicPlayer from '../components/musicplayer';

import '../css/problem-cont.scss';

export class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      essay: {},
      problemlist: [],
      phone: '',
      essayCont: ''
    };
  }
  componentWillMount() {
    this.phone();
    this.essay();
    this.couldBe();
  }
  essay() {
    let helpId = getParameter('helpId');
    let params = {
      helpId: helpId
    };
    http
      .get('/help/detail', { params })
      .then(res => {
        // this.delAudio(res.data.content)
        this.setState({ essay: res.data });
        session.set('essaytype', res.data.typeCode);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  couldBe() {
    // 可能遇到的问题
    let helpId = getParameter('helpId');
    let secparams = {
      outHelpId: helpId,
      pageIndex: 0,
      pageSize: 5,
      typeCode: session.get('essaytype')
    };
    http
      .get('/help/list', { params: secparams })
      .then(res => {
        this.setState({ problemlist: res.data.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
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
  article(e, id, typecode) {
    // debugger;
    let params = {
      helpId: id
    };
    http
      .get('/help/detail', { params: params })
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
      .get('/help/list', { params: params2 })
      .then(res => {
        this.setState({ problemlist: res.data.data });
        // console.log(res.data.data);
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
  call(e, phone) {
    if (browser.yicaiApp && browser.android) {
      e.preventDefault();
      // 调APP登录
      Interaction.sendInteraction('callPhone', [phone]);
    }
  }
  render() {
    let essay = this.state.essay || {};
    let problemList = this.state.problemlist || [];
    let html = { __html: essay.content };
    let phone = this.state.phone;
    return (
      <div className="problem-detail">
        <Header title="问题内容" />
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
              problemList.slice(0, 5).map((e, i) => {
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
