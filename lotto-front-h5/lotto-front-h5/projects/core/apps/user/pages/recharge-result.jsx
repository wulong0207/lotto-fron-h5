/*
 * @Author: yanglidong
 * @Date: 2017-05-31 17:14:00
 * @Desc: 充值结果页
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '@/component/header';
import http from '@/utils/request';
import auth from '@/utils/auth';
import { getParameter, browser } from '@/utils/utils';
import LotteryCode from '@/utils/lottery-code';
import Message from '@/services/message';
// import '../../../scss/user/component/recharge-result.scss';
import CZOK from '../img/recharge/pay_cg@2x.png';
import CZIng from '../img/recharge/iconthree@2x.png';
import CZFailed from '../img/recharge/iconfive@2x.png';
import CZWarning from '../img/recharge/iconfour@2x.png';

import Navigator from '@/utils/navigator'; // 页面跳转
import Interaction from '@/utils/interaction';

import '../css/recharge-result.scss';

export default class PayResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
      recommData: [],
      remaTime: 15
    };

    this.timer = null;
    this.loaded = false;
  }

  componentWillMount() {
    let self = this;

    // 查询订单状态
    this.queryResult();
    self.reqRecomand();
    // 根据接口判断支付状态
  }

  // 如果是充值中，轮询订单状态
  queryResult() {
    const transCode = getParameter('tc');
    const token = auth.getToken();
    let self = this;

    this.timer = setInterval(() => {
      http
        .get('/rechargeCenter/rechargeResult', {
          params: { transCode, token, loading: false }
        })
        .then(res => {
          self.loaded = true;
          this.setState({ result: res });
          const data = this.state.result.data;

          let r_p = data.r_p; // 充值平台
          if (r_p == 4) {
            // 如果来自 ios 充值的
            location.href = `yicai://method=toURL:${location.href}`; // 跳转到 app
            window.close();
          }

          if (data.p_s == 1) {
            if (this.state.remaTime > 1) {
              this.setState({ remaTime: this.state.remaTime - 1 });
            } else {
              this.setState({ result: { data: { p_s: 3 } } });
              clearTimeout(this.timer);
              // this.setState(deepAssign({}, this.state.result, { data: { p_s: 3 }}));
            }
          } else {
            clearTimeout(this.timer);
          }

          if (!this.state.remaTime) {
            clearTimeout(this.timer);
          }
        })
        .catch(err => {
          self.loaded = true;
          Message.toast(err.message);

          clearTimeout(this.timer);
        });
    }, 1000);
  }

  reqRecomand() {
    let self = this;
    http
      .get('/operate/operlottery', {})
      .then(res => {
        self.setState({ recommData: res.data });
      })
      .catch(err => {});
  }

  chargeOK() {
    clearTimeout(this.timer);
    Navigator.goAddr('#/');
  }

  goSSQ() {
    if (browser.yicaiApp) {
      Interaction.toBetVC('100');
    } else {
      Navigator.goSSQ();
    }
  }

  goFC() {
    Message.toast('暂未开通');
    // Interaction.toBetVC(LotteryCode["105"]);
  }

  goCaiPiao(code) {
    if (browser.yicaiApp) {
      Interaction.toBetVC(code + '');
    }
  }

  recharge() {
    if (browser.yicaiApp) {
      location.href = './sccz.html';
    } else {
      Navigator.goAddr('#/recharge');
    }
  }
  goTo() {
    clearTimeout(this.timer);
    location.href = '#/recharge';
  }

  render() {
    const transCode = getParameter('transCode');
    const recommData = this.state.recommData || [];
    let { result } = this.state;
    let picStyle = { marginTop: '60px' };
    // 1、进行中 2、交易成功 3、交易失败 4、订单关闭。判断这个状态来区分支付成功或者失败
    let zt = ['', '充值确认中...', '交易成功', '交易失败', '订单关闭'];

    let headStyle, orderinfoView, resultView;
    if (!browser.yicaiApp) {
      headStyle = { marginTop: '60px' };
    }

    result = result || {};
    let message, pic, resultData;
    resultData = result.data || {};
    message = zt[resultData.p_s];
    pic = CZIng;
    if (result.errorCode == '10001') {
      pic = CZOK;
      resultView = (
        <section className="result-recommend">
          <h2>为你推荐</h2>
          <div>
            <ul>
              {recommData.map((row, index) => {
                if (index < 2) {
                  return (
                    <li key={ index }>
                      <a
                        onClick={ this.goCaiPiao.bind(this, row.typeId) }
                        href={ row.typeUrl }
                      >
                        <img height="60" src={ row.lotteryLogoUrl } />
                        <span>{row.typeAlias}</span>
                        <span
                          dangerouslySetInnerHTML={ { __html: row.typeKey } }
                        />
                      </a>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </section>
      );

      orderinfoView = (
        <section className="result-succ">
          <section className="result-info">
            <div>
              <p>
                <span>充值订单编号</span>
                <span>{resultData.t_r_c}</span>
              </p>
              <p>
                <span>实际支付金额</span>
                <span>
                  <em>￥{resultData.p_a}</em>
                </span>
              </p>
              <p>
                <span>使用红包</span>
                <span>{resultData.r_n || '-'}</span>
              </p>
              <p>
                <span>支付时间</span>
                <span>{resultData.t_t}</span>
              </p>
              <p>
                <span>充值奖励</span>
                <span>{resultData.r_r || '-'}</span>
              </p>
            </div>
            <div />
            {/* <div className="result-handler">
                            <p>
                                <span>再来一注</span>
                                <span>查看方案</span>
                            </p>
                            <p>再买一注中奖机会更高哦</p>
                        </div> */}
          </section>
        </section>
      );
    } else if (this.loaded) {
      message = message || result.message;

      resultView = (
        <section onClick={ this.recharge.bind(this) } className="result-fail">
          <p>
            <span className="button btn-blue btn-large">重新充值</span>
          </p>
        </section>
      );
    }

    switch (resultData.p_s) {
      case 1:
        {
          pic = CZIng;
        }
        break;
      case 2:
        {
          pic = CZOK;
        }
        break;
      case 3:
        {
          pic = CZFailed;
        }
        break;
      case 4:
        {
          pic = CZFailed;
        }
        break;
      default:
        {
        }
        break;
    }

    return (
      <div className="recharge-result">
        <Header title="充值结果" back={ this.goTo.bind(this) }>
          <div className="operation">
            <span onClick={ this.chargeOK.bind(this) }>完成</span>
          </div>
        </Header>
        <section className="result-view">
          <img width="120" src={ pic }
            style={ headStyle } />
          <p>{message}</p>
          <p className="remaTime">
            {resultData.p_s == 1 ? (
              <span>
                剩余时间：<em> {this.state.remaTime} </em>秒
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </p>
        </section>
        {orderinfoView}
        {resultView}
        <br />
      </div>
    );
  }
}

// ReactDOM.render(<PayResult/>, document.getElementById('app'));
