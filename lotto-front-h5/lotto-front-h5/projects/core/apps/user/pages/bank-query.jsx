/**
 * Created by manaster
 * date 2017-03-10
 * desc:个人中心模块--添加银行卡子模块
 */

import React, { Component } from 'react';
import FootCopy from '../components/foot-copy';
import Header from '@/component/header';
import '../css/bank-query.scss';

export default class BankQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverShow: false
    };
  }
  goTo() {
    location.href = '#/add-bank';
  }
  render() {
    return (
      <div className="pt-header bank-query">
        <Header title="银行查询" back={ this.goTo.bind(this) } />

        <div className="bank-sup">
          <span>支持银行</span>
          <span>储蓄卡</span>
          <span>信用卡</span>
        </div>
        <section className="bank-section">
          <div className="bank-item">
            <img
              className="bank-img"
              src={ require('../img/bank/cmb@2x.png') }
              alt="农行"
            />
            <div className="bank-item-r padding-r0">
              <div className="bank-name">
                <span>招商银行</span>
              </div>
              <div className="bankicon">
                <i className="icon-bank-sup" />
              </div>
              <div className="bankicon">
                <i className="icon-bank-sup" />
              </div>
            </div>
          </div>
          <div className="bank-item">
            <img
              className="bank-img"
              src={ require('../img/bank/abc@2x.png') }
              alt="农行"
            />
            <div className="bank-item-r padding-r0">
              <div className="bank-name">
                <span>农业银行</span>
              </div>
              <div className="bankicon">
                <i className="icon-bank-sup" />
              </div>
              <div className="bankicon">
                <i className="icon-bank-sup" />
              </div>
            </div>
          </div>
          {/* <div className="bank-item">
                        <img className="bank-img" src={require('../../../img/cmb@2x.png')} alt="农行"/>
                        <div className="bank-item-r padding-r0">
                            <div className="bank-name">
                                <span>招商银行</span>
                            </div>
                            <div className="bankicon">
                                <i className="icon-bank-sup"></i>
                            </div>
                            <div className="bankicon">
                                <i className="icon-bank-sup"></i>
                            </div>
                        </div>
                    </div> */}
          {/* <div className="bank-item">
                        <img className="bank-img" src={require('../../../img/abc@2x.png')} alt="农行"/>
                        <div className="bank-item-r padding-r0">
                            <div className="bank-name">
                                <span>招商银行</span>
                            </div>
                            <div className="bankicon">
                                <i className="icon-bank-unsup"></i>
                            </div>
                            <div className="bankicon">
                                <i className="icon-bank-sup"></i>
                            </div>
                        </div>
                    </div> */}
        </section>
        <FootCopy />
        {/* 路由跳转 */}
      </div>
    );
  }
}
