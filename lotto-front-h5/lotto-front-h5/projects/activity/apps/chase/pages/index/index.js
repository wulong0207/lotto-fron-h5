import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import http from '@/utils/request';
import session from '@/services/session.js';
import { Link } from 'react-router';
import Interaction from '@/utils/interaction';
import { getParameter, setDate, formatMoney, browser } from '@/utils/utils';
import Dialog from '../../../../../activity/apps/jckt/login/dialog';
import './css/index.scss';

// 规则说明
function Rule() {
  return (
    <div className="chase-rule">
      <Title title="活动规则" />
      <p>1.活动期间内新老用户均可参加，需活动页面参与；</p>
      <p>2.符合活动规则的订单，若追号期间未中奖，则返还相对应的无门槛红包，红包有效期7天；</p>
      <p>3.追号投注成功是指所追号期数皆成功出票，用户追号期间不可取消追号方案(撤单)；</p>
      <p>4.活动返还的红包将在用户追号的最后一期开奖后3个工作日内返还;</p>
      <p>5.追号套餐数量有限，发完即止，先到先得;</p>
      <p>6.追号不中全额返还（100元不中返105元)，每人仅限体验一次;</p>
      <p>7.恶意操作的用户，将取消活动资格，本站有权收回获赠的红包；</p>
      <p>8.在法律许可范围内，2n彩票保留本次活动最终解释权，如有疑问请联系客服: 0755-61988504。</p>
    </div>
  );
}

function Title({ title, imgurl }) {
  console.log(imgurl, 'img');
  return (
    <div className="title">
      <img className="start" src={ require('../../img/start.png') } />
      <div>
        {imgurl ? <img className="title-ssq" src={ imgurl } /> : ''}
        <span>{title}</span>
      </div>
      <img className="start" src={ require('../../img/start.png') } />
    </div>
  );
}

function Buy({ index, data, code, betBuy }) {
  return (
    <div className="package-bug">
      {index == 0 ? (
        <img className="hot-sale" src={ require('../../img/hot-sale.png') } />
      ) : (
        ''
      )}
      <div className="inline">
        {(code === 100 ? 2 : 3) * data.addNum}元<b className="orange">不中返{data.redValue}</b>
      </div>
      <div className="inline f28">追{data.addNum}期套餐</div>
      <div className="bug-white" onClick={ () => betBuy() } />
    </div>
  );
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssqInfo: [],
      dltInfo: []
    };
  }
  componentDidMount() {
    this.getAddInfo(100)
      .then(this.getAddInfo.bind(this, 102))
      .then(this.handleLogin.bind(this));
  }
  // 判断是否登录，如果没有登录
  handleLogin() {
    let token = session.get('token');
    if (!token) {
      // 注册登录
      if (browser.yicaiApp) {
        // 调APP登录
        Interaction.sendInteraction('toLogin', []);
      } else {
        // 注册登录
        this.dialog.changeShowDialog(1);
      }
    }
  }
  getAddInfo(code) {
    // 活动信息
    return new Promise((resolve, reject) => {
      http
        .get('/activity/addedInfo', {
          params: {
            lotteryCode: code
          }
        })
        .then(res => {
          if (code === 100) {
            this.setState({ ssqInfo: res.data || [] });
          } else if (code === 102) {
            this.setState({ dltInfo: res.data || [] });
          }
          console.log(res.data);
          resolve();
        })
        .catch(err => {
          console.error(err);
        });
    });
  }
  goMyChase(ssqInfo, dltInfo, newPerson) {
    let token = session.get('token');
    if (!token) {
      this.handleLogin();
    } else {
      let code = '';
      let code1 = '';
      let code2 = '';
      if (ssqInfo[0]) {
        code = ssqInfo[0].activityId;
      }
      if (dltInfo[0]) {
        code1 = dltInfo[0].activityId;
      }
      if (newPerson[0]) {
        code2 = newPerson[0].activityId;
      }
      window.location.href = `chase.html#/my-chase/?code=${code}&code1=${code1}&code2=${code2}`;
    }
  }
  newPay(newPerson) {
    let token = session.get('token');
    if (!token) {
      this.handleLogin();
    } else {
      window.location.href = `chase.html#/pick?code=100&num=${newPerson[0]
        .addNum}&refund=${newPerson[0].redValue}&activityId=${newPerson[0]
        .activityId}`;
    }
  }
  betBuy(data, code) {
    let token = session.get('token');
    if (!token) {
      this.handleLogin();
    } else {
      window.location.href = `chase.html#/pick?activityId=${data.activityId}&num=${data.addNum}&code=${code}&refund=${data.redValue} `;
    }
  }
  render() {
    let { ssqInfo, dltInfo } = this.state;
    const newPerson = ssqInfo.filter((m, i) => m.singleUserNum === 1) || []; // 是否新人专享
    ssqInfo = ssqInfo.filter((val, index) => val.singleUserNum !== 1);
    // if (ssqInfo.length < 1) return null;
    return (
      <div className="chase">
        <div className="chase-header">
          <div
            className="myChase"
            onClick={ this.goMyChase.bind(this, ssqInfo, dltInfo, newPerson) }
          />
          <img className="buze" src={ require('../../img/bgbu.png') } />
        </div>
        <div className="chase-content">
          {newPerson.length > 0 ? (
            <div className="new-exclusive">
              <Title title="追号不中不要钱，再多送5元" />

              <div className="new-bug">
                <img
                  className="personal"
                  src={ require('../../img/personal.png') }
                />
                <img className="ssq" src={ require('../../img/86x86.png') } />
                <div className="bug-num">
                  <span>
                    {2 * newPerson[0].addNum}元<b className="orange">
                      不中送{newPerson[0].redValue}
                    </b>
                  </span>
                  <span>追{newPerson[0].addNum}期套餐</span>
                </div>

                <img
                  className="bgo"
                  src={ require('../../img/bugo.png') }
                  onClick={ this.newPay.bind(this, newPerson) }
                />
              </div>
            </div>
          ) : (
            ''
          )}

          <div className="ssq-package">
            <Title title="双色球套餐" imgurl={ require('../../img/48x48.png') } />
            <div className="bug">
              {ssqInfo.map((data, index) => (
                <Buy
                  index={ index }
                  key={ index }
                  data={ data }
                  code={ 100 }
                  betBuy={ this.betBuy.bind(this, data, 100) }
                />
              ))}
            </div>
          </div>

          <div className="ssq-package">
            <Title title="大乐透套餐" imgurl={ require('../../img/48.png') } />
            <div className="bug">
              {dltInfo.map((data, index) => (
                <Buy
                  key={ index }
                  data={ data }
                  code={ 102 }
                  betBuy={ this.betBuy.bind(this, data, 102) }
                />
              ))}
            </div>
          </div>
          <Rule />
        </div>
        {/* 弹窗部分 */}
        <Dialog ref={ dialog => (this.dialog = dialog) } />
      </div>
    );
  }
}

export default Index;
