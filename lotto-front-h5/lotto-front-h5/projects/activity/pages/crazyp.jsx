import React, { Component } from 'react';
import Interaction from '@/utils/interaction';
import { browser } from '@/utils/utils'; // 判断浏览器内核

import '../scss/crazyp.scss';
const Table = ({ list }) => {
  return (
    <tbody className="table-wrap">
      {list.map((e, i) => {
        return (
          <tr key={ i }>
            <td>{e.type}</td>
            <td>{e.num}</td>
            <td>{e.money}</td>
            <td>{e.prize}</td>
            <td>{e.profit}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

const ActInfo = () => {
  return (
    <table>
      <tbody>
        <tr className="t-head">
          <td>玩法</td>
          <td>投注方式</td>
          <td>单注奖金 (元)</td>
          <td>加奖奖金 (元)</td>
          <td>加奖后奖金 (元)</td>
        </tr>
        <tr className="t-info">
          <td rowSpan="2">任三</td>
          <td>单式</td>
          <td rowSpan="2">19</td>
          <td>3</td>
          <td>22</td>
        </tr>
        <tr>
          <td className="row-gride">复式、胆拖</td>
          <td className="row-gride mid">4</td>
          <td className="row-gride last">23</td>
        </tr>
        <tr className="t-info">
          <td rowSpan="2">任五</td>
          <td>单式</td>
          <td rowSpan="2">540</td>
          <td>60</td>
          <td>600</td>
        </tr>
        <tr>
          <td className="row-gride">复式、胆拖</td>
          <td className="row-gride mid">80</td>
          <td className="row-gride last">620</td>
        </tr>
        <tr className="t-info">
          <td rowSpan="2">任七</td>
          <td>单式</td>
          <td rowSpan="2">26</td>
          <td>3</td>
          <td>29</td>
        </tr>
        <tr>
          <td className="row-gride">复式、胆拖</td>
          <td className="row-gride mid">4</td>
          <td className="row-gride last">30</td>
        </tr>
      </tbody>
    </table>
  );
};

export class CrazyPrize extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  toBet() {
    if (browser.yicaiApp) {
      return Interaction.sendInteraction('toBetVC', ['213']);
    } else {
      window.location.href = 'jx11x5.html';
    }
  }
  render() {
    let list = [
      {
        type: '投注类型',
        num: '投注注数',
        money: '投注本金',
        prize: '中奖奖金',
        profit: '盈利金额'
      },
      {
        type: '选3个号',
        num: '1',
        money: '2',
        prize: '22',
        profit: '20'
      },
      {
        type: '选4个号',
        num: '4',
        money: '8',
        prize: '23-92',
        profit: '15-84'
      },
      {
        type: '选5个号',
        num: '10',
        money: '20',
        prize: '23-230',
        profit: '3-210'
      }
    ];
    let list2 = [
      {
        type: '投注类型',
        num: '投注注数',
        money: '投注本金',
        prize: '中奖奖金',
        profit: '盈利金额'
      },
      {
        type: '包8个号',
        num: '56',
        money: '112',
        prize: '620',
        profit: '508'
      },
      {
        type: '包9个号',
        num: '126',
        money: '252',
        prize: '620',
        profit: '368'
      },
      {
        type: '包10个号',
        num: '252',
        money: '504',
        prize: '620',
        profit: '116'
      }
    ];
    let list3 = [
      {
        type: '投注类型',
        num: '投注注数',
        money: '投注本金',
        prize: '中奖奖金',
        profit: '盈利金额'
      },
      {
        type: '杀1个号',
        num: '120',
        money: '240',
        prize: '300',
        profit: '60'
      },
      {
        type: '杀2个号',
        num: '36',
        money: '72',
        prize: '180',
        profit: '108'
      },
      {
        type: '杀3个号',
        num: '8',
        money: '16',
        prize: '90',
        profit: '74'
      }
    ];
    return (
      <div className="creazyp-cont">
        <div className="top-head">
          <img src={ require('../img/creazy_top.png') } alt="" />
        </div>
        <div className="cont">
          <div className="prize-cont">
            <div className="head">加奖内容</div>
            <div className="act-info">
              <p>
                活动奖金：<span>1000万</span>
              </p>
              <p>活动时间：12月25日起直至1000万派完为止</p>
              <p>活动内容：</p>
            </div>
            <div className="table-cont">
              <ActInfo />
            </div>
          </div>
          <div className="tools">
            <div className="head">投注技巧</div>
            <div className="tab-1">
              <div className="sec-head">任三：投注技巧</div>
              <table>
                <Table list={ list } />
              </table>
            </div>
            <div className="tab-1">
              <div className="sec-head">任五：投注技巧</div>
              <table>
                <Table list={ list2 } />
              </table>
            </div>
            <div className="tab-1">
              <div className="sec-head">任七：投注技巧</div>
              <table>
                <Table list={ list3 } />
              </table>
            </div>
          </div>
          <div className="info">
            <div className="head">活动说明</div>
            <ul>
              <li>1. 本活动仅限于江西11选5；</li>
              <li>2. 活动时间：2017.12.25日起直至1000万加奖奖金派完为止；</li>
              <li>3. 本次加奖不限方案个数，多中多得；</li>
              <li>4. 加奖金额在第二天上午11:00前派送至用户的购彩账号；</li>
              <li>
                5.
                在法律许可范围内，2n彩票保留本次活动解释权，如有疑问请联系客服:
                0755-61988504。
              </li>
            </ul>
          </div>
        </div>
        <div className="post">
          <button onClick={ event => this.toBet(event) } />
        </div>
      </div>
    );
  }
}
