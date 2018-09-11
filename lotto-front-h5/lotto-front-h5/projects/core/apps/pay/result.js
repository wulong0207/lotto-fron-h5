/*
 * @Author: yubei
 * @Date: 2017-05-26 15:01:48
 * @Desc: 支付结果页
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Header from '@/component/header';
import http from '@/utils/request';
import auth from '@/utils/auth';
import { getParameter, browser, formatMoney } from '@/utils/utils';
import Message from '@/services/message';
import session from '@/services/session';
import deepAssign from '@/utils/deep-assign';
import cx from 'classnames';
import lotteryCode from '@/utils/lottery-code';
import Interaction from '@/utils/interaction';
import Recommend from './components/recommend';
import Navigator from '@/utils/navigator';
import api from '../../../sports/apps/cd/services/api';
import CopyEntrance from '../../../sports/apps/cd/components/entrance';
import ALink from '@/component/analytics/link';
import analytics from '@/services/analytics';

import './css/result.scss';

const transCode = getParameter('tc');
const token = auth.getToken();

export default class PayResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
      // 轮询剩余时间
      remaTime: 45,
      loadMore: false, // 加载更多订单
      isCopyAvailable: null
    };
    this.timer = null;
  }

  componentDidMount() {
    analytics.send(210);
  }

  componentWillMount() {
    this.queryResult().then(res => {
      const { data } = res;
      const orderCodes = data.o_c.split(',');
      // 合买的时候不能发布抄单
      if (orderCodes.length > 1) {
        this.setState({ isCopyAvailable: false });
        return undefined;
      }
      api
        .getAvailableStatus(orderCodes[0])
        .then(available => {
          this.setState({ isCopyAvailable: available });
        })
        .catch(() => {
          this.setState({ isCopyAvailable: false });
        });
    });
  }

  // 如果是支付中，轮询订单状态
  queryResult() {
    /**
     * p_s 订单支付状态
     * 1、进行中
     * 2、交易成功
     * 3、交易失败
     * 4、订单关闭
     *  判断这个状态来区分支付成功或者失败
     */
    return new Promise((resolve, reject) => {
      if (!browser.yicaiApp) {
        this.timer = setInterval(() => {
          http
            .get('/payCenter/payResult', {
              params: { transCode, token, loading: false }
            })
            .then(res => {
              this.setState({ result: res });
              resolve(res);
              const data = this.state.result.data;

              let r_p = data.r_p; // 充值平台
              if (r_p === 4) {
                // 如果来自 ios 充值的
                window.location.href = 'yicai://'; // 跳转到 app
                window.close();
              }

              if (data.p_s === 1) {
                if (this.state.remaTime > 1) {
                  this.setState({ remaTime: this.state.remaTime - 1 });
                } else {
                  clearTimeout(this.timer);
                  this.setState(
                    deepAssign({}, this.state.result, { data: { p_s: 5 } })
                  );
                }
              } else {
                clearTimeout(this.timer);
              }
            })
            .catch(err => {
              clearTimeout(this.timer);
              Message.toast(err.message);
            });
        }, 1000);
      } else {
        // this.returnJsonApp();
      }
    });
  }

  // 返回数据给 APP 客户端
  returnJsonApp() {
    Interaction.payResult(
      JSON.stringify({
        data: { transCode: transCode },
        errorCode: '10001',
        message: '正确',
        success: 1
      })
    );
  }

  // 再来一注
  again() {
    // 当前彩种编号
    analytics.send(2102).then(() => {
      const lotteryNum = this.state.result.data.l_c;
      window.location.href = lotteryCode[lotteryNum].href;
    });
  }

  // 查看方案详情
  viewPlan() {
    // 当前彩种编号
    const data = this.state.result.data;
    const lotteryCode = data.l_c;
    const buyType = data.b_t;
    const orderCode =
      data.o_c.split(',').length > 1 ? data.o_c.split(',')[0] : data.o_c;
    analytics.send(2103).then(() => {
      Navigator.goLotteryDetail({
        orderCode,
        lotteryChildCode: lotteryCode,
        lotteryCode,
        buyType
      });
    });
  }

  // 重新支付
  repeatPay() {
    const data = this.state.result.data;
    location.href =
      '//' +
      location.host +
      '/pay.html?orderCode=' +
      data.o_c +
      '&buyType=' +
      data.b_t;
  }

  toggle() {
    let { loadMore } = this.state;
    this.setState({ loadMore: !loadMore });
  }

  render() {
    const data = this.state.result.data;
    if (!data) return <div />;
    const payState = data.p_s || 1;
    const resultMap = {
      1: { txt: '中...', img: 'wait' },
      2: { txt: '成功', img: 'cg' },
      3: { txt: '失败', img: 'sb' },
      4: { txt: '关闭', img: 'sb' },
      5: { txt: '超时', img: 'sb' }
    };
    let o_c = data.o_c.split(',');
    let { loadMore } = this.state;
    return (
      <div>
        <Header title={ '订单支付' + resultMap[payState].txt } isback={ false }>
          {/* <a href="javascript: void(0);" onClick={ this.again.bind(this) }>完成</a> */}
          <ALink href="/" id={ 2101 }>
            完成
          </ALink>
        </Header>
        <section className="result-view">
          <img
            src={ require('@/img/pay/pay_' +
              resultMap[payState].img +
              '@2x.png') }
          />
          <p>支付{resultMap[payState].txt}</p>
          <p className="remaTime">
            {payState == 1 ? (
              <span>
                剩余时间：<em> {this.state.remaTime} </em>秒
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </p>
        </section>
        <section className={ cx('result-succ', payState < 3 ? 'show' : 'hide') }>
          <section className="result-info">
            <div>
              <div className="oc-num">
                <span>订单编号:</span>
                <p>{o_c[0]}</p>
                <span
                  className={ cx('total-order', o_c.length > 1 ? '' : 'hide') }
                  onClick={ this.toggle.bind(this) }
                >
                  {`以及 ${o_c.length - 1} 个订单`}
                  <b className={ cx('triangle', loadMore ? 'rotate' : '') } />
                </span>
              </div>
              <div className={ cx('drop-menu', loadMore ? '' : 'hide') }>
                {o_c.slice(1).map((item, index) => {
                  return (
                    <span
                      key={ index }
                      className={ cx('menu', index % 2 != 0 ? 'line' : '') }
                    >
                      {item}
                    </span>
                  );
                })}
              </div>

              {data.t_r_c ? (
                <p className="seq-num">订单支付流水号: {data.t_r_c}</p>
              ) : (
                ''
              )}
            </div>
            <div>
              <p>
                <span>订单总额</span>
                <span>￥{formatMoney(data.o_a)}</span>
              </p>
              {data.r_n ? (
                <p>
                  <span>使用红包</span>
                  <span>{data.r_n}</span>
                </p>
              ) : (
                ''
              )}
              <p>
                <span>支付时间</span>
                <span>{data.t_t}</span>
              </p>
            </div>
            <div>
              <p>
                <span>实际支付金额</span>
                <span>
                  <em>￥{formatMoney(data.p_a)}</em>
                </span>
              </p>
            </div>
            <div
              className={ cx('result-handler', payState == 2 ? 'show' : 'hide') }
            >
              <p>
                <MoreOrCopyButton
                  again={ this.again.bind(this) }
                  isCopyAvailable={ this.state.isCopyAvailable }
                  orderCodes={ o_c }
                />
                <a
                  href="javascript: void(0)"
                  onClick={ this.viewPlan.bind(this) }
                >
                  <span className="view-plan">查看方案</span>
                </a>
              </p>
              {typeof this.state.isCopyAvailable === 'boolean' &&
                !this.state.isCopyAvailable && <p>再买一注中奖机会更高哦</p>}
            </div>
          </section>
          {payState == 2 ? <Recommend /> : ''}
          <section
            className={ cx('result-query', payState == 1 ? 'show' : 'hide') }
          >
            <p>
              <a href="http://www.71chat.com/scsf/phone/visitor.html?cmpcd=126378">
                支付有疑问？联系客服
              </a>
            </p>
          </section>
        </section>
        <section
          className={ cx(
            'result-fail',
            payState == 3 || payState == 5 ? 'show' : 'hide'
          ) }
        >
          <p>
            <span
              className="button btn-blue btn-large"
              onClick={ this.repeatPay.bind(this) }
            >
              重新支付
            </span>
          </p>
        </section>
      </div>
    );
  }
}

const Home = ReactDOM.render(<PayResult />, document.getElementById('app'));

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           token token
 */
window.initializeApp = function(params) {
  var curParams = {};
  try {
    curParam = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
  Home.returnJsonApp();
};

function MoreOrCopyButton({ isCopyAvailable, again, orderCodes }) {
  if (typeof isCopyAvailable !== 'boolean') return null;
  if (!isCopyAvailable || orderCodes.length > 1) {
    return (
      <a href="javascript: void(0)" onClick={ () => again() }>
        <span>再来一注</span>
      </a>
    );
  }
  return <CopyEntrance available={ isCopyAvailable } order={ orderCodes[0] } />;
}

MoreOrCopyButton.propTypes = {
  isCopyAvailable: PropTypes.bool,
  again: PropTypes.func.isRequired,
  orderCodes: PropTypes.arrayOf(PropTypes.string).isRequired
};
