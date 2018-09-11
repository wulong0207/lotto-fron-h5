/*
 * @Author: yubei
 * @Date: 2017-06-22 11:59:13
 * @Desc: 支付成功推荐彩种
 */

import React, { Component } from 'react';
import http from '@/utils/request';
import cx from 'classnames';
import ALink from '@/component/analytics/link';

export default class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommend: {}
    };
  }

  // ready
  componentWillMount() {
    http
      .get('/operate/operlottery', {})
      .then(res => {
        this.setState({ recommData: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const recommData = this.state.recommData || [];
    return (
      <section
        className={ cx(
          'result-recommend',
          recommData.length > 0 ? 'show' : 'hide'
        ) }
      >
        <h3>为你推荐</h3>
        <div>
          <ul>
            {recommData.map((row, index) => {
              if (index < 2) {
                return (
                  <li key={ index }>
                    <LotteryLink lotteryData={ row } />
                  </li>
                );
              }
            })}

            {/* <li>
                            <a href="ssq/index.html">
                                <img src={require('../../img/public/icon/ssq@2x.png')}/>
                                <span>双色球</span>
                                <span><em>彩民最爱</em> 2元赢取1000万</span>
                            </a>
                        </li> */}
          </ul>
        </div>
      </section>
    );
  }
}

function LotteryLink({ lotteryData }) {
  if (lotteryData.typeId === 300) {
    return (
      <ALink href={ lotteryData.typeUrl } id={ 2104 }><LotteryItem lotteryData={ lotteryData } /></ALink>
    );
  }
  if (lotteryData.typeId === 100) {
    return <ALink href={ lotteryData.typeUrl } id={ 2105 }><LotteryItem lotteryData={ lotteryData } /></ALink>
  }
  return <a href={ lotteryData.typeUrl }><LotteryItem lotteryData={ lotteryData } /></a>;
}

function LotteryItem({ lotteryData }) {
  return (
    <span>
      <img src={ lotteryData.lotteryLogoUrl } />
      <span>{lotteryData.typeAlias}</span>
      <span /* dangerouslySetInnerHTML={{ __html: lotteryCode[row.typeId].desc }} */
      >
        {lotteryData.typeKey}
      </span>
    </span>
  )
}
