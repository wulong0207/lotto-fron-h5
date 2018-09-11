import React, { Component } from 'react';
import Header from '@/component/header';

import '../css/selfserv.scss';
import session from '@/services/session';
import http from '@/utils/request';
import Message from '@/services/message';

export class SelfServ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selflist: []
    };
  }

  toPages(e, txt, url) {
    let back = encodeURIComponent(window.location.href);
    if (txt == '找回密码') {
      window.location.href = url;
    } else {
      let token = session.get('token');
      let params = {
        token: token
      };
      http
        .post('/member/info', params)
        .then(res => {
          // debugger;
          if (txt == '修改邮箱') {
            if (res.data.em_sts === 0) {
              window.location.href = '/sc.html#/register-mail';
            } else {
              window.location.href =
                '/sc.html/verify-mail/' + res.data.em + '/1';
            }
          } else if (txt == '修改手机号') {
            if (res.data.mob_sts === 0) {
              window.location.href = '/sc.html#/register-phone';
            } else {
              window.location.href =
                '/sc.html#/verify-phone/' + res.data.mob + '/1';
            }
          } else if (txt == '修改密码') {
            window.location.href = '/sc.html#/change-pwd';
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    }
  }
  render() {
    let back = encodeURIComponent(window.location.href);
    let selfList = [
      {
        iconImg: require('../img/findpsd.png'),
        txt: '找回密码',
        tag: '/account.html#/findpwd'
      },
      {
        iconImg: require('../img/changepsd.png'),
        txt: '修改密码',
        tag: '/account.html#/findsec'
      },
      {
        iconImg: require('../img/changemob.png'),
        txt: '修改手机号',
        tag: '/sc.html?back=' + back + '/verify-phone/'
      },
      {
        iconImg: require('../img/changemail.png'),
        txt: '修改邮箱',
        tag: '/sc.html#/verify-mail/'
      }
    ];
    return (
      <div className="self">
        <Header title="自助服务" />
        <div className="cont">
          {selfList.map((e, i) => {
            return (
              <div
                className="self-block"
                onClick={ event => this.toPages(event, e.txt, e.tag) }
                key={ i }
              >
                <div className="listout">
                  <div className="list">
                    <img className="img" src={ e.iconImg } />
                    <span className="txt">{e.txt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
