/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--关于我们子模块
 */

import React, { Component } from 'react';
import FootCopy from '../components/foot-copy';
import '../css/about-us.scss';
import Header from '@/component/header';

export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goTo() {
    location.href = '#/setting';
  }
  render() {
    return (
      <div className="yc-abus">
        <section className="bank-header">
          <Header back={ this.goTo.bind(this) } title="关于我们" />
          <div className="ab-des">
            <div className="logo-img">
              <img src={ require('../img/connact_logo.png') } />
            </div>
            <div>
              2N彩票提供原创体育资讯信息服务，也是最具人气的体育社区，致力于为体育爱好者打造最具体育特色的资讯平台。
            </div>
            <div>
              互动 赛事论坛，各足球、篮球爱好者可友好的交流讨论对赛事的观点。
            </div>
            <div>
              原创
              海量的体育赛事前瞻文章，及名人、专家对赛事的解读，涵盖各国、洲际、及国际足、篮球赛事报告。
            </div>
            <div className="last-one">
              专业 各大赛事一手数据资料，开设专题专栏频道，满足广大体育迷需求。
            </div>
          </div>
        </section>
        <section className="menu-list">
          {/* <div className="menu-item">
                        <span className="left-title">软件名称</span>
                        <em>2N彩票手机客户端</em>
                    </div>
                    <div className="menu-item">
                        <span className="left-title">当前版本号<i></i></span>
                        <em>1.0.1</em>
                    </div> */}
          <div className="menu-item">
            <span className="left-title">版权所有</span>
            <em>深圳益彩网络技术有限公司</em>
          </div>
          <div className="menu-item">
            <span className="left-title">官方网站</span>
            <em>
              <a href="//www.2ncai.com">www.2ncai.com</a>
            </em>
          </div>
          <div className="menu-item">
            <span className="left-title">客服电话</span>
            <em>
              <a href="tel:0371-58634792">0371-58634792</a>
            </em>
          </div>
        </section>
        <FootCopy />
      </div>
    );
  }
}
