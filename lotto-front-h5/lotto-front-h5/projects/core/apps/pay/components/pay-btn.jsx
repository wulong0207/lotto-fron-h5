import React, { Component } from 'react';
import Message from '@/services/message';
import http from '@/utils/request';
import Interaction from '@/utils/interaction';
import { browser } from '@/utils/utils';
import analytics from '@/services/analytics';

export default class PayBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 下订单
  order() {
    let _pay = this.props.pay;
    if (!_pay.payState) {
      return;
    }
    if (!_pay.way) _pay.way = {};
    if (!_pay.red) _pay.red = {};
    var params = {
      clientType: 2,
      balance: _pay.balance, // 余额，不为0表示使用余额金额	number	【选填】
      bankCardId: _pay.way.bankCardId, // 银行卡ID	number	【选填】用户选择余额支付、微信支付或者支付宝支付，银行卡ID为空
      bankId: _pay.way.bankId, // 银行ID	number	【选填】用户选择余额支付，该字段为空
      buyType: _pay.buyType, // 购买类型	string	【选填】批量支付为【必填】，且多个用英文逗号隔开
      orderCode: _pay.orderCode, // 订单号	string	【必填】多个用英文逗号隔开
      payAmount: _pay.way.payAmount, // 需要支付的现金金额	number	【选填】
      redCode: _pay.red.redCode, // 彩金、优惠券code	string	【选填】
      returnUrl: location.origin + '/payresult.html', // 支付同步跳转地址，前台做为一个参数传递过来	string	PC端【必填】、移动端【选填】
      token: _pay.token // token
    };
    analytics.send(2097).then(() => http.post('/payCenter/pay', params))
      .then(res => {
        // 支付成功
        if (res.data.code) {
          let _transCode = res.data.transCode; // 当前交易的交易号

          // 非APP 并且不是余额或者红包支付的时候，点击支付提示弹层
          /* if(res.data.type != 3){
                    Message.confirm({
                            title: '当前订单正在支付中,请耐心等待结果哦',
                            btnTxt: ['取消', '确认'],
                            btnFn: [
                                () => {console.log('取消')},
                                () => {
                                    if(browser.yicaiApp){
                                        Interaction.payResult(JSON.stringify(res));
                                    }else{
                                        //前往支付结果页面
                                        location.href = location.origin + '/payresult.html?tc=' + _transCode;
                                    }
                                // 当前彩种编号
                                // const data = this.props.data;
                                // const lotteryCode = data.od.l_c;
                                // const buyType = data.b_t;
                                // const orderCode = data.od.o_c.split(',').length > 1? data.od.o_c.split(',')[0]: data.od.o_c;

                                // Navigator.goLotteryDetail({'orderCode': orderCode, 'lotteryChildCode': lotteryCode, 'lotteryCode': lotteryCode, 'buyType': params.buyType});
                            }
                        ]}
                    );
                } */

          // 表单
          if (res.data.type == 1) {
            // form表单，跳第三方
            // document.getElementById('app').innerHTML = res.data.formLink;
            // document.getElementById('alipaysubmit').submit();
            // 支付宝 微信支付
            let node = document.createElement('div');
            node.style.display = 'none';
            node.innerHTML = res.data.formLink;
            document.body.appendChild(node);
            document.forms[0].submit();

            /*
                    if(res.data.channel == '10') { // 支付宝
                        document.forms.punchout_form.submit();
                    }
                    if(res.data.channel == '11') { // 微信
                        document.forms.divineForm.submit();
                    }
                    if(res.data.channel == '13') { // 充值卡
                        document.forms.paySubmit.submit();
                    }
                    if(res.data.channel == '2') { // 银行
                        document.forms.lianliansubmit.submit();
                    } */
          }
          // URL支付地址
          if (res.data.type == 4) {
            if (browser.yicaiApp && browser.ios) {
              Interaction.sendInteraction('safariPay', [res.data.formLink]);
            } else {
              location.href = res.data.formLink;
            }
          }
          // 红包或者余额支付的直接成功
          if (res.data.type == 3) {
            // TODO 支付成功 处理逻辑
            // TODO 跳转支付成功页，查询逻辑，显示支付成功还是失败
            // TODO 成功页跳转到哪里？
            // TODO APP查询支付状态是他们查询还是H5查询返回给APP，待调试
            if (browser.yicaiApp) {
              Interaction.payResult(JSON.stringify(res));
            } else {
              let next = encodeURIComponent('/pay.html');
              location.href =
                location.origin +
                '/payresult.html?tc=' +
                _transCode +
                '&next=' +
                next;
            }
          }
        } else {
          Message.toast('支付失败，请重试');
        }
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  // 购彩协议
  agree() {
    if (browser.yicaiApp && browser.ios) {
      Interaction.sendInteraction('toURL', [
        location.origin + '/agree/userAgree.html'
      ]);
    } else {
      location.href = '/agree/userAgree.html';
    }
  }

  render() {
    return (
      <div className="pay-btn">
        <p>
          <span
            className="button btn-red btn-large"
            onClick={ this.order.bind(this) }
            disabled={ !this.props.pay.payState }
          >
            确认支付
          </span>
        </p>
        <p className="agreement">
          点击支付即用户已阅读了<a
            href="javascript: void(0);"
            onClick={ this.agree.bind(this) }
          >
            《购彩须知》
          </a>并同意其中条款
        </p>
      </div>
    );
  }
}
