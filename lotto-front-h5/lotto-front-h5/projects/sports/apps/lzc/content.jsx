/**
 * Created by zouyuting
 * date 2017-07-05
 * desc:竞彩足球 - 混投
 */

import React, { Component } from 'react';

import Header from '../../../component/Header'; // 头部
import Footer from '../../../component/Footer'; // 底部
import { TabMenu } from './tab';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ListComponent from './list.jsx';
import request from '../../../utils/request';

import '../../../scss/lzc/index.scss';
import '../../../scss/lzc/tab.scss';

export class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 右上角菜单显示状态
      operMeneshow: false,
      // 菜单显示状态
      smallMenushow: false,
      matchs: []
    };
  }
  ck_click(i) {
    return this.state.currentIndex == i ? 'active' : '';
  }

  componentDidMount() {
    request.get('/jc/oldLotteryIssue?lotteryCode=304').then(res => {
      const issueCode = res.data.currentIssue[0].issueCode;
      request.get(`/jc/sfc?issueCode=${issueCode}`).then(response => {
        this.setState({ matchs: response.data });
      });
    });
  }
  render() {
    return (
      <div>
        <div className="mainpage">
          <Header title="老足彩" bg="green">
            <div className="operation">
              <div className="filt" />
              <div>
                <i className="opermore" />
                <div
                  className="oper-menu"
                  style={ { display: this.state.open ? '' : 'none' } }
                >
                  <span className="arrows" />
                  <ul>
                    <li>
                      <a>
                        <img
                          src={ require('../../../img/jcz/icon_score@2x.png') }
                        />
                        比分直播
                      </a>
                    </li>
                    <li>
                      <img src={ require('../../../img/jcz/icon_win@2x.png') } />
                      开奖详情
                    </li>
                    <li>
                      <img src={ require('../../../img/jcz/icon_game@2x.png') } />
                      玩法说明
                    </li>
                    <li>
                      <img
                        src={ require('../../../img/jcz/icon_money@2x.png') }
                      />
                      优惠活动
                    </li>
                    <li>
                      <img src={ require('../../../img/jcz/octopus@2x.png') } />
                      召唤章鱼帝
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Header>

          <div className="main">
            <TabMenu>
              <div name="14场胜负彩">
                <div className="forteen">
                  {this.state.matchs.map(m => {
                    return <ListComponent match={ m } key={ m.id } />;
                  })}
                </div>
              </div>
              <div name="任选9场">
                <div className="forteen" />
              </div>
            </TabMenu>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
