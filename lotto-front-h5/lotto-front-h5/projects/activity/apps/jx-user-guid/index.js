/*
 * @Author: nearxu
 * @Date: 2017-11-18 12:04:38
    11x5 新用户指导页
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { SectionsContainer, Section, Footer } from 'react-fullpage';
import { browser } from '@/utils/utils';
import Interaction from '@/utils/interaction';
import '@/scss/base/base.scss';
import './scss/guid.scss';

class UserGuid extends Component {
  refresh() {
    window.location.href = 'jx11x5-user-guid.html';
  }
  goBetPage() {
    if (browser.yicaiApp) {
      // 调APP登录
      Interaction.sendInteraction('toBetVC', [213]);
    } else {
      window.location.href = 'jx11x5.html';
    }
  }
  render() {
    let options = {
      activeClass: 'active', // the class that is appended to the sections links
      anchors: [
        'sectionOne',
        'sectionOne',
        'sectionOne',
        'sectionOne',
        'sectionOne',
        'sectionOne',
        'sectionOne',
        'sectionOne'
      ], // the anchors for each sections
      arrowNavigation: true, // use arrow keys
      className: 'SectionContainer', // the class name for the section container
      delay: 500, // the scroll animation speed
      navigation: false, // use dots navigatio
      scrollBar: false, // use the browser default scrollbar
      sectionClassName: 'Section,footer,make-money,see-argin', // the section class name
      sectionPaddingTop: '0', // the section top padding
      sectionPaddingBottom: '0', // the section bottom padding
      verticalAlign: false, // align the content of each section vertical
      recordHistory: false
    };
    return (
      <div className="full-page">
        <SectionsContainer { ...options }>
          <Section>
            <div className="bg-white bg">
              <div className="top1 top" />
              <img className="arrow" src={ require('./img/arrow.png') } />
            </div>
          </Section>
          <Section>
            <div className="bg-grey bg">
              <div className="top2 top col80" />
              <div className="start">
                <span className="title">即将开启您的人生新篇章</span>
                <img className="arrow" src={ require('./img/arrow1.png') } />
              </div>
            </div>
          </Section>
          <Section>
            <div className="bg-grey bg">
              <div className="col80">
                <span className="title f60">彩种介绍</span>
                <div className="top3 top" />
              </div>
              <img className="arrow" src={ require('./img/arrow1.png') } />
            </div>
          </Section>
          <Section>
            <div className="bg-white bg">
              <div className="col80">
                <div className="info">
                  <span className="title">一分钟教您学会赚钱</span>
                </div>
                <div className="top4 top" />
              </div>
              <img className="arrow" src={ require('./img/arrow2.png') } />
            </div>
          </Section>
          <Section>
            <div className="bg-white bg">
              <div className="col80">
                <div className="info">
                  <span className="title">一分钟教您学会赚钱</span>
                </div>
                <div className="top5 top" />
              </div>

              <img className="arrow" src={ require('./img/arrow2.png') } />
            </div>
          </Section>
          <Section>
            <div className="bg-white bg">
              <div className="col80">
                <div className="info">
                  <span className="title">一分钟教您学会赚钱</span>
                </div>
                <div className="top6 top" />
              </div>
              <img className="arrow" src={ require('./img/arrow2.png') } />
            </div>
          </Section>
          <Section>
            <div className="bg-white bg">
              <div className="col80">
                <div className="info">
                  <span className="title">投注三大法宝</span>
                </div>
                <div className="top7 top" />
              </div>
              <img className="arrow" src={ require('./img/arrow2.png') } />
            </div>
          </Section>
          <Section>
            <div className="bg-grey bg">
              <div className="top8 top col80" />
            </div>
          </Section>
          <Footer className="footer">
            <div className="make-money" onClick={ this.goBetPage.bind(this) }>
              <span>开始赚钱</span>
            </div>
            <div className="see-argin" onClick={ this.refresh.bind(this) }>
              <span>再看一遍</span>
            </div>
          </Footer>
        </SectionsContainer>
      </div>
    );
  }
}

render(<UserGuid />, document.getElementById('app'));
