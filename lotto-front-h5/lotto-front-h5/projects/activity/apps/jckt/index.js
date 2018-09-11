import React, { Component } from 'react';
import Banner from '@/component/banner'; // 轮播图
import FootballWidget from './component/football.js'; // 推荐赛事
import Download from './component/download.jsx'; // 下载链接
import Hint from './component/hint.jsx'; // 友情提示
import Link2ncai from './component/link_2ncai.jsx'; // 跳转至2N首页
import CopyRight from './component/copyRight.jsx'; // 版权
import ReactDOM from 'react-dom';
import http from '@/utils/request';
import Dialog from './login/dialog.jsx';
import { browser } from '@/utils/utils';
import './css/index.scss';
import { log } from 'util';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchs: [],
      lastEndSaleTime: '',
      bannerList: []
    };
  }

  componentDidMount() {
    http
      .get('/jc/fbRecom')
      .then(res => {
        if (res.data) {
          if (res.data.length > 1) {
            let time =
              res.data[0].saleEndTime > res.data[1].saleEndTime
                ? res.data[1].saleEndTime
                : res.data[0].saleEndTime;
            this.setState({ lastEndSaleTime: time });
          }
        }
        this.setState({ matchs: res.data });
      })
      .catch(err => {
        console.log(err);
      });

    this.getBannerList();
  }
  getBannerList() {
    http
      .get(' /operate/ad', { params: { menu: 15 } })
      .then(res => {
        this.setState({ bannerList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onMatchChange(betNum, max, lastEndSaleTime) {
    if (lastEndSaleTime) {
      let t = new Date(lastEndSaleTime);
      let seconds = t.getSeconds() < 9 ? '0' + t.getSeconds() : t.getSeconds();
      let Time =
        t.getFullYear() +
        '-' +
        (t.getMonth() + 1) +
        '-' +
        t.getDate() +
        ' ' +
        t.getHours() +
        ':' +
        t.getMinutes() +
        ':' +
        seconds;
      this.setState({ lastEndSaleTime: Time });
    }
  }

  closeShadow() {
    this.setState({ shadowIsShow: !this.state.shadowIsShow });
  }

  changeShowDialog(diglog) {
    this.dialog.changeShowDialog(diglog);
  }

  render() {
    let HintMessage = [
      '1.投注显示的奖金仅供参考，派奖奖金以出票时间奖金为准;',
      '2.二串一彩果，以比赛90分钟内比分 (含伤停补时，不含加时赛及点球大战) 结果为准;',
      '3.二串一的是两场比赛串在一起，组成一注，必须两场比赛竞猜正确，才算中奖，猜对一场也是没有中奖哦！返奖率高达69%，立即投注体验。'
    ];
    let { bannerList, matchs, lastEndSaleTime } = this.state;
    console.log('1');
    return (
      <div>
        <div className="jckt">
          {bannerList.length ? <Banner bannerList={ bannerList } /> : ''}
          {/* 主体 */}
          <div className="jckt_main">
            <div className="jckt_title">精选2串1</div>
            {/* 投注信息 */}
            <div className="betBox">
              <FootballWidget
                changeShowDialog={ this.changeShowDialog.bind(this) }
                onMatchChange={ this.onMatchChange.bind(this) }
                matchs={ matchs }
                deadline={ lastEndSaleTime }
                ref={ footBall => (this.footBall = footBall) }
              />
            </div>
            {browser.ios ? '' : <Download />}
            <Hint HintMessage={ HintMessage } />
            <Link2ncai />
            <CopyRight />
          </div>
        </div>
        {/* 弹窗部分 */}
        <Dialog ref={ dialog => (this.dialog = dialog) } />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('app'));
