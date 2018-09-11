/*
 * @Author: zouyuting
 * @Date: 2018-01-05 10:04:27
 * Desc: 找回方式----手机，邮箱，银行卡，人工
 */

import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '@/component/header'; // 头部
import session from '@/services/session.js';

import '../scss/findway.scss';

export class FindWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: ''
    };
  }
  componentWillMount() {
    this.setState({ userInfo: session.get('userInfo_find') });
  }
  Turn(e, key) {
    if (key == 'person') {
      window.open('//www.71chat.com/scsf/phone/visitor.html?cmpcd=192663');
    }
  }
  render() {
    let acc = this.state.userInfo.acc;
    let account =
      acc.toString().substring(0, 1) +
      '**' +
      acc.toString().substring(acc.length - 1, acc.length);
    let list = [
      {
        sts: this.state.userInfo.mob_sts,
        key: 'phone',
        target: '/phoneway',
        img: require('@/img/account/phone_id@2x.png'),
        title: '通过手机验证码',
        info: '如果你的手机还在正常使用，请选择此方法'
      },
      {
        sts: this.state.userInfo.dft_cd,
        key: 'bankcard',
        target: 'bkcardway',
        img: require('@/img/account/cridit_card@2x.png'),
        title: '通过快捷支付银行卡验证',
        info: '如果你记得付款时使用的快捷支付银行卡号，请选择此方式'
      },
      {
        sts: this.state.userInfo.em_sts,
        key: 'email',
        target: 'emailway',
        img: require('@/img/account/email_code@2x.png'),
        title: '通过邮箱验证码',
        info: '如果你的邮箱还在使用，请选择此方式'
      },
      {
        sts: '1',
        key: 'person',
        img: require('@/img/account/people_serv@2x.png'),
        title: '通过人工服务',
        info: '我们会在24小时内受理，请耐心等待'
      }
    ];
    return (
      <div className="findway">
        <Header title="找回方式" />
        <div className="findway-container">
          <p className="findway-text">
            正在为<span>{account}</span>账户找回密码，请选择身份验证方式
          </p>
          <div className="valid-box">
            {list.map((e, i) => {
              return (
                <div
                  style={ { display: e.sts == 0 || !e.sts ? 'none' : 'block' } }
                  key={ e.key }
                >
                  <div className="valid-info-box">
                    <Link to={ e.target ? e.target : '' }>
                      <ul
                        className="valid-info-list"
                        onClick={ event => this.Turn(event, e.key) }
                      >
                        <li className="">
                          <img src={ e.img } />
                          <div className="right">
                            <p className="title">{e.title}</p>
                            <p className="info">{e.info}</p>
                          </div>
                        </li>
                      </ul>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
